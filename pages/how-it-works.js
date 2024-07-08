import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Coins,
  Upload,
  Edit,
  Rocket,
  MessageCircle,
  Gamepad,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const StepSection = ({ number, title, icon: Icon, children }) => (
  <section className="mb-8 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4 sm:p-6 shadow-lg">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
      <span className="mr-3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
        {number}
      </span>
      {Icon && <Icon className="mr-2" size={24} />}
      {title}
    </h2>
    {children}
  </section>
);

const ExamplePrompt = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
      >
        <span>View Example Prompt</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="mt-2 p-4 bg-gray-800 rounded-lg whitespace-pre-wrap text-sm sm:text-base">
          {`Create a game like Space Invaders. 

Here are the requirements:

1. The player should be able to move around freely and smoothly across the whole map.
2. The player needs to be able to turn around and shoot yellow bullets in several directions.
3. The obstacles should be astroids that are coming from the sides SLOWLY.
4. The background should be space dark blue and the players good colours to fit on the background.
5. The background should have small stars that move with the movement of the player.
6. Add a score to the top left

How to control:

The player should also have controls for mobile gaming on the bottom. On the left It should have a virtual joystick to move and turn the ship and on the right should be a shoot button to shoot. But he should also be able to control the ship with WASD, mouse to turn around and mouse click to shoot.

Take everything in consideration and don't forget any requirements!`}
        </div>
      )}
    </div>
  );
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-deep-space text-white">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="clouds"></div>

      <Navbar />

      <main className="pt-24 pb-12 px-2 sm:px-4 lg:px-8 relative z-10">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 mt-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            How to Create and Launch Your Own Game
          </h1>

          <StepSection number="0" title="Get Access to GameCraft" icon={Coins}>
            <p className="text-sm sm:text-base">
              To start creating games, you need to hold at least 1 million $GC
              tokens. This gives you full access to the GameCraft platform and
              all its features.
            </p>
            <a
              href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump&inputMint=sol&outputMint=GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
            >
              Buy $GC Tokens
            </a>
          </StepSection>

          <StepSection number="1" title="Create Your Game" icon={Edit}>
            <p className="text-sm sm:text-base">
              Once you have access, start creating your game:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 text-sm sm:text-base">
              <li>
                Upload PNG files (max 5 files, 5MB each) to use in your game
              </li>
              <li>Write clear, detailed prompts describing your game idea</li>
              <li>
                Use the AI to generate or modify your game based on your prompts
              </li>
              <li>
                Iterate and refine your game until you're satisfied with the
                result
              </li>
            </ul>
            <p className="mt-4 font-semibold text-sm sm:text-base">
              Pro Tips for Effective Prompting:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-2 text-sm sm:text-base">
              <li>Make clear and understandable prompts</li>
              <li>Structure your prompt in sections</li>
              <li>Highlight important words</li>
              <li>
                Be specific about gameplay mechanics, visual style, and unique
                features
              </li>
              <li>Break down complex ideas into smaller, manageable parts</li>
            </ol>
            <ExamplePrompt />
            <p className="mt-4 text-sm sm:text-base">
              ⚠️ Note: If you see a blank white screen after modifying your
              game, it might have become too complex for the AI to handle. Use
              the following prompt: 'Make the code as slim as possible without
              losing functionality and style.'
            </p>
          </StepSection>

          <StepSection number="2" title="Launch Your Game" icon={Rocket}>
            <p className="text-sm sm:text-base">When your game is ready:</p>
            <ol className="list-decimal list-inside mt-2 space-y-2 text-sm sm:text-base">
              <li>Give your game a catchy, descriptive name</li>
              <li>Click the "Publish" button to launch your game</li>
              <li>GameCraft will generate a unique link for your game</li>
            </ol>
            <p className="mt-4 text-sm sm:text-base">
              Your game is now live and can be accessed via the generated link
              in any web browser!
            </p>
          </StepSection>

          <StepSection
            number="3"
            title="Share on Telegram"
            icon={MessageCircle}
          >
            <p className="text-sm sm:text-base">
              To make your game accessible via Telegram:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-2 text-sm sm:text-base">
              <li>Add @GameCraftBot to your Telegram group</li>
              <li>Use the command: /add_game &lt;name&gt; &lt;link&gt;</li>
              <li>
                Replace &lt;name&gt; with your game's name and &lt;link&gt; with
                the generated link
              </li>
            </ol>
            <p className="mt-4 text-sm sm:text-base">Example:</p>
            <p className="text-sm sm:text-base break-words">
              /add_game MyAwesomeGame
              https://gamecraft.rocks/uploads/[wallet_address]/MyAwesomeGame.html
            </p>
          </StepSection>

          <StepSection number="4" title="Play and Share" icon={Gamepad}>
            <p className="text-sm sm:text-base">
              Now, anyone in your Telegram group can play your game:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 text-sm sm:text-base">
              <li>
                Group members can type /play_game to get a list of available
                games
              </li>
              <li>
                The bot will send a link to your game as a clickable button
              </li>
              <li>
                Players can click the button to open and play your game in their
                browser
              </li>
            </ul>
            <p className="mt-4 text-sm sm:text-base">
              Encourage your friends to play and share feedback to help you
              improve your game!
            </p>
          </StepSection>

          <div className="mt-12 text-center">
            <p className="mb-4 text-sm sm:text-base">
              Ready to start creating your own games?
            </p>
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
