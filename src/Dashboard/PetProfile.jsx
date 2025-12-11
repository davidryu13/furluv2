import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/petprofile.css";
import { getPetById, updatePet, uploadImage, uploadDocument } from "../utils/api";

export default function PetProfile({ pets = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editUploadProgress, setEditUploadProgress] = useState(0);
  const [editDocumentFile, setEditDocumentFile] = useState(null);
  const [editDocumentProgress, setEditDocumentProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPet() {
      try {
        setLoading(true);
        setError(null);
        const petId = parseInt(id);
        const petData = await getPetById(petId);
        setPet(petData);
        setEditData(petData);
      } catch (err) {
        setError(`Failed to load pet: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPet();
  }, [id]);

  const handleEditChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleEditImage = async (file) => {
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditDocument = async (file) => {
    if (file) {
      setEditDocumentFile(file);
    }
  };

  const getFileExtension = (url) => {
    if (!url) return '';
    return url.split('.').pop().toLowerCase();
  };

  const isImageFile = (url) => {
    if (!url) return false;
    const ext = getFileExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  };

  const isPdfFile = (url) => {
    if (!url) return false;
    return getFileExtension(url) === 'pdf';
  };

  const submitEdit = async () => {
    try {
      if (!editData.name || !editData.breed || editData.age === "") {
        alert("Please fill out all required fields!");
        return;
      }

      setIsSubmitting(true);

      // Upload image if a new one was selected
      let imageUrl = editData.imageUrl;
      if (editImageFile) {
        try {
          setEditUploadProgress(25);
          const uploadResponse = await uploadImage(editImageFile);
          imageUrl = uploadResponse.url || null;
          setEditUploadProgress(50);
        } catch (upErr) {
          console.error('Image upload failed', upErr);
          alert('Failed to upload image: ' + upErr.message);
          setIsSubmitting(false);
          return;
        }
      }

      // Upload document if a new one was selected
      let documentUrl = editData.documents;
      if (editDocumentFile) {
        try {
          setEditDocumentProgress(25);
          const docUploadResponse = await uploadDocument(editDocumentFile);
          documentUrl = docUploadResponse.url || null;
          setEditDocumentProgress(50);
        } catch (docErr) {
          console.error('Document upload failed', docErr);
          alert('Failed to upload document: ' + docErr.message);
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        ...editData,
        age: parseInt(editData.age),
        imageUrl: imageUrl,
        documents: documentUrl,
      };

      const updatedPet = await updatePet(pet.id, payload);
      setPet(updatedPet);
      setShowEditPopup(false);
      setEditImageFile(null);
      setEditImagePreview(null);
      setEditUploadProgress(0);
      setEditDocumentFile(null);
      setEditDocumentProgress(0);
      alert("Pet updated successfully!");
    } catch (err) {
      alert(`Failed to update pet: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pet-profile-page">
        <button className="back-button" onClick={() => navigate("/dashboard/owner-profile")}>
          ← Back to Profile
        </button>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Loading pet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pet-profile-page">
        <button className="back-button" onClick={() => navigate("/dashboard/owner-profile")}>
          ← Back to Profile
        </button>
        <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="pet-profile-page">
        <button className="back-button" onClick={() => navigate("/dashboard/owner-profile")}>
          ← Back to Profile
        </button>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Pet not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-profile-page">
      <button className="back-button" onClick={() => navigate("/dashboard/owner-profile")}>
        ← Back to Profile
      </button>

      <div className="pet-profile-card">
        <div className="pet-profile-image-container">
          <img src={pet.image || "/assets/default-pet.jpg"} alt={pet.name} className="pet-image" />
          <div className="pet-profile-overlay">
            <button className="edit-button" onClick={() => setShowEditPopup(true)}>
              Edit Pet
            </button>
          </div>
        </div>
        
        <div className="pet-details">
          <h2 style={{ margin: '0 0 15px 0', fontSize: '28px', color: '#1f2937' }}>{pet.name}</h2>
          
          <div className="pet-info-grid">
            <div className="pet-info-item">
              <label>Type</label>
              <p>{pet.type}</p>
            </div>
            <div className="pet-info-item">
              <label>Breed</label>
              <p>{pet.breed}</p>
            </div>
            <div className="pet-info-item">
              <label>Age</label>
              <p>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
            </div>
          </div>

          <div className="pet-bio-section">
            <label>Bio</label>
            <p>{pet.bio || "No bio provided"}</p>
          </div>

          <div className="pet-docs-section">
            <label>Documents</label>
            {pet.documents ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <p style={{ margin: 0, flex: '1 1 auto' }}>
                  {isImageFile(pet.documents) ? '📷 Image Document' : isPdfFile(pet.documents) ? '📄 PDF Document' : '📎 Document File'}
                </p>
                <button
                  onClick={() => setShowDocumentViewer(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#45a049';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#4CAF50';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  View Document
                </button>
              </div>
            ) : (
              <p>No documents</p>
            )}
          </div>
        </div>
      </div>

      {showEditPopup && (
        <div className="edit-popup">
          <div className="edit-content">
            <h3 style={{ marginTop: 0, fontSize: '22px', color: '#1f2937' }}>Edit Pet</h3>

            <form onSubmit={(e) => { e.preventDefault(); submitEdit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>Pet Name *</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>Type *</label>
                <select
                  value={editData.type}
                  onChange={(e) => handleEditChange("type", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>Breed *</label>
                <input
                  type="text"
                  value={editData.breed}
                  onChange={(e) => handleEditChange("breed", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>Age (years) *</label>
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) => handleEditChange("age", e.target.value)}
                  min="0"
                  max="50"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleEditChange("bio", e.target.value)}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#374151' }}>Documents</label>
                <textarea
                  value={editData.documents}
                  onChange={(e) => handleEditChange("documents", e.target.value)}
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>Document File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleEditDocument(e.target.files[0]);
                    }
                  }}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                />
                {editDocumentFile && (
                  <p style={{ fontSize: '12px', color: '#10b981', margin: '5px 0' }}>
                    Selected: {editDocumentFile.name}
                  </p>
                )}
              </div>

              {editDocumentProgress > 0 && editDocumentProgress < 100 && (
                <div>
                  <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>Uploading document... {editDocumentProgress}%</p>
                  <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${editDocumentProgress}%`,
                        height: "100%",
                        background: "#10b981",
                        borderRadius: "3px",
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>Pet Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleEditImage(e.target.files[0]);
                    }
                  }}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                />
              </div>

              {editImagePreview && (
                <div>
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              {editUploadProgress > 0 && editUploadProgress < 100 && (
                <div>
                  <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>Uploading... {editUploadProgress}%</p>
                  <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${editUploadProgress}%`,
                        height: "100%",
                        background: "#10b981",
                        borderRadius: "3px",
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="edit-actions">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditPopup(false);
                    setEditImageFile(null);
                    setEditImagePreview(null);
                    setEditUploadProgress(0);
                    setEditDocumentFile(null);
                    setEditDocumentProgress(0);
                  }} 
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: isSubmitting ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDocumentViewer && pet.documents && (
        <div className="document-viewer-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px',
        }}>
          <div className="document-viewer-container" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 25px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>
                {isImageFile(pet.documents) ? 'Document Image' : isPdfFile(pet.documents) ? 'PDF Document' : 'Document'}
              </h3>
              <button
                onClick={() => setShowDocumentViewer(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              padding: '20px',
            }}>
              {isImageFile(pet.documents) ? (
                <img
                  src={pet.documents}
                  alt="Document"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    borderRadius: '8px',
                  }}
                />
              ) : isPdfFile(pet.documents) ? (
                <iframe
                  src={pet.documents}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  title="Document PDF"
                />
              ) : (
                <div style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}>
                  <div style={{
                    fontSize: '48px',
                    color: '#9ca3af',
                  }}>
                    📄
                  </div>
                  <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: 0,
                    maxWidth: '300px',
                  }}>
                    Document file type cannot be previewed in the browser.
                  </p>
                  <a
                    href={pet.documents}
                    download
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#45a049';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4CAF50';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Download Document
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '15px 25px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}>
              {pet.documents && !isPdfFile(pet.documents) && (
                <a
                  href={pet.documents}
                  download
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#45a049';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#4CAF50';
                  }}
                >
                  Download
                </a>
              )}
              <button
                onClick={() => setShowDocumentViewer(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}