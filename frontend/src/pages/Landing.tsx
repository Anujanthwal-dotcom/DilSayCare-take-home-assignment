import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

export default function Landing() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6">
      {/* Hero Section */}
      <div className="max-w-3xl text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <Calendar className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Manage Your Weekly <span className="text-blue-600">Schedule</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Create and manage recurring weekly slots with ease. 
          Add exceptions, update or delete slots anytime — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-6 justify-center">
          <Link
            to="/signup"
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-2xl shadow-md hover:bg-blue-700 transition"
          >
            <span onClick={()=>navigate('/signup')}>Get Started</span>
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border border-blue-600 text-blue-600 font-medium rounded-2xl hover:bg-blue-50 transition"
          >
            <span onClick={()=>navigate('/login')}>Log In</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-20 max-w-4xl">
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md">
          <Clock className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Recurring Slots</h3>
          <p className="text-gray-600">
            Define weekly slots with start and end times. Perfect for meetings, 
            availability, or bookings.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md">
          <Calendar className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Flexible Exceptions</h3>
          <p className="text-gray-600">
            Override recurring slots by editing or deleting them for specific dates. 
            Stay flexible without breaking your schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
