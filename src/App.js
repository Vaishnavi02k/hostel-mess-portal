import './App.css';
// import { Button, Flex } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/login/LoginForm';
import Trial from './components/Trial';

function App() {
  return (
    <Router> {/* ✅ Wrap everything inside Router */}
      <div>
        {/* <div>Helloo</div> */}
        {/* <Button type="primary">Primary Button</Button> */}
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/trial" element={<Trial />} />
          <Route path="/:username" element={<h1>Welcome!</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
