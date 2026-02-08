import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import api from '../api/axiosapi';

const Register = () => {
   

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {

    try{
      
      const res = await api.post("auth/register", {name, email, password });

       localStorage.setItem('authtoken',res.data.accesstoken);

      console.log("successfully Registered!",res.data);
     navigate("/home");
    }catch(error){
      console.log("Error in Registering:",error);
    }
  };

  return (
    <>
    <div className='flex w-screen h-screen justify-center items-center'>
            <div className="py-6 px-6 h-3/4 rounded-4xl  shadow-2xl shadow-gray-700 bg-gray-200">
                <h1 className="text-3xl font-sans py-3 font-bold text-center">Register</h1>
                <input className="focus:bg-amber-50 focus:outline-none hover:bg-gray-400 border-none rounded-2xl pl-7 py-3 w-full my-5" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <input className="focus:bg-amber-50 focus:outline-none hover:bg-gray-400 border-none rounded-2xl pl-7 py-3 w-full my-5" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input className="focus:bg-amber-50 focus:outline-none hover:bg-gray-400 border-none rounded-2xl pl-7 py-3 w-full my-5" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleRegister} className="bg-indigo-500 hover:bg-indigo-600  text-white text-2xl rounded-3xl font-bold py-3 mb-1 p-2 w-full">Sign up</button>
                 <p className=" text-center  ">Already have an account? <Link to="/login" className="text-indigo-500  hover:text-black">Login here</Link></p>  
            </div>
      </div>
    
    </>
  )
}

export default Register