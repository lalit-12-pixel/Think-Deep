import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import Loader from "./loader";
import { Helmet } from "react-helmet";
import { PostContext } from "../store/postlist";
import { MdDelete } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import SmallLoader from "./smallloader";

dayjs.extend(relativeTime);

const Profile = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { deletePost } = useContext(PostContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);
  const [scrollingLocked, setScrollingLocked] = useState(false);
  const [page, setPage] = useState(1);

  // Session check
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            avatar: data.user.avatar || "/webicon3.png",
            location: data.user.location,
            DOB: data.user.DOB,
            bio: data.user.bio || "",
            user: data.user.user,
            joined: dayjs(data.user.createdAt).format("MMMM YYYY"),
          });
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Session check failed:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [location.state?.profileUpdated]);

  // Fetch paginated posts
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      setLoad(true);
      try {
        const resPosts = await fetch(
          `http://localhost:3001/myposts?_limit=5&_page=${page}`,
          {
            credentials: "include",
          }
        );
        if (resPosts.ok) {
          const postData = await resPosts.json();
          setPosts((prevPosts) => [...prevPosts, ...postData.posts]);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoad(false);
      }
    };

    fetchPosts();
  }, [page, user]);

  // Infinite scroll
  const handleInfiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 300 >=
        document.documentElement.scrollHeight &&
      !load &&
      !scrollingLocked
    ) {
      setScrollingLocked(true);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!load) {
      setScrollingLocked(false);
    }
  }, [load]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, []);

  if (loading || !user) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Your Profile</title>
      </Helmet>

      <div className="container profile-container py-3 px-3 px-sm-4">
        <div className="d-flex flex-column flex-sm-row gap-3 mb-3 align-items-sm-start align-items-center text-center text-sm-start">
          <img src={user.avatar} alt="Avatar" className="profile-avatar" />

          <div className="flex-grow-1">
            <div className="d-flex flex-row justify-content-between align-items-center mb-2 gap-2 flex-wrap">
              <div className="text-start">
                <h5 className="fw-bold mb-1 mb-sm-0">{user.name}</h5>
                <p className=" mb-0" style={{ color: "#71767b" }}>
                  @{user.username}
                </p>
              </div>

              <Link
                to="/settings/edit-profile"
                className="btn btn-outline-secondary btn-sm rounded-pill fw-semibold"
              >
                Edit Profile
              </Link>
            </div>

            <div className="d-flex gap-3 small mb-2">
              <span>
                <strong>55</strong> Following
              </span>
              <span>
                <strong>0</strong> Followers
              </span>
              <span>
                <strong>{posts.length}</strong> Posts
              </span>
            </div>

            <div
              className="d-flex flex-wrap gap-3  mb-2"
              style={{ color: "#71767b" }}
            >
              {user.location && (
                <span>
                  <FaMapMarkerAlt size={14} className="me-1" />
                  {user.location}
                </span>
              )}
              {user.DOB && (
                <span>
                  <BsCalendarDate size={14} className="me-1" />
                  Born {dayjs(user.DOB).format("DD MMMM YYYY")}
                </span>
              )}
              <span>
                <BsCalendarDate size={14} className="me-1" />
                Joined {user.joined}
              </span>
            </div>

            {user.bio && (
              <p className="fw-medium small mt-2 text-start">{user.bio}</p>
            )}
          </div>
        </div>

        <div
          className="d-flex justify-content-around  pb-2 mb-3 fw-bold small tab-links"
          style={{ borderBottom: "0.5px solid  rgba(48, 48, 48, 0.57)" }}
        >
          {["profile", "replies", "saved", "liked"].map((tab) => (
            <Link
              key={tab}
              to={`/profile${tab === "profile" ? "" : `/${tab}`}`}
              className={`link ${
                currentPath === `/profile${tab === "profile" ? "" : `/${tab}`}`
                  ? "active"
                  : ""
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          ))}
        </div>

        {currentPath === "/profile" ? (
          <div>
            {!load && posts.length === 0 ? (
              <p>No posts found.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className=" p-3 mb-3 position-relative post"
                  style={{
                    borderRadius: "6px",
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
                      backgroundColor: " rgba(101, 94, 94, 0.44)",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    onClick={async () => {
                      const sure = window.confirm(
                        "Are you sure you want to delete the post?"
                      );
                      if (sure) {
                        await deletePost(post._id);
                        setPosts((prev) =>
                          prev.filter((p) => p._id !== post._id)
                        );
                      }
                    }}
                  >
                    <MdDelete size={19} />
                  </span>

                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={post.user?.avatar || "/webicon3.png"}
                      alt="avatar"
                      className="rounded-circle me-2"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <strong>{post.user?.name || "Unknown"}</strong>
                      <div style={{ color: "#71767b" }}>
                        @{post.user?.username || "anonymous"} •{" "}
                        {dayjs(post.createdAt).fromNow()}
                      </div>
                    </div>
                  </div>

                  <p className="mb-2" style={{ whiteSpace: "pre-line" }}>
                    {post.description}
                  </p>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="post"
                      className="w-100 rounded"
                      style={{
                        objectFit: "contain",
                        maxHeight: "400px",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 1)",
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <Outlet />
        )}
        {load && <SmallLoader />}
      </div>
    </>
  );
};

export default Profile;
