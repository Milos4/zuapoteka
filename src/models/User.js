class User {
  constructor({
    username,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    city,
    postalCode,
    apartment = "",
    floor = "",
    emailVerified = false,
    orderHistory = [],
    favorites = [],
    role = "korisnik", // Moguće vrednosti: 'administrator', 'korisnik', 'radnik'
  }) {
    this.username = username; // Korisničko ime
    this.password = password; // Lozinka
    this.firstName = firstName; // Ime
    this.lastName = lastName; // Prezime
    this.email = email; // Email adresa
    this.phoneNumber = phoneNumber; // Broj telefona
    this.address = address; // Adresa
    this.city = city; // Grad
    this.postalCode = postalCode; // Poštanski broj
    this.apartment = apartment; // Stan (opciono)
    this.floor = floor; // Sprat (opciono)
    this.emailVerified = emailVerified; // Da li je email verifikovan
    this.orderHistory = orderHistory; // Istorija narudžbi
    this.favorites = favorites; // Omiljeni proizvodi
    this.role = role; // Uloga korisnika
  }
}

export default User;
