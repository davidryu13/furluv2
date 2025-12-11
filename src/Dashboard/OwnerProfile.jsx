import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ownerprofile.css";
import { FaPlus, FaEdit, FaCamera } from "react-icons/fa";
import { getPetOwnerById, updatePetOwner, getPets } from "../utils/api";
import { uploadImage } from "../utils/api";

export default function OwnerProfile({
  pets = [],
  setPets,
  posts = [],
  setPosts,
}) {
  const navigate = useNavigate();
  
  const [ownerInfo, setOwnerInfo] = useState({});

  const [petOwner, setPetOwner] = useState(null);
  const [petsLoading, setPetsLoading] = useState(true);

  const [showPostPopup, setShowPostPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [editData, setEditData] = useState({ ...ownerInfo });

  // Load PetOwner from backend
  useEffect(() => {
    async function loadOwner() {
      try {
        const data = await getPetOwnerById(1);
        setPetOwner(data);

        const fullName = `${data.firstName} ${data.lastName}`.trim();

        setOwnerInfo((prev) => ({
          ...prev,
          name: fullName || "Unnamed Owner",
          // set profile/cover from backend if available
          profile: data.profileImage || '/assets/profile.jpg',
          cover: data.coverImage || '/assets/cover.jpg',
          club: prev.club || 'Pet Lovers Club',
          location: prev.location || 'Philippines',
        }));

        setEditData((prev) => ({
          ...prev,
          name: fullName || "Unnamed Owner",
          profile: data.profileImage || '/assets/profile.jpg',
          cover: data.coverImage || '/assets/cover.jpg',
        }));
      } catch (e) {
        console.error("Failed to load pet owner", e);
      }
    }

    loadOwner();
  }, []);

  // Load pets from backend
  useEffect(() => {
    async function loadPets() {
      try {
        setPetsLoading(true);
        const backendPets = await getPets();
        setPets(backendPets);
      } catch (e) {
        console.error("Failed to load pets", e);
      } finally {
        setPetsLoading(false);
      }
    }

    loadPets();
  }, [setPets]);

  const addPet = () => {
    navigate("/dashboard/add-pet");
  };

  const addPost = () => setShowPostPopup(true);

  const attachPhoto = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setPostImage(URL.createObjectURL(e.target.files[0]));
      }
    };
    fileInput.click();
  };

  const submitPost = () => {
    if (!postText && !postImage) {
      alert("Post cannot be empty!");
      return;
    }

    const newPost = {
      id: Date.now(),
      image: postImage,
      title: ownerInfo.name,
      content: postText,
      liked: false,
      showComments: false,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);

    setShowPostPopup(false);
    setPostText("");
    setPostImage(null);

    navigate("/dashboard/feed");
  };

  const openEditPopup = () => {
    setEditData({ ...ownerInfo });
    setShowEditPopup(true);
  };

  const handleEditChange = (field, value) =>
    setEditData({ ...editData, [field]: value });

  const handleEditImage = async (field) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      if (e.target.files && e.target.files[0]) {
        try {
          const file = e.target.files[0];
          const uploadResponse = await uploadImage(file);
          
          setEditData({
            ...editData,
            [field]: uploadResponse.url,
          });
        } catch (err) {
          alert(`Failed to upload image: ${err.message}`);
          console.error(err);
        }
      }
    };
    fileInput.click();
  };

  const submitEdit = async () => {
    try {
      if (!petOwner) {
        alert("No pet owner loaded.");
        return;
      }

      const parts = editData.name.trim().split(" ");
      const firstName = parts[0] || petOwner.firstName;
      const lastName =
        parts.length > 1 ? parts.slice(1).join(" ") : petOwner.lastName;

      const updatedOwner = {
        ...petOwner,
        firstName,
        lastName,
        email: petOwner.email,
        password: petOwner.password,
        // editData stores `profile` / `cover` (used by the UI), map to backend names
        profileImage: editData.profile || petOwner.profileImage || null,
        coverImage: editData.cover || petOwner.coverImage || null,
      };

      const saved = await updatePetOwner(petOwner.id, updatedOwner);

      setPetOwner(saved);
      setOwnerInfo((prev) => ({
        ...prev,
        name: `${saved.firstName} ${saved.lastName}`,
        profile: saved.profileImage || prev.profile,
        cover: saved.coverImage || prev.cover,
      }));
      setShowEditPopup(false);
    } catch (e) {
      console.error("Failed to update pet owner", e);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="owner-profile">
      <div className="cover-photo">
        <img src={ownerInfo.cover} alt="Cover" />
      </div>

      <div className="profile-avatar" onClick={openEditPopup}>
        <img src={ownerInfo.profile} alt="Profile" />
        <FaEdit className="edit-icon" />
      </div>

      <div className="owner-info">
        <h2 onClick={openEditPopup}>{ownerInfo.name}</h2>
        <p className="club">{ownerInfo.club}</p>
        <p className="location">{ownerInfo.location}</p>
      </div>

      <div className="stats">
        <div>
          <h3>0</h3>
          <p>Followers</p>
        </div>
        <div>
          <h3>0</h3>
          <p>Following</p>
        </div>
        <div>
          <h3>{posts.length}</h3>
          <p>Posts</p>
        </div>
      </div>

      <div className="manage-documents">
        <button onClick={() => navigate("/dashboard/documents")}>
          Manage Documents
        </button>
      </div>

      <div className="pets-section">
        <h3>Pets ({pets.length})</h3>
        <div className="pets-grid">
          {petsLoading ? (
            <p>Loading pets...</p>
          ) : pets.length === 0 ? (
            <>
            <p>No pets yet. Add one to get started!</p>
            <br></br>
            </>  
          ) : (
            pets.map((pet) => (
              <div
                key={pet.id}
                className="pet-card"
                onClick={() => navigate(`/dashboard/pet-profile/${pet.id}`)}
              >
                <img src={pet.image || "/assets/default-pet.jpg"} alt={pet.name} />
                <p>{pet.name}</p>
                <span className="pet-type">{pet.type}</span>
              </div>
            ))
          )}

          <div className="pet-card add-pet" onClick={addPet}>
            <FaPlus className="plus-icon" />
            <p>Add Pet</p>
          </div>
        </div>
      </div>

      <div className="create-post">
        <img
          src={ownerInfo.profile}
          alt="User"
          className="create-post-avatar"
        />
        <input
          type="text"
          placeholder="What's on your mind?"
          className="create-post-input"
          onClick={addPost}
        />
        <button className="attach-photo-btn" onClick={attachPhoto}>
          <FaCamera />
        </button>
      </div>

      {showPostPopup && (
        <div className="post-popup">
          <div className="post-content">
            <h3>Create Post</h3>

            <textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />

            <div className="popup-attach-photo" onClick={attachPhoto}>
              <FaCamera className="popup-camera-icon" />
              <span>Attach Photo</span>
            </div>

            {postImage && (
              <img src={postImage} alt="Preview" className="post-preview" />
            )}

            <div className="post-actions">
              <button onClick={() => setShowPostPopup(false)}>Cancel</button>
              <button onClick={submitPost}>Post</button>
            </div>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="edit-popup">
          <div className="edit-content">
            <h3>Edit Profile</h3>

            <div className="edit-avatar-section">
              <img
                src={editData.profile}
                alt="Profile"
                className="edit-avatar"
              />
              <button
                onClick={() => handleEditImage("profile")}
                className="edit-photo-btn"
              >
                <FaCamera /> Change Profile
              </button>
            </div>

            <div className="edit-cover-section">
              <img src={editData.cover} alt="Cover" className="edit-cover" />
              <button
                onClick={() => handleEditImage("cover")}
                className="edit-photo-btn"
              >
                <FaCamera /> Change Cover
              </button>
            </div>

            <input
              type="text"
              value={editData.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
              className="edit-input"
            />

            <input
              type="text"
              value={editData.location}
              onChange={(e) => handleEditChange("location", e.target.value)}
              className="edit-input"
            />

            <div className="edit-actions">
              <button onClick={() => setShowEditPopup(false)}>Cancel</button>
              <button onClick={submitEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}