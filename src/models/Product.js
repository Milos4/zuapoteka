class Product {
  constructor({
    productId,
    name,
    brand,
    category,
    subCategory = null, // Podkategorija (ako postoji)
    description = "", // Opis proizvoda (može biti tekst ili URL slike)
    discount = 0, // Popust (ako postoji)
    price,
    stockQuantity = true, // Količina na skladištu
    imageUrl = "", // URL slike proizvoda (ako postoji)
    createdAt = new Date(), // Datum kada je proizvod kreiran
    updatedAt = new Date(), // Datum kada je proizvod poslednji put ažuriran
  }) {
    this.productId = productId; // Jedinstveni ID proizvoda
    this.name = name; // Naziv proizvoda
    this.brand = brand; // Brend proizvoda
    this.category = category; // Kategorija proizvoda
    this.subCategory = subCategory; // Podkategorija proizvoda
    this.description = description; // Opis proizvoda (može biti tekst ili URL slike)
    this.discount = discount; // Popust na proizvod (ako postoji)
    this.price = price; // Cena proizvoda
    this.stockQuantity = stockQuantity; // Količina na skladištu
    this.imageUrl = imageUrl; // URL slike proizvoda
    this.createdAt = createdAt; // Datum kreiranja proizvoda
    this.updatedAt = updatedAt; // Datum poslednje izmene proizvoda
  }

  // Metoda za ažuriranje popusta na proizvod
  updateDiscount(newDiscount) {
    this.discount = newDiscount;
  }

  // Metoda za ažuriranje cene proizvoda
  updatePrice(newPrice) {
    this.price = newPrice;
  }

  // Metoda za ažuriranje količine proizvoda na skladištu
  updateStockQuantity(newQuantity) {
    this.stockQuantity = newQuantity;
  }

  // Metoda za ažuriranje opisa proizvoda
  updateDescription(newDescription) {
    this.description = newDescription;
  }

  // Metoda za ažuriranje URL slike proizvoda
  updateImageUrl(newImageUrl) {
    this.imageUrl = newImageUrl;
  }

  // Metoda za prikazivanje svih podataka o proizvodu
  getProductDetails() {
    return {
      productId: this.productId,
      name: this.name,
      brand: this.brand,
      category: this.category,
      subCategory: this.subCategory,
      description: this.description,
      discount: this.discount,
      price: this.price,
      stockQuantity: this.stockQuantity,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Product;
