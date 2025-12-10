import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Post from "./post.jsx";
import { PostContext } from "../store/postlist.jsx";
import Loader from "./loader.jsx";
import SmallLoader from "./smallloader.jsx";

const Posts = () => {
  const { posts, loading, setPage, initialloading } = useContext(PostContext);

  const [activeFilter, setActiveFilter] = useState("Daily");
  const [scrollingLocked, setScrollingLocked] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔧 Fix image URLs for production
  const fixImageUrl = (img) => {
    if (!img) return "";

    // Replace localhost with production backend URL
    if (img.startsWith("http://localhost:3001")) {
      return img.replace("http://localhost:3001", API_URL);
    }

    // If no http prefix, add uploads path
    if (!img.startsWith("http")) {
      return `${API_URL}/uploads/${img}`;
    }

    return img;
  };

  // Infinite scroll handler
  const handelInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 300 >=
        document.documentElement.scrollHeight &&
      !loading &&
      !scrollingLocked
    ) {
      setScrollingLocked(true);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!loading) {
      setScrollingLocked(false);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, []);

  if (initialloading) {
    return (
      <>
        <Helmet>
          <title>Loading</title>
        </Helmet>
        <Loader />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Posts</title>
      </Helmet>

      {/* Summary */}
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          margin: "0.8rem auto",
          display: "flex",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <p style={{ margin: 0 }}>
          Showing: <strong>{activeFilter}</strong> Thoughts
        </p>
      </div>

      {/* POSTS LIST */}
      {posts && posts.length > 0 ? (
        <div
          className="d-flex flex-wrap justify-content-center"
          style={{ gap: "1rem" }}
        >
          {posts.map((post) => (
            <Post
              key={post.id || post._id}
              post={{
                ...post,
                imageUrl: fixImageUrl(post.imageUrl), // ✅ Correct prop
                user: {
                  ...post.user,
                  avatar: fixImageUrl(post.user?.avatar),
                },
              }}
              activeFilter={activeFilter}
            />
          ))}
        </div>
      ) : (
        <div
          className="alert alert-warning"
          role="alert"
          style={{
            margin: "1rem auto",
            maxWidth: "700px",
            width: "100%",
          }}
        >
          No posts available.
        </div>
      )}

      {/* Infinite loader */}
      {loading && (
        <div style={{ width: "100%", height: "5rem" }}>
          <SmallLoader />
        </div>
      )}
    </>
  );
};

export default Posts;
