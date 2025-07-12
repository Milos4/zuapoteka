import React, { useState } from "react";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddImage.css";

const AddImage = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Molimo izaberite sliku.");
      return;
    }

    setUploading(true);

    try {
      const imageRef = ref(storage, `image/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      setDownloadURL(url);
      alert("Slika uspešno uploadovana!");
    } catch (err) {
      console.error("Greška pri uploadu:", err);
      alert("Greška pri uploadu slike.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-image-container">
      <h3>Dodaj sliku</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Dodavanje..." : "Dodaj sliku"}
      </button>

      {downloadURL && (
        <div className="upload-success">
          <p>Slika uspešno dodana!</p>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            {downloadURL}
          </a>
        </div>
      )}
    </div>
  );
};

export default AddImage;
