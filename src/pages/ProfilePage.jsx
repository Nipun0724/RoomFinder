import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import { StarRating } from "../components/star-rating";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const decodedToken = jwtDecode(token);
        let id = decodedToken.email;
        if (!id) {
          throw new Error("Email not found in token");
        }

        setIsAdmin(decodedToken.isAdmin || false); // Set admin status

        const response = await axios.get("https://roomfinder-0ouu.onrender.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setRegNumber(response.data.user.reg);
        setReviews(response.data.user.reviews);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        navigate("/");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 mt-[10%]">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <img
                src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>

            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-gray-600">{regNumber}</p>
            <p className="text-gray-600 mb-6">{email}</p>

            {/* Buttons in a Row */}
            <div className="flex gap-4 justify-center mt-4 w-full">
              <button
                className="bg-[#0097b2] text-white px-3 py-2 rounded hover:bg-[#007a8f]"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? "Hide Reviews" : "Show Reviews"}
              </button>

              {isAdmin && (
                  <Link to="/admin/add-hostel">
                    <button className="bg-[#0097b2] text-white px-3 py-2 rounded hover:bg-[#007a8f]">
                      Add Hostel
                    </button>
                  </Link>
              )}
              {isAdmin && (
                  <Link to="/admin/edit-hostel">
                  <button className="bg-[#0097b2] text-white px-3 py-2 rounded hover:bg-[#007a8f]">
                    Edit Hostel Info
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Review History Section */}
        {isOpen && (
          <div className="flex justify-center mt-[5%] flex-wrap gap-4">
            {reviews?.map((review, index) => (
              <div
                key={index}
                className="flex items-center border rounded-md p-4 max-w-[30%]"
              >
                <div className="flex-1">
                  <StarRating rating={review.rating} />
                  <p>{review.review}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
