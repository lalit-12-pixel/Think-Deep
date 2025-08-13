import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer
        style={{
          width: "95%",
          marginLeft: "4.95rem",
          userSelect: "none",
          border: "0.5px solid  rgb(48, 48, 48)",
        }}
        className="d-none d-md-flex flex-wrap justify-content-between align-items-center py-3 px-4 text-light"
      >
        <p
          className="mb-0 text-secondary"
          style={{ textAlign: "left", flex: 1 }}
        >
          © 2025 ThinkDeep.Com
        </p>
        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-secondary">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/features" className="nav-link px-2 text-secondary">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/faqs" className="nav-link px-2 text-secondary">
              FAQs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link px-2 text-secondary">
              About
            </Link>
          </li>
        </ul>
      </footer>

      <footer
        className=" d-block d-md-none"
        style={{
          marginBottom: "4rem",
          userSelect: "none",
        }}
      >
        <ul className="nav justify-content-center border-bottom  mb-3" >
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-secondary">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/features" className="nav-link px-2 text-secondary">
              Features
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/faqs" className="nav-link px-2 text-secondary">
              FAQs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link px-2 text-secondary">
              About
            </Link>
          </li>
        </ul>
        <p className="text-center text-secondary">© 2025 ThinkDeep.com</p>
      </footer>
    </>
  );
}

export default Footer;
