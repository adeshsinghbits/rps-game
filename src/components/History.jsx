import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import rockImg from '../assets/rock.png';
import paperImg from '../assets/paper.png';
import scissorsImg from '../assets/scissors.png';
import sadImg from '../assets/sad.png'; 
import { IoTime } from "react-icons/io5";
import { FaUser,FaAward, FaRobot } from "react-icons/fa";

const icons = {
  rock: rockImg,
  paper: paperImg,
  scissors: scissorsImg,
};

const History = () => {
  const history = useSelector((state) => state.game.history);

  const renderChoice = (choice) => (
    <div className="flex items-center gap-2 capitalize">
      <img
        src={icons[choice] || sadImg}
        alt={choice || 'none'}
        className="w-8 h-8 rounded-full border"
      />
      <span>{choice || 'none'}</span>
    </div>
  );

  const rowVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        type: 'spring',
        stiffness: 100,
      },
    }),
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4 text-center">Game History</h1>
      <div className="overflow-auto max-h-[60vh] rounded-lg shadow border border-gray-600">
        <table className="w-full text-left text-sm table-auto">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">
                <IoTime className="inline mr-2" />Timestamp</th>
              <th className="px-4 py-2">
                <FaUser className="inline mr-2" />Player</th>
              <th className="px-4 py-2">
                <FaRobot className="inline mr-2" />CPU</th>
              <th className="px-4 py-2">
                <FaAward className="inline mr-2" />Result</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No game history yet.
                </td>
              </tr>
            ) : (
              history
                .slice()
                .reverse()
                .map(({ time, player, cpu, result }, i) => (
                  <motion.tr
                    key={i}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="odd:bg-gray-800 even:bg-gray-700"
                  >
                    <td className="px-4 py-2">{new Date(time).toLocaleString()}</td>
                    <td className="px-4 py-2">{renderChoice(player)}</td>
                    <td className="px-4 py-2">{renderChoice(cpu)}</td>
                    <td
                      className={`px-4 py-2 font-semibold capitalize ${
                        result === 'win'
                          ? 'text-green-400'
                          : result === 'lose'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {result}
                    </td>
                  </motion.tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default History;
