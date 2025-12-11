import React from "react";

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
}
