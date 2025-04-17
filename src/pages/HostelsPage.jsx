import { Sidebar } from "../components/sidebar";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Search } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get("https://roomfinder-0ouu.onrender.com/api/hostels");
        setHostels(response.data.hostels);
        console.log(response.data.hostels)
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };

    fetchHostels();
  }, []);

  const filteredHostels = hostels.filter((hostel) =>
    hostel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-6 flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search hostels..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredHostels.length > 0 ? (
            filteredHostels.map((hostel) => (
              <div key={hostel.id} className="flex items-center justify-center gap-[10%] border rounded-md p-4">
                <div className="">
                  <h3 className="font-medium">{hostel.name}</h3>
                  <img
                    src={hostel.image || "https://picsum.photos/200"}
                    alt={hostel.name}
                    width={120}
                    height={100}
                    className="mt-2 rounded"
                  />
                </div>
                  <p className="">
                    {hostel.description}
                    </p>
                  <Link to={`/hostels/${hostel.id}`}>
                    <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)]">Visit</Button>
                  </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hostels found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
