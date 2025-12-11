import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/listings.css';
import { getPetListings, createPetListing, getPetOwnerById, uploadImage, deletePetListing } from '../utils/api';
import { FaPlus } from 'react-icons/fa';

export default function Listings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [showOwnListings, setShowOwnListings] = useState(false);

  // Create listing state
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    petName: '',
    breed: '',
    age: '',
    status: 'Available',
  });
  const [listingImageFile, setListingImageFile] = useState(null);
  const [listingImagePreview, setListingImagePreview] = useState(null);
  const [listingUploadProgress, setListingUploadProgress] = useState(0);

  // Load user info and listings from backend on mount
  useEffect(() => {
    loadUserInfo();
    loadListings();
  }, []);

  // Function to load user info
  const loadUserInfo = async () => {
    try {
      const data = await getPetOwnerById(1);
      setUserId(data.id);
      if (data.firstName && data.lastName) {
        setUserName(`${data.firstName} ${data.lastName}`);
      }
    } catch (e) {
      console.error("Failed to load user info", e);
    }
  };

  // Function to load listings (can be called after creating)
  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch listings from backend
      const backendListings = await getPetListings();
      
      // Transform backend listings to frontend format
      const transformedListings = backendListings.map((listing) => ({
        id: listing.id,
        name: listing.petName,
        breed: listing.breed,
        age: listing.age,
        status: listing.status || 'Available',
        image: listing.image || listing.imageUrl || null,
        creatorName: listing.creatorName || 'Unknown',
        creatorId: listing.creatorId || null,
      }));

      setListings(transformedListings);
      setFilteredListings(transformedListings);
    } catch (err) {
      console.error('Failed to load listings', err);
      setError('Failed to load listings. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Filter listings based on search query and own/all toggle
  useEffect(() => {
    let results = listings;
    
    // Filter by own/all listings
    if (showOwnListings && userId) {
      results = results.filter(listing => listing.creatorId === userId);
    }
    
    // Filter by search query
    if (!searchQuery.trim()) {
      setFilteredListings(results);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = results.filter((listing) => {
      return (
        listing.name.toLowerCase().includes(query) ||
        listing.breed.toLowerCase().includes(query) ||
        listing.status.toLowerCase().includes(query) ||
        listing.creatorName.toLowerCase().includes(query)
      );
    });

    setFilteredListings(filtered);
  }, [searchQuery, listings, showOwnListings, userId]);

  const openTransaction = (pet) => {
    navigate('/dashboard/transactions', { state: { pet } });
  };

  const deleteListing = async (listingId, e) => {
    e.stopPropagation(); // Prevent triggering openTransaction
    if (window.confirm('Delete this listing?')) {
      try {
        await deletePetListing(listingId);
        setListings((prev) => prev.filter((l) => l.id !== listingId));
      } catch (err) {
        console.error('Failed to delete listing', err);
        alert('Failed to delete listing: ' + (err.message || err));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : parseInt(value) || '') : value,
    }));
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.petName.trim() || !formData.breed.trim() || !formData.age) {
      alert('Please fill in all required fields.');
      return;
    }

    if (formData.age < 0) {
      alert('Age must be a positive number.');
      return;
    }

    try {
      setSubmitting(true);

      // Upload image if provided
      let imageUrl = null;
      if (listingImageFile) {
        try {
          setListingUploadProgress(30);
          const uploadResponse = await uploadImage(listingImageFile);
          imageUrl = uploadResponse.url || null;
          setListingUploadProgress(100);
        } catch (upErr) {
          console.error('Image upload failed', upErr);
          alert('Failed to upload image: ' + upErr.message);
          setSubmitting(false);
          return;
        }
      }

      // Create listing in backend
      // Backend expects: { petName, breed, age, status, creatorName, creatorId, imageUrl }
      const newListing = await createPetListing({
        petName: formData.petName.trim(),
        breed: formData.breed.trim(),
        age: parseInt(formData.age),
        status: formData.status,
        creatorName: userName,
        creatorId: userId,
        imageUrl: imageUrl,
      });

      // Close popup and reset form
      setShowCreatePopup(false);
      setFormData({
        petName: '',
        breed: '',
        age: '',
        status: 'Available',
      });
      setListingImageFile(null);
      setListingImagePreview(null);
      setListingUploadProgress(0);

      // Reload listings to show the new one
      await loadListings();
    } catch (error) {
      console.error('Failed to create listing', error);
      alert('Failed to create listing: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && listings.length === 0) {
    return (
      <div className="listings-page">
        <h2>Pet Lists 🐾</h2>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error && listings.length === 0) {
    return (
      <div className="listings-page">
        <h2>Pet Lists 🐾</h2>
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2>Pet Lists 🐾</h2>
        <button
          onClick={() => setShowCreatePopup(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold'
          }}
        >
          <FaPlus /> Create Listing
        </button>
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={() => setShowOwnListings(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: !showOwnListings ? '#4CAF50' : '#ddd',
            color: !showOwnListings ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          All Listings
        </button>
        <button
          onClick={() => setShowOwnListings(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: showOwnListings ? '#4CAF50' : '#ddd',
            color: showOwnListings ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          My Listings
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, breed, status, or creator..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredListings.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>
            {searchQuery.trim() 
              ? 'No listings found matching your search.' 
              : showOwnListings
              ? 'You have no listings yet. Create one to get started!'
              : 'No pet listings available yet.'}
          </p>
        </div>
      ) : (
        filteredListings.map((pet) => (
          <div
            className="listing-card"
            key={pet.id}
            onClick={() => openTransaction(pet)}
            style={{ cursor: "pointer" }}
          >
            <img 
              src={pet.image || '/assets/default-pet.jpg'} 
              alt={pet.name} 
              className="pet-image"
              onError={(e) => {
                e.target.src = '/assets/default-pet.jpg';
              }}
            />
            <div className="pet-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <p><strong>Name:</strong> {pet.name}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
                  <p>
                    <strong>Status:</strong>
                    <span className={`status ${pet.status === 'Available' ? 'available' : 'not-available'}`}>
                      {pet.status}
                    </span>
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    <strong>Posted by:</strong> {pet.creatorName}
                  </p>
                </div>
                {pet.creatorId === userId && (
                  <button
                    onClick={(e) => deleteListing(pet.id, e)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      marginLeft: '12px',
                    }}
                    title="Delete listing"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Create Listing Popup */}
      {showCreatePopup && (
        <div className="post-popup" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="post-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginTop: 0 }}>Create Pet Listing</h3>

            <form onSubmit={handleSubmitListing}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Pet Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                  placeholder="Enter pet name"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Breed <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Enter breed"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Age (years) <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  min="0"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Pet Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setListingImageFile(file);
                      setListingImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                />

                {listingImagePreview && (
                  <img src={listingImagePreview} alt="Preview" style={{ width: '100%', marginTop: 8, borderRadius: 6 }} />
                )}

                {listingUploadProgress > 0 && listingUploadProgress < 100 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 6, background: '#eee', borderRadius: 3 }}>
                      <div style={{ width: `${listingUploadProgress}%`, height: '100%', background: '#4CAF50', borderRadius: 3 }} />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreatePopup(false);
                    setFormData({
                      petName: '',
                      breed: '',
                      age: '',
                      status: 'Available',
                    });
                    setListingImageFile(null);
                    setListingImagePreview(null);
                    setListingUploadProgress(0);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f0f0f0',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: submitting ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {submitting ? 'Creating...' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}