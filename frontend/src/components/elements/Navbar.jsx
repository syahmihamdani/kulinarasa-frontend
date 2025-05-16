function Navbar() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">Kulinarasa</h1>
        <div className="space-x-4">
          <a href="/" className="text-gray-700 hover:text-orange-500">Home</a>
          <a href="/add" className="text-gray-700 hover:text-orange-500">Add Recipe</a>
          <a href="/saved" className="text-gray-700 hover:text-orange-500">Saved</a>
          <a href="/login" className="text-gray-700 hover:text-orange-500">Logout</a>
        </div>
      </nav>
      </div>
  )
}

export default Navbar
