import { useState, useRef, useEffect } from "react";
import {
  PlusCircle,
  Leaf,
  Activity,
  Baby,
  Shield,
  Apple,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PharmacyCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);

  const navigate = useNavigate();

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -window.innerWidth : window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categories = [
    {
      id: 1,
      name: "DODACI ISHRANI",
      icon: PlusCircle,
      desc: "",
      details: ["Za energiju", "Imunitet podrška"],
      color: "#4CAF50",
    },
    {
      id: 2,
      name: "Dermokozmetika",
      icon: Leaf,
      desc: "",
      details: ["Njega kože", "Prirodni sastojci"],
      color: "#8BC34A",
    },
    {
      id: 3,
      name: "Medicinska pomagala",
      icon: Activity,
      desc: "",
      details: ["Kućna dijagnostika", "Precizna merenja"],
      color: "#009688",
    },
    {
      id: 4,
      name: "Mama i bebe",
      icon: Baby,
      desc: "",
      details: ["Nježna njega", "Bezbedno za bebe"],
      color: "#FF9800",
    },
    {
      id: 5,
      name: "Higijena, njega i ostalo",
      icon: Shield,
      desc: "",
      details: ["Dezinfekcija", "Zdravlje prvo"],
      color: "#3F51B5",
    },
    {
      id: 6,
      name: "Zdrava hrana i čajevi",
      icon: Apple,
      desc: "",
      details: ["Prirodna energija", "Balans u ishrani"],
      color: "#FF5722",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "3rem 1rem",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          position: "relative",
          paddingBottom: "1rem",
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            color: "#4CAF50",
            margin: "0",
            fontWeight: "700",
            letterSpacing: "0.5px",
            display: "inline-block",
          }}
        >
          Važno za{" "}
          <span
            style={{
              background: "linear-gradient(to right, #FFEB3B, #FF9800)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VAŠE
          </span>{" "}
          zdravlje
          <span
            style={{
              background: "linear-gradient(to right, #FFEB3B, #FF9800)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            !
          </span>
        </h2>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "4px",
            background: "linear-gradient(to right, #FFEB3B, #FF9800)",
            borderRadius: "2px",
          }}
        ></div>
      </div>

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          flexWrap: isMobile ? "nowrap" : "wrap",
          overflowX: isMobile ? "auto" : "visible",
          scrollSnapType: isMobile ? "x mandatory" : "none",
          gap: "1rem",
          padding: "0 0.5rem",
          scrollBehavior: "smooth",
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              minWidth: isMobile ? "calc(100vw - 2rem)" : "210px",
              maxWidth: isMobile ? "calc(100vw - 2rem)" : "210px",
              scrollSnapAlign: isMobile ? "center" : "none",
              flex: isMobile ? "0 0 auto" : "1 1 auto",
              height: "140px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "1rem",
              cursor: "pointer",
              background:
                activeCategory === category.id
                  ? `linear-gradient(145deg, ${category.color}40, ${category.color}20)`
                  : "white",
              border:
                activeCategory === category.id
                  ? `2px solid ${category.color}`
                  : "1px solid #ddd",
              boxShadow:
                activeCategory === category.id
                  ? `0 6px 16px ${category.color}30`
                  : "0 3px 8px rgba(0,0,0,0.06)",
              transition: "all 0.4s ease",
            }}
            onMouseEnter={() => setActiveCategory(category.id)}
            onMouseLeave={() => setActiveCategory(null)}
            onClick={() => {
              const query = new URLSearchParams();
              query.append("kategorija", category.name);

              navigate(`/prodavnica?${query.toString()}`);
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background:
                  activeCategory === category.id
                    ? `${category.color}20`
                    : "#f5f5f5",
                border: `2px solid ${
                  activeCategory === category.id ? category.color : "#e0e0e0"
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "1rem",
                boxShadow:
                  activeCategory === category.id
                    ? `0 0 0 4px ${category.color}10`
                    : "none",
                transition: "all 0.3s ease",
              }}
            >
              <category.icon
                size={22}
                style={{
                  color:
                    activeCategory === category.id ? category.color : "#555",
                }}
              />
            </div>
            <div style={{ width: "100%" }}>
              <h3
                style={{
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  margin: "0 0 0.2rem 0",
                  color:
                    activeCategory === category.id ? category.color : "#333",
                  textTransform: "uppercase",
                }}
              >
                {category.name}
              </h3>
              <p
                style={{
                  fontSize: "0.75rem",
                  margin: "0 0 0.3rem 0",
                  color:
                    activeCategory === category.id ? category.color : "#666",
                  fontWeight: "600",
                }}
              >
                {category.desc}
              </p>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {category.details.map((detail, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.2rem 0.4rem",
                      background:
                        activeCategory === category.id
                          ? `${category.color}15`
                          : "#f5f5f5",
                      color:
                        activeCategory === category.id
                          ? category.color
                          : "#555",
                      borderRadius: "10px",
                      border:
                        activeCategory === category.id
                          ? `1px solid ${category.color}30`
                          : "1px solid #e0e0e0",
                      fontWeight: "500",
                    }}
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
