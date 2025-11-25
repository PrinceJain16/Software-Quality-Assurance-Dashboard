import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditHub() {
  const navigate = useNavigate();
  const { id } = useParams();

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    margin: "12px 0",
    fontSize: "18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#5c14eb",
    color: "white",
    fontWeight: "bold",
    transition: "0.3s ease",
  };

  const backButton = {
    padding: "12px 20px",
    marginBottom: "20px",
    background: "#ff5c5c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #edcdc6ff 0%, #a0f2e9ff 100%)",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "35px",
          background: "rgba(238, 241, 218, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          textAlign: "center",
          animation: "fadeIn 0.5s ease",
        }}
      >
        {/* Back Button */}
        <button
          style={backButton}
          onMouseEnter={(e) => (e.target.style.background = "#cc3b3b")}
          onMouseLeave={(e) => (e.target.style.background = "#ff5c5c")}
          onClick={() => navigate("/projects")}
        >
          ⬅ Back to Projects
        </button>

        <h2
          style={{
            marginBottom: "25px",
            color: "#5c14eb",
            fontSize: "26px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Edit Project Phases
        </h2>

        {/* Phase Buttons */}
        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.background = "#4911b3")}
          onMouseLeave={(e) => (e.target.style.background = "#5c14eb")}
          onClick={() => navigate(`/projects/${id}/edit/overview`)}
        >
          📘 Requirement & Design Phase
        </button>

        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.background = "#4911b3")}
          onMouseLeave={(e) => (e.target.style.background = "#5c14eb")}
          onClick={() => navigate(`/projects/${id}/edit/implementation`)}
        >
          💻 Implementation Phase
        </button>

        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.background = "#4911b3")}
          onMouseLeave={(e) => (e.target.style.background = "#5c14eb")}
          onClick={() => navigate(`/projects/${id}/edit/testing`)}
        >
          🧪 Testing Phase
        </button>

        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.background = "#4911b3")}
          onMouseLeave={(e) => (e.target.style.background = "#5c14eb")}
          onClick={() => navigate(`/projects/${id}/edit/deployment`)}
        >
          🚀 Deployment & Maintenance
        </button>
      </div>
    </div>
  );
}
