import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CreateStatusReportForm = () => {
  const [statusReport, setStatusReport] = useState({
    scopeRag: '',
    timeRag: '',
    costRag: '',
    percentage: '',
    revisedStart: '',
    revisedEnd: '',
  });

  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStatusReport((prevStatusReport) => ({
      ...prevStatusReport,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Construct the status report data to be sent to the backend
    const statusReportData = {
      ...statusReport,
      date: new Date().toISOString().split('T')[0], // Current date in ISO format, only date part
      project: projectId // Assuming projectId is from the URL params
    };
  
    try {
      const response = await axios.post(`http://localhost:5000/api/reports/${projectId}`, statusReportData);
      // Handle success response
      navigate(`/project-details/${projectId}`); // Navigate to the project details page
    } catch (error) {
      console.error('Error submitting status report:', error);
      // Handle error response
    }
  };
  
  return (
    <div className="container mx-auto p-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Create Status Report for Project {projectId}</h2>
        {/* RAG Status Fields */}
        <div className="flex mb-4">
          {/* Scope RAG */}
          <div className="w-1/3 mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scopeRag">
              Scope RAG
            </label>
            <select
              name="scopeRag"
              value={statusReport.scopeRag}
              onChange={handleInputChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Scope RAG Status</option>
              <option value="Red">Red</option>
              <option value="Amber">Amber</option>
              <option value="Green">Green</option>
            </select>
          </div>

          {/* Time RAG */}
          <div className="w-1/3 mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeRag">
              Time RAG
            </label>
            <select
              name="timeRag"
              value={statusReport.timeRag}
              onChange={handleInputChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Time RAG Status</option>
              <option value="Red">Red</option>
              <option value="Amber">Amber</option>
              <option value="Green">Green</option>
            </select>
          </div>

          {/* Cost RAG */}
          <div className="w-1/3 mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="costRag">
              Cost RAG
            </label>
            <select
              name="costRag"
              value={statusReport.costRag}
              onChange={handleInputChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Cost RAG Status</option>
              <option value="Red">Red</option>
              <option value="Amber">Amber</option>
              <option value="Green">Green</option>
            </select>
          </div>
        </div>


        {/* Second Line: Phase % Complete and Revised Phase Start/End Dates */}
        <div className="flex mb-4">
            <div className="w-1/3 mr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phasePercentageComplete">
                Phase % Complete
                </label>
                <input
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="percentage"
                name="percentage"
                type="text"
                placeholder="Phase % Complete"
                value={statusReport.percentage}
                onChange={handleInputChange}
                />
            </div>
            <div className="w-1/3 mx-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revisedPhaseStart">
                Revised Phase Start Date
                </label>
                <input
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="revisedStart"
                name="revisedStart"
                type="date"
                value={statusReport.revisedStart}
                onChange={handleInputChange}
                />
            </div>
            <div className="w-1/3 ml-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revisedPhaseEnd">
                Revised Phase End Date
                </label>
                <input
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="revisedEnd"
                name="revisedEnd"
                type="date"
                value={statusReport.revisedEnd}
                onChange={handleInputChange}
                />
            </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Status Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStatusReportForm;
