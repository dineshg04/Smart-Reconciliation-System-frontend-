
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen  flex flex-col">
    
      <Navbar/>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-6xl font-extrabold text-gray-900  mb-6">
            Smart Reconciliation    
            <br />
            <span className="text-indigo-600">& Aduit System</span>
          </h1>

          <p className="text-2xl text-gray-600 mb-10 ">
            Upload your transactions, map columns, reconciliation.
          </p>

          <div className="flex flex-row justify-center gap-5">
            <Link
              to="/uploadfile"
              className=" items-center justify-center px-10 py-5 text-lg font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl "
            >
              Get Started
            </Link>

            
          </div>

         
        </div>
      </main>

      
    </div>
  );
};

export default Home;