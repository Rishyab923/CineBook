import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../apis/axiosWrapper";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", {
        email: e.target.email.value,
        password: e.target.password.value,
      });

      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-purple-100 via-pink-50 to-white
                    dark:from-gray-900 dark:via-gray-900 dark:to-gray-800
                    transition-colors duration-300">
      <form
        onSubmit={submit}
        className="w-96 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl space-y-5
                   border border-purple-100 dark:border-gray-700
                   shadow-[0_20px_60px_rgba(139,92,246,0.15)]
                   dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                   hover:shadow-[0_25px_80px_rgba(139,92,246,0.2)]
                   dark:hover:shadow-[0_25px_80px_rgba(0,0,0,0.4)]
                   transition-all duration-300"
      >
        <div className="h-1.5 w-20 bg-gradient-to-r from-purple-500 to-pink-500 
                        rounded-full mx-auto"></div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Continue booking your favourites
        </p>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400
                     transition-all duration-200 bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400
                     transition-all duration-200 bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
        />

        <button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500
                     hover:from-purple-700 hover:to-pink-600
                     text-white py-3 rounded-xl font-bold
                     transition-all duration-300 transform hover:-translate-y-0.5
                     shadow-lg shadow-purple-300/40 hover:shadow-xl hover:shadow-purple-400/50"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          New user?{" "}
          <Link to="/signup" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-800 dark:hover:text-purple-300 hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
