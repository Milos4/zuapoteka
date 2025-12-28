import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import ContactReplyModal from "./ContactReplyModal";
import "./WorkerContactMessagesPage.css";

const WorkerContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "contactMessages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati poruku?")) return;
    await deleteDoc(doc(db, "contactMessages", id));
    setOpenMenuId(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp.seconds * 1000).toLocaleString("sr-RS");
  };

  return (
    <div className="worker-messages">
      <h1>Kontakt poruke</h1>

      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-card ${msg.status}`}>
            {/* HEADER */}
            <div className="message-header">
              <div>
                <strong>{msg.name}</strong>
                <div className="message-time">{formatDate(msg.createdAt)}</div>
              </div>

              {/* MENU */}
              <div className="menu-wrapper">
                <button
                  className="menu-btn"
                  onClick={() =>
                    setOpenMenuId(openMenuId === msg.id ? null : msg.id)
                  }
                >
                  ⋮
                </button>

                {openMenuId === msg.id && (
                  <div className="menu-dropdown">
                    <button onClick={() => handleDelete(msg.id)}>
                      Obriši poruku
                    </button>
                  </div>
                )}
              </div>
            </div>

            <span className={`status ${msg.status}`}>
              {msg.status === "new" ? "NOVO" : "ODGOVORENO"}
            </span>

            <div className="email">
              <strong>Email:</strong> {msg.email}
            </div>
            <div className="subject">
              <strong>Naslov:</strong> {msg.subject || "Bez naslova"}
            </div>
            <div className="message-text">
              <strong>Poruka:</strong> {msg.message}
            </div>
            <div className="message-text">
              <strong>Odgovor:</strong> {msg.answer}
            </div>

            {/* ODGOVOR */}
            {msg.status === "answered" && msg.answer && (
              <div className="answer-box">
                <strong>Odgovor:</strong>
                <p>{msg.answer}</p>
                <span className="answered-time">
                  Odgovoreno: {formatDate(msg.answeredAt)}
                </span>
              </div>
            )}

            {/* DUGME */}
            {msg.status === "new" && (
              <button
                className="btn-load-more"
                onClick={() => setSelectedMessage(msg)}
              >
                Odgovori
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedMessage && (
        <ContactReplyModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};

export default WorkerContactMessagesPage;
