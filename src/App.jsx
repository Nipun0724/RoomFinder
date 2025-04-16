import React from 'react'
import { Routes,Route } from 'react-router'
import Register from './pages/Register'
import Home from './pages/Home'
import HostelsPage from './pages/HostelsPage'
import HostelPage from './pages/HostelPage'
import ProfilePage from './pages/ProfilePage'
import RoomDetailPage from './pages/RoomDetailPage'
import ReviewPage from './pages/ReviewPage'
import AddHostelPage from './pages/AddHostelPage'
import EditHostelPage from './pages/EditHostelPage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/admin/add-hostel" element={<AddHostelPage/>}/>
      <Route path="/admin/edit-hostel" element={<EditHostelPage/>}/>
      <Route path="/hostels" element={<HostelsPage/>}/>
      <Route path="/hostels/:hostelId" element={<HostelPage/>}/>
      <Route path="/profile" element={<ProfilePage/>}/>
      <Route path='/hostels/rooms/:roomId' element={<RoomDetailPage/>}/>
      <Route path='/hostels/:roomId/review' element={<ReviewPage/>}/>
    </Routes>
    </>
  )
}

export default App