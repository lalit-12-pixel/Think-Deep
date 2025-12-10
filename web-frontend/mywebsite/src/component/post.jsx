import { FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { useContext, useState } from "react";
import { PostContext } from "../store/postlist.jsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
const API_URL = import.meta.env.VITE_API_URL;
dayjs.extend(relativeTime);

const Media = ({ post, activeFilter }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const { loading } = useContext(PostContext);
  const [active, setActive] = useState("");
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [comments, setComments] = useState(post.comments || 0);
  const [showcomments, setShowcomments] = useState(false);
  const [shared, setShared] = useState(post.shares || 0);
  const [loadingField, setLoadingField] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");

  const toggleText = () => setExpanded(!expanded);

  const handleBoost = () => {
    const action = active === "like" ? "decrement" : "increment";

    if (active === "like") {
      setLikes(likes - 1);
      setActive("");
    } else {
      if (active === "dislike") setDislikes(dislikes - 1);
      setLikes(likes + 1);
      setActive("like");
    }

    handleStatUpdate("likes", action);
  };

  const handleDown = () => {
    const action = active === "dislike" ? "decrement" : "increment";

    if (active === "dislike") {
      setDislikes(dislikes - 1);
      setActive("");
    } else {
      if (active === "like") setLikes(likes - 1);
      setDislikes(dislikes + 1);
      setActive("dislike");
    }

    handleStatUpdate("dislikes", action);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const newComment = {
      text: commentText,
      name: userName || "Anonymous",
      createdAt: new Date().toISOString(),
    };
    setCommentText("");
    try {
      await handleStatUpdate("comments", newComment);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleStatUpdate = async (field, value) => {
    setLoadingField(field);
    try {
      const bodyData =
        field === "comments"
          ? { field, comment: value }
          : { field, action: value };
      const response = await fetch(
        `${API_URL}/posts/${post.id}/stat`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.status === 401 && field === "comments") {
        navigate("/login");
        return;
      }

      if (response.ok) {
        setUserName(data.post.user.name);
        if (field === "likes") setLikes(data.post.likes);
        else if (field === "dislikes") setDislikes(data.post.dislikes);
        else if (field === "comments")
          setComments(
            Array.isArray(data.post.comments) ? data.post.comments : []
          );
        else if (field === "shares") setShared(data.post.shares);
      } else {
        console.error("Failed to update stat:", data.message);
      }
    } catch (error) {
      console.error("Failed to update stat:", error);
    } finally {
      setLoadingField("");
    }
  };

  const handleSave = async () => {
    try {
    
      const response = await fetch(
        `${API_URL}/posts/save/${post.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
        if(response.ok){
       setSaved(true);
      }else{
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
     
    }
  };
  const handleUnsave = async () => {
    try {
     
      const response = await fetch(
        `${API_URL}/posts/save/${post.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if(response.ok){
       setSaved(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        className="p-2 p-sm-3 post"
        style={{
          maxWidth: "700px",
          width: "100%",
          display: "flex",
          borderRadius: "8px",
          gap: "10px",
        }}
      >
        <img
          src={post.user?.avatar || "/webicon3.png"}
          alt="avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            userSelect: "none",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.01)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        <div style={{ flex: 1 }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <strong style={{ fontSize: "0.95rem", userSelect: "none" }}>
                {post.name || "Unknown User"}
              </strong>{" "}
              <span
                style={{
                  color: "#71767B",
                  fontSize: "0.8rem",
                  userSelect: "none",
                }}
              >
                @{post.username || "anonymous"} {" "}
                <span style={{ display: "inline-block" }}>
                  . {dayjs(post.createdAt).fromNow()}
                </span>
              </span>
            </div>
          </div>

          <p
            className="mb-2"
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.5",
              fontSize: "0.95rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.description}
          </p>

          {post.description?.length > 100 && (
            <span
              onClick={toggleText}
              style={{
                color: "#0d6efd",
                cursor: "pointer",
                marginTop: "-10px",
                fontSize: "0.85rem",
                userSelect: "none",
              }}
            >
              {expanded ? "Show less" : "Show more"}
            </span>
          )}

          {post.imageUrl && (
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "0.5px solid rgba(68, 65, 65, 0.42)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 1)",
                marginTop: "12px",
              }}
            >
              <img
                src={post.imageUrl}
                alt="post media"
                className="img-fluid"
                style={{
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          <div className="d-flex  mt-2" style={{ fontSize: "0.9rem" }}>
            <div
              className="d-flex align-items-center vote"
              style={{ borderRadius: "1.7rem" }}
            >
              <div
                className="reactions boost"
                style={{
                  display: "flex",
                  width: "7rem",
                  height: "2rem",
                  alignItems: "center",
                  borderTopLeftRadius: "1.7rem",
                  borderBottomLeftRadius: "1.7rem",
                  padding: "0.5rem",
                  userSelect: "none",
                }}
              >
                <span
                  onClick={handleBoost}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    width: "5.5rem",
                    height: "2rem",
                    alignItems: "center",
                    color: active === "like" ? "#0a66c2" : "inherit",
                    fontWeight: active === "like" ? "600" : "normal",
                    userSelect: "none",
                  }}
                >
                  <BiUpvote size={18} className="me-1" />
                  Boost.
                </span>
                <span
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {likes > 0 ? likes : ""}
                </span>
              </div>

              <span
                className="reactions"
                onClick={handleDown}
                style={{
                  display: "flex",

                  width: "2rem",
                  height: "2rem",
                  alignItems: "center",
                  paddingLeft: "0.7rem",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderTopLeftRadius: "1.7rem",
                  borderBottomLeftRadius: "1.7rem",
                  color: active === "dislike" ? "#dc3545" : "inherit",
                  fontWeight: active === "dislike" ? "600" : "normal",
                  transform: "rotate(180deg)",
                }}
              >
                <BiUpvote size={18} className="me-1" />
              </span>
            </div>

            {/* Comment */}
            <span
              className="reactions-hover"
              style={{
                cursor: "pointer",
                display: "flex",
                borderRadius: "1.7rem",
                width: "3rem",
                height: "2rem",
                paddingLeft: "0.2rem",
                alignItems: "center",
                marginLeft: "0.7rem",
                justifyContent: "center",
              }}
              onClick={() => setShowcomments(true)}
              title="React"
            >
              <FaRegCommentDots size={19} className="me-1" />{" "}
              {comments > 0 ? comments : ""}
            </span>

            {/* Share */}
            {/* <span
            className="reactions-hover"
            style={{
              cursor: "pointer",
              display: "flex",
              borderRadius: "1.7rem",

              width: "3rem",
              height: "2rem",
              paddingLeft: "0.2rem",
              alignItems: "center",
              marginLeft: "0.2rem",
              justifyContent: "center",
            }}
            onClick={() => updateStat("shares")}
            title="Share"
          >
            <TbLocationShare size={18} className="me-1" />{" "}
            {shared > 0 ? shared : ""}
          </span> */}
            {/* Save */}
            <span
              className="reactions-hover"
              style={{
                cursor: "pointer",
                display: "flex",
                borderRadius: "1.7rem",
                width: "3rem",
                height: "2rem",
                paddingLeft: "0.2rem",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "auto",
              }}
              title="Save"
            >
              {saved ? (
                <FaBookmark size={18} className="me-1" onClick={handleUnsave} />
              ) : (
                <FaRegBookmark
                  size={18}
                  className="me-1"
                  onClick={handleSave}
                />
              )}
            </span>
          </div>
        </div>
      </div>

      {showcomments && (
        <div
          className="post"
          style={{
            padding: "1rem",
            width: "100%",
            maxWidth: "700px",
            margin: "auto",
            position: "relative",
            borderRadius: "0.8rem",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
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
              backgroundColor: "rgba(0,0,0,0.1)",
              cursor: "pointer",
              zIndex: 10,
            }}
            onClick={() => setShowcomments(false)}
          >
            <MdClose size={18} />
          </span>

          <h5 style={{ marginBottom: "0.75rem", fontWeight: "bold" }}>
            Comments
          </h5>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    userSelect: "none",
                  }}
                >
                  <img
                    src={comment.avatar}
                    alt="avatar"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ marginTop: "0.2rem" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        fontSize: "0.9rem",
                      }}
                    >
                      {comment.name || "Anonymous"}
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#888",
                          marginLeft: "0.8rem",
                          display: "flex",
                          marginTop: "0.3rem",
                        }}
                      >
                        {dayjs(comment.createdAt).fromNow()}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.95rem", margin: "0.25rem 0" }}>
                      {comment.text}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#888" }}>No comments yet.</p>
            )}
          </div>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <input
              className="post"
              type="text"
              name="comment"
              id={`comment-${post.id}`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              required
            />
            <button
              onClick={handleAddComment}
              style={{
                padding: "0.6rem 1rem",
                backgroundColor: "#0d6efd",
                color: "white",
                border: "none",
                userSelect: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Media;
