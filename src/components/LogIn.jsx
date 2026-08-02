import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL }from "../utils/constants"

function LogIn() {
  const [email, setEmail] = useState("hulk@avenger.com");
  const [password, setPassword] = useState("Hulk@123");
  const  dispatch = useDispatch()
  const navigate = useNavigate()
  const [Err, setError]= useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/logIn",
        {
          emailId: email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res.data))
      return navigate("/")
    } catch (err) {
      setError(err.response?.data || "something went Wrong")
      
    }
  };
  return (
    <div
      data-theme="greenroom"
      className="flex items-center justify-center min-h-screen bg-base-100 p-4"
    >
      <style>{`
        [data-theme="greenroom"] {
          --color-base-100: #E7EBDF;
          --color-base-200: #F3F5EC;
          --color-base-300: #FBFBF6;
          --color-base-content: #1F2A22;
          --color-neutral: #28402F;
          --color-neutral-content: #FBFBF6;
          --color-primary: #28402F;
          --color-primary-content: #FBFBF6;
          --color-error: #B3453D;
          --color-error-content: #FBFBF6;
        }
      `}</style>
      <div className="card card-side bg-base-300 shadow-xl overflow-hidden max-w-4xl w-full">
        {/* Rectangle Image */}
        <figure className="w-100 h-[480px] hidden md:block">
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.4DvdfTyTJsP10bST3HPsAAHaDt?r=0&w=1200&h=600&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </figure>

        {/* Form Section */}
        <div className="card-body flex items-center justify-center">
          <form
            onSubmit={handleLogin}
            className="fieldset bg-base-200 border border-base-300 rounded-box w-full max-w-sm p-6"
          >
            <h2 className="text-2xl font-bold text-center ">Login</h2>

            {/* Email */}
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                className="input validator w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Fixed height prevents growing */}
              <div className="h-1 mt-1">
                <p className="validator-hint text-error text-sm">
                  Enter a valid email address
                </p>
              </div>
            </fieldset>

            {/* Password */}
            <fieldset className="fieldset">
              <label className="label">Password</label>
              <input
                type="password"
                className="input validator w-full"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />

              <div className="h-5 mt-1">
                <p className="validator-hint text-error text-sm">
                  Password must be at least 6 characters
                </p>
              </div>
            </fieldset>

            {/* Buttons */}
            <p className="text-red-500">{Err}</p>
            <button className="btn btn-neutral mt-4 w-full" type="submit">
              Login
            </button>

            <button className="btn btn-ghost mt-2 w-full" type="reset">
              Reset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
