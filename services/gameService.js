import logger from '../utils/logger';

const API_BASE_URL = '/api';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchUserGames(userId) {
  logger.info('gameService: Fetching user games for user ID:', userId);
  return fetchJson(`${API_BASE_URL}/games?userId=${userId}`);
}

export async function fetchGameVersions(gameId) {
  return fetchJson(`${API_BASE_URL}/game-versions?gameId=${gameId}`);
}

export const deleteGameVersion = async (versionId) => {
  try {
    const axios = require('axios');
    const response = await axios.delete(`/api/games?versionId=${versionId}`);
    if (response.status !== 200) {
      throw new Error('Failed to delete game version');
    }
    return response.data;
  } catch (error) {
    console.error('Error deleting game version:', error);
    throw error;
  }
};

export async function fetchUserFiles(userPublicKey, gameId) {
  return fetchJson(
    `${API_BASE_URL}/get-user-files?userPublicKey=${userPublicKey}&gameId=${gameId}`
  );
}

export async function uploadFile(file, userPublicKey, gameId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userPublicKey', userPublicKey);
  formData.append('gameId', gameId);

  return fetchJson(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteImage(filepath) {
  return fetchJson(`${API_BASE_URL}/delete-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filepath }),
  });
}

export async function generateGame(params) {
  logger.info('gameService: Generating game with params:', params);
  const response = await fetch('/api/generate-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to generate game');
  }

  const data = await response.json();
  console.log('Generated game data:', data);
  return data;
}

export async function fetchGameVersionsFromAPI(gameId) {
  const response = await fetch(`/api/game-versions?gameId=${gameId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game versions');
  }
  const data = await response.json();
  console.log('Fetched game versions:', data);
  return data;
}

export async function saveGame(gameId, title) {
  return fetchJson(`${API_BASE_URL}/games?gameId=${gameId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}

export async function createDefaultGame(userId) {
  return fetchJson(`${API_BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      title: 'Untitled Game',
      htmlContent: '<div>New Game</div>', // Default HTML content
      prompt: '',
    }),
  });
}

export const launchGame = async ({ gameId, versionId, walletAddress }) => {
  const response = await fetch('/api/launch-game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameId, versionId, walletAddress }),
  });

  if (!response.ok) {
    throw new Error('Failed to launch game');
  }

  return response.json();
};

export const unlaunchGame = async ({ gameId, walletAddress }) => {
  const response = await fetch('/api/unlaunch-game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameId, walletAddress }),
  });

  if (!response.ok) {
    throw new Error('Failed to unlaunch game');
  }

  return response.json();
};
