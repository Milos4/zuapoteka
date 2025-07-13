import React, { useState } from 'react';
import { ShoppingCart, User, MapPin, Phone, Mail, Home, Package, Truck } from 'lucide-react';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import './DeliveryAndPayment.css';
import { db } from '../firebase';
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


const DeliveryAndPayment = () => {
const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'pickup',
    selectedPharmacy: 'apoteka1'
  });

  // Mock cart data ako nema podataka iz props
  const mockCartItems = [
    { id: 1, name: 'Biljka Fikus', price: 2500, quantity: 1, image: '/api/placeholder/80/80' },
    { id: 2, name: 'Kaktus', price: 1200, quantity: 2, image: '/api/placeholder/80/80' },
    { id: 3, name: 'Monstera', price: 300, quantity: 1, image: '/api/placeholder/80/80' }
  ];

  const items = cartItems.length > 0 ? cartItems : mockCartItems;
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = formData.paymentMethod === 'pickup' ? 0 : 220; // Besplatno ako se preuzima u apoteci
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const deliveryMethod = formData.paymentMethod === 'pickup' ? 'Preuzimanje u apoteci' : 'Dostava na adresu';
    console.log('Narudžba poslana:', { 
      formData, 
      items, 
      total,
      deliveryMethod
    });
    alert(`Narudžba je uspešno poslana! Način dostave: ${deliveryMethod}`);
  };

  return (
    <div>
      <div className="delivery-container">
        <div className="main-content">
          <div>
            <div className="form-card">
              <h2 className="section-title">
                <User size={28} color="#16a34a" />
                Dostava i Plaćanje
              </h2>

              <div>
                {/* Lični podaci */}
                <div className="section personal-section">
                  <h3 className="subsection-title">
                    <User size={20} color="var(--tamnoZelena)" />
                    Lični podaci
                  </h3>
                  <div className="input-grid">
                    <div className="input-group">
                      <label className="label">Ime</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input" required />
                    </div>
                    <div className="input-group">
                      <label className="label">Prezime</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input" required />
                    </div>
                    <div className="input-group">
                      <label className="label label-with-icon">
                        <Mail size={16} color="var(--tamnoZelena)" />
                        Email
                      </label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input" required />
                    </div>
                    <div className="input-group">
                      <label className="label label-with-icon">
                        <Phone size={16} color="var(--tamnoZelena)" />
                        Telefon
                      </label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input" required />
                    </div>
                  </div>
                </div>

                {/* Način dostave i plaćanja */}
                <div className="section delivery-section">
                  <h3 className="subsection-title">
                    <Package size={20} color="var(--tamnoZelena)" />
                    Način dostave i plaćanja
                  </h3>

                  <div className="radio-group">
                    <label className={`radio-option ${formData.paymentMethod === 'pickup' ? 'selected' : ''}`} onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'pickup' }))}>
                      <input type="radio" name="paymentMethod" value="pickup" checked={formData.paymentMethod === 'pickup'} onChange={handleInputChange} className="radio" />
                      <div className="radio-content">
                        <div className="radio-title">
                          <Package size={18} color="var(--tamnoZelena)" />
                          Preuzimanje u apoteci
                        </div>
                        <div className="radio-description">
                          Dođite po proizvod u našu apoteku i platite na licu mesta. Besplatno!
                        </div>
                      </div>
                    </label>

                    {formData.paymentMethod === 'pickup' && (
                      <div className="pharmacy-selection">
                        <label className="label">Izaberite apoteku:</label>
                        <div className="pharmacy-options">
                          <label className="pharmacy-option">
                            <input type="radio" name="selectedPharmacy" value="apoteka1" checked={formData.selectedPharmacy === 'apoteka1'} onChange={handleInputChange} className="pharmacy-radio" />
                            <span className="pharmacy-label">Apoteka 1 - Centar (Kralja Petra I 15)</span>
                          </label>
                          <label className="pharmacy-option">
                            <input type="radio" name="selectedPharmacy" value="apoteka2" checked={formData.selectedPharmacy === 'apoteka2'} onChange={handleInputChange} className="pharmacy-radio" />
                            <span className="pharmacy-label">Apoteka 2 - Novi deo (Vuka Karadžića 23)</span>
                          </label>
                        </div>
                      </div>
                    )}

                    <label className={`radio-option ${formData.paymentMethod === 'delivery' ? 'selected' : ''}`} onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'delivery' }))}>
                      <input type="radio" name="paymentMethod" value="delivery" checked={formData.paymentMethod === 'delivery'} onChange={handleInputChange} className="radio" />
                      <div className="radio-content">
                        <div className="radio-title">
                          <Truck size={18} color="#f59e0b" />
                          Dostava na adresu - plaćanje pouzećem
                        </div>
                        <div className="radio-description">
                          Proizvod će biti dostavljen na vašu adresu putem pošte. Plaćanje pri preuzimanju {subtotal < 60 ? `(+10 BAM dostava)` : `(Besplatna dostava)`}.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'delivery' && (
                  <div className="section address-section">
                    <h3 className="subsection-title">
                      <MapPin size={20} color="#2563eb" />
                      Adresa dostave
                    </h3>
                    <div className="input-grid">
                      <div className="input-group full-width">
                        <label className="label label-with-icon">
                          <Home size={16} color="#2563eb" />
                          Adresa
                        </label>
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input address-input" required />
                      </div>
                      <div className="input-group">
                        <label className="label">Grad</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input address-input" required />
                      </div>
                      <div className="input-group">
                        <label className="label">Poštanski broj</label>
                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="input address-input" required />
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={handleSubmit} className="submit-button">
                  Potvrdi narudžbu – {total.toFixed(2)} BAM
                </button>
              </div>
            </div>
          </div>

          {/* Pregled korpe */}
          <div>
            <div className="cart-card">
              <h3 className="cart-title">
                <ShoppingCart size={24} color="#16a34a" />
                Vaša korpa
              </h3>

              <div>
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.slikaURL} alt={item.naziv} className="item-image" />
                    <div className="item-info">
                      <h4 className="item-name">{item.naziv}</h4>
                      <p className="item-price">{item.cijena.toFixed(2)} BAM</p>
                      <p className="item-quantity">Količina: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary">
                <div className="summary-row">
                  <span>Iznos artikala:</span>
                  <span>{subtotal.toFixed(2)} BAM</span>
                </div>

                {formData.paymentMethod === 'delivery' && (
                  <div className="summary-row">
                    <span>Dostava:</span>
                    <span>{shipping === 0 ? 'Besplatno' : `${shipping.toFixed(2)} BAM`}</span>
                  </div>
                )}

                <div className="total-row">
                  <span>Ukupno:</span>
                  <span className="total-price">{total.toFixed(2)} BAM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popup komponenta */}
      <Popup 
        isOpen={isPopupOpen} 
        onClose={closePopup} 
        message={popupMessage} 
      />
      
      <Footer />
    </div>
  );
};

export default DeliveryAndPayment;
