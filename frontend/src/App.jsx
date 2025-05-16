import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirect ke login */}
        {/* <Route
          path="*"
          element={<Navigate to="/login" replace />}
        /> */}

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<RegisterPage/>}/>

        <Route path="/home" element={<HomePage/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
