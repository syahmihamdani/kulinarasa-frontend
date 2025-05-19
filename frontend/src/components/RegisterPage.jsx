import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    //fetch
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cover bg-[url(https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)] bg-center flex items-center justify-center">
      <div className="backdrop-blur-sm bg-kulinarasa-orange/30 p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" className="p-3 rounded bg-white/50 text-black placeholder-gray-600" />
          <input type="email" placeholder="Email" className="p-3 rounded bg-white/50 text-black placeholder-gray-600" />
          <input type="password" placeholder="Password" className="p-3 rounded bg-white/50 text-black placeholder-gray-600" />
          <button type="submit" className="bg-kulinarasa-darkblue hover:bg-gray-900 p-3 rounded text-white font-semibold">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-white/80">
          Already have an account? <a href="/login" className="underline text-kulinarasa-darkblue">Login</a>
        </p>
      </div>
    </div>
  )
}
