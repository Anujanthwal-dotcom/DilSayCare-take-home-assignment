import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import BASE from "../utils/api";
import axios from "axios";

const Auth = ({mode}:{mode:string}) => {
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Password strength checker
  const validatePassword = (pwd: string): string[] => {
    const errs: string[] = [];
    if (pwd.length < 8) errs.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(pwd)) errs.push("Must include an uppercase letter.");
    if (!/[a-z]/.test(pwd)) errs.push("Must include a lowercase letter.");
    if (!/[0-9]/.test(pwd)) errs.push("Must include a number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
      errs.push("Must include a special character.");
    return errs;
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(isSignup){
        const validationErrors = validatePassword(password);
        if (password !== confirmPassword) {
            validationErrors.push("Passwords do not match.");
        }
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const res = await axios.post(`${BASE}/api/v1/users/register`, {
                username,
                email,
                password,
            });

            if(res.data){
                navigate('/login');
            }
        }
        catch(err:any){
            if(err.response && err.response.data && err.response.data.message){
                setErrors([err.response.data.message]);
            }
            else{
                setErrors(["An unexpected error occurred. Please try again."]);
            }
        }
    }
    else if(isLogin){
        const validationErrors = validatePassword(password);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const res = await axios.post(`${BASE}/api/v1/users/login`, {
                email,
                password,
            });
            if(res.status === 200){
                // Save token to localStorage
                localStorage.setItem('token', res.data.token);
                navigate('/schedules');
            }
        }
        catch(err:any){
            if(err.response && err.response.data && err.response.data.message){
                setErrors([err.response.data.message]);
            }
            else{
                setErrors(["An unexpected error occurred. Please try again."]);
            }
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : isSignup ? "Sign Up" : "Invalid Mode"}
        </h1>

        {(isLogin || isSignup) && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Signup only: Username */}
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirm password only for signup */}
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {/* Error messages */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>
        )}

        {/* Switch link */}
        <p className="text-sm text-gray-600 text-center mt-6">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
