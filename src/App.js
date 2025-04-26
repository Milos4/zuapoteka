import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


//Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AboutPage from "./pages/AboutPage";
import CartProductsPage from "./pages/CartProductsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import CustomerSupportPage from "./pages/CustomerSupportPage";
import DeliveryInformationPage from "./pages/DeliveryInformationPage";
import ForgottenPasswordPage from "./pages/ForgottenPasswordPage";
import LoginPage from "./pages/LoginPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderingProcessPage from "./pages/OrderingProcessPage";
import RegistrationPage from "./pages/RegistrationPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";
import ContactPage from "./pages/ContactPage";
import FavoritesPage from "./pages/FavoritesPage";
import FAQPage from "./pages/FAQPage";
////

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pocetna" element={<HomePage />} />

      <Route path="/o-nama" element={<AboutPage />} />
      <Route path="/kontakt" element={<ContactPage />} />
      <Route path="/reklamacije" element={<ComplaintsPage />} />
      <Route path="/koristnicka-podrska" element={<CustomerSupportPage />} />
      <Route path="/info-dostava" element={<DeliveryInformationPage />} />
      <Route path="/uslovi-koristenja" element={<TermsOfUsePage />} />
      <Route path="/pitanja" element={<FAQPage />} />

      <Route path="/korpa" element={<CartProductsPage />} />
      <Route path="/prodavnica" element={<ShopPage />} />
      <Route path="/informacije-dostave" element={<OrderingProcessPage />} />


      <Route path="/prijava" element={<LoginPage />} />
      <Route path="/registracija" element={<RegistrationPage />} />
      <Route path="/istorija" element={<OrderHistoryPage />} />
      <Route path="/favoriti" element={<FavoritesPage />} />
      <Route path="/zaboravljenja-sifra" element={<ForgottenPasswordPage />} />



    </Routes>
  );
}

export default App;

