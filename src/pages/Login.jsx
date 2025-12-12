import { useState } from "react";
import { toast } from "react-toastify";
// NOTE: Assuming firebase.config is at src/firebase/firebase.config.js or .jsx
import { auth, googleProvider } from "../firebase/firebase.config.js"; 
import { signInWithPopup } from "firebase/auth";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Added useAuth to use the new login function

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Use context-provided login function
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      if (data?.token) {
        // Use the context login function which handles token storage and redirection
        login(data.token); 
      } else toast.error("Login failed! Check credentials.");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed! Try again.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const res = await API.post("/auth/google-login", {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        uid: user.uid,
      });
      if (res.data?.token) {
        // Use the context login function for Google login token as well
        login(res.data.token);
      } else toast.error("Google Login failed! Try again.");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err.response?.data?.message || "Google Login Failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="max-w-md w-full bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-200 text-center mb-6">
          Login to StyleDecor
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input fields remain the same */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full input input-bordered"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full input input-bordered"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider my-6 text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn w-full btn-outline border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2 bg-white text-gray-700"
          disabled={loading}
        >
          {/* Google SVG */}
          <svg aria-label="Google logo" width="16" height="16" viewBox="0 0 512 512">
            <g>
              <path d="M0 0H512V512H0" fill="#fff"></path>
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
            </g>
          </svg>
          Continue with Google
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline font-medium">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}