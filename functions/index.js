const functions = require("firebase-functions");
const fetch = require("node-fetch");

const admin = require("firebase-admin");
admin.initializeApp();

// Funkcija za pripremu narudžbine kuriru
exports.preannounceCourier = functions.https.onCall(async (data, context) => {
  try {
    const username = "higra_api_test";
    const password = "test1234!";
    const auth = Buffer.from(`${username}:${password}`).toString("base64");
    console.log("DATA FROM FRONTEND:", JSON.stringify(data, null, 2));

    // 🔥 OVO JE KLJUČNO
    const payload = data.payload;

    if (!Array.isArray(payload) || payload.length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Payload mora biti niz pošiljki"
      );
    }

    const response = await fetch(
      "https://gateway.euroexpress.ba/test/shipment/preannounce?lokacija=0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Kurir API error: ${response.status} ${text}`);
    }

    const result = await response.json();
    return { success: true, result };
  } catch (err) {
    console.error("Greška u preannounceCourier:", err);
    throw new functions.https.HttpsError("unknown", err.message);
  }
});

exports.sendAllPreparedToCourier = functions.https.onCall(
  async (_, context) => {
    try {
      // if (!context.auth) {
      //   throw new functions.https.HttpsError(
      //     "unauthenticated",
      //     "Nisi ulogovan"
      //   );
      // }

      const db = admin.firestore();

      const username = "higra_api_test";
      const password = "test1234!";
      const auth = Buffer.from(`${username}:${password}`).toString("base64");

      // 1️⃣ NAĐI ORDERS U PRIPREMI
      const ordersSnap = await db
        .collection("orders")
        .where("status", "==", "Priprema")
        .get();

      if (ordersSnap.empty) {
        return { success: true, message: "Nema orders u pripremi" };
      }

      // 2️⃣ UZMI NJIHOVE REFERENTNE BROJEVE
      const orderIds = [];
      const orderRefs = [];

      ordersSnap.forEach((doc) => {
        const data = doc.data();
        orderIds.push(data.orderId); // REFERENTNI BROJ
        orderRefs.push(doc.ref);
      });

      // 3️⃣ NAĐI COURIER ORDERS ZA NJIH
      const courierSnap = await db
        .collection("courierOrders")
        .where("referentniBroj", "in", orderIds)
        .where("status", "==", "priprema")
        .get();

      if (courierSnap.empty) {
        throw new Error("Postoje orders u pripremi bez courier zapisa");
      }

      // 4️⃣ SKUPI PAYLOAD-OVE
      const shipments = [];
      const courierRefs = [];

      courierSnap.forEach((doc) => {
        const data = doc.data();
        shipments.push(data.payload);
        courierRefs.push(doc.ref);
      });

      // 5️⃣ POŠALJI KURIRU (PROD)
      const response = await fetch(
        "https://gateway.euroexpress.ba/test/shipment/announce?lokacija=0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify(shipments),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Kurir API error: ${response.status} ${text}`);
      }

      const courierResult = await response.json();

      // 6️⃣ TRANSAKCIJA – SVE ZAKLJUČAJ
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

      return {
        success: true,
        sentCount: shipments.length,
        courierResult,
      };
    } catch (err) {
      console.error("SEND PREPARED ERROR:", err);
      throw new functions.https.HttpsError("unknown", err.message);
    }
  }
);
