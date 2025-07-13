import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductsPopup, setShowProductsPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pratimo auth status
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchOrders(currentUser);
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchOrders = async (currentUser) => {
    try {
      setLoading(true);
      
      // Prvo pokušaj sa userId
      let ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      
      let snapshot = await getDocs(ordersQuery);
      let userOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Ako nema rezultata sa userId, pokušaj sa email
      if (userOrders.length === 0) {
        ordersQuery = query(
          collection(db, "orders"),
          where("userInfo.email", "==", currentUser.email),
          orderBy("createdAt", "desc")
        );
        
        snapshot = await getDocs(ordersQuery);
        userOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      // Ako i dalje nema rezultata, dohvati sve i filtriraj lokalno
      if (userOrders.length === 0) {
        const allOrdersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );
        
        snapshot = await getDocs(allOrdersQuery);
        const allOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtriraj po email ili userId
        userOrders = allOrders.filter(order => 
          order.userId === currentUser.uid || 
          order.userInfo?.email === currentUser.email
        );
      }
      
      setOrders(userOrders);
    } catch (error) {
      console.error("Greška pri dohvatanju narudžbi:", error);
      
      // Fallback - dohvati sve narudžbe i filtriraj lokalno
      try {
        const allOrdersSnapshot = await getDocs(collection(db, "orders"));
        const allOrders = allOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userOrders = allOrders.filter(order => 
          order.userId === currentUser.uid || 
          order.userInfo?.email === currentUser.email
        ).sort((a, b) => {
          const aDate = a.createdAt?.seconds || 0;
          const bDate = b.createdAt?.seconds || 0;
          return bDate - aDate;
        });

        setOrders(userOrders);
      } catch (fallbackError) {
        console.error("Greška pri fallback dohvatanju:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Nepoznat datum";
    
    let date;
    
    // Ako je Firestore timestamp (serverTimestamp)
    if (dateValue.toDate) {
      date = dateValue.toDate();
    } 
    // Ako je objekat sa seconds (Firestore timestamp)
    else if (dateValue.seconds) {
      date = new Date(dateValue.seconds * 1000);
    }
    // Ako je string
    else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    }
    // Ako je već Date objekat
    else if (dateValue instanceof Date) {
      date = dateValue;
    }
    // Ako je timestamp broj
    else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    }
    else {
      return "Nepoznat datum";
    }
    
    return date.toLocaleDateString("sr-Latn-BA");
  };

  const formatStatus = (status) => {
    const statusMap = {
      'Poručeno': 'Poručeno',
      'Potvrđeno': 'Potvrđeno',
      'U pripremi': 'U pripremi',
      'Poslato': 'Poslato',
      'Dostavljeno': 'Dostavljeno',
      'Završeno': 'Završeno',
      'Otkazano': 'Otkazano',
      'Pripremljeno': 'Pripremljeno',
      'Preuzeto': 'Preuzeto',
      'Spremno za preuzimanje': 'Spremno za preuzimanje',
      'pending': 'Na čekanju',
      'confirmed': 'Potvrđeno',
      'processing': 'U pripremi',
      'shipped': 'Poslato',
      'delivered': 'Dostavljeno',
      'cancelled': 'Otkazano',
      'ready': 'Spremno za preuzimanje'
    };
    
    return statusMap[status] || status;
  };

  const calculateTotalPrice = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
      const price = item.naPopustu 
        ? item.cijena * (1 - item.popustProcenat / 100)
        : item.cijena;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <h2>Istorija narudžbi</h2>
        <p>Učitavanje narudžbi...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="order-history-container">
        <h2>Istorija narudžbi</h2>
        <p>Morate biti ulogovani da biste vidjeli istoriju narudžbi.</p>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2>Istorija narudžbi</h2>

      {orders.length === 0 ? (
        <p>Nemate nijednu narudžbinu.</p>
      ) : (
        orders.map((order) => {
          const subtotal = calculateTotalPrice(order.items);
          const shippingCost = order.shippingCost || 0;
          const totalPrice = order.total || (subtotal + shippingCost);
          
          return (
            <div key={order.id} className="order-card">
              <div className="order-info">
                <p><strong>ID:</strong> {order.orderId || order.id}</p>
                <p><strong>Datum:</strong> {formatDate(order.createdAt)}</p>
                <p><strong>Cijena:</strong> {totalPrice.toFixed(2)} BAM</p>
                <p>
                  <strong>Način:</strong>{" "}
                  {order.deliveryMethod === "Dostava na adresu" ? "Dostava" : "Preuzimanje"}
                </p>
                <p><strong>Status:</strong> {formatStatus(order.status || "Poručeno")}</p>
              </div>
              <div className="order-buttons">
                <button
                  className="btn-details"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowProductsPopup(true);
                  }}
                >
                  Vidi proizvode
                </button>
                <button
                  className="btn-details"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetailsPopup(true);
                  }}
                >
                  Vidi podatke
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Proizvodi popup */}
      {showProductsPopup && selectedOrder && (
        <div className="popup-overlay" onClick={() => setShowProductsPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Proizvodi</h3>
            <div className="products-popup">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, i) => {
                  const pricePerItem = item.naPopustu
                    ? item.cijena * (1 - item.popustProcenat / 100)
                    : item.cijena;
                  
                  return (
                    <div key={i} className="product-line">
                      <div className="product-info">
                        <span className="product-name">{item.naziv}</span>
                        <span className="product-meta">Količina: {item.quantity} kom</span>
                        <span className="product-meta">
                          Cijena: {pricePerItem.toFixed(2)} BAM
                        </span>
                        {item.naPopustu && (
                          <span className="product-meta discount">
                            Popust: {item.popustProcenat}%
                          </span>
                        )}
                      </div>
                      <img
                        src={item.slikaURL || "/placeholder.png"}
                        alt={item.naziv}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </div>
                  );
                })
              ) : (
                <p>Nema proizvoda u ovoj narudžbi.</p>
              )}
            </div>
            <button className="btnZatvori" onClick={() => setShowProductsPopup(false)}>
              Zatvori
            </button>
          </div>
        </div>
      )}

      {/* Podaci popup */}
      {showDetailsPopup && selectedOrder && (
        <div className="popup-overlay" onClick={() => setShowDetailsPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Lični podaci</h3>
            <p><strong>Ime:</strong> {selectedOrder.userInfo?.firstName}</p>
            <p><strong>Prezime:</strong> {selectedOrder.userInfo?.lastName}</p>
            <p><strong>Email:</strong> {selectedOrder.userInfo?.email}</p>
            <p><strong>Telefon:</strong> {selectedOrder.userInfo?.phone}</p>

            {selectedOrder.deliveryMethod === "Preuzimanje u apoteci" ? (
              <p><strong>Apoteka:</strong> {
                selectedOrder.userInfo?.pickupPharmacy === "apoteka1" 
                  ? "Apoteka 1 - Centar (Kralja Petra I 15)"
                  : selectedOrder.userInfo?.pickupPharmacy === "apoteka2"
                  ? "Apoteka 2 - Novi deo (Vuka Karadžića 23)"
                  : "Apoteka Centar"
              }</p>
            ) : (
              <>
                <p><strong>Grad:</strong> {selectedOrder.userInfo?.city}</p>
                <p><strong>Poštanski broj:</strong> {selectedOrder.userInfo?.postalCode}</p>
                <p><strong>Adresa:</strong> {selectedOrder.userInfo?.address}</p>
                <p><strong>Cijena dostave:</strong> {selectedOrder.shippingCost ? `${selectedOrder.shippingCost.toFixed(2)} BAM` : "Besplatno"}</p>
              </>
            )}

            <button className="btnZatvori" onClick={() => setShowDetailsPopup(false)}>
              Zatvori
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;