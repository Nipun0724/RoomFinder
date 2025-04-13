
import { Link } from "react-router"
import { Navbar } from "../components/navbar"
import home_bg from "../assets/home_bg.jpg"
import { useEffect } from "react";

export default function Home() {
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      console.log(tokenFromUrl)
      if (tokenFromUrl) {
        localStorage.setItem("token",tokenFromUrl)
      }
    }, []);
  return (
    <main>
      <Navbar />
      <div>
        <img
          src={home_bg}
          alt="Hostel room"
          className="w-[100%] h-screen object-cover"
        />
        <div className="inset-0 bg-black/30" />
        <div className="text-center flex flex-col justify-center items-center mx-[33%] absolute top-[30%]">
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6">RoomFinder</h1>
          <p className="text-2xl md:text-3xl text-white">Find your dream hostel room</p>
          <div className="mt-8">
            <Link
              to="/hostels"
              className="bg-white text-[var(--primary)] hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg"
            >
              Start Searching
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
