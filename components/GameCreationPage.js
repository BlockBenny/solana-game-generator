import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import LoadingSpinner from './LoadingSpinner';
import GamePreview from './GamePreview';
import VersionHistory from './VersionHistory';
import FileUploader from './FileUploader';
import { useGame } from '../hooks/useGame';
import { useGameVersions } from '../hooks/useGameVersions';
import {
  generateGame,
  saveGame,
  launchGame,
  unlaunchGame,
} from '../services/gameService';
import logger from '../utils/logger';

const GameCreationPage = () => {
  const { publicKey } = useWallet();
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const {
    game,
    setGame,
    isLoading: isGameLoading,
    fetchGame,
  } = useGame(publicKey);

  const {
    gameVersions,
    currentVersionIndex,
    setCurrentVersionIndex,
    fetchGameVersions,
    deleteVersion,
  } = useGameVersions(game?.id);

  useEffect(() => {
    const preventDefaultKeys = (e) => {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventDefaultKeys);

    return () => {
      window.removeEventListener('keydown', preventDefaultKeys);
    };
  }, []);

  useEffect(() => {
    if (publicKey) {
      fetchGame();
      fetchUserFiles();
    }
  }, [publicKey, fetchGame]);

  useEffect(() => {
    if (game?.id) {
      fetchGameVersions();
    }
  }, [game?.id, fetchGameVersions]);

  useEffect(() => {
    if (gameVersions.length > 0) {
      setCurrentVersionIndex(gameVersions.length - 1);
    }
  }, [gameVersions, setCurrentVersionIndex]);

  const fetchUserFiles = useCallback(async () => {
    if (!publicKey) return;

    try {
      const response = await fetch(
        `/api/upload?walletAddress=${publicKey.toBase58()}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch uploaded files');
      }
      const files = await response.json();
      setUploadedFiles(files);
    } catch (error) {
      logger.error('Error fetching user files:', error);
      setError('Failed to fetch uploaded files');
    }
  }, [publicKey]);

  const handleGenerateGame = useCallback(
    async (isIteration = false) => {
      if (!isIteration && gameVersions && gameVersions.length > 0) {
        const confirmNewGame = window.confirm(
          'Are you sure you want to generate a new game? This will create a new version of the current game.'
        );
        if (!confirmNewGame) {
          return;
        }
      }

      setIsGenerating(true);
      setError('');

      try {
        const currentVersion =
          isIteration && currentVersionIndex !== -1 && gameVersions
            ? gameVersions[currentVersionIndex]
            : null;

        const currentGameHTML =
          currentVersion?.html_content || '<div>New Game</div>';

        console.log('Generating game with params:', {
          prompt,
          currentGame: currentGameHTML,
          uploadedFiles,
          publicKey: publicKey.toBase58(),
          gameId: game?.id,
          isIteration,
        });

        const result = await generateGame({
          prompt,
          currentGame: currentGameHTML,
          uploadedFiles,
          publicKey: publicKey.toBase58(),
          gameId: game?.id,
          isIteration,
        });

        console.log('Game generation result:', result);

        if (result.gameId) {
          setGame((prevGame) => ({
            ...prevGame,
            id: result.gameId,
            title: result.gameTitle || prevGame.title,
          }));

          // Fetch the updated game versions
          await fetchGameVersions(result.gameId);
        }

        setPrompt('');
      } catch (error) {
        console.error('Error generating game:', error);
        setError(`Failed to generate or modify game: ${error.message}`);
      } finally {
        setIsGenerating(false);
      }
    },
    [
      prompt,
      currentVersionIndex,
      gameVersions,
      uploadedFiles,
      publicKey,
      game,
      setGame,
      fetchGameVersions,
      setCurrentVersionIndex,
    ]
  );

  const handleFileUpload = useCallback(
    async (file) => {
      if (!publicKey) {
        setError('Please connect your wallet before uploading files.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(
          `/api/upload?walletAddress=${publicKey.toBase58()}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'File upload failed');
        }

        const result = await response.json();
        setUploadedFiles((prevFiles) => [...prevFiles, result]);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError(`Failed to upload file: ${error.message}`);
      }
    },
    [publicKey]
  );

  const handleDeleteImage = useCallback(
    async (fileId) => {
      if (!publicKey) {
        setError('Please connect your wallet before deleting files.');
        return;
      }

      try {
        const response = await fetch(
          `/api/upload?walletAddress=${publicKey.toBase58()}&fileId=${fileId}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'File deletion failed');
        }

        setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => file.id !== fileId)
        );
      } catch (error) {
        console.error('Error deleting file:', error);
        setError(`Failed to delete file: ${error.message}`);
      }
    },
    [publicKey]
  );

  const handleSaveGame = useCallback(async () => {
    console.log('Current game state:', game);
    if (!game?.id) {
      console.error('Attempting to save game without an ID');
      setError('No game to save. Please create a game first.');
      return;
    }

    try {
      await saveGame(game.id, game.title);
      console.log('Game saved successfully:', game);
    } catch (error) {
      console.error('Error saving game:', error);
      setError('Failed to save game. Please try again.');
    }
  }, [game]);

  const handleLaunchGame = useCallback(async () => {
    if (!game?.id) {
      setError('No game to launch. Please create a game first.');
      return;
    }

    try {
      if (game.is_launched) {
        const result = await unlaunchGame({
          gameId: game.id,
          walletAddress: publicKey.toBase58(),
        });
        setGame((prevGame) => ({
          ...prevGame,
          is_launched: false,
          launch_link: null,
        }));
        logger.info('Game unlaunched successfully', result);
      } else {
        const { gameUrl } = await launchGame({
          gameId: game.id,
          versionId: gameVersions[currentVersionIndex].id,
          walletAddress: publicKey.toBase58(),
        });
        setGame((prevGame) => ({
          ...prevGame,
          is_launched: true,
          launch_link: gameUrl,
        }));
        logger.info('Game launched:', gameUrl);
      }
    } catch (error) {
      logger.error('Error launching/unlaunching game:', error);
      setError('Failed to launch/unlaunch game. Please try again.');
    }
  }, [game, gameVersions, currentVersionIndex, publicKey, setGame]);

  if (isGameLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
      {error && (
        <div className="bg-red-600 bg-opacity-80 p-4 rounded-md animate-shake col-span-1 md:col-span-12">
          <p>{error}</p>
        </div>
      )}

      <section className="bg-glass p-6 rounded-lg shadow-neon col-span-1 md:col-span-6">
        <h2 className="text-2xl font-semibold mb-4 font-orbitron">Your Game</h2>
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-12 flex">
          <input
            type="text"
            value={game?.title || ''}
            onChange={(e) =>
              setGame((prev) => ({ ...prev, title: e.target.value }))
            }
            onBlur={handleSaveGame}
            placeholder="Enter game title"
            className="w-full p-2 bg-purple-800 border border-purple-600 rounded-md text-white col-span-1 md:col-span-12"
          />
          <input
            type="text"
            value={game?.launch_link || 'Game not launched yet'}
            readOnly
            className="w-full p-2 bg-purple-800 border border-purple-600 rounded-md text-white col-span-1 md:col-span-12"
          />
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 col-span-1 md:col-span-12 justify-between">
            <button
              onClick={handleSaveGame}
              className="w-full md:w-1/3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:opacity-50 transition duration-200 py-2"
              disabled={!game?.id}
            >
              Save Game
            </button>
            <button
              onClick={handleLaunchGame}
              className={`w-full md:w-1/3 py-2 rounded-md font-semibold disabled:opacity-50 transition duration-200 ${
                game?.is_launched
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={!game?.id}
            >
              {game?.is_launched ? 'Unpublish Game' : 'Publish'}
            </button>
          </div>
        </div>
      </section>

      <section className="bg-glass p-6 rounded-lg shadow-neon col-span-1 md:col-span-6">
        <h2 className="text-2xl font-semibold mb-4 font-orbitron">
          Create or Modify Your Game
        </h2>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 bg-purple-800 border border-purple-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 transition duration-200 h-20 resize-none"
            placeholder="e.g. A simple platformer game with a jumping character"
          />
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <button
              onClick={() => handleGenerateGame(false)}
              className="w-full md:w-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:opacity-50 transition duration-200"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? 'Generating...' : 'Generate New Game'}
            </button>
            <button
              onClick={() => handleGenerateGame(true)}
              className="w-full md:w-1/2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold disabled:opacity-50 transition duration-200"
              disabled={
                isGenerating || !prompt.trim() || currentVersionIndex === -1
              }
            >
              Modify Current Game
            </button>
          </div>
        </div>
      </section>

      <div className="col-span-1 md:col-span-8">
        <GamePreview
          gameVersions={gameVersions}
          currentVersionIndex={currentVersionIndex}
          isGenerating={isGenerating}
        />
      </div>

      <div className="col-span-1 md:col-span-4">
        <VersionHistory
          gameVersions={gameVersions}
          currentVersionIndex={currentVersionIndex}
          setCurrentVersionIndex={setCurrentVersionIndex}
          deleteVersion={deleteVersion}
        />
      </div>

      <div className="col-span-1 md:col-span-12">
        <FileUploader
          walletAddress={publicKey ? publicKey.toBase58() : null}
          uploadedFiles={uploadedFiles}
          handleFileUpload={handleFileUpload}
          handleDeleteImage={handleDeleteImage}
        />
      </div>
    </div>
  );
};

export default React.memo(GameCreationPage);
