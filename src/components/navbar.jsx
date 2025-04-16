import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(!!decodedToken.email);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
  
    checkAuth();
  
    window.addEventListener("storage", checkAuth);
    window.addEventListener("load", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("load", checkAuth);
    };
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
            <a href="https://roomfinder-0ouu.onrender.com/auth/google">
              <button className="focus:outline-none">Sign-in</button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
