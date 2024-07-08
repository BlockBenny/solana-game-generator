import { useState, useCallback } from 'react';
import { fetchUserGames } from '../services/gameService';
import logger from '../utils/logger';

export function useGame(publicKey) {
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGame = useCallback(async () => {
    if (!publicKey) return;

    setIsLoading(true);

    try {
      logger.info('Fetching user games for public key:', publicKey.toBase58());

      const games = await fetchUserGames(publicKey.toBase58());

      logger.info('Fetched games:', games);

      if (games.length > 0) {
        setGame(games[0]);
      }
    } catch (error) {
      logger.error('Error fetching or creating user games:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  return { game, setGame, isLoading, fetchGame };
}
