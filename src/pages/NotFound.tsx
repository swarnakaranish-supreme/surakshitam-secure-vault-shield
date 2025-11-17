import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h2 className="text-2xl font-bold">404 — Page not found</h2>
      <p className="mt-4"><Link to="/" className="text-blue-600">Go home</Link></p>
    </div>
  );
}
