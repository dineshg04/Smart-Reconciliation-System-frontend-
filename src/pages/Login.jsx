import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import api from '../api/axiosapi';

const Login = () => {
   

    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {

    try{
      const res = await api.post("/api/auth/login", { email, password });

      localStorage.setItem('authtoken',res.data.token);

      console.log("successfully logged in!",res.data);
      navigate("/");
    }catch(error){
      console.log("Error in Registering:",error);
    }
  };

  return (
    <>
    <div className='flex  w-screen h-screen justify-center items-center'>
            <div className="py-6 px-6 h-2/3 rounded-4xl  bg-gray-200 shadow-2xl shadow-gray-700">
                <h1 className="text-3xl font-sans py-3 font-bold text-center">Login</h1>
                <input className="hover:bg-gray-400 border-none rounded-2xl pl-7 py-3 w-full my-5  " placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input className="hover:bg-gray-400 border-none rounded-2xl pl-7 py-3 w-full my-5" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin} className="bg-indigo-500 hover:bg-indigo-600  text-white text-2xl rounded-3xl font-bold py-3 my-5 p-2 w-full">Sign in</button>
                 <p className=" text-center ">New User ! Create an account? <Link to="/register" className="text-indigo-500  hover:text-black">Register here</Link></p>  
            </div>
    </div>
    
    </>
  )
}

export default Login