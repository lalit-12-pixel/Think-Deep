import "bootstrap/dist/css/bootstrap.min.css";
import "./appp.css";
import "./component/nav.css";
import "./component/post.css";
import Footer from "./component/footer.jsx";
import Sidebar from "./component/sidebar.jsx";
import { PostProvider } from "./store/postlist.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import OpenLoader from "./component/openloader.jsx";


function App() {
  const location = useLocation();
  const shouldHideFooter = location.pathname.startsWith("/settings");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <OpenLoader />;
  }

  return (
    <PostProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />

          <div
            className="main-content"
            style={{
              width: "100%",
              marginLeft: "5rem",
              padding: " 0.5rem",
            }}
          >
            <Outlet />
          </div>
        </div>

        {!shouldHideFooter && (
          <div className="footer">
            <Footer />
          </div>
        )}
      </div>
    </PostProvider>
  );
}

export default App;
