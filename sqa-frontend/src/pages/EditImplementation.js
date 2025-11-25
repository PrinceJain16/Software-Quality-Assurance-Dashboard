import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// ----------------------------------------------------
// 1. Memoized Input Component
// FIX 1: Prevents re-render, focus loss, and scroll jump.
// FIX 2: Handles the leading '0' issue by cleaning the input value.
// ----------------------------------------------------
const Input = React.memo(({ label, field, value, onChange }) => {
    
    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        // If the input is completely cleared, pass an empty string
        if (inputValue === "") {
            onChange("");
            return;
        }

        // Logic to prevent unwanted leading zeros (e.g., stops "034")
        // Checks if the input starts with one or more '0' followed by a digit
        // And if the entire value isn't just "0" itself (allowing "0" as a single value)
        if (inputValue.length > 1 && inputValue.startsWith('0')) {
            // Use regex to remove all leading zeros, allowing only one if the value is 0
            inputValue = inputValue.replace(/^0+/, '');
            if (inputValue === "") {
                 inputValue = "0"; // If all we had was "000", reset to "0"
            }
        }
        
        onChange(inputValue); 
    };

    return (
      <div style={{ display: "flex", marginBottom: "10px", alignItems: "center" }}>
        <label style={{ width: "260px", fontWeight: "bold" }}>{label}</label>
        <input
          type="number"
          // Convert the state value (number) to a string for the input field
          value={String(value)} 
          onChange={handleInputChange}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #bbb",
            borderRadius: "6px",
          }}
        />
      </div>
    );
});


// ----------------------------------------------------
// 2. Card Component (Unchanged)
// ----------------------------------------------------
const Card = ({ title, children }) => (
  <div
    style={{
      background: "#e5ffe5",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "25px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ marginBottom: "15px", color: "#28a745" }}>{title}</h3>
    {children}
  </div>
);


// ----------------------------------------------------
// 3. Main Component
// ----------------------------------------------------
export default function EditImplementation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // Initial state for project metrics
  const [project, setProject] = useState({
    metrics: {
      implementation: {
        n1: 0, n2: 0, N1: 0, N2: 0,
        bugs: 0, codeQualityScore: 0, commentsPercentage: 0, duplicateCode: 0,
        warnings: 0, errors: 0, cyclomaticComplexity: 0, codingStandardViolations: 0
      }
    }
  });

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
                ...res.data.metrics,
                implementation: {
                    ...prev.metrics.implementation,
                    ...(res.data.metrics?.implementation || {})
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

  if (loading) return <p style={{ textAlign: "center", marginTop: "30px" }}>Loading...</p>;

  // This function updates the state. It converts empty string to 0 for storage.
  const updateMetric = (field, value) => {
    setProject((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        implementation: {
          ...prev.metrics.implementation,
          // Store 0 if the input is empty (""), otherwise store the parsed number
          [field]: value === "" ? 0 : Number(value)
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, {
        metrics: {
          ...project.metrics,
          implementation: project.metrics.implementation
        }
      });
      alert("Implementation metrics updated!");
      navigate(`/projects/${id}/edit`);
    } catch (error) {
      console.error(error);
      alert("Failed to update.");
    }
  };

  // Helper function to dynamically pass props to the memoized Input
  const renderInput = (label, field) => (
    <Input
      key={field} // Add key for stability, though React.memo is the main fix
      label={label}
      field={field}
      // Pass the specific value from state
      value={project.metrics.implementation[field]}
      // Pass the updateMetric function as the onChange handler
      onChange={(value) => updateMetric(field, value)}
    />
  );


  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Implementation Metrics</h2>

      <form onSubmit={handleSubmit}>

        <Card title="🟢 Halstead Metrics">
          {renderInput("n1 (Distinct Operators)", "n1")}
          {renderInput("n2 (Distinct Operands)", "n2")}
          {renderInput("N1 (Total Operators)", "N1")}
          {renderInput("N2 (Total Operands)", "N2")}
        </Card>

        <Card title="🟢 Code Quality Metrics">
          {renderInput("Bugs Found", "bugs")}
          {renderInput("Code Quality Score (1–10)", "codeQualityScore")}
          {renderInput("Comments (% of Code)", "commentsPercentage")}
          {renderInput("Duplicate Code", "duplicateCode")}
        </Card>

        <Card title="🟢 Compilation & Complexity Metrics">
          {renderInput("Warnings", "warnings")}
          {renderInput("Errors", "errors")}
          {renderInput("Cyclomatic Complexity", "cyclomaticComplexity")}
          {renderInput("Coding Standard Violations", "codingStandardViolations")}
        </Card>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Save Implementation Details
        </button>

      </form>
    </div>
  );
}