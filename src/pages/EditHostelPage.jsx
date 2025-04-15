import { useState, useEffect } from "react";
import axios from "axios";
import { Sidebar } from "../components/sidebar";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export default function EditHostelPage() {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    description: "",
    rooms: [{ type: "",image: "" }],
    amenities: "",
    image: "",
  });
  const [uploadingHostel, setUploadingHostel] = useState(false);
  const [uploadingRoom, setUploadingRoom] = useState(null);
  const [token, setToken]=useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/");
    } else {
      try {
        const decodedToken = jwtDecode(storedToken);
        if (!decodedToken.isAdmin) {
          navigate("/"); // redirect if not admin
        } else {
          setToken(storedToken);
        }
      } catch (err) {
        console.error("Invalid token");
        navigate("/");
      }
    }
  }, [navigate]);  

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get("https://roomfinder-0ouu.onrender.com/api/hostels");
        setHostels(response.data.hostels);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };

    fetchHostels();
  }, []);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      if (!selectedHostel) return;
      setLoading(true);
      try {
        const response = await axios.get(`https://roomfinder-0ouu.onrender.com/api/hostel/${selectedHostel}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setFormData(response.data.hostel);
      } catch (error) {
        console.error("Error fetching hostel details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [selectedHostel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoomTypeChange = (index, field, value) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index][field] = value;
    setFormData({ ...formData, rooms: updatedRooms });
  };

  const addRoomType = () => {
    setFormData({
      ...formData,
      rooms: [...formData.rooms, { type: "", capacity: "", price: "", image: "" }],
    });
  };

  const removeRoomType = (index) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms.splice(index, 1);
    setFormData({ ...formData, rooms: updatedRooms });
  };

  const handleRoomImageUpload = async (index, file) => {
    if (!file) return;
    setUploadingRoom(index);
  
    const formData2 = new FormData();
    formData2.append("avatar", file);
  
    try {
      const response = await axios.post("https://roomfinder-0ouu.onrender.com/upload/pic", formData2, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setFormData((prevFormData) => {
        const updatedRooms = [...prevFormData.rooms];
        updatedRooms[index].image = response.data.picUrl;
        return { ...prevFormData, rooms: updatedRooms };
      });
  
      setUploadingRoom(null);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadingRoom(null);
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingHostel(true);

      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await axios.post("https://roomfinder-0ouu.onrender.com/upload/pic", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setFormData((prevFormData) => {
          return { ...prevFormData, image: response.data.picUrl };
        });
        setUploadingHostel(false);
      } catch (error) {
        console.error("Image upload failed:", error);
        setUploadingHostel(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const hostelData = {
      name: formData.name,
      sex: formData.sex,
      description: formData.description,
      rooms: formData.rooms,
      amenities: Array.isArray(formData.amenities) ? formData.amenities : formData.amenities.split(",").map((a) => a.trim()),
      image: formData.image
    };
    try {

      await axios.put(
        `https://roomfinder-0ouu.onrender.com/api/edit-hostel/${selectedHostel}`,
        hostelData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Hostel updated successfully!");
    } catch (error) {
      console.error("Error updating hostel:", error);
      alert("Failed to update hostel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Hostel Information</h1>

          <div className="mb-6">
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">-- Select a hostel --</option>
              {hostels.map((hostel) => (
                <option key={hostel.id} value={hostel.id}>
                  {hostel.name}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-10">
              <p>Loading hostel information...</p>
            </div>
          )}

          {selectedHostel && !loading && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hostel Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Room Types</label>
                {formData.rooms.map((room, index) => (
                <div key={index} className="border p-3 mb-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={room.type}
                      onChange={(e) => handleRoomTypeChange(index, "type", e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded"
                      placeholder="Room type (e.g., 2-bed, 4-bed)"
                      required
                    />
                    {formData.rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomType(index)}
                        className="p-2 bg-red-500 text-white rounded"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mt-2">
                    <label className="block text-sm font-medium">Room Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleRoomImageUpload(index, e.target.files[0])}
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled={uploadingRoom === index}
                    />
                    {uploadingRoom === index && <p className="text-blue-500 mt-2">Uploading...</p>}
                    {room.image && <img src={room.image} alt="Room" className="mt-2 w-32 h-32 object-cover rounded" />}
                  </div>
                </div>
              ))}
                <button type="button" onClick={addRoomType} className="mt-2 p-2 bg-gray-200 rounded">
                  Add Room Type
                </button>
              </div>

              <div className="border p-3 mb-3 rounded-md">
                <label className="block text-sm font-medium mb-1">Hostel Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={uploadingHostel}
                />
                {uploadingHostel && <p className="text-blue-500 mt-2">Uploading image...</p>}
                {formData.image && <img src={formData.image} alt="Room" className="mt-2 w-32 h-32 object-cover rounded" />}
              </div>

              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                Update Hostel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
