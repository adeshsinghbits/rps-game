import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Game from './components/Game';
import History from './components/History';
import { IoLogoGameControllerB, IoMdHome } from "react-icons/io";

const App = () => {
  const baseClass = "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300";
  const activeClass = "bg-indigo-600 text-white shadow-md";
  const inactiveClass = "text-gray-400 hover:bg-gray-700 hover:text-white";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur bg-gray-800/50 flex flex-wrap items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex gap-3 mb-2 sm:mb-0">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
          >
            <IoLogoGameControllerB className="text-xl sm:text-2xl" />
            <span className="text-sm sm:text-base font-medium">Game</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
          >
            <IoMdHome className="text-xl sm:text-2xl" />
            <span className="text-sm sm:text-base font-medium">History</span>
          </NavLink>
        </div>
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-center w-full sm:w-auto mt-2 sm:mt-0">
          Rock Paper Scissors
        </h1>
      </nav>

      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  );
};

export default App;