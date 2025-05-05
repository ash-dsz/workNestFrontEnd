import React from 'react';
import { useParams } from 'react-router-dom';

const EmployeeProfile = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Employee profile component for ID: {id} - To be implemented</p>
      </div>
    </div>
  );
};

export default EmployeeProfile;