import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | ThinkDeep</title>
      </Helmet>

      <div className="container-fluid px-0" style={{ userSelect: "none" }}>
        <div className="row g-0 min-vh-100 d-flex flex-column flex-lg-row">
          {/* Image section (desktop only) */}
          <div className="col-lg-6 d-none d-lg-block bg-dark">
            <img
              src="https://images.unsplash.com/photo-1518600506278-4e8ef466b810?auto=format&fit=crop&w=1350&q=80"
              alt="About ThinkDeep"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-center p-4 p-md-5 onmobileabout">
            <h1 className="display-4 fw-bold">About ThinkDeep</h1>
            <p className="lead mt-3">
             ThinkDeep is more than a platform — it's a vibrant space for people
              to share thoughts, ideas, and perspectives. Whether you're
              reflecting on life or sharing a random idea, you're welcome here.
            </p>

            <p className="mt-3">
              Our mission is to create a space that encourages curiosity,
              connection, and creativity. We believe small ideas can make a big
              difference — and you never know which thought might spark
              something great.
            </p>

            <ul className="text-start mt-3 small" style={{ maxWidth: "420px" }}>
              <li>💡 Share original thoughts & ideas</li>
              <li>🗳️ Vote, remix, and comment on others’ posts</li>
              <li>🎯 Build a profile that reflects your voice</li>
              <li>🌎 Join a growing community of thinkers</li>
            </ul>

            <div className="mt-4">
              <a href="/" className="btn btn-primary px-4 me-2">
                Get Started
              </a>
              <a href="/features" className="btn btn-outline-secondary px-4">
                Explore Features
              </a>
            </div>

            <footer className="mt-5 small ">
              <p>&copy; {new Date().getFullYear()} ThinkDeep Community</p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
