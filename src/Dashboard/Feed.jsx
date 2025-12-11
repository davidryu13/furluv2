// src/routes/Dashboard/Feed.jsx
import React, { useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/feed.css';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment, FaPlus } from 'react-icons/fa';
import Avatar from 'react-avatar';
import { getPosts, createPost, getPetOwnerById, deletePost } from '../utils/api';

// Memoized Comment to prevent unnecessary re-renders
const Comment = memo(function Comment({ postId, comment, onReact, onReply }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMessageConfirm, setShowMessageConfirm] = useState(false);

  const navigate = useNavigate();

  const reactionsAvailable = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleReactionSelect = (reaction) => {
    onReact(comment.id, reaction);
    setShowReactionPicker(false);
  };

  const handleMessageClick = () => {
    navigate('/dashboard/messages', { state: { user: comment.user } });
    setShowMessageConfirm(false);
  };

  return (
    <div className="comment">
      <Avatar
        name={comment.user.name}
        round={true}
        size="36"
        className="comment-avatar"
        onClick={() => setShowMessageConfirm(true)}
        style={{ cursor: 'pointer' }}
      />
      <div className="comment-body">
        <div
          className="comment-username"
          onClick={() => setShowMessageConfirm(true)}
          style={{ cursor: 'pointer' }}
        >
          {comment.user.name}
        </div>
        <div>{comment.text}</div>

        <div className="comment-reactions">
          {comment.reactions && Object.entries(comment.reactions).length > 0 &&
            Object.entries(comment.reactions).map(([reaction, count]) => (
              <div
                key={reaction}
                className="comment-reaction-btn"
                onClick={() => onReact(comment.id, reaction)}
                title={`React with ${reaction}`}
              >
                {reaction} {count}
              </div>
            ))
          }

          <div
            className="comment-reaction-picker-toggle"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            title="Add reaction"
          >
            🐶
          </div>

          {showReactionPicker && (
            <div className="comment-reaction-picker">
              {reactionsAvailable.map((reaction) => (
                <span
                  key={reaction}
                  className="comment-reaction-picker-btn"
                  onClick={() => handleReactionSelect(reaction)}
                >
                  {reaction}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="comment-reply-btn"
          onClick={() => setShowReplyInput(!showReplyInput)}
          tabIndex={0}
          role="button"
          onKeyPress={(e) => {
            if (e.key === 'Enter') setShowReplyInput(!showReplyInput);
          }}
        >
          Reply
        </div>

        {showReplyInput && (
          <div className="comment-reply-input-container">
            <input
              type="text"
              className="comment-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleReplySubmit();
              }}
              aria-label="Write a reply"
              autoFocus
            />
            <button
              className="comment-send-btn"
              onClick={handleReplySubmit}
              aria-label="Send reply"
            >
              Send
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                postId={postId}
                comment={reply}
                onReact={onReact}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>

      {showMessageConfirm && (
        <div
          className="message-confirm-overlay"
          onClick={() => setShowMessageConfirm(false)}
        >
          <div
            className="message-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="message-confirm-text">Message <strong>{comment.user.name}</strong>?</p>
            <div className="message-confirm-buttons">
              <button className="btn btn-message" onClick={handleMessageClick}>Message</button>
              <button className="btn btn-cancel" onClick={() => setShowMessageConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// FeedCard without animation
function FeedCard({ post, toggleLike, toggleComments, handleReact, handleReply, onDelete, isOwnPost }) {
  return (
    <div className="feed-card">
      {post.image && (
        <img src={post.image} alt={post.title || 'Post'} className="feed-img" />
      )}
      {post.creatorName && (
        <div style={{ paddingLeft: '15px', paddingTop: '10px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>
          <h3>{post.creatorName}</h3>
        </div>
      )}
      <div className="feed-caption">
        {post.title && <h3>{post.title}</h3>}
        <p>{post.content}</p>
      </div>

      <div className="feed-actions">
        <span onClick={() => toggleLike(post.id)} style={{ cursor: 'pointer' }}>
          {post.liked ? (
            <AiFillHeart className="heart liked" />
          ) : (
            <AiOutlineHeart className="heart" />
          )}
        </span>

        <span onClick={() => toggleComments(post.id)} style={{ cursor: 'pointer' }}>
          <FaRegComment className="comment-icon" />
        </span>

        {isOwnPost && (
          <span
            onClick={() => onDelete(post.id)}
            style={{
              cursor: 'pointer',
              color: '#ef4444',
              fontSize: '14px',
              marginLeft: 'auto',
              fontWeight: 'bold'
            }}
          >
            Delete
          </span>
        )}
      </div>

      {post.showComments && (
        <div className="comment-section">
          <div className="existing-comments">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  postId={post.id}
                  comment={comment}
                  onReact={(commentId, reaction) =>
                    handleReact(post.id, commentId, reaction)
                  }
                  onReply={(commentId, replyText) =>
                    handleReply(post.id, commentId, replyText)
                  }
                />
              ))
            ) : (
              <p style={{ padding: '10px', color: '#666' }}>No comments yet</p>
            )}
          </div>

          <input
            type="text"
            placeholder="Add a comment..."
            className="comment-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.target.value.trim();
                if (value) {
                  handleReply(post.id, null, value);
                  e.target.value = '';
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function Feed({ posts, setPosts }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Post creation state
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [postText, setPostText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [postUploadProgress, setPostUploadProgress] = useState(0);
  const [creatorName, setCreatorName] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState({});
  const [petOwner, setPetOwner] = useState(null);
  const [petsLoading, setPetsLoading] = useState(true);
  const [editData, setEditData] = useState({ ...ownerInfo });

  // Delete post handler
  const deletePostHandler = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        setPosts((prev) => prev.filter((post) => post.id !== postId));
      } catch (err) {
        console.error('Failed to delete post', err);
        alert('Failed to delete post');
      }
    }
  };

  // Load creator name from backend on mount
  useEffect(() => {
    async function loadCreatorName() {
      try {
        const data = await getPetOwnerById(1);
        if (data && data.firstName && data.lastName) {
          setCreatorName(`${data.firstName} ${data.lastName}`);
        }
      } catch (e) {
        console.error("Failed to load creator name", e);
      }
    }
    loadCreatorName();
  }, []);

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
  // Load posts from backend on mount
  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch posts from backend
        const backendPosts = await getPosts();
        
        // Transform backend posts to frontend format
        const transformedPosts = backendPosts.map((backendPost) => ({
          id: backendPost.id,
          title: null,
          content: backendPost.content || '',
          image: backendPost.image || backendPost.imageUrl || null,
          creatorName: backendPost.creatorName || null,
          liked: false,
          showComments: false,
          comments: [],
        }));

        // Merge with existing posts
        setPosts((prev) => {
          const existingMap = new Map(prev.map(p => [p.id, p]));
          
          transformedPosts.forEach(post => {
            const existing = existingMap.get(post.id);
            if (existing) {
              existingMap.set(post.id, {
                ...existing,
                content: post.content,
                image: post.image,
                creatorName: post.creatorName,
              });
            } else {
              existingMap.set(post.id, post);
            }
          });
          
          return Array.from(existingMap.values()).sort((a, b) => b.id - a.id);
        });
      } catch (err) {
        console.error('Failed to load posts', err);
        setError('Failed to load posts. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []); // Empty dependency array - only load once on mount

  // Post creation function
  const submitPost = async () => {
    if (!postText.trim()) {
      alert("Post cannot be empty!");
      return;
    }

    try {
      setSubmitting(true);

      // Upload image if provided
      let imageUrl = null;
      if (postImageFile) {
        try {
          setPostUploadProgress(30);
          const api = await import('../utils/api');
          const uploadResponse = await api.uploadImage(postImageFile);
          imageUrl = uploadResponse.url || null;
          setPostUploadProgress(100);
        } catch (upErr) {
          console.error('Image upload failed', upErr);
          alert('Failed to upload image: ' + upErr.message);
          setSubmitting(false);
          return;
        }
      }

      // Create post in backend
      const savedPost = await createPost({
        content: postText.trim(),
        imageUrl: imageUrl,
        creatorName: creatorName,
      });

      // Create frontend post object
      const newPost = {
        id: savedPost.id,
        image: savedPost.image || savedPost.imageUrl || imageUrl || null,
        title: null,
        content: postText.trim(),
        creatorName: creatorName,
        liked: false,
        showComments: false,
        comments: [],
      };

      // Update local state - add to beginning
      setPosts((prev) => [newPost, ...prev]);

      // Close popup and reset form
      setShowPostPopup(false);
      setPostText("");
      setPostImageFile(null);
      setPostImagePreview(null);
      setPostUploadProgress(0);
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to create post: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, liked: !post.liked } : post
      )
    );
  };

  const toggleComments = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  const handleReact = (postId, commentId, reaction) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const addReaction = (comments) =>
          comments.map((c) => {
            if (c.id === commentId) {
              const newReactions = { ...c.reactions };
              newReactions[reaction] = (newReactions[reaction] || 0) + 1;
              return { ...c, reactions: newReactions };
            }
            if (c.replies?.length > 0) {
              return { ...c, replies: addReaction(c.replies) };
            }
            return c;
          });

        return { ...post, comments: addReaction(post.comments) };
      })
    );
  };

  const handleReply = (postId, parentCommentId, replyText) => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      user: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=you' },
      text: replyText,
      reactions: {},
      replies: [],
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        if (parentCommentId === null) {
          return { ...post, comments: [...(post.comments || []), newReply] };
        }

        const addReply = (comments) =>
          comments.map((c) => {
            if (c.id === parentCommentId) {
              return { ...c, replies: [...(c.replies || []), newReply] };
            }
            if (c.replies?.length > 0) {
              return { ...c, replies: addReply(c.replies) };
            }
            return c;
          });

        return { ...post, comments: addReply(post.comments || []) };
      })
    );
  };

  if (loading) {
    return (
      <div className="feed-page">
        <h2 className="feed-title">Feed</h2>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-page">
        <h2 className="feed-title">Feed</h2>
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 50px'}}>
        
      </div>

      <div className="feed-container">
        <h2 className="feed-title">Feed</h2>
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
                  onClick={showPostPopup ? null : () => setShowPostPopup(true)}
                />
              </div>
        {posts.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              toggleLike={toggleLike}
              toggleComments={toggleComments}
              handleReact={handleReact}
              handleReply={handleReply}
              onDelete={deletePostHandler}
              isOwnPost={post.creatorName === creatorName}
            />
          ))
        )}
      </div>

      {/* Post Creation Popup */}
      {showPostPopup && (
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
            <h3 style={{ marginTop: 0 }}>Create Post</h3>

            <textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '15px'
              }}
            />

            <div style={{ marginTop: 10 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Attach Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setPostImageFile(file);
                    setPostImagePreview(URL.createObjectURL(file));
                  }
                }}
                disabled={submitting}
              />

              {postImagePreview && (
                <img src={postImagePreview} alt="Preview" style={{ width: '100%', marginTop: 8, borderRadius: 6 }} />
              )}

              {postUploadProgress > 0 && postUploadProgress < 100 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 6, background: '#eee', borderRadius: 3 }}>
                    <div style={{ width: `${postUploadProgress}%`, height: '100%', background: '#4CAF50', borderRadius: 3 }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowPostPopup(false);
                  setPostText("");
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
                onClick={submitPost}
                disabled={submitting || !postText.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: submitting || !postText.trim() ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: submitting || !postText.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
