import React, { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
const API_URL = import.meta.env.VITE_API_URL;
const ThoughtOfTheDay = () => {
  const [thought, setThought] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBestThought = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/bestpost`, {
        credentials: "include",
      });
      const data = await res.json();
      setThought(data);
    } catch (err) {
      console.error("Failed to load thought:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBestThought();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 py-10 post"
      style={{
        width: "100%",
        maxWidth: "700px",
        borderRadius: "8px",
        margin: "auto",
      }}
    >
      <div className="shadow-2xl rounded-3xl p-8 w-full max-w-lg text-center transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl font-extrabold mb-6 text-indigo-700 tracking-wide">
          ✨ Thought of the Day
        </h1>
        <hr className="my-4" />

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : thought ? (
          <>
            <p className="fs-4 fst-italic text-center - mb-4">
              “{thought.content}”
            </p>

            <div className="d-flex align-items-center gap-3 flex-wrap flex-sm-nowrap justify-content-center justify-content-sm-start text-center  mt-4">
              <img
                src={thought.user?.avatar || "/wenicon.png"}
                alt="avatar"
                className="rounded-circle border border-primary shadow"
                style={{ width: "48px", height: "48px", objectFit: "cover" }}
              />
              <div>
                <p className="fw-semibold  mb-0">
                  {thought.user?.name || "Anonymous"}
                </p>
                <p className=" mb-0">@{thought.user?.username || "@unknown"}</p>
              </div>
            </div>

            <div className=" text-center">
              {thought.image && (
                <div className="mb-3 text-center">
                  <img
                    src={thought.image}
                    alt="Post media"
                    className="img-fluid rounded shadow-sm w-100"
                    style={{
                      height: "auto",
                      maxHeight: "320px",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="d-flex flex-wrap justify-content-center gap-4  small">
                <div>
                  <i className="bi bi-rocket-takeoff me-1"></i>
                  Boosts {thought.likes || 0}
                </div>
                <div>
                  <i className="bi bi-chat-dots me-1"></i>
                  Reactions {thought.comments?.length || 0}
                </div>
                <div>
                  <i className="bi bi-calendar3 me-1"></i>
                  {new Date(thought.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-red-500">No thought found.</p>
        )}
      </div>
    </div>
  );
};

export default ThoughtOfTheDay;
