import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export function Sidebar() {
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
          <button
            onClick={handleLogOut}
            className="block w-full text-left py-2 px-4 hover:bg-[var(--primary-dark)] rounded cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <a
            href="https://roomfinder-0ouu.onrender.com/auth/google"
            className="block py-2 px-4 hover:bg-[var(--primary-dark)] rounded cursor-pointer"
          >
            Login
          </a>
        )}
      </nav>
    </div>
  );
}

