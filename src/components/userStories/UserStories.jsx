import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import "./UserStories.scss";
import DefaultUser from "../../assets/default-user.jpg";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/Setup";
import { Link } from "react-router-dom";

const UserStories = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: false,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    autoplay: false,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200, // for screens >= 1200px wide
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024, // for screens >= 992px wide
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768, // for screens >= 768px wide
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 576, // for screens >= 576px wide
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersQuery = query(
          usersCollection,
          where("email", "!=", "admin@gmail.com")
        );
        const usersQuerySnapshot = await getDocs(usersQuery);
        const usersData = usersQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchUsers();
  }, []);
  return (
    <Container fluid>
      <div className="slider-container">
        {loading ? (
          <Slider {...settings}>
            <div className="single-story">
              <div className="user-img load"></div>

              <div className="user-details">
                <a>
                  <h4>Loading</h4>
                </a>
              </div>
            </div>
            <div className="single-story">
              <div className="user-img load"></div>

              <div className="user-details">
                <a>
                  <h4>Loading</h4>
                </a>
              </div>
            </div>
            <div className="single-story">
              <div className="user-img load"></div>

              <div className="user-details">
                <a>
                  <h4>Loading</h4>
                </a>
              </div>
            </div>
            <div className="single-story">
              <div className="user-img load"></div>

              <div className="user-details">
                <a>
                  <h4>Loading</h4>
                </a>
              </div>
            </div>
            <div className="single-story">
              <div className="user-img load"></div>

              <div className="user-details">
                <a>
                  <h4>Loading</h4>
                </a>
              </div>
            </div>
          </Slider>
        ) : (
          <Slider {...settings}>
            {users.map((user) => (
              <div key={user.id} className="single-story">
                <div className="user-img">
                  <img
                    src={user.photoURL || DefaultUser}
                    className="img-fluid load"
                    alt=""
                  />
                </div>

                <div className="user-details">
                  <Link to={`/user/${user.id}`}>
                    <h4>{user.displayName.split(" ")[0]}</h4>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </Container>
  );
};

export default UserStories;
