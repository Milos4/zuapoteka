import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/colors.css";

import NavBar from "./components/MainNavbar";
import NavBarAdmin from "./components/admin/NavBarAdmin";
import NavBarWorker from "./components/worker/NavBarWorker";


import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import AdminRoute from "./components/admin/AdminRoute";
import WorkerRoute from "./components/worker/WorkerRoute";
import { fixProductCategories } from "./fixProductCategories"; 



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

import { CartProvider } from "./context/CartContext";



//Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AddBrandPage from "./pages/admin/AddBrandPage";
import AddProductPage from "./pages/admin/AddProductPage";
import AddImagePage from "./pages/admin/AddImagePage";
import AddProductCPage from "./pages/admin/AddProductCPage";
import UsersPage from "./pages/admin/UsersPage";


// worker pages
import WorkerOrdersPage from "./pages/worker/Orders";
import WorkerProductsPage from "./pages/worker/WorkerProductsPage";
import WorkerBrandsPage from "./pages/worker/WorkerBrandsPage";
import WorkerCategoryPage from "./pages/worker/WorkerCategoryPage";




import ScrollToTop from "./components/ScrollToTop";
import DeliveryAndPayment from "./pages/DeliveryAndPayment";


import GenerateCategories from "./GenerateCategories";
//<GenerateCategories></GenerateCategories>


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

  //ZA UPDEJTOVANJE KATEGORIJE
  // useEffect(() => {
  //   fixProductCategories();
  // }, []);


  const location = useLocation();
  const hideNavbarRoutes = ["/prijava", "/registracija"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  if (loading) return null;
  return (
    <>
<CartProvider>
      <ScrollToTop />
      {!shouldHideNavbar && 
  (role === "admin" 
    ? <NavBarAdmin /> 
    : role === "radnik"
      ? <NavBarWorker />
      : <NavBar />
  )
}
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
        <Route
          path="/zaboravljenja-sifra"
          element={<ForgottenPasswordPage />}
        />
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

<Route path="/profil" element={<ProfilePage />} />
        <Route path="/kupi" element={<DeliveryAndPayment />} />
<Route path="/product/:id" element={<ProductDetailsPage />} />

<Route path="/radnik/porudzbine" element={
  <WorkerRoute>
    <WorkerOrdersPage />
  </WorkerRoute>
} />

<Route path="/radnik/brendovi" element={
  <WorkerRoute>
    <WorkerBrandsPage />
  </WorkerRoute>
} />

<Route path="/radnik/kategorije" element={
  <WorkerRoute>
    <WorkerCategoryPage />
  </WorkerRoute>
} />
   <Route path="/radnik/proizvodi" element={ <WorkerRoute>
    <WorkerProductsPage />
  </WorkerRoute>} />
</Routes>
          </CartProvider>
    </>
  );
}

export default App;
