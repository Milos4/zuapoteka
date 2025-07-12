import React from "react";
import "./ProfileDetails.css";

const ProfileDetails = () => {
  return (
    <div className="profile-details">
      <h2>Moji podaci</h2>
      <p>Ovdje ćeš moći vidjeti i urediti svoje lične informacije.</p>
      {/* Ovdje možeš dodati podatke iz Firestore i formu za uređivanje */}
    </div>
  );
};

export default ProfileDetails;
