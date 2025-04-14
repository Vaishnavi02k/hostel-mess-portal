import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import LoginForm from './components/login/LoginForm';
import Navbar from './components/Navbar';
import Inventory from './components/Inventory/Inventory';
import InventoryForm from './components/Inventory/InventoryForm';
import Anouncement from './components/Anouncement/Anouncement';
import MessMenu from './components/MessMenu/MessMenu';
import OrderReminder from './components/Reminder/OrderReminder';
import Dashboard from './components/Dashboard/Dashboard';
import AllStudents from './components/AllStudent/AllStudent';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// ✅ Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const storedUsername = localStorage.getItem("username");
  const location = useLocation();
  const currentUsername = location.pathname.split("/")[1];

  // ❌ No username in storage? Send to login
  if (!storedUsername) return <Navigate to="/login" />;

  // ❌ Mismatched user in URL? Force correct one
  if (storedUsername !== currentUsername) {
    return <Navigate to={`/${storedUsername}/dashboard`} />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <div>
      {showNavbar && <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          {/* ✅ Dashboard routes wrapped in protection */}
          <Route
            path="/:username/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:username/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:username/announcements"
            element={
              <ProtectedRoute>
                <Anouncement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:username/messmenu"
            element={
              <ProtectedRoute>
                <MessMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:username/reminder"
            element={
              <ProtectedRoute>
                <OrderReminder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:username/allstudents"
            element={
              <ProtectedRoute>
                <AllStudents />
              </ProtectedRoute>
            }
          />

          {/* ❌ Unknown route fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
