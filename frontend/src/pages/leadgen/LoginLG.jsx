import { useState } from "react"
import { Link } from 'react-router-dom'
import { useLoginLG } from "../../hooks/useLoginLG"

const LoginLG = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // State for password visibility
  const { loginLG, error, isLoading } = useLoginLG()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await loginLG(email, password)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <section className="bg-[#b1b4ba] min-h-screen flex items-center justify-center">
      <div className="bg-[#041926] flex rounded-2xl shadow-lg max-w-3xl p-5 py-5 items-center">
        <div className="md:w-1/2 px-8 md:px-11">
          <img
            src={process.env.PUBLIC_URL + '/logo.png'}
            alt="logo"
            className="image-xl mt-3 rounded cursor-pointer block float-left mr-2"
          />
          <h2 className="font-bold text-3xl text-[#f4f5fd] mt-3">Chromagen</h2>
          <p className="text-xs mt-4 text-[#f4f5fd]">If you are already a member, easily log in</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              className="p-3 mt-8 rounded-xl border"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
            />

            <div className="relative">
              <input
                className="p-3 rounded-xl border w-full"
                type={showPassword ? "text" : "password"} // Toggle input type based on state
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
              />
              <img
                src={process.env.PUBLIC_URL + '/eye.svg'}
                alt="eye"
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility} // Toggle password visibility on click
              />
            </div>
            <button
              disabled={isLoading}
              className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
            >
              Log In
            </button>
            {error && <div className="error">{error}</div>}
          </form>

          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <Link to="/forgot-password">
            <button
              className="bg-[#082f49] py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#f4f5fd]"
            >
              <img src={process.env.PUBLIC_URL + '/lock.png'} alt="google" className="mr-3" />
              Forgot Password?
          </button>
          </Link>

          <div className="mt-5 text-xs border-b border-[#f4f5fd] py-5 text-[#f4f5fd]">
            Create an account with your Team Leader first!
          </div>
        </div>

        <div className="md:block hidden w-1/2 mr-2">
          <img src={process.env.PUBLIC_URL + '/slay.png'} alt="Chromagen Logo" className="rounded-2xl shadow-lg" />
        </div>
      </div>
    </section>
  )
}

export default LoginLG