import React, { useContext, useEffect, useRef, useState } from "react";
import { PostContext } from "../store/postlist.jsx";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaCamera } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const Createpost = () => {
  const navigate = useNavigate();
  const { addPost } = useContext(PostContext);
  const Description = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3001/", {
          credentials: "include",
        });
        if (!res.ok) navigate("/login");
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const description = Description.current.value;
    try {
      await addPost(file, description);
      navigate("/");
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Helmet>
        <title>Share Your Thought</title>
      </Helmet>

      <form method="post" onSubmit={handleOnSubmit}>
        <div
          className="onmobile"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "95%",
            maxWidth: "650px",
            margin: "5rem auto 15rem auto",
            padding: "24px",
            maxHeight: "800px",
            overflowY: "auto",
            border: "1px solid #4a4848ff",
            borderRadius: "25px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            userSelect: "none",
          }}
        >
          <h4
            style={{
              marginBottom: "25px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.5rem",
              userSelect: "none",
            }}
          >
            Share Your Thought
          </h4>

          <textarea
            name="description"
            placeholder="Your thought here..."
            ref={Description}
            style={{
              width: "100%",
              height: "100px",
              padding: "12px",
              border: "1px solid #4a4848ff",
              borderRadius: "8px",
              resize: "none",
              fontSize: "1rem",
              marginBottom: "20px",
            }}
            required
          />

          {previewUrl && (
            <div
              style={{
                width: "100%",
                position: "relative",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backdropFilter: "blur(4px)",
                  backgroundColor: "rgba(91, 84, 84, 0.48)",
                  boxShadow: "0 0 4px rgba(0, 0, 0, 0.37)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
              >
                <RxCross2 size={18} />
              </span>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #4a4848ff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              />
            </div>
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="button-upload"
            onClick={handleIconClick}
            style={{
              width: "100%",
              border: "2px dashed #4a4848ff",
              borderRadius: "8px",
              padding: "0.8rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              marginBottom: "3rem",
              display: "flex",
              userSelect: "none",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <FaCamera />
            Upload Image
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "50%",
              padding: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "8px",
              backgroundColor: "#0d6efd",
              borderColor: "#0d6efd",
              color: "#fff",
            }}
          >
            Create Post
          </button>
        </div>
      </form>
    </>
  );
};

export default Createpost;
