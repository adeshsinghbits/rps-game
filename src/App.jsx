import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Game from './components/Game';
import History from './components/History';
import { IoLogoGameControllerB,  IoMdHome} from "react-icons/io";

const App = () => {
  // Define active and inactive class styles for NavLink
  const baseClass = "flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-300";
  const activeClass = "bg-indigo-600 text-white shadow-lg";
  const inactiveClass = "text-gray-400 hover:bg-gray-700 hover:text-white";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="sticky top-0 left-0 right-0 backdrop-blur flex gap-6  px-4 text-lg border-b border-gray-700 py-4 ">
        <NavLink
          to="/"
          end
          className={({ isActive }) => 
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <IoLogoGameControllerB className="text-2xl" />
          <span className="font-semibold">Game</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <IoMdHome className="text-2xl" />
          History
        </NavLink>
        <h1 className="text-4xl font-bold mx-auto">Rock Paper Scissors</h1>
      </nav>

      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  );
};

export default App;
