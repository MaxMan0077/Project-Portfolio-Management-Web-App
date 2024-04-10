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
    const [chartKey, setChartKey] = useState(Date.now());
    const intl = useIntl();
    const t = (id) => intl.formatMessage({ id });
    const [totalProjects, setTotalProjects] = useState(0);

    // Hardcoded total budget
    const totalBudget = 100000; // Example figure
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4A4A4'];

    useEffect(() => {
      setIsFadingIn(true);
      const fetchProjects = async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/projects/getall');
          const fetchedProjects = response.data;
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
        
      const fetchActiveProjectsAndResources = async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/projects/getActiveProjects');
          const activeProjects = response.data;
          setProjects(activeProjects);
    
          // Fetching photos
          const photoPromises = activeProjects.flatMap(project => [
              fetchPhoto(project.business_owner).then(photoUrl => ({ [project.business_owner]: photoUrl })),
              fetchPhoto(project.project_manager).then(photoUrl => ({ [project.project_manager]: photoUrl }))
          ]);
    
          // Fetching names
          const namePromises = activeProjects.flatMap(project => [
              fetchNames(project.business_owner).then(name => ({ [project.business_owner]: name })),
              fetchNames(project.project_manager).then(name => ({ [project.project_manager]: name }))
          ]);
    
          // Resolve all promises
          const photosArray = await Promise.all(photoPromises);
          const namesArray = await Promise.all(namePromises);
    
          // Combine results into objects
          const photosObj = photosArray.reduce((acc, current) => ({ ...acc, ...current }), {});
          const namesObj = namesArray.reduce((acc, current) => ({ ...acc, ...current }), {});
    
          // Update states
          setPhotos(photosObj);
          setNames(namesObj);
        } catch (error) {
          console.error('Error fetching active projects and resources:', error);
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


    const CustomLegend = ({ data }) => (
      <div className="legend flex flex-col justify-center">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center mb-1">
            <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <div className="text-sm">{entry.name}</div>
          </div>
        ))}
      </div>
    );
          
    const renderPieChart = (data, name) => (
      <div className="p-4" style={{ width: "420px" }}>
        <div className="bg-white rounded shadow flex p-4 justify-start items-center">
          <div>
            <h3 className="font-bold text-xl mb-4 text-center">{name}</h3>
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
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className="ml-1 mt-14">
            <CustomLegend data={data} />
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
                {renderPieChart(dataByPhaseSorted, 'Phase')}
                {renderPieChart(dataByLocation, 'Region')}
                {renderPieChart(dataByComplexitySorted, 'Complexity')}
              </div>
            </div>
            <div className="mt-1 px-5">
              {/* Header "Active Projects" */}
              <div className="text-left mb-5">
                <h2 className="text-3xl font-bold">{t('active_projects')}</h2>
              </div>
              <div style={{ maxHeight: 'calc(60px * 7)', overflowY: 'auto' }}>
                <table className="min-w-full leading-normal w-full">
                  <thead className="sticky top-0 text-white bg-blue-500 text-left text-sm">
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('project_name')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('status')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('business_owner')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('project_manager')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('phase_timeline')}</th>
                      {/* Placeholder Columns */}
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">R1</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">R2</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">R3</th>
                      {/* Budget Column */}
                      <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('budget_approved')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getProjectsByPhase("In Implementation").length > 0 ? (
                      getProjectsByPhase("In Implementation").map((project, index) => (
                        <tr key={index} className={`cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200`}>
                          <td className="px-5 py-2 border-b border-gray-200">{project.name}</td>
                          <td className="px-5 py-2 border-b border-gray-200">{project.status}</td>
                          <td className="px-5 py-2 border-b border-gray-200">
                            <div className="flex items-center">
                              <img src={photos[project.business_owner] || 'https://via.placeholder.com/150'} alt="Business Owner" className="h-7 w-7 rounded-full" />
                              <span className="ml-3">{names[project.business_owner] || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-5 py-2 border-b border-gray-200">
                            <div className="flex items-center">
                              <img src={photos[project.project_manager] || 'https://via.placeholder.com/150'} alt="Project Manager" className="h-7 w-7 rounded-full" />
                              <span className="ml-3">{names[project.project_manager] || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-5 py-2 border-b border-gray-200">
                            {`${formatDate(project.phase_start)} - ${formatDate(project.phase_end)}`}
                          </td>
                          {/* Placeholder Columns */}
                          <td className="px-5 py-2 border-b border-gray-200"></td>
                          <td className="px-5 py-2 border-b border-gray-200"></td>
                          <td className="px-5 py-2 border-b border-gray-200"></td>
                          {/* Budget Column */}
                          <td className="px-5 py-2 border-b border-gray-200">{formatBudget(project.budget_approved)}</td>
                        </tr>
                      ))
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