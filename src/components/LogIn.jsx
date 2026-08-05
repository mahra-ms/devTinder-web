import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

function Login() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const extractErrorMessage = (err) => {
    const data = err?.response?.data;
    if (!data) return "Something went wrong. Please try again.";
    if (typeof data === "string") return data;
    if (typeof data === "object")
      return data.message || data.error || JSON.stringify(data);
    return "Something went wrong. Please try again.";
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/logIn`,
        { emailId: email, password },
        { withCredentials: true },
      );
      const user = res.data?.data || res.data?.user || res.data;
      dispatch(addUser(user));
      navigate("/feed");
    } catch (err) {
      console.error("Login error:", err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    if (!firstName || !email || !password) {
      setError("Please fill in first name, email, and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/signUp`,
        { firstName, lastName, emailId: email, password },
        { withCredentials: true },
      );
      const user = res.data?.data || res.data?.user || res.data;
      if (!user) {
        setError("Signup succeeded but no user data was returned.");
        return;
      }
      dispatch(addUser(user));
      navigate("/profile");
    } catch (err) {
      console.error("Signup error:", err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setError("");
    setIsLoginForm(true);
  };
  const switchToSignUp = () => {
    setError("");
    setIsLoginForm(false);
  };

  const fieldClasses =
    "w-full rounded-lg bg-[#1C1F29] border border-[#2A2E3A] px-3.5 py-2.5 text-sm text-[#E7E9EE] placeholder:text-[#565B6B] outline-none focus:border-[#7C6CFF] focus:ring-1 focus:ring-[#7C6CFF] transition-colors";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#0B0D12] px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">
        {/* Terminal window chrome */}
        <div className="rounded-t-2xl bg-[#14161D] border border-[#2A2E3A] border-b-0 px-4 py-3 flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5C7A]/70" />
          <span className="w-3 h-3 rounded-full bg-[#F5C242]/70" />
          <span className="w-3 h-3 rounded-full bg-[#00D6A3]/70" />
          <span className="ml-3 text-xs font-mono text-[#565B6B] truncate">
            ~/devTinder/{isLoginForm ? "login" : "signup"}.sh
          </span>
        </div>

        <div className="bg-[#14161D] border border-[#2A2E3A] rounded-b-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          <div className="flex justify-center mb-6">
            <span className="font-mono text-xl font-medium text-[#E7E9EE]">
              <span className="text-[#7C6CFF]">{"<"}</span>byte.Social
              <span className="text-[#7C6CFF]">{"/>"}</span>
            </span>
          </div>

          <div className="flex mb-6 bg-[#1C1F29] rounded-full p-1">
            <button
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isLoginForm
                  ? "bg-[#7C6CFF] text-white shadow"
                  : "text-[#8A8FA3] hover:text-[#E7E9EE]"
              }`}
              onClick={switchToLogin}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isLoginForm
                  ? "bg-[#7C6CFF] text-white shadow"
                  : "text-[#8A8FA3] hover:text-[#E7E9EE]"
              }`}
              onClick={switchToSignUp}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-center text-[#E7E9EE] mb-1">
            {isLoginForm ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-center text-sm text-[#8A8FA3] mb-6">
            {isLoginForm
              ? "Log in to keep matching"
              : "Find your next merge conflict \u2014 or your match"}
          </p>

          <div className="flex flex-col gap-4">
            {!isLoginForm && (
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex-1">
                  <span className="block text-xs font-medium text-[#8A8FA3] mb-1.5">
                    First name
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    placeholder="John"
                    className={fieldClasses}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="flex-1">
                  <span className="block text-xs font-medium text-[#8A8FA3] mb-1.5">
                    Last name
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Doe"
                    className={fieldClasses}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
            )}

            <label>
              <span className="block text-xs font-medium text-[#8A8FA3] mb-1.5">
                Email
              </span>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                className={fieldClasses}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              <span className="block text-xs font-medium text-[#8A8FA3] mb-1.5">
                Password
              </span>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                className={fieldClasses}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && (
              <p className="text-[#FF5C7A] text-sm text-center bg-[#FF5C7A]/10 border border-[#FF5C7A]/20 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full bg-[#7C6CFF] hover:bg-[#6D5CF0] disabled:opacity-60 text-white font-medium rounded-lg py-2.5 mt-1 shadow-lg shadow-[#7C6CFF]/20 transition-colors"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {loading ? "Please wait…" : isLoginForm ? "Login" : "Sign Up"}
            </button>

            <p
              className="text-center text-sm cursor-pointer mt-1 text-[#8A8FA3] hover:text-[#7C6CFF] transition-colors"
              onClick={() => setIsLoginForm((prev) => !prev)}
            >
              {isLoginForm
                ? "New here? Sign up now"
                : "Already have an account? Login"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
