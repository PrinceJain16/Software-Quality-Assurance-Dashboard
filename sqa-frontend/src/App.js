import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import ProjectDashboard from './pages/ProjectDashboard'
import EditHub from './pages/EditHub';
import EditOverview from './pages/EditOverview';
import EditImplementation from './pages/EditImplementation';
import EditTesting from './pages/EditTesting';
import EditDeployment from './pages/EditDeployment';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

         
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute><Projects /></ProtectedRoute>
          } />


          <Route path="/projects/new" element={
            <ProtectedRoute><NewProject /></ProtectedRoute>
          } />

          <Route path="/projects/:id" element={
            <ProtectedRoute><ProjectDashboard /></ProtectedRoute>
          } />

          <Route path="/projects/:id/edit" element={
            <ProtectedRoute><EditHub /></ProtectedRoute>
          } />

          <Route path="/projects/:id/edit/overview" element={
            <ProtectedRoute><EditOverview /></ProtectedRoute>
          } />
          <Route path="/projects/:id/edit/implementation" element={
            <ProtectedRoute><EditImplementation /></ProtectedRoute>
          } />
          <Route path="/projects/:id/edit/testing" element={
            <ProtectedRoute><EditTesting /></ProtectedRoute>
          } />
          <Route path="/projects/:id/edit/deployment" element={
            <ProtectedRoute><EditDeployment /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
