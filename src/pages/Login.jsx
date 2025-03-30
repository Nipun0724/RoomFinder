import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Link } from "react-router";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        if (data.newUser) {
          navigate("/register");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/6 bg-[var(--primary)] text-white p-6">
        <Link to="/" className="text-2xl font-bold">RoomFinder</Link>
      </div>
      <div className="w-5/6 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6">Login</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* <div className="space-y-2">
              <Label htmlFor="email">VIT Email ID</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your VIT email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div> */}
            <a href="http://localhost:5000/auth/google">
            <Button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)]">
              Sign In
            </Button>
            </a>
            <p className="text-center text-sm">
              Login via VIT account
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
