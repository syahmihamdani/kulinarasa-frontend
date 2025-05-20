import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const queryParams = new URLSearchParams({
        email: formData.email,
        password: formData.password
      }).toString()
      
      const response = await fetch(`http://localhost:3000/user/login?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (!data.success) {
        setError(data.message || 'Invalid email or password')
        setLoading(false)
        return
      }
      
      // If login successful, store user data in localStorage for session management
      localStorage.setItem('user', JSON.stringify(data.payload))
      
      // Redirect to home page
      navigate('/home')
    } catch (err) {
      setError('An error occurred during login. Please try again.')
      console.error('Login error:', err)
      setLoading(false)
    }
  }

  const handleContinueAsGuest = (e) => {
    e.preventDefault();
    navigate('/home'); // Langsung ke home tanpa login
  };

  return (
    <div className="min-h-screen bg-cover bg-[url(https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)] bg-center flex items-center justify-center">
      <div className="backdrop-blur-sm bg-kulinarasa-orange/30 p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl mb-6 text-center font-kulinarasa">Login</h2>
        
        {error && (
          <div className="bg-red-500/70 p-3 rounded-md mb-4 text-white text-center">
            {error}
          </div>
        )}
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email" 
            className="p-3 rounded bg-white/50 text-black placeholder-gray-600" 
            required
          />
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password" 
            className="p-3 rounded bg-white/50 text-black placeholder-gray-600" 
            required
          />
          <button 
            type="submit" 
            className="bg-kulinarasa-darkblue hover:bg-gray-800 p-3 rounded text-white font-semibold flex justify-center"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button 
            onClick={handleContinueAsGuest}
            className="bg-kulinarasa-brown hover:bg-kulinarasa-orange p-3 rounded text-white font-semibold flex justify-center"
          >
            Continue as Guest
          </button>
        </form>
        <p className="mt-4 text-center text-white/80">
          Don't have an account? <a href="/register" className="underline text-kulinarasa-darkblue">Register</a>
        </p>
      </div>
    </div>
  )
}