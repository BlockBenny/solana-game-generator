import React from 'react';
import Navbar from '../components/Navbar';
import { Grid } from 'lucide-react';

// This is a placeholder component for a game card
const GameCard = ({ title, creator, plays }) => (
  <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4 shadow-lg">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm mb-2">Created by: {creator}</p>
    <p className="text-sm">Plays: {plays}</p>
    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition duration-200">
      Play Now
    </button>
  </div>
);

export default function CommunityGames() {
  // This is placeholder data. In a real application, you'd fetch this from an API
  const games = [
    { id: 1, title: 'Space Adventure', creator: 'CosmicCoder', plays: 1234 },
    { id: 2, title: 'Dungeon Crawler', creator: 'PixelWarrior', plays: 987 },
    { id: 3, title: 'Puzzle Master', creator: 'BrainTeaser', plays: 2345 },
    { id: 4, title: 'Racing Frenzy', creator: 'SpeedDemon', plays: 876 },
    { id: 5, title: 'Zombie Survival', creator: 'UndeadSlayer', plays: 3456 },
    { id: 6, title: 'Farm Simulator', creator: 'GreenThumb', plays: 654 },
  ];

  return (
    <div className="min-h-screen bg-deep-space text-white">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="clouds"></div>

      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 flex items-center justify-center">
            <Grid size={36} className="mr-4" />
            Community Games
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4">Want to add your game to the community?</p>
            <a
              href="/game-creation"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Create Your Game Now
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
