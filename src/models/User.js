class User {
  constructor({
    userId,
    email,
    role = "user", // Moguće vrednosti: 'admin', 'worker', 'user'
    favorites = [],
    mobilePhone = "",
    address = "",
    apartment = "", // Stan
    floor = "", // Sprat
    city = "", // Grad
    postalCode = "", // Poštanski broj
    createdAt = new Date(),
    username = "", // Ako imaš username
  }) {
    this.userId = userId; // Jedinstveni ID korisnika
    this.email = email; // Email korisnika
    this.role = role; // Uloga korisnika (admin, worker, user)
    this.favorites = favorites; // Lista omiljenih proizvoda (ID proizvoda)
    this.mobilePhone = mobilePhone; // Broj telefona
    this.address = address; // Adresa korisnika
    this.apartment = apartment; // Stan
    this.floor = floor; // Sprat
    this.city = city; // Grad
    this.postalCode = postalCode; // Poštanski broj
    this.createdAt = createdAt; // Datum kada je korisnik napravio nalog
    this.username = username; // Ako koristiš username
  }

  // Metoda za dodavanje proizvoda u favorite
  addFavorite(productId) {
    if (!this.favorites.includes(productId)) {
      this.favorites.push(productId);
    }
  }

  // Metoda za uklanjanje proizvoda iz omiljenih
  removeFavorite(productId) {
    const index = this.favorites.indexOf(productId);
    if (index !== -1) {
      this.favorites.splice(index, 1);
    }
  }

  // Metoda za ažuriranje korisničkih podataka (npr. email, telefon)
  updateProfile({
    email,
    mobilePhone,
    address,
    apartment,
    floor,
    city,
    postalCode,
  }) {
    this.email = email || this.email;
    this.mobilePhone = mobilePhone || this.mobilePhone;
    this.address = address || this.address;
    this.apartment = apartment || this.apartment;
    this.floor = floor || this.floor;
    this.city = city || this.city;
    this.postalCode = postalCode || this.postalCode;
  }

  updateRole(newRole) {
    this.role = newRole;
  }

  getProfile() {
    return {
      userId: this.userId,
      email: this.email,
      role: this.role,
      favorites: this.favorites,
      mobilePhone: this.mobilePhone,
      address: this.address,
      apartment: this.apartment,
      floor: this.floor,
      city: this.city,
      postalCode: this.postalCode,
      note: this.note,
      createdAt: this.createdAt,
      username: this.username,
    };
  }
}

export default User;
