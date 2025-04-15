import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar";
import { StarRating } from "../components/star-rating";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function ReviewPage() {
  const { hostelId, roomType } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.email) {
            setToken(token)
            return;
          }
        } catch (error) {
          toast.error("You must be logged in to submit a review.");
          navigate("/");
        }
      }else{
        toast.error("You must be logged in to submit a review.");
        navigate("/");
      }
    }, []);

  const countWords = (text) => text.trim().split(/\s+/).length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1) {
      toast.error("Please give at least a 1-star rating.");
      return;
    }

    if (countWords(review) < 20) {
      toast.error("Your review must be at least 20 words long.");
      return;
    }

    try {
      await axios.post(
        "https://roomfinder-0ouu.onrender.com/api/addReview",
        {
          hostelId,
          roomType,
          rating,
          review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review submitted successfully!");
      navigate(`/hostels/${hostelId}/${roomType}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review. Please try again.");
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="font-semibold mb-2">Rating</p>
            <StarRating rating={rating} interactive={true} onRatingChange={setRating} />
          </div>

          <div className="mb-6">
            <p className="font-semibold mb-2">Review</p>
            <textarea
              className="w-full border border-gray-300 rounded p-3 h-40"
              placeholder="Describe your stay in this room"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <button type="submit" className="bg-[#0097b2] text-white px-4 py-2 rounded hover:bg-[#007a8f]">
            Post Review
          </button>
        </form>
      </div>
    </div>
  );
}
