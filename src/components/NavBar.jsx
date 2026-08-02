import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

function NavBar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async (e) => {
    e.preventDefault();

    try {
      await axios.post(BASE_URL + "/logOut", {}, { withCredentials: true });

      dispatch(removeUser());
      navigate("/logIn");
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
    }
  };
  return (
    <div className="navbar bg-base-200 shadow-sm ">
      <div className="flex-1">
        <Link to="/"  className="btn btn-ghost text-xl">devTinder</Link>
      </div>
      {user && (
        <div className="flex gap-2">
          <div className="flex items-center justify-center">
            welcome, {user.firstName}
          </div>
          <div className="dropdown dropdown-end mx-4">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ">
                <img alt="Tailwind CSS Navbar component" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile"  className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connection</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <a onClick={handleLogOut}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
