import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { useIntl } from 'react-intl';

const CreateStatusReportForm = () => {
  const { formatMessage } = useIntl();
  const t = (id) => formatMessage({ id });
  const [statusReport, setStatusReport] = useState({
    date: '',
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
  
    const statusReportData = {
      ...statusReport,
      project: projectId
    };
  
    try {
      const response = await axios.post(`http://localhost:5001/api/reports/${projectId}`, statusReportData);
      // Handle success response
      navigate(`/project-details/${projectId}`); // Navigate to the project details page
    } catch (error) {
      console.error('Error submitting status report:', error);
      // Handle error response
    }
  };

  const handleCancel = () => {
    navigate(`/project-details/${projectId}`);
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">{t('create_status_report_for_project')} {projectId}</h2>
          
          {/* First row of inputs including the date */}
          <div className="flex mb-4">
            {/* Date Field */}
            <div className="w-1/3 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                {t('date')}
              </label>
              <input
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="date"
                name="date"
                type="date"
                value={statusReport.date}
                onChange={handleInputChange}
              />
            </div>
  
            {/* Placeholder for alignment */}
            <div className="w-1/3 mx-2"></div>
            <div className="w-1/3 ml-2"></div>
          </div>
  
          {/* RAG Status Fields */}
          <div className="flex mb-4">
            {/* Scope RAG */}
            <div className="w-1/3 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scopeRag">
                {t('scope_rag')}
              </label>
              <select
                name="scopeRag"
                value={statusReport.scopeRag}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">{t('select_scope_rag_status')}</option>
                <option value="Red">{t('red')}</option>
                <option value="Amber">{t('amber')}</option>
                <option value="Green">{t('green')}</option>
              </select>
            </div>
  
            {/* Time RAG */}
            <div className="w-1/3 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeRag">
                {t('time_rag')}
              </label>
              <select
                name="timeRag"
                value={statusReport.timeRag}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">{t('select_time_rag_status')}</option>
                <option value="Red">{t('red')}</option>
                <option value="Amber">{t('amber')}</option>
                <option value="Green">{t('green')}</option>
              </select>
            </div>
  
            {/* Cost RAG */}
            <div className="w-1/3 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="costRag">
                {t('cost_rag')}
              </label>
              <select
                name="costRag"
                value={statusReport.costRag}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">{t('select_cost_rag_status')}</option>
                <option value="Red">{t('red')}</option>
                <option value="Amber">{t('amber')}</option>
                <option value="Green">{t('green')}</option>
              </select>
            </div>
          </div>
  
          {/* Second Line: Phase % Complete and Revised Phase Start/End Dates */}
          <div className="flex mb-4">
            <div className="w-1/3 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="percentage">
                {t('phase_percentage_complete')}
              </label>
              <input
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="percentage"
                name="percentage"
                type="text"
                placeholder={t('phase_percentage_complete_placeholder')}
                value={statusReport.percentage}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/3 mx-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revisedStart">
                {t('revised_phase_start_date')}
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revisedEnd">
                {t('revised_phase_end_date')}
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
  
          {/* Submit and Cancel Buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {t('save')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </>
  );  
};

export default CreateStatusReportForm;
