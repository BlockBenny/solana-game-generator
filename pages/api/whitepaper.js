import React from 'react';

const Whitepaper = () => {
  return (
    <div className="min-h-screen bg-deep-space text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">GameCraft Whitepaper</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
            <p>
              GameCraft is a revolutionary platform that combines blockchain
              technology with AI-powered game creation. Our mission is to
              democratize game development and create a thriving ecosystem for
              creators and players alike.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Technology</h2>
            <p>
              GameCraft utilizes advanced AI models to generate and modify games
              based on user prompts. The platform is built on the Solana
              blockchain, ensuring fast transactions and low fees for all
              ecosystem participants.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Token Economics</h2>
            <p>
              The $GC token is the native currency of the GameCraft ecosystem.
              It is used for accessing premium features, rewarding creators, and
              governance. A total supply of 1 billion $GC tokens has been
              minted, with a deflationary mechanism in place.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Roadmap</h2>
            <ul className="list-disc list-inside">
              <li>Q3 2024: Launch of GameCraft beta</li>
              <li>Q4 2024: Integration with major game engines</li>
              <li>Q1 2025: Launch of GameCraft marketplace</li>
              <li>Q2 2025: Mobile app release</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Team</h2>
            <p>
              GameCraft is led by a team of experienced game developers,
              blockchain experts, and AI researchers. Our advisory board
              includes industry veterans from major gaming companies and
              blockchain projects.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Whitepaper;
