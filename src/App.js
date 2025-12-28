import "./App.css";
import "./styles/colors.css";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Navbar
import NavBar from "./components/MainNavbar";
import NavBarAdmin from "./components/admin/NavBarAdmin";
import NavBarWorker from "./components/worker/NavBarWorker";

// Route guards
import AdminRoute from "./components/admin/AdminRoute";
import WorkerRoute from "./components/worker/WorkerRoute";

// Pages
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
import DeliveryAndPayment from "./pages/DeliveryAndPayment";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AddBrandPage from "./pages/admin/AddBrandPage";
import AddProductPage from "./pages/admin/AddProductPage";
import AddImagePage from "./pages/admin/AddImagePage";
import AddProductCPage from "./pages/admin/AddProductCPage";
import UsersPage from "./pages/admin/UsersPage";

// Worker pages
import WorkerOrdersPage from "./pages/worker/Orders";
import WorkerBrandDiscountPage from "./pages/worker/WorkerBrandDiscountPage";
import WorkerProductsPage from "./pages/worker/WorkerProductsPage";
import WorkerBrandsPage from "./pages/worker/WorkerBrandsPage";
import WorkerCategoryPage from "./pages/worker/WorkerCategoryPage";
import WorkerContactMessagesPage from "./pages/worker/WorkerContactMessagesPage";

// Utils
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import CookieBanner from "./components/cookieBanner/CookieBanner";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          setRole(snap.data().role || "user");
        }
      } else {
        setRole("");
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null;

  // JAVNE RUTE (bez logina)
  if (!user) {
    if (
      location.pathname !== "/prijava" &&
      location.pathname !== "/registracija" &&
      location.pathname !== "/zaboravljenja-sifra"
    ) {
      return <Navigate to="/prijava" replace />;
    }
  }

  const hideNavbarRoutes = ["/prijava", "/registracija"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <CartProvider>
      <ScrollToTop />

      {!shouldHideNavbar &&
        (role === "admin" ? (
          <NavBarAdmin />
        ) : role === "radnik" ? (
          <>
            <NavBar />
            <NavBarWorker />
          </>
        ) : (
          <NavBar />
        ))}

      <Routes>
        {/* AUTH */}
        <Route path="/prijava" element={<LoginPage />} />
        <Route path="/registracija" element={<RegistrationPage />} />
        <Route
          path="/zaboravljenja-sifra"
          element={<ForgottenPasswordPage />}
        />

        {/* COMMON */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pocetna" element={<HomePage />} />
        <Route path="/o-nama" element={<AboutPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/prodavnica" element={<ShopPage />} />
        <Route path="/korpa" element={<CartProductsPage />} />
        <Route path="/favoriti" element={<FavoritesPage />} />
        <Route path="/istorija" element={<OrderHistoryPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/kupi" element={<DeliveryAndPayment />} />

        {/* FOOTER STRANICE */}
        <Route path="/koristnicka-podrska" element={<CustomerSupportPage />} />
        <Route path="/uslovi-koristenja" element={<TermsOfUsePage />} />
        <Route path="/info-dostava" element={<DeliveryInformationPage />} />
        <Route path="/reklamacije" element={<ComplaintsPage />} />
        <Route path="/pitanja" element={<FAQPage />} />

        {/* ADMIN */}
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
        <Route
          path="/admin/dodaj-odjecu"
          element={
            <AdminRoute>
              <AddProductCPage />
            </AdminRoute>
          }
        />

        {/* WORKER */}
        <Route
          path="/radnik/porudzbine"
          element={
            <WorkerRoute>
              <WorkerOrdersPage />
            </WorkerRoute>
          }
        />
        <Route
          path="/radnik/poruke"
          element={
            <WorkerRoute>
              <WorkerContactMessagesPage />
            </WorkerRoute>
          }
        />
        <Route
          path="/radnik/popusti-po-brendu"
          element={
            <WorkerRoute>
              <WorkerBrandDiscountPage />
            </WorkerRoute>
          }
        />
        <Route
          path="/radnik/brendovi"
          element={
            <WorkerRoute>
              <WorkerBrandsPage />
            </WorkerRoute>
          }
        />
        <Route
          path="/radnik/kategorije"
          element={
            <WorkerRoute>
              <WorkerCategoryPage />
            </WorkerRoute>
          }
        />
        <Route
          path="/radnik/proizvodi"
          element={
            <WorkerRoute>
              <WorkerProductsPage />
            </WorkerRoute>
          }
        />
      </Routes>

      <CookieBanner />
    </CartProvider>
  );
}

export default App;
