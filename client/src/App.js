import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login'
import Dashboard from './components/dashboard';
import CreateUser from './components/createUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-user" element={<createUser />} />
      </Routes>
    </Router>
  );
}
export default App;
