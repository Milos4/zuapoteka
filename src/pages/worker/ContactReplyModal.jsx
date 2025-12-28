import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions, db } from "../../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import "./ContactReplyModal.css";

const ContactReplyModal = ({ message, onClose }) => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!answer.trim()) return;

    setLoading(true);

    try {
      const sendReply = httpsCallable(functions, "sendContactReply");

      await sendReply({
        email: message.email,
        ime: message.name,
        odgovor: answer,
      });

      // ✅ tek kad mail uspješno ode
      await updateDoc(doc(db, "contactMessages", message.id), {
        status: "answered",
        answer: answer,
        answeredAt: serverTimestamp(),
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert("Greška pri slanju emaila. Pokušaj ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Odgovor na poruku</h2>

        <p>
          <strong>{message.name}</strong> ({message.email})
        </p>
        <p className="original-message">{message.message}</p>

        <textarea
          placeholder="Upiši odgovor..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={6}
        />

        <div className="modal-actions">
          <button className="btn-delete" onClick={onClose}>
            Otkaži
          </button>
          <button
            className="btn-secondary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Slanje..." : "Pošalji odgovor"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactReplyModal;
