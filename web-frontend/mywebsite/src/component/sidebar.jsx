import { useLocation, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoCreate } from "react-icons/io5";
import { AiFillFire } from "react-icons/ai";
import { IoIosSettings } from "react-icons/io";
import { useState, useEffect } from "react";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const [login, setLogin] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch("http://localhost:3001/", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.user) {
          setLogin(true);
          setUser(data.user);
        } else {
          setLogin(false);
          setUser(null);
        }
      } catch (error) {
        setLogin(false);
        setUser(null);
      }
    };
    checkLogin();
  }, [location]);

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/signout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLogin(false);
        navigate("/login");
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      alert("Logout error. Please try again.");
    }
  };

  return (
    <>
      {/*(only for mobile) */}
      <nav
        className="navbar navbar-dark bg-dark shadow-sm d-flex d-md-none"
        style={{
          height: "3.5rem",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          padding: "0",
          zIndex: 1050,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "50px",
            padding: "0 0.9rem",
          }}
        >
          <Link
            to="/about"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src="/webicon3.png"
              alt="Logo"
              style={{ height: "2.5rem", width: "2.5rem" }}
            />
            <p
              className="fw-bold mb-0"
              style={{
                textDecoration: "none",
                color: "#fff",
                marginLeft: "8px",
              }}
            >
              ThinkDeep
            </p>
          </Link>

          <div className="dropdown d-lg-none">
            <button
              className="btn btn-dark dropdown-toggle"
              type="button"
              id="mobileMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-dark end custom-mobile-dropdown"
              aria-labelledby="mobileMenuButton"
              style={{ minWidth: "13rem" }}
            >
              <li>
                <Link className="dropdown-item" to="/settings">
                  <IoIosSettings size={20} className="me-2" />
                  Settings
                </Link>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <Link className="dropdown-item" to="/signup">
                  Create an Account
                </Link>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              {login ? (
                <li>
                  <button className="dropdown-item " onClick={handleSignout}>
                    <span className=" text-danger">
                      Log out @{user?.username}
                    </span>
                  </button>
                </li>
              ) : (
                <li>
                  <Link className="dropdown-item" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* for mobile screen */}
      <div
        className="d-flex d-md-none justify-content-center align-items-center mobilenav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "3.5rem",
          borderTop: "0.5px solid #424344ff",
          zIndex: 1050,
        }}
      >
        <ul
          className="d-flex w-100 justify-content-around align-items-center mb-0 nav "
          style={{
            listStyle: "none",
            paddingLeft: 0,
            marginBottom: 0,
            height: "100%",
          }}
        >
          {[
            { to: "/", icon: <FaHome size={24} />, title: "home" },
            {
              to: "/share-thought",
              icon: <IoCreate size={24} />,
              title: "Create",
            },
            {
              to: "/thought-of-the-day",
              icon: <AiFillFire size={24} />,
              title: "post of the day",
            },
            { to: "/profile", icon: <IoPerson size={24} />, title: "Profile" },
          ].map((item) => (
            <li
              className="nav-item"
              key={item.to}
              style={{
                width: "3.5rem",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link
                to={item.to}
                title={item.title}
                className={`nav-link d-flex justify-content-center align-items-center w-100 h-100 ${
                  currentPath === item.to ? "active" : ""
                }`}
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  backgroundColor:
                    currentPath === item.to ? "#1DA1F2" : "transparent",
                  color: currentPath === item.to ? "white" : "#aaa",
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                {item.icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* mobile screen ends here */}

      <div
        className="d-none d-md-flex flex-column flex-shrink-0"
        style={{
          width: "5rem",
          minHeight: "100vh",
          position: "fixed",
          zIndex: 1050,
          borderRight: "0.5px solid #424344ff",
        }}
      >
        <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
          <li className="nav-item" style={{ height: "60px" }}>
            <Link to={"/about"}>
              <img
                src="/webicon.png"
                alt="Logo"
                className="logo"
                style={{ width: "58px", height: "58px" }}
              />
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className={`nav-link py-3 rounded-0 ${
                currentPath === "/" || currentPath === "/home" ? "active" : ""
              }`}
              title="home"
            >
              <FaHome size={24} />
            </Link>
          </li>
          <li>
            <Link
              to="/share-thought"
              className={`nav-link py-3  rounded-0 ${
                currentPath === "/share-thought" ? "active" : ""
              }`}
              title="share your thought"
            >
              <IoCreate size={24} />
            </Link>
          </li>
          <li>
            <Link
              to="/thought-of-the-day"
              className={`nav-link py-3  rounded-0 ${
                currentPath === "/thought-of-the-day" ? "active" : ""
              }`}
              title="post of the day"
            >
              <AiFillFire size={24} />
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`nav-link py-3  rounded-0 ${
                currentPath === "/profile" ? "active" : ""
              }`}
              title="profile"
            >
              <IoPerson size={24} />
            </Link>
          </li>
        </ul>
        <div className="dropup mt-auto">
          <button
            className=" d-flex align-items-center justify-content-center p-3 link-body-emphasis text-decoration-none dropdown-toggle border-0 bg-transparent"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            type="button"
          >
            <img
              src={user?.avatar || "/webicon3.png"}
              alt="avatar"
              width="40"
              height="40"
              className="rounded-circle"
            />
          </button>

          <ul
            className="dropdown-menu text-small shadow rounded-3 custom-dropup-menu"
            style={{ minWidth: "13.6rem" }}
          >
            <li style={{ height: "50px" }}>
              <Link
                className="dropdown-item d-flex align-items-center gap"
                to="/settings/edit-profile"
                style={{ lineHeight: "46px", borderRadius: "10px" }}
              >
                <IoIosSettings size={25} style={{ marginRight: "5px" }} />
                Settings
              </Link>
            </li>

            <li>
              <hr
                className="dropdown-divider "
                style={{
                  borderColor: "rgba(154, 147, 147, 0.3)",
                  margin: "0",
                  padding: "0 auto",
                }}
              />
            </li>

            <li style={{ height: "50px" }}>
              <Link
                className="dropdown-item d-flex align-items-center gap-2 h-100"
                to="/signup"
                style={{ lineHeight: "45px", borderRadius: "10px" }}
              >
                Create an Account
              </Link>
            </li>

            <li>
              <hr
                className="dropdown-divider "
                style={{ borderColor: "rgba(154, 147, 147, 0.3)", margin: "0" }}
              />
            </li>

            {login ? (
              <li style={{ height: "50px" }}>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 "
                  onClick={handleSignout}
                  style={{ lineHeight: "45px", borderRadius: "10px" }}
                >
                  <span className="text-danger">Log out @{user?.username}</span>
                </button>
              </li>
            ) : (
              <li style={{ height: "50px" }}>
                <Link
                  className="dropdown-item d-flex align-items-center gap-2"
                  to="/login"
                  style={{ lineHeight: "45px", borderRadius: "10px" }}
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
