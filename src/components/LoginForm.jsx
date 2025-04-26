import React from 'react';
import './LoginForm.css';

import { Link } from 'react-router-dom';


const LoginForm = () => {
  return (
    <div className="login-container">
      {/* Left: Image */}
      <div className="login-image">
        <img 
          src="https://sexy-costume.com/cdn/shop/files/sexy-doctor-and-nurse-costume-white-s-624.webp?v=1738214111&width=800"
          alt="Placeholder"
        />
      </div>

      {/* Right: Form */}
      <div className="login-form">
        <h1>Prijava</h1>
        <form action="#" method="POST">
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Korisničko ime</label>
            <input type="text" id="username" name="username" autoComplete="off" />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Šifra</label>
            <input type="password" id="password" name="password" autoComplete="off" />
          </div>

          {/* Remember me */}
          <div className="form-remember">
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Ostani prijavljen</label>
          </div>

          {/* Forgot password */}
          <div className="form-forgot">
            <Link to="/zaboravljenja-sifra">Zaboravio šifru?</Link>

          </div>

          {/* Login button */}
          <button type="submit" className="login-button">Prijavi se</button>
        </form>

        {/* Signup link */}
        <div className="form-signup">
        <Link to="/registracija">Registruj se</Link>
        </div>

        <div className="back-to-home">
  <Link to="/pocetna">← Nazad na početnu</Link>
</div>
      </div>
    </div>
  );
};

export default LoginForm;
