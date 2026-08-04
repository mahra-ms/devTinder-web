import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const links = [
  { to: "/profile", label: "Profile" },
  { to: "/connections", label: "Connections" },
  { to: "/requests", label: "Requests" },
  { to: "/premium", label: "Premium" },
];

function NavBar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#2A2E3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}

        <Link
          to={user ? "/feed" : "/login"}
          className="font-[var(--font-mono,'JetBrains_Mono',monospace)] text-lg sm:text-xl font-medium text-[#E7E9EE] flex items-center gap-0.5"
        >
          <span className="text-[#7C6CFF]">{"<"}</span>
          byte.Social
          <span className="text-[#7C6CFF]">{"/>"}</span>
        </Link>

        {user && (
          <>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm text-[#8A8FA3] hover:text-[#E7E9EE] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-[#2A2E3A]" />
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#8A8FA3]">
                  hi,{" "}
                  <span className="text-[#E7E9EE] font-medium">
                    {user.firstName}
                  </span>
                </span>
                <img
                  src={user.photoUrl}
                  alt={user.firstName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#2A2E3A]"
                />
                <button
                  onClick={handleLogOut}
                  className="text-sm px-3 py-1.5 rounded-lg border border-[#2A2E3A] text-[#8A8FA3] hover:text-[#FF5C7A] hover:border-[#FF5C7A]/50 transition-colors"
                >
                  Log out
                </button>
              </div>
            </nav>

            {/* Mobile trigger */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[#2A2E3A] text-[#E7E9EE]"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>

      {/* Mobile sheet */}
      {user && menuOpen && (
        <div className="md:hidden border-t border-[#2A2E3A] bg-[#0B0D12] px-4 py-4 flex flex-col gap-1">
          <div className="flex items-center gap-3 pb-3 mb-2 border-b border-[#2A2E3A]">
            <img
              src={user.photoUrl}
              alt={user.firstName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2A2E3A]"
            />
            <span className="text-sm text-[#E7E9EE]">
              welcome, <span className="font-medium">{user.firstName}</span>
            </span>
          </div>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-[#E7E9EE] text-sm active:bg-[#1C1F29] rounded-lg px-2"
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleLogOut}
            className="text-left py-2.5 px-2 text-sm text-[#FF5C7A] rounded-lg active:bg-[#1C1F29]"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}

export default NavBar;
