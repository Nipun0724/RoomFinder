import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      return !!decodedToken.email;
    } catch (err) {
      return false;
    }
  });
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-[var(--primary)] text-white p-4 absolute w-full">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold">
          RoomFinder
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/hostels" className="hover:text-gray-200">Search</Link>
        </div>

        <div className="relative">
          {isLoggedIn ? (
            <button onClick={handleLogOut} className="focus:outline-none">
              Logout
            </button>
          ) : (
            <a href="http://localhost:5000/auth/google">
              <button className="focus:outline-none">Sign-in</button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
