import { useState, useEffect } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [name, setName] = useState("");
  const [reg, setReg] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token",tokenFromUrl);
      setToken(tokenFromUrl);
    } else {
      toast.error("No authentication token found.");
      navigate("/");
    }
  }, []);

  const validateRegNumber = (reg) => {
    const regPattern = /^[0-9]{2}[A-Z]{3}[0-9]{4}$/; // Format: 23ABC1234
    return regPattern.test(reg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!reg.trim()) {
      toast.error("Please enter your registration number.");
      return;
    }
    if (!validateRegNumber(reg)) {
      toast.error("Invalid registration number format! Use: 22BCE3934");
      return;
    }

    try {
      const response = await axios.post(
        "https://roomfinder-0ouu.onrender.com/api/register",
        { name, reg },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      navigate(`/?token=${token}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/6 bg-[var(--primary)] text-white p-6">
        <Link to="/" className="text-2xl font-bold">RoomFinder</Link>
      </div>
      <div className="w-5/6 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg">Registration Number</Label>
              <Input 
                id="reg" 
                placeholder="Enter your registration number (e.g., 22BCE3934)" 
                value={reg} 
                onChange={(e) => setReg(e.target.value)} 
              />
            </div>
            <Button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)]">
              Finish
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
