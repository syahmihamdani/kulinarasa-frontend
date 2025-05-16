import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    //
    navigate('/home')
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-kulinarasa-orange flex items-center justify-center"
    >
      <div className="backdrop-blur-sm bg-white/30 p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="p-3 rounded bg-white/50 text-black placeholder-gray-600" />
          <input type="password" placeholder="Password" className="p-3 rounded bg-white/50 text-black placeholder-gray-600" />
          <button type="submit" className="bg-kulinarasa-darkblue hover:bg-gray-800 p-3 rounded text-white font-semibold">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-white/80">
          Don’t have an account? <a href="/register" className="underline text-kulinarasa-darkblue">Register</a>
        </p>
      </div>
    </div>
  )
}
