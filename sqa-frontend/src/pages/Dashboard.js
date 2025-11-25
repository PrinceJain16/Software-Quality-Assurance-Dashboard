import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h2>Welcome to the SQA Dashboard</h2>
      <Link to="/projects">Go to Projects</Link>
    </div>
  );
}
