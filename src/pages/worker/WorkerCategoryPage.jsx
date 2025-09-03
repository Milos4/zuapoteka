import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import EditCategoryModal from "../../components/worker/EditCategoryModal";

const WorkerCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Učitaj sve kategorije iz baze
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "kategorije"));
      const cats = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCategories(cats);
    } catch (error) {
      console.error("Greška pri učitavanju kategorija:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Da li sigurno želiš obrisati ovu kategoriju?")) {
      try {
        await deleteDoc(doc(db, "kategorije", id));
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } catch (error) {
        console.error("Greška pri brisanju kategorije:", error);
      }
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedCategory(null);
  };

  const handleModalSave = () => {
    fetchCategories(); // ponovo učitaj posle edita
    handleModalClose();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Kategorije i Podkategorije</h2>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{cat.naziv}</h3>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                    {cat.subkategorije.map((sub, idx) => (
                      <li key={idx}>{sub}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openModal && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default WorkerCategoryPage;
