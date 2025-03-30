import { Sidebar } from "../components/sidebar"
import { Link } from "react-router"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 mt-[15%]">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2">
              <img
                src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
                alt="Admin"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-semibold">Admin123</h2>
          </div>
          <div className="space-y-7">
            <Link to="/admin/add-hostel">
              <button className="w-full bg-[#0097b2] text-white py-2 px-4 rounded hover:bg-[#007a8f]">
                Add Hostel
              </button>
            </Link>
            <Link to="/admin/edit-hostel">
              <button className="w-full bg-[#0097b2] text-white py-2 px-4 rounded hover:bg-[#007a8f] mt-[5%]">
                Edit Hostel Info
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

