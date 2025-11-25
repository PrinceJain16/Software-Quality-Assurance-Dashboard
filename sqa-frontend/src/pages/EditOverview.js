import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// Extracted and Memoized Card UI block
const Card = ({ title, bg, children }) => (
  <div
    style={{
      background: bg,
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "25px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ marginBottom: "15px" }}>{title}</h3>
    {children}
  </div>
);

// Extracted and Memoized InputRow component
// FIXES: Focus loss/scroll jump (via React.memo) and leading '0' issue.
const InputRow = React.memo(({ label, value, onChange }) => {
    
    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        // Pass empty string if input is cleared (to store 0 in state)
        if (inputValue === "") {
            onChange("");
            return;
        }

        // Logic to remove unwanted leading zeros (e.g., stops "034")
        if (inputValue.length > 1 && inputValue.startsWith('0')) {
            inputValue = inputValue.replace(/^0+/, '');
            if (inputValue === "") {
                 inputValue = "0"; // Handle case like "000" being cleared down to "0"
            }
        }
        
        onChange(inputValue); 
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <label style={{ width: "260px", fontWeight: "bold" }}>{label}:</label>
        <input
          type="number"
          // Ensure the state value (number) is converted to string for the controlled input
          value={String(value)}
          onChange={handleInputChange}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>
    );
});


export default function EditOverview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [project, setProject] = useState({
    metrics: {
      requirement: {
        total: 0, reviewed: 0, changedAfterApproval: 0, unclear: 0
      },
      design: {
        totalComponents: 0, reviewedComponents: 0, defectiveComponents: 0
      }
    }
  });

  // Fetch project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        // Merge fetched data with default state structure
        setProject(prev => ({
            ...prev,
            ...res.data,
            metrics: {
                ...prev.metrics,
                ...(res.data.metrics || {}),
                requirement: {
                    ...prev.metrics.requirement,
                    ...(res.data.metrics?.requirement || {})
                },
                design: {
                    ...prev.metrics.design,
                    ...(res.data.metrics?.design || {})
                }
            }
        }));
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading…</p>;

  // Helper for updating nested fields
  // Updated to handle the empty string from InputRow correctly
  const updateMetric = (phase, field, value) => {
    setProject((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [phase]: {
          ...prev.metrics[phase],
          // Store 0 if the input is empty (""), otherwise store the parsed number
          [field]: value === "" ? 0 : Number(value)
        }
      }
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, project);
      alert("Overview metrics updated!");
      navigate(`/projects/${id}/edit`);
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        Edit – Requirements & Design
      </h2>

      <form onSubmit={handleSubmit}>

        {/* Requirements Phase */}
        <Card title="📘 Requirements Metrics" bg="#ffe5e5">
          <InputRow
            label="Total Requirements"
            value={project.metrics.requirement.total}
            onChange={(v) => updateMetric("requirement", "total", v)}
          />
          <InputRow
            label="Reviewed Requirements"
            value={project.metrics.requirement.reviewed}
            onChange={(v) => updateMetric("requirement", "reviewed", v)}
          />
          <InputRow
            label="Changed After Approval"
            value={project.metrics.requirement.changedAfterApproval}
            onChange={(v) =>
              updateMetric("requirement", "changedAfterApproval", v)
            }
          />
          <InputRow
            label="Unclear Requirements"
            value={project.metrics.requirement.unclear}
            onChange={(v) => updateMetric("requirement", "unclear", v)}
          />
        </Card>

        {/* Design Phase */}
        <Card title="🎨 Design Metrics" bg="#fff8e5">
          <InputRow
            label="Total Components"
            value={project.metrics.design.totalComponents}
            onChange={(v) => updateMetric("design", "totalComponents", v)}
          />
          <InputRow
            label="Reviewed Components"
            value={project.metrics.design.reviewedComponents}
            onChange={(v) => updateMetric("design", "reviewedComponents", v)}
          />
          <InputRow
            label="Defective Components"
            value={project.metrics.design.defectiveComponents}
            onChange={(v) =>
              updateMetric("design", "defectiveComponents", v)
            }
          />
        </Card>

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#5c14eb",
            color: "white",
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "15px",
          }}
        >
          Save Overview
        </button>
      </form>
    </div>
  );
}