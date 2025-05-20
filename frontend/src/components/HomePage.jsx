import { useEffect, useState } from 'react'
import { Home, Search, PlusCircle, Bookmark, LogOut } from "lucide-react";
import Navbar from './elements/Navbar'

export default function HomePage() {
  const [recipes, setRecipes] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch('http://localhost:3000/recipe/public')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        if (data.success && Array.isArray(data.payload)) {
          setRecipes(data.payload)
        } else {
          console.error("Invalid response format:", data)
        }
      })
      .catch(err => console.error('Error fetching recipes', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No public recipes available.</p>
        ) : (
          recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
              <img
                src={recipe.image_url || '/placeholder.jpg'}
                alt={recipe.name}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="mt-2 text-xl text-kulinarasa-darkblue font-semibold">{recipe.name}</h3>
              <p className="text-sm text-gray-600">{recipe.caption?.slice(0, 100)}...</p>
              <p className="text-xs text-gray-400 mt-2">by {recipe.author_name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
