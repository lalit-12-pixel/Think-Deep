import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Post from "./post.jsx";
import { PostContext } from "../store/postlist.jsx";
import Loader from "./loader.jsx";
import SmallLoader from "./smallloader.jsx";

const filterOptions = ["Daily"];

const Posts = () => {
  const { posts, loading, setLoading, setPage, initialloading } =
    useContext(PostContext);
  const [activeFilter, setActiveFilter] = useState("Daily");
  const [scrollingLocked, setScrollingLocked] = useState(false);

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

      {/* Filter Tabs */}
      {/* <div
        className="postfilter"
        style={{
          height: "56px",
          maxWidth: "700px",
          width: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          border: "1px solid rgba(120, 120, 120, 0.2)",
          borderRadius: "1.9rem",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
          margin: " auto",
        }}
      >
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            margin: 0,
            padding: "0 1rem",
            gap: "8px",
          }}
        >
          {filterOptions.map((option) => (
            <li
              key={option}
              onClick={() => setActiveFilter(option)}
              style={{
                padding: "0 20px",
                height: "40px",
                minWidth: "100px",
                border: `0.5px solid ${
                  activeFilter === option ? "#007bff" : "rgba(60, 60, 63, 1)"
                }`,
                backgroundColor:
                  activeFilter === option ? "#46494e9a" : "transparent",
                borderRadius: "19px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                userSelect: "none",
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      </div> */}

      {/* Active Filter */}
      <div
        className=""
        style={{
          maxWidth: "700px",
          width: "100%",
          margin: " 0.8rem auto",
          display: "flex",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <p style={{ margin: "0" }}>
          Showing:{" "}
          <strong style={{ marginLeft: "0.5rem" }}>{activeFilter}</strong>{" "}
          Thoughts
        </p>
      </div>

      {/* Posts */}
      {posts && posts.length > 0 ? (
        <div
          className="d-flex flex-wrap justify-content-center"
          style={{ gap: "1rem" }}
        >
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
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
            display: "flex",
            alignItems: "center",
            justifyContentL: "center",
            maxWidth: "700px",
            width: "100%",
          }}
        >
          No posts available.
        </div>
      )}

      {loading && <div style={{width:"100%",height:"5rem"}}>
      <SmallLoader/> </div>}
    </>
  );
};

export default Posts;
