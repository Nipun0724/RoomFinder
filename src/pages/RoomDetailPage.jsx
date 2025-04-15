import { Link, useParams } from "react-router";
import { Sidebar } from "../components/sidebar";
import { StarRating } from "../components/star-rating";
import { useEffect, useState } from "react";
import axios from "axios";
import hostelPic from "../assets/room.jpg";


export default function RoomDetailPage() {
  const { hostelId, roomType } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating]=useState(0)

  useEffect(() => {
    if (!roomType) return;

    const fetchRoom = async () => {
      try {
        const response = await axios.get("https://roomfinder-0ouu.onrender.com/api/hostelRoom", {
          params: { roomType, hostelId },
        });
        setRoomData(response.data.rooms[0]);
        console.log(roomData)
        if (response.data.rooms[0].reviews && response.data.rooms[0].reviews.length > 0) { 
          const totalRating = response.data.rooms[0].reviews.reduce((sum, review) => sum + review.rating, 0);
          const avg = totalRating / response.data.rooms[0].reviews.length;
          setAvgRating(avg.toFixed(1));
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomType]);

  if (loading) return <div>Loading...</div>;
  if (!roomData) return <div>Error loading room details.</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{roomData.block} : {roomData.type}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/3">
            <img
              src={hostelPic || "https://picsum.photos/200"}
              alt={roomData.type}
              width={300}
              height={200}
              className="rounded"
            />
          </div>

          <div className="md:w-2/3">
            <p><strong>Block:</strong> {roomData.block}</p>
            <p><strong>Room Type:</strong> {roomData.type}</p>
            <p><strong>Price:</strong> {roomData.price}</p>
            <p><strong>Amenities:</strong> {roomData.amenities?.join(", ")}</p>
            <div className="mt-2">
              <p><strong>Rating:</strong></p>
              <StarRating rating={avgRating} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <Link
              to={`/hostels/${hostelId}/${roomType}/review`}
              className="bg-[#0097b2] text-white px-4 py-2 rounded hover:bg-[#007a8f]">
              Add Review
            </Link>
          </div>

          {roomData.reviews?.slice(0, 3).map((review, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <p className="font-semibold">{review.name}:</p>
              <StarRating rating={review.rating} />
              <p>{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
