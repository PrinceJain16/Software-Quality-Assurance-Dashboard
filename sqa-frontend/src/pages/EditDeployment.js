import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// Extracted and memoized Card component (unchanged)
const Card = ({ title, icon, children }) => (
  <div
    style={{
      background: "#e5f0ff",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "25px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ marginBottom: "15px", color: "#3399ff" }}>
      {icon} {title}
    </h3>
    {children}
  </div>
);

// Extracted and memoized Input component (unchanged)
const Input = React.memo(({ label, value, field, onChange }) => {
    
    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        if (inputValue === "") {
            onChange("");
            return;
        }

        if (inputValue.length > 1 && inputValue.startsWith('0')) {
            inputValue = inputValue.replace(/^0+/, '');
            if (inputValue === "") {
                 inputValue = "0";
            }
        }
        
        onChange(inputValue); 
    };
    
    const displayLabel = label.replace(/([A-Z])/g, " $1");

    return (
      <div style={{ display: "flex", marginBottom: "12px", alignItems: "center" }}>
        <label style={{ width: "280px", fontWeight: "bold" }}>
          {displayLabel}
        </label>
        <input
          type="number"
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


export default function EditDeployment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deployment, setDeployment] = useState({
    bugsReported: 0,
    bugsResolved: 0,
    avgTimeToResolve: 0,
    deploymentFailures: 0,
    rollbackCount: 0,
    downtimeHours: 0,
    uptimePercentage: 0,
    customerTickets: 0,
    customerSatisfactionScore: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        
        // FIX: Access the nested 'deployment' object correctly from 'metrics'
        const fetchedDeployment = res.data?.metrics?.deployment; 

        if (fetchedDeployment) {
          // Merge fetched data with default state structure
          setDeployment(prev => ({
              ...prev,
              ...fetchedDeployment // Use the correctly accessed object
          }));
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setDeployment((prev) => ({
      ...prev,
      [field]: value === "" ? 0 : Number(value),
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/projects/${id}`, { metrics: { deployment } });
      alert("Deployment metrics updated!");
      navigate(`/projects/${id}/edit`);
    } catch (err) {
      console.error(err);
      alert("Failed to update deployment data");
    }
  };

  if (loading) return <p>Loading...</p>;

  const renderInput = (field) => (
    <Input
        key={field} // Added key for consistency
        label={field}
        field={field}
        value={deployment[field]}
        onChange={(v) => handleChange(field, v)}
    />
  );

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#3399ff",
        }}
      >
        🚀 Edit Deployment & Maintenance Metrics
      </h2>

      <Card title="Deployment Performance" icon="📦">
        {renderInput("bugsReported")}
        {renderInput("bugsResolved")}
        {renderInput("avgTimeToResolve")}
        {renderInput("deploymentFailures")}
        {renderInput("rollbackCount")}
      </Card>

      <Card title="System Uptime & Stability" icon="🖥️">
        {renderInput("downtimeHours")}
        {renderInput("uptimePercentage")}
      </Card>

      <Card title="Customer Feedback" icon="💬">
        {renderInput("customerTickets")}
        {renderInput("customerSatisfactionScore")}
      </Card>

      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "14px",
          background: "#3399ff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        💾 Save Deployment Metrics
      </button>
    </div>
  );
}