import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import Wishlist from "./Wishlist";
import OrderHistory from "./OrderHistory";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profil");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "profil":
        return <ProfileDetails />;
      case "zelje":
        return <Wishlist />;
      case "istorija":
        return <OrderHistory />;
      default:
        return <ProfileDetails />;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <button
          className={activeTab === "profil" ? "active" : ""}
          onClick={() => setActiveTab("profil")}
        >
          Moj profil
        </button>
        <button
          className={activeTab === "zelje" ? "active" : ""}
          onClick={() => setActiveTab("zelje")}
        >
          Lista želja
        </button>
        <button
          className={activeTab === "istorija" ? "active" : ""}
          onClick={() => setActiveTab("istorija")}
        >
          Istorija narudžbi
        </button>
      </div>
       <div className="profile-separator" />
      <div className="profile-content">{renderTabContent()}</div>
    </div>
  );
};

export default Profile;
