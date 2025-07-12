import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "./UsersList.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null); // Za prikaz "loading" na ban dugmetu

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error("Greška pri učitavanju korisnika:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleBan = async (userId, currentBanStatus) => {
    setUpdatingUserId(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { banovan: !currentBanStatus });

      // Update state lokalno da odmah reflektuje promenu u UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banovan: !currentBanStatus } : user
        )
      );
    } catch (error) {
      alert("Greška pri ažuriranju statusa banovanja.");
      console.error(error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return <p>Učitavanje korisnika...</p>;

  return (
    <div className="users-list-container">
      <h2>Lista korisnika</h2>
      <table className="users-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Korisničko ime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Banovan</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6">Nema korisnika</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username || user.name || "-"}</td>
                <td>{user.email}</td>
                <td>{user.role || "user"}</td>
                <td>{user.banovan ? "Da" : "Ne"}</td>
                <td>
                  <button
                    onClick={() => toggleBan(user.id, user.banovan || false)}
                    disabled={updatingUserId === user.id}
                    className={user.banovan ? "unban-button" : "ban-button"}
                  >
                    {updatingUserId === user.id
                      ? "Ažuriranje..."
                      : user.banovan
                      ? "Odbanuj"
                      : "Banuj"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
