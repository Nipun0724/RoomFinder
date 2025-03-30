import { jwtDecode } from "jwt-decode"; // ✅ Added import
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.email) {
          setIsLoggedIn(true);
          return;
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    setIsLoggedIn(false);
  }, []);

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
