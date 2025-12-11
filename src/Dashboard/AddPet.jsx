import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addpet.css";
import { createPet, uploadImage } from "../utils/api";

export default function AddPet({ setPets }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [petData, setPetData] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: "",
    bio: "",
    documents: "",
    imageUrl: null,
    imageFile: null,
  });

  const dogBreeds = [
    "Labrador Retriever", "Golden Retriever", "German Shepherd", "Bulldog",
    "Beagle", "Poodle", "Rottweiler", "Yorkshire Terrier", "Boxer", "Dachshund",
    "Siberian Husky", "Chihuahua", "Shih Tzu", "Doberman", "Australian Shepherd"
  ];

  const catBreeds = [
    "Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal", "Sphynx",
    "British Shorthair", "Scottish Fold", "Abyssinian", "Oriental"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Store file for later upload
      setPetData({ 
        ...petData, 
        imageFile: file,
        imageUrl: URL.createObjectURL(file) // For preview
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!petData.name || !petData.breed || !petData.age) {
      alert("Please fill out all required fields!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (petData.imageFile) {
        setUploadProgress(50);
        const uploadResponse = await uploadImage(petData.imageFile);
        imageUrl = uploadResponse.url;
        setUploadProgress(100);
      }

      const petPayload = {
        name: petData.name,
        type: petData.type,
        breed: petData.breed,
        age: parseInt(petData.age),
        bio: petData.bio || "No bio provided",
        documents: petData.documents || "No documents",
        imageUrl: imageUrl || null,
      };

      const newPet = await createPet(petPayload);

      setPets((prev) => [...prev, newPet]);
      navigate("/dashboard/owner-profile");
    } catch (err) {
      setError(`Failed to add pet: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="add-pet-page">
      <button
        className="back-button"
        onClick={() => navigate("/dashboard/owner-profile")}
        disabled={loading}
      >
        ← Back to Owner Profile
      </button>

      <h2>Add Your Pet 🐾</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="add-pet-form" onSubmit={handleSubmit}>
        <label>Pet Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter pet name"
          value={petData.name}
          onChange={handleChange}
          required
        />

        <label>Type *</label>
        <select name="type" value={petData.type} onChange={handleChange}>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>

        <label>Breed *</label>
        <select
          name="breed"
          value={petData.breed}
          onChange={handleChange}
          required
        >
          <option value="">Select breed</option>
          {(petData.type === "Dog" ? dogBreeds : catBreeds).map((b, idx) => (
            <option key={idx} value={b}>{b}</option>
          ))}
        </select>

        <label>Age (years) *</label>
        <input
          type="number"
          name="age"
          placeholder="Enter pet age"
          min="0"
          max="50"
          value={petData.age}
          onChange={handleChange}
          required
        />

        <label>Bio</label>
        <textarea
          name="bio"
          placeholder="Tell us about your pet..."
          value={petData.bio}
          onChange={handleChange}
          rows="4"
        />

        <label>Documents (notes)</label>
        <textarea
          name="documents"
          placeholder="Any relevant documents or notes..."
          value={petData.documents}
          onChange={handleChange}
          rows="3"
        />

        <label>Pet Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
        />
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="upload-progress">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
            <p>Uploading... {uploadProgress}%</p>
          </div>
        )}

        {petData.imageUrl && (
          <img
            src={petData.imageUrl}
            alt="Pet Preview"
            className="pet-image-preview"
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding Pet..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
}