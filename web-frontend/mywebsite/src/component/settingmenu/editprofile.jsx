import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../loader";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import { FaCamera } from "react-icons/fa";
import SmallLoader from "../smallloader";

let hasProfileLoadedOnce = false;

const Editprofile = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [dob, setDob] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!hasProfileLoadedOnce);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef();

  const nameRef = useRef();
  const bioRef = useRef();
  const locationRef = useRef();
  const usernameRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:3001/", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const u = {
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            avatar: data.user.avatar || "/webicon3.png",
            bio: data.user.bio || "",
            DOB: data.user.DOB?.slice(0, 10),
            location: data.user.location || "",
            joined: dayjs(data.user.createdAt).format("MMMM YYYY"),
          };
          setUser(u);
          setDob(u.DOB || "");
          setAvatarPreview(u.avatar);
        } else {
          navigate("/profile");
        }
      } catch (err) {
        navigate("/profile");
      } finally {
        hasProfileLoadedOnce = true;
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      nameRef.current.value = user.name;
      bioRef.current.value = user.bio;
      locationRef.current.value = user.location;
      usernameRef.current.value = user.username;
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const updatedData = {
      name: nameRef.current.value,
      bio: bioRef.current.value,
      location: locationRef.current.value,
      DOB: dob,
      username: usernameRef.current.value,
    };

    const formData = new FormData();
    formData.append("name", updatedData.name);
    formData.append("bio", updatedData.bio);
    formData.append("location", updatedData.location);
    formData.append("username", updatedData.username);
    formData.append("DOB", updatedData.DOB);
    if (avatarInputRef.current.files[0]) {
      formData.append("avatar", avatarInputRef.current.files[0]);
    }

    try {
      const res = await fetch("http://localhost:3001/editprofile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        navigate("/profile", { state: { profileUpdated: true } });
      } else {
        const data = await res.json();
        console.error("Update failed:", data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  if (loading || !user) return <SmallLoader />;

  return (
    <>
      <Helmet>
        <title>Edit Profile</title>
      </Helmet>

      <div
        className="container-fluid"
        style={{ paddingLeft: "0", paddingRight: "0", width: "100%" }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <h4
              style={{
                marginBottom: "10px",
                marginLeft: "5px",
                fontWeight: "600",
              }}
            >
              Edit Profile
            </h4>

            <div style={{ maxWidth: "100%" }}>
              <div className="text-center mb-3 position-relative">
                <div
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    margin: "5px auto",
                    cursor: "pointer",
                  }}
                  onClick={() => avatarInputRef.current.click()}
                  onMouseEnter={() => setOverlayVisible(true)}
                  onMouseLeave={() => setOverlayVisible(false)}
                >
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid rgb(52, 48, 48)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.25)",
                      color: "#fff",
                      display: overlayVisible ? "flex" : "none",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaCamera size={22} />
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  ref={nameRef}
                  style={{
                    padding: "10px",
                    width: "100%",
                    border: "1px solid rgb(52, 48, 48)",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  ref={usernameRef}
                  style={{
                    padding: "10px",
                    width: "100%",
                    border: "1px solid rgb(52, 48, 48)",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  ref={bioRef}
                  rows="2"
                  style={{
                    padding: "10px",
                    width: "100%",
                    border: "1px solid rgb(52, 48, 48)",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  ref={locationRef}
                  style={{
                    padding: "10px",
                    width: "100%",
                    border: "1px solid rgb(52, 48, 48)",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="custom-date-input"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{
                    padding: "10px",
                    width: "100%",
                    border: "1px solid rgb(48, 48, 48)",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className="text-center">
                <button className="btn btn-primary px-4" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editprofile;
