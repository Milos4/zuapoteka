class Order {
  constructor(
    userId,
    items = [],
    totalPrice = 0,
    address = {},
    note = "",
    phone = "",
    paymentMethod = "delivery"
  ) {
    this.userId = userId; // ID korisnika koji je napravio narudžbinu
    this.items = items; // Lista proizvoda u narudžbini
    this.totalPrice = totalPrice; // Ukupna cena
    this.address = address || {}; // Adresa dostave (ako je potrebno, prazno za "preuzimanje u apoteci")
    this.note = note; // Opcionalna napomena
    this.phone = phone || ""; // Broj telefona (ako je potrebno, prazno za "preuzimanje u apoteci")
    this.paymentMethod = paymentMethod; // Način plaćanja ("delivery" ili "pickup")
    this.status = "pending"; // Status narudžbine (default je "pending")
    this.createdAt = new Date(); // Datum kada je narudžbina kreirana
  }

  // Metoda za dodavanje proizvoda u narudžbinu
  addItem(product) {
    const existingItem = this.items.find(
      (item) => item.productId === product.productId
    );
    if (existingItem) {
      existingItem.quantity += 1; // Povećaj količinu ako proizvod već postoji
    } else {
      this.items.push({ productId: product.productId, quantity: 1 });
    }
  }

  // Metoda za uklanjanje proizvoda iz narudžbine
  removeItem(productId) {
    this.items = this.items.filter((item) => item.productId !== productId);
  }

  // Metoda za izračunavanje ukupne cene
  calculateTotalPrice(products) {
    return this.items.reduce((total, item) => {
      const product = products.find((p) => p.productId === item.productId);
      if (product) {
        return total + product.price * item.quantity;
      }
      return total;
    }, 0);
  }

  // Metoda za postavljanje statusa narudžbine
  updateStatus(newStatus) {
    this.status = newStatus;
  }

  // Metoda za čuvanje narudžbine u Firestore
  saveOrderToFirestore(db) {
    db.collection("orders").add({
      userId: this.userId,
      items: this.items,
      totalPrice: this.totalPrice,
      address: this.address,
      note: this.note,
      phone: this.phone,
      paymentMethod: this.paymentMethod,
      status: this.status,
      createdAt: this.createdAt,
    });
  }

  // Metoda za učitavanje narudžbine iz Firestore prema orderId
  static loadOrderFromFirestore(db, orderId) {
    return db
      .collection("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          return null; // Ako narudžbina ne postoji
        }
      });
  }

  // Metoda za generisanje order ID (ako je potrebno, na primer)
  static generateOrderId() {
    return "ORD-" + Math.random().toString(36).substr(2, 9); // Generišite jedinstven ID za narudžbinu
  }
}

export default Order;
