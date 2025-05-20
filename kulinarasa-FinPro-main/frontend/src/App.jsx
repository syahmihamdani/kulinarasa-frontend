import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LandingPage from './components/LandingPage';
import CreateRecipePage from './components/CreateRecipePage'
import SavedPage from './components/SavedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/add" element={<CreateRecipePage/>}/>
        <Route path="/saved" element={<SavedPage/>}/> {/* Tambahkan route ini */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
