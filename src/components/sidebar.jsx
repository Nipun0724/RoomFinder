import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export function Sidebar() {
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
    <div className="w-64 bg-[var(--primary)] text-white min-h-screen p-4">
      <div className="mb-8">
        <Link to="/" className="text-2xl font-bold">
          RoomFinder
        </Link>
      </div>

      <div className="flex justify-start mb-6 px-4">
        <Link to="/profile">
          <User size={24} className="text-[var(--primary)] bg-white rounded-full p-1" />
        </Link>
      </div>

      <nav className="space-y-2">
        <Link to="/" className="block py-2 px-4 hover:bg-[var(--primary-dark)] rounded">
          Home Page
        </Link>
        <Link to="/hostels" className="block py-2 px-4 hover:bg-[var(--primary-dark)] rounded">
          Hostels
        </Link>
        <Link to="/profile" className="block py-2 px-4 hover:bg-[var(--primary-dark)] rounded">
          User Profile
        </Link>
        {isLoggedIn ? (
          <a onClick={handleLogOut} className="block py-2 px-4 hover:bg-[var(--primary-dark)] rounded cursor-pointer">
            Logout
          </a>
        ) : (
          <a href="http://localhost:5000/auth/google" className="block py-2 px-4 hover:bg-[var(--primary-dark)] rounded cursor-pointer">
            Login
          </a>
        )}
      </nav>
    </div>
  );
}
