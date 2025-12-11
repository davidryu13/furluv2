import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from "react";
import "../styles/comments.css";


export default function Comment({ comment, onReact, onReply }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMessageConfirm, setShowMessageConfirm] = useState(false);
  const navigate = useNavigate();

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleMessageUser = () => {
    setShowMessageConfirm(false);
    navigate('/message', { state: { user: comment.user } });
  };

  return (
    <>
      <div className="comment">
        {/* Clickable avatar */}
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="comment-avatar"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowMessageConfirm(true)}
          title={`Message ${comment.user.name}`}
        />

        <div
          className="comment-body"
          onClick={() => setShowMessageConfirm(true)}
          style={{ cursor: 'pointer' }}
          title={`Message ${comment.user.name}`}
        >
          <div className="comment-username">{comment.user.name}</div>
          <div>{comment.text}</div>

          <div className="comment-reactions">
            {comment.reactions && Object.entries(comment.reactions).length > 0 ? (
              Object.entries(comment.reactions).map(([reaction, count]) => (
                <div
                  key={reaction}
                  className="comment-reaction-btn"
                  onClick={() => onReact(comment.id, reaction)}
                >
                  {reaction} {count}
                </div>
              ))
            ) : (
              ['👍', '❤️', '😂'].map((r) => (
                <div
                  key={r}
                  className="comment-reaction-btn"
                  onClick={() => onReact(comment.id, r)}
                >
                  {r}
                </div>
              ))
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
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                className="comment-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleReplySubmit();
                  }
                }}
                aria-label="Write a reply"
                autoFocus
              />
              <button
                onClick={handleReplySubmit}
                style={{ marginLeft: '8px', padding: '6px 12px', cursor: 'pointer' }}
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
                  comment={reply}
                  onReact={onReact}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message confirmation popup */}
      {showMessageConfirm && (
        <div
          className="message-confirm-popup"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowMessageConfirm(false)} // close popup on outside click
        >
          <div
            className="message-confirm-content"
            onClick={(e) => e.stopPropagation()} // prevent closing on clicking inside popup
          >
            <p>
              Message <strong>{comment.user.name}</strong>?
            </p>
            <button onClick={handleMessageUser}>Message</button>
            <button onClick={() => setShowMessageConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
