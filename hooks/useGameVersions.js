import { useState, useEffect, useCallback } from 'react';
import {
  fetchGameVersions as fetchGameVersionsAPI,
  deleteGameVersion,
} from '../services/gameService';

export const useGameVersions = (gameId) => {
  const [gameVersions, setGameVersions] = useState([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGameVersions = useCallback(async () => {
    if (!gameId) return;

    setIsLoading(true);
    setError(null);

    try {
      const versions = await fetchGameVersionsAPI(gameId);
      setGameVersions(versions);
      setCurrentVersionIndex(versions.length - 1);
    } catch (err) {
      console.error('Error fetching game versions:', err);
      setError('Failed to fetch game versions');
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGameVersions();
  }, [fetchGameVersions]);

  const deleteVersion = useCallback(
    async (versionId) => {
      try {
        await deleteGameVersion(versionId);
        // Refetch game versions after successful deletion
        await fetchGameVersions();
      } catch (err) {
        console.error('Error deleting game version:', err);
        setError('Failed to delete game version');
      }
    },
    [fetchGameVersions]
  );

  const resetVersions = useCallback((newVersions) => {
    setGameVersions(newVersions);
    setCurrentVersionIndex(newVersions.length - 1);
  }, []);

  return {
    gameVersions,
    currentVersionIndex,
    setCurrentVersionIndex,
    isLoading,
    error,
    fetchGameVersions,
    deleteVersion,
    resetVersions,
  };
};
