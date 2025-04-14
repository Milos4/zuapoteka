class Cart {
  constructor({
    userId = null, // Ako je ulogovan, ovo će biti korisnički ID
    items = [], // Lista proizvoda u korpi
    totalPrice = 0, // Ukupna cena proizvoda u korpi
    createdAt = new Date(), // Datum kreiranja korpe
    updatedAt = new Date(), // Datum poslednje izmene korpe
  }) {
    this.userId = userId; // ID korisnika (ako je ulogovan)
    this.items = items; // Lista proizvoda u korpi
    this.totalPrice = totalPrice; // Ukupna cena
    this.createdAt = createdAt; // Datum kreiranja
    this.updatedAt = updatedAt; // Datum poslednje izmene
  }

  // Metoda za dodavanje proizvoda u korpu
  addItem(product, quantity = 1) {
    const existingItemIndex = this.items.findIndex(
      (item) => item.productId === product.productId
    );

    if (existingItemIndex >= 0) {
      // Ako proizvod već postoji u korpi, samo povećaj količinu
      this.items[existingItemIndex].quantity += quantity;
    } else {
      // Ako proizvod ne postoji, dodaj ga u korpu
      this.items.push({ ...product, quantity });
    }

    this.updateTotalPrice();
  }

  // Metoda za uklanjanje proizvoda iz korpe
  removeItem(productId) {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.updateTotalPrice();
  }

  // Metoda za ažuriranje ukupne cene
  updateTotalPrice() {
    this.totalPrice = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Metoda za prikaz svih proizvoda u korpi
  getCartItems() {
    return this.items;
  }

  // Metoda za prikaz ukupne cene korpe
  getTotalPrice() {
    return this.totalPrice;
  }

  // Metoda za čuvanje korpe u Firebase (ako je ulogovan)
  saveCartToFirestore(db) {
    if (this.userId) {
      // Ako je ulogovan, spremi korpu u Firestore povezanu sa korisnikom
      const userCartRef = db.collection("carts").doc(this.userId);
      userCartRef.set({
        items: this.items,
        totalPrice: this.totalPrice,
        updatedAt: new Date(),
      });
    }
  }
}

export default Cart;
