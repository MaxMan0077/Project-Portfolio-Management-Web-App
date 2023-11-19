import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login'
import Dashboard from './components/dashboard';
import UserCreate from './components/UserCreate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-user" element={<UserCreate />} />
      </Routes>
    </Router>
  );
}
export default App;
