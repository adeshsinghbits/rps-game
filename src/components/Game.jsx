import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playRound, resetGame, updateAIMode } from '../redux/gameSlice';
import rockImg from '../assets/rock.png';
import paperImg from '../assets/paper.png';
import scissorsImg from '../assets/scissors.png';
import sadImg from '../assets/sad.png';
import gameCoins from '../assets/gamecoin.webp';
import { FaRedo, FaUser, FaRobot } from 'react-icons/fa';
import { IoTimeSharp } from 'react-icons/io5';
import { motion } from 'framer-motion';

const icons = {
  rock: rockImg,
  paper: paperImg,
  scissors: scissorsImg,
};

const Game = () => {
  const dispatch = useDispatch();
  const { playerScore, cpuScore, current, coins, streak, achievements, aiMode } = useSelector((state) => state.game);
  const [timeLimit, setTimeLimit] = useState(5);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [lastResult, setLastResult] = useState(null);

  const playAudio = (fileName) => {
    const audio = new Audio(`/audio/${fileName}`);
    audio.play();
  };

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit, current]);

  useEffect(() => {
    if (current.result && current.result !== lastResult) {
      setLastResult(current.result);
      playAudio(`${current.result}.mp3`);
    }
  }, [current.result]);

  useEffect(() => {
    if (achievements.length > 0) {
      playAudio('achievement.mp3');
    }
  }, [achievements]);

  useEffect(() => {
    if (timeLeft <= 0) {
      dispatch(playRound('none'));
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="bg-gray-900 text-white p-4 min-h-screen overflow-y-auto">
      {/* Score and Stats */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 text-sm sm:text-base">
        <div className="bg-slate-500 py-2 px-4 rounded flex items-center gap-2">
          <FaUser /> Player: {playerScore}
        </div>
        <div className="bg-slate-500 py-2 px-4 rounded flex items-center gap-2">
          <FaRobot /> CPU: {cpuScore}
        </div>
        <div className="bg-slate-500 py-2 px-4 rounded flex items-center gap-2">
          <img src={gameCoins} alt="coins" className="w-5" /> Coins: {coins}
        </div>
        <div className="bg-slate-500 py-2 px-4 rounded flex items-center gap-2">
          <IoTimeSharp /> Time Left: {timeLeft}s
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="text-center">
          <label className="mr-2">AI Mode:</label>
          <select
            value={aiMode}
            onChange={(e) => dispatch(updateAIMode(e.target.value))}
            className="bg-gray-800 text-white p-1 rounded"
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="text-center">
          <label className="mr-2">Round Time Limit (1–15s):</label>
          <input
            type="number"
            min={1}
            max={15}
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="bg-gray-800 p-1 rounded w-20 text-center"
          />
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {['rock', 'paper', 'scissors'].map((choice) => (
          <motion.button
            key={choice}
            whileTap={{ scale: 1.1 }}
            onClick={() => dispatch(playRound(choice))}
            className="bg-gray-700 hover:bg-gray-600 p-4 w-24 sm:w-28 rounded-lg shadow"
            disabled={timeLeft === 0}
          >
            <img
              src={icons[choice]}
              alt={choice}
              className="rounded-full w-14 h-14 mx-auto"
            />
          </motion.button>
        ))}
      </div>

      {/* Result Display */}
      {current.result && (
        <motion.div
          key={current.result}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 mb-4">
            <div>
              <p className="mb-1 font-semibold">You chose:</p>
              <img
                src={icons[current.player] || sadImg}
                alt={current.player || 'No choice'}
                className="w-20 h-20 rounded-full border-4 border-green-500 mx-auto"
              />
            </div>
            <div>
              <p className="mb-1 font-semibold">CPU chose:</p>
              <img
                src={icons[current.cpu] || sadImg}
                alt={current.cpu || 'No choice'}
                className="w-20 h-20 rounded-full border-4 border-red-500 mx-auto"
              />
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${
              current.result === 'win'
                ? 'text-green-400'
                : current.result === 'lose'
                ? 'text-red-400'
                : current.result === 'draw'
                ? 'text-yellow-300'
                : 'text-white'
            }`}
          >
            Result: {current.result.toUpperCase()}
          </p>
          <p className="mt-2">
            Streak: {streak.count} {streak.type ? `(${streak.type})` : ''}
          </p>
        </motion.div>
      )}

      {/* Reset Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => dispatch(resetGame())}
          className="bg-red-500 px-4 py-2 rounded flex items-center gap-2 mx-auto"
        >
          <FaRedo /> Reset
        </button>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2 text-center">Achievements</h2>
        <ul className="flex flex-wrap justify-center gap-2">
          {achievements.map((ach, i) => (
            <li key={i} className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">
              {ach}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Game;