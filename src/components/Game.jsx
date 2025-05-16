import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playRound, resetGame, updateAIMode } from '../redux/gameSlice';
import rockImg from '../assets/rock.png';
import paperImg from '../assets/paper.png';
import scissorsImg from '../assets/scissors.png';
import sadImg from '../assets/sad.png';
import gameCoins from '../assets/gamecoin.webp';
import { FaRedo } from 'react-icons/fa';
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
      if (current.result === 'win') playAudio('win.mp3');
      else if (current.result === 'lose') playAudio('lose.mp3');
      else if (current.result === 'draw') playAudio('draw.mp3');
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
    <div  className="bg-gray-900 text-white p-4 h-screen">
      <div className="flex justify-between text-xl mb-4">
        <div className="bg-slate-500 py-2 px-4 rounded">Player: {playerScore}</div>
        <div className="bg-slate-500 py-2 px-4 rounded">CPU: {cpuScore}</div>
        <div className="bg-slate-500 py-2 px-4 rounded" >Coins: <img src={gameCoins} alt="" className="w-6 inline-block"/>  {coins}</div>
        <div className="bg-slate-500 py-2 px-4 rounded">Time Left: {timeLeft}s</div>
      </div>

      <div className="flex justify-between">
        <div className=" text-center mb-4">
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

      <div className="mb-4 text-center">
        <label className="mr-2">Round Time Limit (1–15s):</label>
        <input
          type="number"
          min={1}
          max={15}
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="bg-gray-800 p-1 rounded w-16 text-center inline-block"
        />
        </div>
      </div>

      <div className="flex justify-center gap-6 mb-6">
        {['rock', 'paper', 'scissors'].map((choice) => (
          <motion.button
            key={choice}
            whileTap={{ scale: 1.1 }}
            onClick={() => dispatch(playRound(choice))}
            className="bg-gray-700 hover:bg-gray-600 p-4 w-28 rounded-lg shadow"
            disabled={timeLeft === 0}
          >
            <img
              src={icons[choice]}
              alt={choice || 'choice'}
              className="rounded-full w-16 h-16 mx-auto"
            />
          </motion.button>
        ))}
      </div>

      {current.result && (
        <motion.div
          key={current.result}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="flex justify-center items-center gap-6 mb-4">
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

          <p>
            Streak: {streak.count} {streak.type ? `(${streak.type})` : ''}
          </p>
        </motion.div>
      )}

      <div className="text-center mb-6">
        <button
          onClick={() => dispatch(resetGame())}
          className="bg-red-500 px-4 py-2 rounded flex items-center gap-2 mx-auto"
        >
          <FaRedo /> Reset
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Achievements</h2>
        <ul className="flex gap-2 flex-wrap">
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
