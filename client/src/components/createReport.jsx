import React, {useState, useEffect } from 'react';
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
  const [projectName, setProjectName] = useState('');
  const [errors, setErrors] = useState({});

  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/projects/name/${projectId}`);
        console.log(response);
        setProjectName(response.data.projectName);
      } catch (error) {
        console.error('Error fetching project name:', error);
      }
    };

    fetchProjectName();
  }, [projectId]); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStatusReport(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const newErrors = validateAllInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);  // Update the errors state with new errors
      console.error('Validation errors:', newErrors);
      return;  // Prevent form submission if errors exist
    }
  
    // Form data is valid here, so proceed with the API call
    const statusReportData = {
      ...statusReport,
      project: projectId
    };
  
    try {
      const response = await axios.post(`http://localhost:5001/api/reports/${projectId}`, statusReportData);
      navigate(`/project-details/${projectId}`);  // Navigate to the project details page
    } catch (error) {
      console.error('Error submitting status report:', error);
    }
  };  
  
  const validateAllInputs = () => {
    let newErrors = {};
  
    // Check the date field
    if (!statusReport.date) {
      newErrors.date = '*Date is required.';
    }
  
    // Check RAG status fields
    ['scopeRag', 'timeRag', 'costRag'].forEach(field => {
      if (!statusReport[field]) {
        let fieldName = field.replace('Rag', ' RAG'); // Prepare field name for display
        fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        newErrors[field] = `*${fieldName} is required.`;
      }
    });
  
    // Check the percentage field
    if (!statusReport.percentage) {
      newErrors.percentage = 'Percentage Complete is required.';
    } else if (/^0[0-9].*$/.test(statusReport.percentage)) {
      newErrors.percentage = '*Percentage cannot start with zero.';
    } else if (isNaN(statusReport.percentage) || parseInt(statusReport.percentage) < 0 || parseInt(statusReport.percentage) > 100) {
      newErrors.percentage = 'Percentage must be a number between 0 and 100.';
    }
  
    // Check the start and end dates for not being empty and validation
    if (!statusReport.revisedStart) {
      newErrors.revisedStart = '*Start date is required.';
    }
  
    if (!statusReport.revisedEnd) {
      newErrors.revisedEnd = '*End date is required.';
    } else if (statusReport.revisedStart && new Date(statusReport.revisedStart) >= new Date(statusReport.revisedEnd)) {
      newErrors.revisedEnd = '*End date must be after the start date.';
    }
  
    return newErrors;
  };  

  const handleCancel = () => {
    navigate(`/project-details/${projectId}`);
  };

  // Dynamically set input class based on errors
  const inputClass = (key) => `shadow border ${errors[key] ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">{t('create_status_report_for_project')} - {projectName || projectId}</h2>
          
          {/* Date Field */}
          <div className="flex mb-4">
            <div style={{ width: 'calc(33.666667% - 1rem)' }}>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                {t('date')}
              </label>
              <input
                className={inputClass('date')}
                id="date"
                name="date"
                type="date"
                value={statusReport.date}
                onChange={handleInputChange}
              />
              {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}
            </div>
          </div>

          {/* RAG Status Fields */}
          <div className="flex mb-4">
            <div className="w-1/3 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scopeRag">
                {t('scope_rag')}
              </label>
              <select
                className={inputClass('scopeRag')}
                name="scopeRag"
                onChange={handleInputChange}
                value={statusReport.scopeRag}
              >
                <option value="">{t('select_scope_rag_status')}</option>
                <option value="Red">{t('red')}</option>
                <option value="Amber">{t('amber')}</option>
                <option value="Green">{t('green')}</option>
              </select>
              {errors.scopeRag && <p className="text-red-500 text-xs italic">{errors.scopeRag}</p>}
            </div>

            <div className="w-1/3 mx-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeRag">
                {t('time_rag')}
              </label>
              <select
                className={inputClass('timeRag')}
                name="timeRag"
                onChange={handleInputChange}
                value={statusReport.timeRag}
              >
                <option value="">{t('select_time_rag_status')}</option>
                <option value="Red">{t('red')}</option>
                <option value="Amber">{t('amber')}</option>
                <option value="Green">{t('green')}</option>
              </select>
              {errors.timeRag && <p className="text-red-500 text-xs italic">{errors.timeRag}</p>}
            </div>

            <div className="w-1/3 ml-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="costRag">
                {t('cost_rag')}
              </label>
              <select
                className={inputClass('costRag')}
                name="costRag"
                onChange={handleInputChange}
                value={statusReport.costRag}
              >
                <option value="">{t('select_cost_rag_status')}</option>
                <option value="Red">{t('red')}</option>
                <option value="Amber">{t('amber')}</option>
                <option value="Green">{t('green')}</option>
              </select>
              {errors.costRag && <p className="text-red-500 text-xs italic">{errors.costRag}</p>}
            </div>
          </div>

          {/* Percentage Complete and Revised Phase Start/End Dates */}
          <div className="flex mb-4">
            <div className="w-1/3 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="percentage">
                {t('phase_percentage_complete')}
              </label>
              <input
                className={inputClass('percentage')}
                id="percentage"
                name="percentage"
                type="text"
                placeholder={t('phase_percentage_complete_placeholder')}
                value={statusReport.percentage}
                onChange={handleInputChange}
              />
              {errors.percentage && <p className="text-red-500 text-xs italic">{errors.percentage}</p>}
            </div>

            <div className="w-1/3 mx-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revisedStart">
                {t('revised_phase_start_date')}
              </label>
              <input
                className={inputClass('revisedStart')}
                id="revisedStart"
                name="revisedStart"
                type="date"
                value={statusReport.revisedStart}
                onChange={handleInputChange}
              />
              {errors.revisedStart && <p className="text-red-500 text-xs italic">{errors.revisedStart}</p>}
            </div>

            <div className="w-1/3 ml-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revisedEnd">
                {t('revised_phase_end_date')}
              </label>
              <input
                className={inputClass('revisedEnd')}
                id="revisedEnd"
                name="revisedEnd"
                type="date"
                value={statusReport.revisedEnd}
                onChange={handleInputChange}
              />
              {errors.revisedEnd && <p className="text-red-500 text-xs italic">{errors.revisedEnd}</p>}
            </div>
          </div>
          {/* Submit and Cancel Buttons */}
          <div className="bg-gray-50 px-4 pt-3 sm:flex sm:flex-row-reverse">
            {/* Submit Button */}
            <button
              type="submit"
              className="w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              {t('save')}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              style={{ textDecoration: 'none' }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
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
