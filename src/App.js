import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './components/login/LoginForm';
import Trial from './components/Trial';
import Navbar from './components/Navbar';
import Inventory from './components/Inventory/Inventory';
import InventoryForm from './components/Inventory/InventoryForm';
import Anouncement from './components/Anouncement/Anouncement';
import MessMenu from './components/MessMenu/MessMenu';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/"; // ✅ Hide Navbar on `/`, show elsewhere

  return (
    <div>
      {showNavbar && <Navbar  />} {/* ✅ Conditionally render Navbar */}
      <div className={showNavbar ? "content" : ""}>
        <Routes>
          {/* <Route path="/" element={<LoginForm />} /> */}
          {/* <Route path="/trial" element={<Trial />} /> */}
          {/* <Route path="/:username" element={<h1>Welcome, User!</h1>} /> */}
          <Route path="/inventory" element={<Inventory/>}/>
          <Route path="/announcement" element={<Anouncement/>}/>
          <Route path="/messmenu" element={<MessMenu/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
