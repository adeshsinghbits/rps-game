import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playerScore: 0,
  cpuScore: 0,
  coins: 0,
  streak: { count: 0, type: null },
  achievements: [],
  aiMode: 'easy',
  history: [],
  current: {},
};

const choices = ['rock', 'paper', 'scissors'];

function cpuChoice(aiMode, lastPlayer) {
  if (aiMode === 'easy') {
    return choices[Math.floor(Math.random() * choices.length)];
  }
  if (aiMode === 'normal') {
    // 50% random, 50% counter player's last move
    if (Math.random() > 0.5 && lastPlayer) {
      if (lastPlayer === 'rock') return 'paper';
      if (lastPlayer === 'paper') return 'scissors';
      if (lastPlayer === 'scissors') return 'rock';
    }
    return choices[Math.floor(Math.random() * choices.length)];
  }
  if (aiMode === 'hard') {
    // Always counter player's last move
    if (lastPlayer === 'rock') return 'paper';
    if (lastPlayer === 'paper') return 'scissors';
    if (lastPlayer === 'scissors') return 'rock';
    return choices[Math.floor(Math.random() * choices.length)];
  }
  return choices[Math.floor(Math.random() * choices.length)];
}

function getResult(player, cpu) {
  if (player === cpu) return 'draw';
  if (
    (player === 'rock' && cpu === 'scissors') ||
    (player === 'paper' && cpu === 'rock') ||
    (player === 'scissors' && cpu === 'paper')
  ) return 'win';
  return 'lose';
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    playRound(state, action) {
      const player = action.payload;
      if (!player || !choices.includes(player)) {
        // Timeout or no move
        state.current = { player: 'none', cpu: 'none', result: 'lose' };
        state.cpuScore++;
        state.streak = { count: 0, type: null };
        state.history.push({ player: 'none', cpu: 'none', result: 'lose', time: new Date().toISOString() });
        return;
      }
      const cpu = cpuChoice(state.aiMode, player);
      const result = getResult(player, cpu);
      state.current = { player, cpu, result };

      if (result === 'win') {
        state.playerScore++;
        state.coins += 10;
        if (state.streak.type === 'win') {
          state.streak.count++;
        } else {
          state.streak = { count: 1, type: 'win' };
        }
        if (state.streak.count === 3 && !state.achievements.includes('3 Win Streak')) {
          state.achievements.push('3 Win Streak');
          state.coins += 50;
        }
      } else if (result === 'lose') {
        state.cpuScore++;
        state.streak = { count: 0, type: null };
      } else {
        state.streak = { count: 0, type: null };
      }
      state.history.push({ player, cpu, result, time: new Date().toISOString() });
    },
    resetGame(state) {
      Object.assign(state, initialState);
    },
    updateAIMode(state, action) {
      state.aiMode = action.payload;
    },
  },
});

export const { playRound, resetGame, updateAIMode } = gameSlice.actions;
export default gameSlice.reducer;
