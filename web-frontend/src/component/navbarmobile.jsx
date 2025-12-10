import { useLocation, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoCreate } from "react-icons/io5";
import { AiFillFire } from "react-icons/ai";
const Navbar=()=>{
    return(
        <div>
             <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li className="nav-item" style={{ height: "60px" }}>
          <Link to={"/"}>
            <img
              src="/webicon.png"
              alt="Logo"
              className="logo"
              style={{ width: "58px", height: "58px" }}
            />
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className={`nav-link py-3  rounded-0 ${
              currentPath === "/home"|| currentPath === "/" ? "active" : ""
            }`}
            title="home"
          >
            <FaHome size={24} />
          </Link>
        </li>
        <li>
          <Link
            to="/createpost"
            className={`nav-link py-3  rounded-0 ${
              currentPath === "/createpost" ? "active" : ""
            }`}
            title="share your thought"
          >
            <IoCreate size={24} />
          </Link>
        </li>
        <li>
          <Link
            to="#"
            className={`nav-link py-3  rounded-0 ${
              currentPath === "/trending" ? "active" : ""
            }`}
            title="Trending"
          >
            <AiFillFire size={24} />
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className={`nav-link py-3  rounded-0 ${
              currentPath === "/profile" ? "active" : ""
            }`}
            title="Followings"
          >
            <IoPerson size={24} />
          </Link>
        </li>
      </ul>
        </div>
    );
}
export default Navbar;