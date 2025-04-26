import React from 'react';
import { Link } from 'react-router-dom';
import './RegistrationForm.css'; 

const RegistrationForm = () => {
  return (
    <div className="registration-container">
      <div className="registration-background"></div>

      <div className="registration-form">
        <h1>Registracija</h1>
        <form action="#" method="POST">
          <div className="registration-group">
            <label htmlFor="username">Korisničko ime</label>
            <input type="text" id="username" name="username" autoComplete="off" />
          </div>

          <div className="registration-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" autoComplete="off" />
          </div>

          <div className="registration-group">
            <label htmlFor="address">Adresa</label>
            <input type="text" id="address" name="address" autoComplete="off" />
          </div>

          <div className="registration-group">
            <label htmlFor="phone">Broj telefona</label>
            <input type="text" id="phone" name="phone" autoComplete="off" />
          </div>

          <div className="registration-group">
            <label htmlFor="password">Šifra</label>
            <input type="password" id="password" name="password" autoComplete="off" />
          </div>

          <div className="registration-group">
            <label htmlFor="confirmPassword">Ponovi šifru</label>
            <input type="password" id="confirmPassword" name="confirmPassword" autoComplete="off" />
          </div>

      

          <button type="submit" className="registration-button">Registruj se</button>

          <div className="registration-link">
            <Link to="/prijava">Već imate nalog? Prijavite se</Link>
          </div>

          <div className="back-to-home">
  <Link to="/pocetna">← Nazad na početnu</Link>
</div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
