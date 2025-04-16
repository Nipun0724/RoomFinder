import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar";
import axios from "axios";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function AddHostelPage() {
  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    description: "",
    rooms: [{ type: "", image: "", amenities: "", price: "" }],
    amenities: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingRoom, setUploadingRoom] = useState(null);
  const [token, setToken]=useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken.isAdmin) {
          navigate("/");
        }
        else if (decodedToken.email) {
          setToken(token);
          return;
        }
      } catch (error) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);  

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
    setFormData({
      ...formData,
      rooms: updatedRooms,
    });
  };
  

  const addRoomType = () => {
    setFormData({
      ...formData,
      rooms: [...formData.rooms, { type: "", image: "", amenities: "", price: "" }],
    });
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
  
  const removeRoomType = (index) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms.splice(index, 1);
    setFormData({
      ...formData,
      rooms: updatedRooms,
    });
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await axios.post("https://roomfinder-0ouu.onrender.com/upload/pic", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setFormData((prevFormData) => {
          return { ...prevFormData, image: response.data.picUrl };
        });
        setLoading(false);
      } catch (error) {
        console.error("Image upload failed:", error);
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name.trim()) {
      toast.error("Hostel name is required.");
      return;
    }
    if (!formData.sex) {
      toast.error("Please select the gender category.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description cannot be empty.");
      return;
    }
    if (!formData.amenities.trim()) {
      toast.error("Please list at least one amenity.");
      return;
    }
    if (!formData.image) {
      toast.error("Hostel image is required.");
      return;
    }
    if (formData.rooms.length === 0) {
      toast.error("At least one room type must be added.");
      return;
    }
    
    for (let i = 0; i < formData.rooms.length; i++) {
      if (!formData.rooms[i].type.trim()) {
        toast.error(`Room ${i + 1} type is required.`);
        return;
      }
      if (!formData.rooms[i].image) {
        toast.error(`Room ${i + 1} image is required.`);
        return;
      }
    }
  
    const hostelData = {
      name: formData.name,
      sex: formData.sex,
      description: formData.description,
      image: formData.image,
      amenities: formData.amenities.split(",").map((a) => a.trim()),
      rooms: formData.rooms.map((room) => ({
        ...room,
        amenities: room.amenities.split(",").map((a) => a.trim()),
        price: Number(room.price),
      })),
    };    
  
    try {
      await axios.post("https://roomfinder-0ouu.onrender.com/api/add-hostels", hostelData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Hostel added successfully!");
      
      setFormData({
        name: "",
        sex: "",
        description: "",
        rooms: [{ type: "", image: "" }],
        amenities: "",
        image: "",
      });
  
      navigate("/hostels");
    } catch (error) {
      console.error("Error adding hostel:", error);
      toast.error("Failed to add hostel. Please try again.");
    }
  };
  
  

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Add New Hostel</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Hostel Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded h-24"
                
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amenities (comma separated)</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="WiFi, Laundry, Gym, etc."
                
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

                  <div className="mt-3">
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

                  <div className="mt-3">
                    <label className="block text-sm font-medium">Room Amenities (comma-separated)</label>
                    <input
                      type="text"
                      value={room.amenities}
                      onChange={(e) => handleRoomTypeChange(index, "amenities", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="AC, Study Table, Wardrobe, etc."
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium">Price (INR)</label>
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => handleRoomTypeChange(index, "price", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter price"
                    />
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
                disabled={loading}
              />
              {loading && <p className="text-blue-500 mt-2">Uploading image...</p>}
              {formData.image && <img src={formData.image} alt="Room" className="mt-2 w-32 h-32 object-cover rounded" />}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#0097b2] text-white rounded hover:bg-[#007a8f]" disabled={loading}>
                {(loading || uploadingRoom) ? "Uploading..." : "Add Hostel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
