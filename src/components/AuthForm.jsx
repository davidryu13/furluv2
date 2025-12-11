// src/components/AuthForm.jsx
import React from "react";

export default function AuthForm({ children, onSubmit }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
