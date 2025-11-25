import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    technologies: '',
    teamMembers: '',
    metrics: {
      requirement: {},
      design: {},
      implementation: {},
      testing: {},
      deployment: {}
    }
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        const p = res.data;

        setProject({
          ...p,
          startDate: p.startDate ? p.startDate.split('T')[0] : '',
          endDate: p.endDate ? p.endDate.split('T')[0] : '',
          metrics: {
            requirement: p.metrics?.requirement || {},
            design: p.metrics?.design || {},
            implementation: p.metrics?.implementation || {},
            testing: p.metrics?.testing || {},
            deployment: p.metrics?.deployment || {}
          }
        });
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleMetricChange = (phase, field, value) => {
    setProject({
      ...project,
      metrics: {
        ...project.metrics,
        [phase]: {
          ...project.metrics[phase],
          [field]: value // store as number for charts
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, project);
      alert('Project updated successfully!');
      navigate('/projects');
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading project details...</p>;

  const renderField = (label, value, onChange, type = 'text') => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <label style={{ width: '250px', fontWeight: 'bold' }}>{label}:</label>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        style={{
          flex: 1,
          padding: '6px 10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#5c14eb' }}>Edit Project</h2>
      <form onSubmit={handleSubmit}>

        {/* Project Info */}
        <div style={{ marginBottom: '25px', padding: '20px', borderRadius: '10px', background: '#f0f0f0' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Project Information</h3>
          {renderField('Project Name', project.name, (e) => handleChange(e))}
          {renderField('Project Description', project.description, (e) => handleChange(e))}
          {renderField('Start Date', project.startDate, (e) => handleChange(e), 'date')}
          {renderField('End Date', project.endDate, (e) => handleChange(e), 'date')}
          {renderField('Technologies', project.technologies, (e) => handleChange(e))}
          {renderField('Team Members', project.teamMembers, (e) => handleChange(e))}
        </div>

        {/* Requirement Phase */}
        <div style={{ marginBottom: '25px', padding: '20px', borderRadius: '10px', background: '#ffe5e5' }}>
          <h3 style={{ color: '#ff6384', marginBottom: '15px' }}>📘 Requirement Phase Metrics</h3>
          {renderField('Total Requirements', project.metrics.requirement.total, (e) => handleMetricChange('requirement','total', e.target.value))}
          {renderField('Requirements Reviewed', project.metrics.requirement.reviewed, (e) => handleMetricChange('requirement','reviewed', e.target.value))}
          {renderField('Requirements Changed After Approval', project.metrics.requirement.changedAfterApproval, (e) => handleMetricChange('requirement','changedAfterApproval', e.target.value))}
          {renderField('Unclear Requirements', project.metrics.requirement.unclear, (e) => handleMetricChange('requirement','unclear', e.target.value))}
        </div>

        {/* Design Phase */}
        <div style={{ marginBottom: '25px', padding: '20px', borderRadius: '10px', background: '#fff8e5' }}>
          <h3 style={{ color: '#ffb84d', marginBottom: '15px' }}>🎨 Design Phase Metrics</h3>
          {renderField('Total Components', project.metrics.design.totalComponents, (e) => handleMetricChange('design','totalComponents', e.target.value))}
          {renderField('Components Reviewed', project.metrics.design.reviewedComponents, (e) => handleMetricChange('design','reviewedComponents', e.target.value))}
          {renderField('Defective Components', project.metrics.design.defectedComponents, (e) => handleMetricChange('design','defectedComponents', e.target.value))}
        </div>

        {/* Implementation Phase */}
        <div style={{ marginBottom: '25px', padding: '20px', borderRadius: '10px', background: '#e5ffe5' }}>
          <h3 style={{ color: '#28a745', marginBottom: '15px' }}>💻 Implementation Phase Metrics</h3>
          {renderField('Lines of Code', project.metrics.implementation.linesOfCode, (e) => handleMetricChange('implementation','linesOfCode', e.target.value))}
          {renderField('Duplicate Code', project.metrics.implementation.duplicateCode, (e) => handleMetricChange('implementation','duplicateCode', e.target.value))}
          {renderField('Warnings/Errors', project.metrics.implementation.warningsErrors, (e) => handleMetricChange('implementation','warningsErrors', e.target.value))}
        </div>

        {/* Testing Phase */}
        <div style={{ marginBottom: '25px', padding: '20px', borderRadius: '10px', background: '#fff0e5' }}>
          <h3 style={{ color: '#ff7300', marginBottom: '15px' }}>🧪 Testing Phase Metrics</h3>
          {renderField('Total Modules', project.metrics.testing.totalModules, (e) => handleMetricChange('testing','totalModules', e.target.value))}
          {renderField('Modules Tested', project.metrics.testing.modulesTested, (e) => handleMetricChange('testing','modulesTested', e.target.value))}
          {renderField('Total Defects', project.metrics.testing.totalDefects, (e) => handleMetricChange('testing','totalDefects', e.target.value))}
          {renderField('Unit Test Errors', project.metrics.testing.unitErrors, (e) => handleMetricChange('testing','unitErrors', e.target.value))}
          {renderField('Integration Test Errors', project.metrics.testing.integrationErrors, (e) => handleMetricChange('testing','integrationErrors', e.target.value))}
          {renderField('System Test Errors', project.metrics.testing.systemErrors, (e) => handleMetricChange('testing','systemErrors', e.target.value))}
        </div>

        {/* Deployment Phase */}
        <div style={{ marginBottom: '25px', padding: '20px', borderRadius: '10px', background: '#e5f0ff' }}>
          <h3 style={{ color: '#3399ff', marginBottom: '15px' }}>🚀 Deployment & Maintenance Metrics</h3>
          {renderField('Bugs Reported', project.metrics.deployment.productionIssues, (e) => handleMetricChange('deployment','productionIssues', e.target.value))}
          {renderField('Customer Satisfaction Index', project.metrics.deployment.customerSatisfaction, (e) => handleMetricChange('deployment','customerSatisfaction', e.target.value))}
          {renderField('Avg Time To Fix (hrs)', project.metrics.deployment.avgTimeToFix, (e) => handleMetricChange('deployment','avgTimeToFix', e.target.value))}
        </div>

        <button
          type="submit"
          style={{
            background: '#5c14eb',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
