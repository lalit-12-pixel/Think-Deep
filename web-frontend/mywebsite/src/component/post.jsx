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

const Media = ({ post }) => {
  const navigate = useNavigate();
  const { loading } = useContext(PostContext);

  // Local states
  const [active, setActive] = useState("");
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [comments, setComments] = useState(post.comments || []);
  const [shares, setShares] = useState(post.shares);
  const [saved, setSaved] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const toggleDescExpand = () => setExpanded((prev) => !prev);
  const [expanded, setExpanded] = useState(false);

  // ---------------------------------------------
  // IMAGE URL FIX (same as Posts.jsx)
  // ---------------------------------------------
  const fixUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://localhost:3001"))
      return url.replace("http://localhost:3001", API_URL);
    return url;
  };

  const avatar = fixUrl(post.user?.avatar);
  const imageUrl = fixUrl(post.imageUrl);

  // ---------------------------------------------
  // LIKE HANDLER
  // ---------------------------------------------
  const handleBoost = async () => {
    const action = active === "like" ? "decrement" : "increment";

    if (active === "like") {
      setLikes((l) => l - 1);
      setActive("");
    } else {
      if (active === "dislike") setDislikes((d) => d - 1);
      setLikes((l) => l + 1);
      setActive("like");
    }

    updateStat("likes", action);
  };

  // ---------------------------------------------
  // DISLIKE HANDLER
  // ---------------------------------------------
  const handleDown = async () => {
    const action = active === "dislike" ? "decrement" : "increment";

    if (active === "dislike") {
      setDislikes((d) => d - 1);
      setActive("");
    } else {
      if (active === "like") setLikes((l) => l - 1);
      setDislikes((d) => d + 1);
      setActive("dislike");
    }

    updateStat("dislikes", action);
  };

  // ---------------------------------------------
  // UPDATE STATS (LIKE, DISLIKE, COMMENT, SHARE)
  // ---------------------------------------------
  const updateStat = async (field, value) => {
    try {
      const res = await fetch(`${API_URL}/posts/${post.id}/stat`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          field === "comments" ? { field, comment: value } : { field, action: value }
        ),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) return;

      if (field === "likes") setLikes(data.post.likes);
      if (field === "dislikes") setDislikes(data.post.dislikes);
      if (field === "comments") setComments(data.post.comments);
      if (field === "shares") setShares(data.post.shares);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------------
  // COMMENT HANDLER
  // ---------------------------------------------
  const addComment = async () => {
    if (!commentText.trim()) return;

    const newComment = {
      text: commentText,
      name: post.user.name,
      createdAt: new Date().toISOString(),
    };

    setCommentText("");

    updateStat("comments", newComment);
  };

  // ---------------------------------------------
  // SAVE / UNSAVE POST
  // ---------------------------------------------
  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/posts/save/${post.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) return navigate("/login");
      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsave = async () => {
    try {
      await fetch(`${API_URL}/posts/save/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSaved(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  return (
    <>
      <div
        className="p-2 p-sm-3 post"
        style={{
          maxWidth: "700px",
          width: "100%",
          display: "flex",
          gap: "10px",
          borderRadius: "8px",
        }}
      >
        {/* Avatar */}
        <img
          src={avatar || "/webicon3.png"}
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        {/* Post Body */}
        <div style={{ flex: 1 }}>
          {/* User Info */}
          <strong>{post.user.name}</strong>{" "}
          <span style={{ color: "#777", fontSize: "0.8rem" }}>
            @{post.user.username} · {dayjs(post.createdAt).fromNow()}
          </span>

          {/* Description */}
          <p
            style={{
              marginTop: 8,
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.5,
            }}
          >
            {post.description}
          </p>

          {post.description.length > 100 && (
            <span
              style={{
                color: "#0d6efd",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : "Show more"}
            </span>
          )}

          {/* Image */}
          {imageUrl && (
            <div
              style={{
                marginTop: 12,
                overflow: "hidden",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={imageUrl}
                alt="post"
                style={{ width: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          {/* ACTIONS */}
          <div className="d-flex mt-2" style={{ fontSize: "0.9rem" }}>
            {/* LIKE */}
            <span
              onClick={handleBoost}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                color: active === "like" ? "#0a66c2" : "inherit",
              }}
            >
              <BiUpvote size={18} className="me-1" />
              Boost {likes > 0 && likes}
            </span>

            {/* DISLIKE */}
            <span
              onClick={handleDown}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                color: active === "dislike" ? "#dc3545" : "inherit",
                transform: "rotate(180deg)",
              }}
            >
              <BiUpvote size={18} />
            </span>

            {/* COMMENTS */}
            <span
              onClick={() => setShowComments(true)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
              }}
            >
              <FaRegCommentDots size={18} className="me-1" />
              {comments.length > 0 && comments.length}
            </span>

            {/* SAVE */}
            <span style={{ marginLeft: "auto" }}>
              {saved ? (
                <FaBookmark size={18} onClick={handleUnsave} />
              ) : (
                <FaRegBookmark size={18} onClick={handleSave} />
              )}
            </span>
          </div>
        </div>
      </div>

      {/* COMMENTS MODAL */}
      {showComments && (
        <div
          className="post"
          style={{
            maxWidth: "700px",
            margin: "auto",
            padding: "1rem",
            borderRadius: "0.8rem",
            position: "relative",
          }}
        >
          <MdClose
            size={20}
            onClick={() => setShowComments(false)}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              cursor: "pointer",
            }}
          />

          <h5>Comments</h5>

          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <strong>{c.name}</strong>{" "}
                <span style={{ color: "#777", fontSize: "0.75rem" }}>
                  {dayjs(c.createdAt).fromNow()}
                </span>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "#777" }}>No comments yet.</p>
          )}

          {/* ADD COMMENT */}
          <div style={{ display: "flex", marginTop: "1rem", gap: "0.5rem" }}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              style={{ flex: 1, padding: "0.6rem", borderRadius: 8 }}
            />
            <button
              onClick={addComment}
              style={{
                padding: "0.6rem 1rem",
                background: "#0d6efd",
                color: "white",
                borderRadius: 8,
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
