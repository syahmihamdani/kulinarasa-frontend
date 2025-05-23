import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LandingPage from './components/LandingPage';
import CreateRecipePage from './components/CreateRecipePage'
import RecipePage from './components/RecipePage';
import ProfilePage from './components/ProfilePage'
import SavedPage from './components/SavedPage';
import SearchResults from './components/SearchResultsPage'
import EditRecipe from './components/EditRecipePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/add" element={<CreateRecipePage />} />
        <Route path="/recipe/:id" element={<RecipePage />}/>
        <Route path="/profile/:id" element={<ProfilePage />}/>
        <Route path="/saved" element={<SavedPage />}/>
        <Route path="/search/:q" element={<SearchResults />} />
        <Route path="/recipe/edit/:id" element={<EditRecipe />} />

        
      </Routes>

    </BrowserRouter>
  )
}

export default App
