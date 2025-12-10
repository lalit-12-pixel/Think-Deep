import React, { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Loader from "../loader";
import SmallLoader from "../smallloader";
const API_URL = import.meta.env.VITE_API_URL;
const Security = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleChangePassword = () => {
    setShowModal(true);
  };

  const handleDeleteAccount = async (id) => {
    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;
    const response = await fetch(`${API_URL}/deleteuser/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    alert("Account deleted successfully!");
    navigate("/home");
    window.location.reload();
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete account");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            avatar: data.user.avatar || "/webicon3.png",
          });
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return <SmallLoader />;

  return (
    <>
      <h4
        style={{
          marginBottom: "30px",
          marginLeft: "5px",
          fontWeight: "600",
        }}
      >
        Password & Security
      </h4>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.77)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: "30px",
              borderRadius: "20px",
              width: "90%",
              maxWidth:"700px",
              height: "70%",
              maxHeight:"450px",
              backgroundColor: "rgba(71, 68, 68, 1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              border: "1px solid #333030ff",
            }}
          >
            <h4
              style={{ marginBottom: "5px", color: "rgba(255, 250, 250, 1)" }}
            >
              Change Password
            </h4>

            <p
              style={{
                fontFamily: "inherit",
                color: "rgba(186, 184, 184, 1)",
                fontSize: "12px",
                lineHeight: "16px",
                marginBottom: "20px",
              }}
            >
              Password should be at least 8 characters long, one uppercase
              letter, one lowercase letter, one number, one special character
            </p>

            <input
              type="text"
              placeholder="Current Password"
              style={{
                width: "100%",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "10px",
                height: "60px",
                border: "0.5px solid #343030ff",
              }}
            />
            <input
              type="password"
              placeholder="New Password"
              style={{
                width: "100%",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "10px",
                height: "60px",
                border: "0.5px solid #343030ff",
              }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              style={{
                width: "100%",
                padding: "15px",
                marginBottom: "35px",
                borderRadius: "10px",
                height: "60px",
                border: "0.5px solid #343030ff",
              }}
            />
            <div className="d-flex justify-content-end">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary "
                style={{ width: "30%", marginRight: "20px" }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" style={{ width: "40%" }}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="mb-4 d-flex align-items-center justify-content-between"
        style={{
          border: "0.5px solid #343030ff",
          width: "100%",
          height: "70px",
          borderRadius: "10px",
          fontWeight: "400",
          paddingLeft: "30px",
        }}
        onClick={handleChangePassword}
      >
        Change Password
        <IoIosArrowForward size={20} style={{ marginRight: "20px" }} />
      </div>
      <div
        className="mb-4 d-flex align-items-center justify-content-between"
        style={{
          border: "0.5px solid #343030ff",
          width: "100%",
          height: "70px",
          borderRadius: "10px",
          fontWeight: "400",
          paddingLeft: "30px",
        }}
        onClick={() => handleDeleteAccount(user?.id)}
      >
        Delete Account
        <IoIosArrowForward size={20} style={{ marginRight: "20px" }} />
      </div>
    </>
  );
};

export default Security;
