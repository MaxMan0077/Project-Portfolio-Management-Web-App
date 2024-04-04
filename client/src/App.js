import React, { useContext, useEffect, useState } from 'react';
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
import { IntlProvider } from 'react-intl';
import { LanguageContext } from './LanguageContext'; // Adjust the import path as necessary
import messagesEN from './locales/en.json';
import messagesUA from './locales/ua.json';

const messages = {
  en: messagesEN,
  ua: messagesUA,
};

function App() {
  const { language } = useContext(LanguageContext);
  const [locale, setLocale] = useState(language); // Initialize with context language

  useEffect(() => {
    setLocale(language); // Update locale whenever context language changes
  }, [language]);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
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
    </IntlProvider>
  );
}
export default App;
