// frontend/src/pages/Home.js
import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [employeeFile, setEmployeeFile] = useState(null);
  const [lastYearFile, setLastYearFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!employeeFile || !lastYearFile) {
      setError("Please upload both files.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('employeeFile', employeeFile);
      formData.append('lastYearFile', lastYearFile);

      const response = await axios.post('http://localhost:5000/api/assign', formData, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Secret_Santa_Assignments.csv';
      a.click();
    } catch (err) {
      setError("Failed to generate assignments.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Secret Santa Generator</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload Employee List</label>
        <input type="file" onChange={(e) => setEmployeeFile(e.target.files[0])} className="w-full border p-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload Last Year Assignments</label>
        <input type="file" onChange={(e) => setLastYearFile(e.target.files[0])} className="w-full border p-2 rounded" />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Generating...' : 'Generate Assignments'}
      </button>
    </div>
  );
};

export default Home;
