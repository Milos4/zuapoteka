import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/colors.css";

import NavBar from "./components/NavBar";
import NavBarAdmin from "./components/admin/NavBarAdmin";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import AdminRoute from "./components/admin/AdminRoute";

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
import ProductDetailsPage from "./pages/ProductDeatilsPage";

import ProfilePage from "./pages/ProfilePage";


//Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AddBrandPage from "./pages/admin/AddBrandPage";
import AddProductPage from "./pages/admin/AddProductPage";
import AddImagePage from "./pages/admin/AddImagePage";
import UsersPage from "./pages/admin/UsersPage";



import ScrollToTop from "./components/ScrollToTop";
import DeliveryAndPayment from "./pages/DeliveryAndPayment";


import { useLocation } from "react-router-dom";

////

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setRole(data.role || "user");
        }
      } else {
        setRole("");
      }
      setLoading(false); // <- ovde završi loading
    });
    return () => unsubscribe();
  }, []);

  const location = useLocation();
  const hideNavbarRoutes = ["/prijava", "/registracija"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  if (loading) return null;
  return (
    <>
      <ScrollToTop />
      {!shouldHideNavbar &&
        (role === "admin" ? <NavBarAdmin /> : <NavBar />)}{" "}
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
        <Route path="/prodavnica1" element={<ShopPage />} />
        <Route path="/informacije-dostave" element={<OrderingProcessPage />} />

        <Route path="/prijava" element={<LoginPage />} />
        <Route path="/registracija" element={<RegistrationPage />} />
        <Route path="/istorija" element={<OrderHistoryPage />} />
        <Route path="/favoriti" element={<FavoritesPage />} />
        <Route
          path="/zaboravljenja-sifra"
          element={<ForgottenPasswordPage />}
        />
        <Route path="/prodavnica" element={<ProductDetailsPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

<Route
  path="/admin/dodaj-brend"
  element={
    <AdminRoute>
      <AddBrandPage />
    </AdminRoute>
  }
/> 
<Route
  path="/admin/dodaj-proizvod"
  element={
    <AdminRoute>
      <AddProductPage />
    </AdminRoute>
  }
/>
<Route
  path="/admin/dodaj-sliku"
  element={
    <AdminRoute>
      <AddImagePage />
    </AdminRoute>
  }
/>
<Route
  path="/admin/korisnici"
  element={
    <AdminRoute>
      <UsersPage />
    </AdminRoute>
  }
/>
<Route path="/profil" element={<ProfilePage />} />
        <Route path="/kupi" element={<DeliveryAndPayment />} />

</Routes>
        
    </>
  );
}

export default App;
