import { Sidebar } from "../components/sidebar";
import { useParams } from "react-router";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import hostelPic from "../assets/hostel.jpg";
import roomPic from "../assets/room.jpg";

export default function HostelPage() {
  const { hostelId } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hostelId) return;

    const fetchHostel = async () => {
      try {
        const response = await axios.get("https://roomfinder-0ouu.onrender.com/api/hostel", {
          params: { hostelId },
        });
        console.log("API Response:", response.data);
        setHostel(response.data.hostel);
      } catch (error) {
        console.error("Error fetching hostel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);

  if (loading) return <div>Loading...</div>;
  if (!hostel) return <div>Error loading hostel details.</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-md p-6">
          <h1 className="text-xl font-semibold mb-4">{hostel.name}</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={hostelPic || "https://picsum.photos/200"}
                alt={hostel.name}
                width={300}
                height={200}
                className="rounded"
              />
            </div>
            <div className="md:w-2/3">
              <p className="mb-6">{hostel.description}</p>
              <h2 className="text-lg font-medium mb-3">Amenities</h2>
              <ul className="space-y-1">
                {hostel.amenities?.map((amenity, index) => (
                  <li key={index}>• {amenity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">Room Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostel.rooms?.map((room, index) => (
              <div key={index} className="flex items-center border rounded-md p-4 max-w-[70%]">
                <div className="flex-1">
                  <h3 className="font-medium">{room.type}</h3>
                  <img
                    src={roomPic || "https://picsum.photos/200"}
                    alt={room.type}
                    width={150}
                    height={90}
                    className="mt-2 rounded"
                  />
                </div>
                <Link to={`/hostels/${hostelId}/${room.type}`}>
                  <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-md">
                    Visit
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
