import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    api.get(`/projects/${id}`).then(res => setProject(res.data));
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
      <h3>Members:</h3>
      <ul>
        {project.members.map(m => (
          <li key={m._id}>
            {m.name} ({m.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
