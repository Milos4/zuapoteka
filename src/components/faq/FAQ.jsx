import React, { useState, useRef } from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "Kako mogu da naručim proizvod?",
    answer:
      "Proizvod možete naručiti tako što ga dodate u korpu, zatim nastavite na kasu i popunite podatke za dostavu i plaćanje.",
  },
  {
    question: "Koji su načini plaćanja?",
    answer: "Plaćanje je moguće pouzećem, karticom ili uplatom na račun.",
  },
  {
    question: "Koliko traje isporuka?",
    answer: "Rok isporuke je 1-3 radna dana, u zavisnosti od lokacije.",
  },
  {
    question: "Kako mogu da vratim proizvod?",
    answer:
      "Proizvod možete vratiti u roku od 14 dana ako je neotvoren i u originalnom pakovanju. Kontaktirajte korisničku podršku za instrukcije.",
  },
  {
    question: "Da li je potrebna registracija za poručivanje?",
    answer:
      "Ne, možete poručiti i bez registracije. Registracija omogućava brži proces naručivanja u budućnosti.",
  },
];

const FAQ = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const contentRefs = useRef([]);

  const toggleAnswer = (index) => {
    setOpenIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // zatvori ako je već otvoreno
          : [...prev, index] // dodaj ako nije
    );
  };

  return (
    <div className="faq-container">
      <h1>Najčešća pitanja u vezi Web prodavnice</h1>
      {faqData.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleAnswer(index)}>
              {item.question}
              <span className="faq-icon">{isOpen ? "−" : "+"}</span>
            </div>
            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className={`faq-answer-wrapper ${isOpen ? "open" : ""}`}
              style={{
                height: isOpen
                  ? `${contentRefs.current[index]?.scrollHeight}px`
                  : "0px",
              }}
            >
              <div className="faq-answer">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQ;
