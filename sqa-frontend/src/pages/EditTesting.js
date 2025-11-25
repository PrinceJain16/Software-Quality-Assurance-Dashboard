import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// Extracted and Memoized Card component
const Card = ({ title, icon, children }) => (
  <div
    style={{
      background: "#fff0e5",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "25px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ marginBottom: "15px", color: "#ff7300" }}>
      {icon} {title}
    </h3>
    {children}
  </div>
);

// Extracted and Memoized Input component
// FIXES: Focus loss/scroll jump (via React.memo) and leading '0' issue.
const Input = React.memo(({ label, value, onChange }) => {
    
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
    
    // The label is generated from the field key using your existing logic
    const displayLabel = label.replace(/([A-Z])/g, " $1");

    return (
      <div style={{ display: "flex", marginBottom: "12px", alignItems: "center" }}>
        <label style={{ width: "260px", fontWeight: "bold" }}>
          {displayLabel}
        </label>
        <input
          type="number"
          // Ensure the state value (number) is converted to string for the controlled input
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


export default function EditTesting() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [testing, setTesting] = useState({
    unit: {
      totalModules: 0,
      modulesTested: 0,
      modulesPassed: 0,
      unitDefects: 0,
    },
    integration: {
      integratedModules: 0,
      integrationsTested: 0,
      integrationsPassed: 0,
      integrationDefects: 0,
      interfaceFailures: 0,
    },
    system: {
      functionalDefects: 0,
      securityVulnerabilities: 0,
      loadCapacity: 0,
      maxConcurrentUsers: 0,
      uptimePercentage: 0,
      responseTime: 0,
      performanceIssues: 0,
    },
    uat: {
      alphaTestUsers: 0,
      alphaIssues: 0,
      betaTestUsers: 0,
      betaIssues: 0,
      clientApprovalScore: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  // Inside EditTesting.js useEffect
useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await api.get(`/projects/${id}`);
            
            // Access the nested metrics.testing object
            const fetchedTesting = res.data?.metrics?.testing; 

            if (fetchedTesting) {
                // Safely merge the fetched data with the initial state structure
                setTesting(prev => ({
                    // Use fetchedTesting directly to overwrite the top-level keys 
                    // of 'unit', 'integration', etc., then ensure deep merging.
                    ...prev,
                    unit: { ...prev.unit, ...(fetchedTesting.unit || {}) },
                    integration: { ...prev.integration, ...(fetchedTesting.integration || {}) },
                    system: { ...prev.system, ...(fetchedTesting.system || {}) },
                    uat: { ...prev.uat, ...(fetchedTesting.uat || {}) },
                }));
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };
    fetchData();
}, [id]);

  // Updated handleChange to handle empty string input correctly
  const handleChange = (section, field, value) => {
    setTesting((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        // Store 0 if the input is empty (""), otherwise store the parsed number
        [field]: value === "" ? 0 : Number(value),
      },
    }));
  };

  const handleSave = async () => {
      try {
        await api.put(`/projects/${id}`, {
          metrics: {
            testing
          }
        });

        alert("Testing metrics updated!");
        navigate(`/projects/${id}/edit`);

      } catch (err) {
        console.error(err);
        alert("Failed to update testing data");
      }
    };


  if (loading) return <p>Loading...</p>;
  
  // Helper function to render the memoized Input component
  const renderInput = (section, key, value) => (
    <Input
        key={key}
        label={key}
        value={value}
        onChange={(v) => handleChange(section, key, v)}
    />
  );


  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#ff7300" }}>
        🧪 Edit Testing Phase
      </h2>

      {/* UNIT TESTING */}
      <Card title="Unit Testing" icon="📘">
        {Object.entries(testing.unit).map(([key, value]) => (
          renderInput("unit", key, value)
        ))}
      </Card>

      {/* INTEGRATION TESTING */}
      <Card title="Integration Testing" icon="🔗">
        {Object.entries(testing.integration).map(([key, value]) => (
          renderInput("integration", key, value)
        ))}
      </Card>

      {/* SYSTEM TESTING */}
      <Card title="System Testing" icon="🖥️">
        {Object.entries(testing.system).map(([key, value]) => (
          renderInput("system", key, value)
        ))}
      </Card>

      {/* UAT TESTING */}
      <Card title="User Acceptance Testing (UAT)" icon="👥">
        {Object.entries(testing.uat).map(([key, value]) => (
          renderInput("uat", key, value)
        ))}
      </Card>

      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "14px",
          background: "#ff7300",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "15px",
        }}
      >
        💾 Save Testing Metrics
      </button>
    </div>
  );
}