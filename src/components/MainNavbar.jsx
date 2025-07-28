import React, { useEffect, useState } from "react";
import DesktopNavbar from "./NavBar"; // klasičan navbar
import MobileNavbar from "./MobileNavbar";   // za manje ekrane

const MainNavbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navHeight = isMobile ? 78 : 150; 


  return (
    <>
      {isMobile ? <MobileNavbar /> : <DesktopNavbar />}
      {/* Ovaj div je spacer da gura sadržaj ispod fiksirane navbar */}
      <div style={{ height: navHeight }} />
    </>
  );};

export default MainNavbar;