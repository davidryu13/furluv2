import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/NavBar";        // FIXED PATH
import "../styles/dashboard.css";    
import Feed from "./Feed";
import PetProfile from "./PetProfile";
import Listings from "./Listings";
import Transactions from "./Transactions";
import OwnerProfile from "./OwnerProfile";
import AddPet from "./AddPet";
import Messages from "./Messages";
import Documents from "./Documents";

export default function Dashboard({ user, onLogout, pets, setPets, posts, setPosts }) {
  return (
    <div className="dashboard no-sidepanels">
      {/* Global Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main dashboard content */}
      <div className="main-content">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="feed" />} />

          {/* Dashboard pages */}
          <Route
            path="feed"
            element={<Feed posts={posts} setPosts={setPosts} />}
          />
          <Route
            path="owner-profile"
            element={<OwnerProfile pets={pets} setPets={setPets} posts={posts} setPosts={setPosts} />}
          />
          <Route path="pet-profile/:id" element={<PetProfile pets={pets} />} />
          <Route path="add-pet" element={<AddPet pets={pets} setPets={setPets} />} />
          <Route path="listings" element={<Listings />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="messages" element={<Messages />} />
          <Route path="documents" element={<Documents />} />

          {/* Fallback */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
}
