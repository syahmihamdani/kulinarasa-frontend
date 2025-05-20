import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
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
        name: formData.name,
        email: formData.email,
        password: formData.password
      }).toString()
      
      const response = await fetch(`http://localhost:3000/user/register/?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (!data.success) {
        setError(data.message || 'Registration failed')
        setLoading(false)
        return
      }
      
      navigate('/login')
    } catch (err) {
      setError('An error occurred during registration. Please try again.')
      console.error('Registration error:', err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-[url(https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)] bg-center flex items-center justify-center">
      <div className="backdrop-blur-sm bg-kulinarasa-orange/30 p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl mb-6 text-center font-kulinarasa">Register</h2>
        
        {error && (
          <div className="bg-red-500/70 p-3 rounded-md mb-4 text-white text-center">
            {error}
          </div>
        )}
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name" 
            className="p-3 rounded bg-white/50 text-black placeholder-gray-600"
            required
          />
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
          <div className="text-xs text-white/80 -mt-2">
            Password must be at least 8 characters long and include a number and special character
          </div>
          <button 
            type="submit" 
            className="bg-kulinarasa-darkblue hover:bg-gray-900 p-3 rounded text-white font-semibold flex justify-center"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-white/80">
          Already have an account? <a href="/login" className="underline text-kulinarasa-darkblue">Login</a>
        </p>
      </div>
    </div>
  )
}