import React, { useState, useEffect } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../../firebase/Setup";
import "./AllUsers.scss";
import DefaultUser from "../../assets/default-user.jpg";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersQuery = query(usersCollection);
        const usersQuerySnapshot = await getDocs(usersQuery);
        const usersData = usersQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Filter out both admin and logged-in user
        const filteredUsers = usersData.filter(
          (user) =>
            user.email !== "admin@gmail.com" && user.email !== loggedUser.email
        );
        setUsers(filteredUsers);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchUsers();
  }, [loggedUser.email]);

  return (
    <div className="all-users">
      {loading ? (
        <div className="single-user load"></div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="single-user">
            <div className="user-img">
              <Link to={`/user/${user.id}`}>
                <img
                  src={user.photoURL || DefaultUser}
                  className="img-fluid load"
                  alt=""
                />
              </Link>
            </div>

            <div className="user-details d-lg-block d-none">
              <Link to={`/user/${user.id}`}>
                <h4>{user.displayName}</h4>
              </Link>

              <form className="user-form">
                <input type="text" placeholder="Send Hi.." />
              </form>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllUsers;
