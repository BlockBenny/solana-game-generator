import React from 'react';
import Navbar from '../components/Navbar';
import {
  Coins,
  Upload,
  Edit,
  Rocket,
  MessageCircle,
  Gamepad,
} from 'lucide-react';

const StepSection = ({ number, title, icon: Icon, children }) => (
  <section className="mb-8 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6 shadow-lg">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="mr-3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
        {number}
      </span>
      {Icon && <Icon className="mr-2" size={24} />}
      {title}
    </h2>
    {children}
  </section>
);

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-deep-space text-white">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="clouds"></div>

      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 mt-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            How to Create and Launch Your Own Game
          </h1>

          <StepSection number="0" title="Get Access to GameCraft" icon={Coins}>
            <p>
              To start creating games, you need to hold at least 1 million $GC
              tokens. This gives you full access to the GameCraft platform and
              all its features.
            </p>
            <a
              href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump&inputMint=sol&outputMint=GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Buy $GC Tokens
            </a>
          </StepSection>

          <StepSection number="1" title="Create Your Game" icon={Edit}>
            <p>Once you have access, start creating your game:</p>
            <ul className="list-disc list-inside mt-2 space-y-2">
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
            <p className="mt-4">
              Pro Tip: Be specific in your prompts. Describe gameplay mechanics,
              visual style, and any unique features you want in your game.
            </p>
          </StepSection>

          <StepSection number="2" title="Launch Your Game" icon={Rocket}>
            <p>When your game is ready:</p>
            <ol className="list-decimal list-inside mt-2 space-y-2">
              <li>Give your game a catchy, descriptive name</li>
              <li>Click the "Publish" button to launch your game</li>
              <li>GameCraft will generate a unique link for your game</li>
            </ol>
            <p className="mt-4">
              Your game is now live and can be accessed via the generated link
              in any web browser!
            </p>
          </StepSection>

          <StepSection
            number="3"
            title="Share on Telegram"
            icon={MessageCircle}
          >
            <p>To make your game accessible via Telegram:</p>
            <ol className="list-decimal list-inside mt-2 space-y-2">
              <li>Add @GameCraftBot to your Telegram group</li>
              <li>Use the command: /add_game &lt;name&gt; &lt;link&gt;</li>
              <li>
                Replace &lt;name&gt; with your game's name and &lt;link&gt; with
                the generated link
              </li>
            </ol>
            <p className="mt-4">
              Example: /add_game MyAwesomeGame
              https://gamecraft.rocks/uploads/[wallet_address]/MyAwesomeGame.html
            </p>
          </StepSection>

          <StepSection number="4" title="Play and Share" icon={Gamepad}>
            <p>Now, anyone in your Telegram group can play your game:</p>
            <ul className="list-disc list-inside mt-2 space-y-2">
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
            <p className="mt-4">
              Encourage your friends to play and share feedback to help you
              improve your game!
            </p>
          </StepSection>

          <div className="mt-12 text-center">
            <p className="mb-4">Ready to start creating your own games?</p>
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
