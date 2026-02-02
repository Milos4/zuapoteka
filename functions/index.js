const { onCall } = require("firebase-functions/v2/https");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

const { transporter } = require("./email/mailer");
const { courierPreparedEmail } = require("./email/courierPreparedEmail");
const { contactReplyEmail } = require("./email/contactReplyEmail");

admin.initializeApp();

exports.preannounceCourier = onCall(async (request) => {
  try {
    const payload = request.data.payload;

    console.log("PAYLOAD STRING:", JSON.stringify(payload, null, 2));

    // Ovdje logujemo da provjerimo
    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error("Payload mora biti niz pošiljki");
    }

    const username = "higra_api_pro";
    const password = "K52@7XcD!#";
    const apiKey = "MwqpzbRJ2tBRIygONGR08QAhTviaQp5u";
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    console.log("Auth header (Base64):", auth);
    console.log("Full header:", { Authorization: `Basic ${auth}` });

    const response = await fetch(
      "https://gateway.euroexpress.ba/b2b/shipment/preannounce?lokacija=0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
          "x-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Kurir API error ${response.status}: ${text}`);
    }

    return {
      success: true,
      result: JSON.parse(text),
    };
  } catch (err) {
    console.error("❌ preannounceCourier ERROR:", err);
    throw err;
  }
});

exports.sendAllPreparedToCourier = onCall(async (_, context) => {
  try {
    // ❌ Ako želiš auth, možeš odkomentarisati
    // if (!context.auth) {
    //   throw new functions.https.HttpsError(
    //     "unauthenticated",
    //     "Nisi ulogovan"
    //   );
    // }

    const db = admin.firestore();

    const username = "higra_api_pro";
    const password = "K52@7XcD!#";
    const apiKey = "MwqpzbRJ2tBRIygONGR08QAhTviaQp5u";
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    // 1️⃣ Nađi orders u pripremi
    const ordersSnap = await db
      .collection("orders")
      .where("status", "==", "Priprema")
      .get();

    if (ordersSnap.empty) {
      return { success: true, message: "Nema orders u pripremi" };
    }

    // 2️⃣ Uzmi njihove referentne brojeve
    const orderIds = [];
    const orderRefs = [];
    const ordersForEmail = []; // ⬅️ NOVO

    ordersSnap.forEach((doc) => {
      const data = doc.data();

      orderIds.push(data.orderId);
      orderRefs.push(doc.ref);

      if (data.userInfo?.email) {
        ordersForEmail.push({
          email: data.userInfo.email,
          orderId: data.orderId,
          ime: data.userInfo.firstName || "Kupče",
        });
      }
    });

    // 3️⃣ Nađi courierOrders za njih
    const courierSnap = await db
      .collection("courierOrders")
      .where("referentniBroj", "in", orderIds)
      .where("status", "==", "priprema")
      .get();

    if (courierSnap.empty) {
      throw new Error("Postoje orders u pripremi bez courier zapisa");
    }

    // 4️⃣ Skupi payload-ove
    const shipments = [];
    const courierRefs = [];

    courierSnap.forEach((doc) => {
      const data = doc.data();
      shipments.push(data.payload);
      courierRefs.push(doc.ref);
    });

    // 5️⃣ Pošalji kuriru (test/prod endpoint)
    const response = await fetch(
      "https://gateway.euroexpress.ba/b2b/shipment/announce?lokacija=0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
           "x-api-key": apiKey,
        },
        body: JSON.stringify(shipments),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Kurir API error: ${response.status} ${text}`);
    }

    const courierResult = await response.json();

    // 6️⃣ Transakcija – sve update-uj
    const batch = db.batch();

    courierRefs.forEach((ref) => {
      batch.update(ref, {
        status: "poslato",
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        courierResponse: courierResult,
      });
    });

    orderRefs.forEach((ref) => {
      batch.update(ref, {
        status: "Spremno za kurira",
      });
    });

    await batch.commit();

    for (const order of ordersForEmail) {
      if (!order.email) {
        console.warn("⚠️ Order bez emaila:", order.orderId);
        continue;
      }

      try {
        console.log("📧 Šaljem mail:", order.email, order.orderId);

        await transporter.sendMail({
          from: '"Apoteka Higra Sarić" <info@apoteka-higrasaric.ba>',
          to: order.email,
          subject: `Vaša porudžbina #${order.orderId} je poslata`,
          html: courierPreparedEmail({
            orderId: order.orderId,
            ime: order.ime,
          }),
        });

        console.log("✅ Mail poslat:", order.email);
      } catch (mailErr) {
        console.error("❌ Mail error:", order.orderId, mailErr);
      }
    }
    return {
      success: true,
      sentCount: shipments.length,
      courierResult,
    };
  } catch (err) {
    console.error("SEND PREPARED ERROR:", err);
    throw new functions.https.HttpsError("unknown", err.message);
  }
});

exports.sendContactReply = onCall(async (request) => {
  try {
    const { email, ime, odgovor } = request.data;

    if (!email || !odgovor) {
      throw new Error("Nedostaju podaci za slanje odgovora");
    }

    await transporter.sendMail({
      from: '"Apoteka Higra Sarić" <info@apoteka-higrasaric.ba>',
      to: email,
      subject: "Odgovor na Vašu poruku",
      html: contactReplyEmail({
        ime,
        odgovor,
      }),
    });

    return { success: true };
  } catch (err) {
    console.error("❌ sendContactReply ERROR:", err);
    throw err;
  }
});

const { pickupPreparedEmail } = require("./email/pickupPreparedEmail");

exports.sendPickupPreparedEmail = onCall(async (request) => {
  try {
    const { email, ime, orderId } = request.data;

    if (!email || !orderId) {
      throw new Error("Nedostaju podaci za slanje maila");
    }

    await transporter.sendMail({
      from: '"Apoteka Higra Sarić" <info@apoteka-higrasaric.ba>',
      to: email,
      subject: `Vaša porudžbina #${orderId} je spremna za preuzimanje`,
      html: pickupPreparedEmail({
        orderId,
        ime: ime || "Kupče",
      }),
    });

    return { success: true };
  } catch (err) {
    console.error("❌ sendPickupPreparedEmail ERROR:", err);
    throw err;
  }
});


exports.printEuroExpressLabel = onCall(async (request) => {
  try {
    const { refBroj, printFormat = "DEFAULT" } = request.data;

    if (!refBroj) {
      throw new Error("Nedostaje refBroj");
    }

    const username = "higra_api_pro";
    const password = "K52@7XcD!#";
    const apiKey = "MwqpzbRJ2tBRIygONGR08QAhTviaQp5u";

    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    const url = new URL(
      "https://gateway.euroexpress.ba/b2b/shipment/print"
    );

    url.searchParams.append("refBroj", refBroj);
    url.searchParams.append("printFormat", printFormat); // DEFAULT | BC

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `EuroExpress error ${response.status}: ${text}`
      );
    }

    // 👇 PDF → base64
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Pdf = buffer.toString("base64");

    return {
      success: true,
      fileName: `opremnica_${refBroj}.pdf`,
      mimeType: "application/pdf",
      base64: base64Pdf,
    };
  } catch (err) {
    console.error("❌ printEuroExpressLabel ERROR:", err);
    throw err;
  }
});