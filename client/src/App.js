import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login'
import Dashboard from './components/dashboard';
import UserCreate from './components/UserCreate';
import CreateProject from './components/createProject';
import UserOverview from './components/userOverview';
import ProjectsOverview from './components/projectsOverview'; 
import Kanban from './components/kanban';
import ProjectDetails from './components/projectDetails'
import CreateStatusReport from './components/createReport';
import Roadmap from './components/roadmap';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-overview" element={<UserOverview />} />
        <Route path="/create-user" element={<UserCreate />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/projects-overview" element={<ProjectsOverview />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/project-details/:projectId" element={<ProjectDetails />} />
        <Route path="/project/:projectId/create-status-report" element={<CreateStatusReport />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </Router>
  );
}
export default App;
