import React, { useEffect, useState } from "react";
import axios from 'axios';
import Navbar from './navbar';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useIntl } from 'react-intl';
import { useLanguage } from '../LanguageContext';

export default function Dashboard() {
    const [isFadingIn, setIsFadingIn] = useState(false);
    const [projects, setProjects] = useState([]);
    const [totalExpenditure, setTotalExpenditure] = useState(0);
    const { language } = useLanguage();
    const phaseOrder = ["Funnel", "Review & Evaluation", "Business Case Development", "In Implementation", "Closed"];
    const complexityOrder = ["low", "medium", "high"];
    const [photos, setPhotos] = useState({});
    const [names, setNames] = useState({});
    const [ragStatuses, setRagStatuses] = useState({});
    const [chartKey, setChartKey] = useState(Date.now());
    const intl = useIntl();
    const t = (id) => intl.formatMessage({ id });
    const [totalProjects, setTotalProjects] = useState(0);

    // Hardcoded total budget
    const totalBudget = 10000000;
    const PHASE_COLORS = ['#FCDA0D', '#F99B21', '#FF4B3D', '#9DB0AC', '#000000'];
    const REGION_COLORS = ['#9DB0AC', '#C69C02', '#F99B21', '#9E0B00'];
    const COMPLEXITY_COLORS = ['#00B51B', '#F8B800', '#E52800'];


    useEffect(() => {
      setIsFadingIn(true);
      const fetchProjects = async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/projects/getall');
          const fetchedProjects = response.data;
          console.log(response);
          setProjects(fetchedProjects);
          setTotalExpenditure(fetchedProjects.reduce((acc, project) => acc + project.budget_approved, 0));
          setTotalProjects(fetchedProjects.length);
          setChartKey(Date.now());
        } catch (err) {
          console.error('Error fetching projects:', err);
        }
      };
      fetchProjects();
    }, [language]);

    useEffect(() => {
      const fetchPhoto = async (resourceId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/resources/photo/${resourceId}`);
            // Assuming the endpoint returns a base64 string directly
            const base64Filename = response.data; // If the response structure is different, adjust this line accordingly
            const decodedFilename = atob(base64Filename); // Use atob for Base64 decoding
            return `http://localhost:5001/uploads/${decodedFilename}`;
        } catch (error) {
            console.error(`Error fetching photo for resource ID ${resourceId}:`, error);
            return 'https://via.placeholder.com/150'; // Placeholder photo URL
        }
      };    

      const fetchNames = async (resourceId) => {
        try {
          const response = await axios.get(`http://localhost:5001/api/resources/resourceNames/${resourceId}`);
          // Assuming your endpoint sends back an object with first and last names
          const { firstName, lastName } = response.data;
          return `${firstName} ${lastName}`;
        } catch (error) {
          console.error(`Error fetching name for resource ID ${resourceId}:`, error);
          return 'Unknown'; // Fallback name
        }
      };
      
      const fetchLatestRAGStatus = async (projectId) => {
        try {
          const response = await axios.get(`http://localhost:5001/api/reports/latestRAGStatus/${projectId}`);
          // Accessing the RAG status directly from the response.data
          const { cost_rag, scope_rag, time_rag } = response.data;
          return { cost_rag, scope_rag, time_rag }; // Returns the RAG status for the project
        } catch (error) {
          console.error(`Error fetching latest RAG status for project ID ${projectId}:`, error);
          return { scope_rag: 'unknown', time_rag: 'unknown', cost_rag: 'unknown' }; // Default values in case of error
        }
      };      
    
      const fetchActiveProjectsAndResources = async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/projects/getActiveProjects');
          const activeProjects = response.data;
      
          // Only fetch additional details for active projects without overriding the projects state
          const additionalDetailsPromises = activeProjects.flatMap(project => [
            fetchPhoto(project.business_owner).then(photoUrl => ({ ['photo_' + project.business_owner]: photoUrl })),
            fetchPhoto(project.project_manager).then(photoUrl => ({ ['photo_' + project.project_manager]: photoUrl })),
            fetchNames(project.business_owner).then(name => ({ ['name_' + project.business_owner]: name })),
            fetchNames(project.project_manager).then(name => ({ ['name_' + project.project_manager]: name })),
            fetchLatestRAGStatus(project.idproject).then(ragStatus => ({ ['rag_' + project.idproject]: ragStatus }))
          ]);
      
          const combinedResults = await Promise.all(additionalDetailsPromises);
      
          // Process combined results and update relevant states without modifying the projects state
          let photosObj = {}, namesObj = {}, ragStatusesObj = {};
          combinedResults.forEach(result => {
            const key = Object.keys(result)[0];
            if (key.startsWith('photo_')) {
              photosObj[key] = result[key];
            } else if (key.startsWith('name_')) {
              namesObj[key] = result[key];
            } else if (key.startsWith('rag_')) {
              ragStatusesObj[key] = result[key];
            }
          });
      
          // Update state
          setPhotos(photosObj);
          setNames(namesObj);
          setRagStatuses(ragStatusesObj);
        } catch (error) {
          console.error('Error fetching additional details for active projects:', error);
        }
      };      
      fetchActiveProjectsAndResources();
    }, []);

    const getActiveProjectsCount = () => {
      return projects.filter(project => project.phase === "In Implementation").length;
    }; 

    const formatBudget = (budget) => {
      let value = budget;
      let suffix = '';
    
      // Determine the suffix and divide value accordingly
      if (budget >= 1_000_000) {
        value = budget / 1_000_000;
        suffix = 'M';
      } else if (budget >= 1000) {
        value = budget / 1000;
        suffix = 'K';
      }
    
      // Format the number to have only three significant figures
      let formattedValue = Number(value.toPrecision(3));
    
      // Return formatted string with suffix
      return `$${formattedValue}${suffix}`;
    };    

    // Function to transform data into chart format
    const generateChartData = (projects, key) => {
      const groupBy = projects.reduce((acc, project) => {
        const keyValue = project[key];
        if (!acc[keyValue]) {
          acc[keyValue] = { name: keyValue, value: 0 };
        }
        acc[keyValue].value += 1;
        return acc;
      }, {});
      return Object.values(groupBy);
    };

    const getProjectsByPhase = (phase) => {
        return projects.filter(project => project.phase === phase);
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };
    
    const sortData = (data, order) => {
      return data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
    };
    // Correcting the sorting and use of sorted data
    const dataByPhaseSorted = sortData(generateChartData(projects, 'phase'), phaseOrder);
    const dataByLocation = generateChartData(projects, 'location');
    const dataByComplexitySorted = sortData(generateChartData(projects, 'complexity'), complexityOrder);


    const CustomLegend = ({ data, colors }) => (
      <div className="legend flex flex-col justify-center">
          {data.map((entry, index) => (
              <div key={index} className="flex items-center mb-1">
                  <div className="w-3 h-3 mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                  <div className="text-sm">{t(entry.name)}</div>
              </div>
          ))}
      </div>
  );    

    const renderCustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
          return (
              <div className="custom-tooltip bg-white p-2 shadow rounded">
                  <p className="label">{`${t(payload[0].name)}: ${payload[0].value}`}</p>
              </div>
          );
      }
      return null;
    };
          
    const renderPieChart = (data, name, colors) => (
      <div className="p-4" style={{ width: "420px" }}>
          <div className="bg-white rounded shadow flex p-4 justify-start items-center">
              <div>
                  <h3 className="font-bold text-xl mb-4 text-center">{t(name)}</h3>
                  <PieChart key={chartKey} width={200} height={200}>
                      <Pie
                          dataKey="value"
                          data={data}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={50}
                          fill="#8884d8"
                          isAnimationActive={true}
                          animationDuration={1300}
                          label={name === 'Phase' ? (props) => renderCustomLabel(props, totalProjects) : undefined}
                          labelLine={false}
                      >
                          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
                      </Pie>
                      <Tooltip content={renderCustomTooltip} />
                  </PieChart>
              </div>
              <div className="ml-1 mt-14">
                  <CustomLegend data={data} colors={colors} />
              </div>
          </div>
      </div>
    );  

    const renderCustomLabel = ({ cx, cy }, total) => (
      <text x={cx} y={cy} fill="#333" fontSize="42" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
        {total}
      </text>
    );

    return (
        <>
          <Navbar />
          <div className={`transition-opacity duration-2000 mt-4 ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Flex container for all content */}
            <div className="flex flex-col md:flex-row justify-around items-stretch">
              <div className="flex flex-row flex-wrap justify-around md:flex-nowrap md:w-1/2 lg:w-2/5 xl:w-1/3">
                <div className="flex-1 min-w-0 rounded shadow p-4 m-2 flex flex-col justify-center items-center">
                  <div className="text-gray-500 text-md font-semibold">{t('active_projects')}</div>
                  <div className="text-3xl font-bold">{getActiveProjectsCount()}</div>
                </div>
                <div className="flex-1 min-w-0 rounded shadow p-4 m-2 flex flex-col justify-center items-center">
                  <div className="text-gray-500 text-md font-semibold">{t('total_budget')}</div>
                  <div className="text-3xl font-bold">{`$${totalBudget.toLocaleString()}`}</div>
                </div>
                <div className="flex-1 min-w-0 rounded shadow p-4 m-2 flex flex-col justify-center items-center">
                  <div className="text-gray-500 text-md font-semibold">{t('total_expenditure')}</div>
                  <div className="text-3xl font-bold">{`$${totalExpenditure.toLocaleString()}`}</div>
                </div>
              </div>
              <div className="flex flex-wrap justify-around">
                {renderPieChart(dataByPhaseSorted, 'Phase', PHASE_COLORS)}
                {renderPieChart(dataByLocation, 'Region', REGION_COLORS)}
                {renderPieChart(dataByComplexitySorted, 'Complexity', COMPLEXITY_COLORS)}
              </div>
            </div>
            <div className="mt-1 px-5">
              {/* Header "Active Projects" */}
              <div className="text-left mb-5">
                <h2 className="text-3xl font-bold">{t('active_projects')}</h2>
              </div>
              <div style={{ maxHeight: 'calc(60px * 8)', overflowY: 'auto' }}>
                <table className="min-w-full leading-normal w-full">
                  <thead className="sticky top-0 text-white bg-blue-500 text-left text-sm">
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('project_name')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider text-center">{t('status')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('business_owner')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('project_manager')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('phase_timeline')}</th>
                      {/* Placeholder Columns */}
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider text-center">{t('scope')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider text-center">{t('time')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider text-center">{t('cost')}</th>
                      {/* Budget Column */}
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('budget')} USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getProjectsByPhase("In Implementation").length > 0 ? (
                      getProjectsByPhase("In Implementation").map((project, index) => {
                        const rag = ragStatuses[`rag_${project.idproject}`] || {};
                        const statusColor = {
                          'Red': 'bg-red-500',
                          'Amber': 'bg-yellow-500',
                          'Green': 'bg-green-500'
                        }[project.status] || 'bg-gray-500'; // Default color if status is unknown

                        return (
                          <tr key={index} className={`cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200`}>
                            <td className="px-5 py-2 border-b border-gray-200">{project.name}</td>
                            <td className="px-5 py-2 border-b border-gray-200 text-center">
                              <span className={`inline-block w-4 h-4 rounded-full ${statusColor}`} />
                            </td>
                            <td className="px-5 py-2 border-b border-gray-200">
                              <div className="flex items-center">
                                <img src={photos[`photo_${project.business_owner}`] || 'https://via.placeholder.com/150'} alt="Business Owner" className="h-7 w-7 rounded-full" />
                                <span className="ml-3">{names[`name_${project.business_owner}`] || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-5 py-2 border-b border-gray-200">
                              <div className="flex items-center">
                                <img src={photos[`photo_${project.project_manager}`] || 'https://via.placeholder.com/150'} alt="Project Manager" className="h-7 w-7 rounded-full" />
                                <span className="ml-3">{names[`name_${project.project_manager}`] || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-5 py-2 border-b border-gray-200">
                              {`${formatDate(project.phase_start)} - ${formatDate(project.phase_end)}`}
                            </td>
                            <td className="px-5 py-2 border-b border-gray-200 text-center">
                              <span className={`inline-block w-4 h-4 rounded-full ${
                                rag.scope_rag === 'Red' ? 'bg-red-500' : 
                                rag.scope_rag === 'Amber' ? 'bg-yellow-500' : 
                                rag.scope_rag === 'Green' ? 'bg-green-500' : 
                                'bg-gray-500'}`} />
                            </td>
                            <td className="px-5 py-2 border-b border-gray-200 text-center">
                              <span className={`inline-block w-4 h-4 rounded-full ${
                                rag.time_rag === 'Red' ? 'bg-red-500' : 
                                rag.time_rag === 'Amber' ? 'bg-yellow-500' : 
                                rag.time_rag === 'Green' ? 'bg-green-500' : 
                                'bg-gray-500'}`} />
                            </td>
                            <td className="px-5 py-2 border-b border-gray-200 text-center">
                              <span className={`inline-block w-4 h-4 rounded-full ${
                                rag.cost_rag === 'Red' ? 'bg-red-500' : 
                                rag.cost_rag === 'Amber' ? 'bg-yellow-500' : 
                                rag.cost_rag === 'Green' ? 'bg-green-500' : 
                                'bg-gray-500'}`} />
                            </td>
                            <td className="px-5 py-2 border-b border-gray-200">{formatBudget(project.budget_approved)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center px-5 py-5 border-b border-gray-200 text-lg font-bold">{t('no_projects_in_phase')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      );               
}