import React from 'react';
import { Zap, ArrowRight, Coins, RocketLaunch, Users } from 'lucide-react';
import { Calendar } from 'lucide-react';

const WhitepaperSection = ({ title, icon: Icon, children }) => (
  <section className="mb-8 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6 shadow-lg">
    <h2 className="text-3xl font-bold mb-4 flex items-center">
      {Icon && <Icon className="mr-2" />}
      {title}
    </h2>
    {children}
  </section>
);

const RoadmapQuarter = ({ quarter, year, items }) => (
  <div className="bg-indigo-800 p-4 rounded-lg mb-4">
    <h3 className="font-semibold mb-2">
      {quarter} {year}
    </h3>
    <ul className="list-disc list-inside space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const WhitepaperPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-10 mt-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        Revolutionizing Game Creation with AI
      </h1>

      <WhitepaperSection title="Introduction" icon={Zap}>
        <p className="mb-4">
          GameCraft is a groundbreaking platform that democratizes game
          development through the power of AI. With just a simple prompt, anyone
          can bring their game ideas to life instantly.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>No coding experience required</li>
          <li>Instant game generation</li>
          <li>Endless possibilities for creativity</li>
        </ul>
      </WhitepaperSection>

      <WhitepaperSection title="Cutting-Edge Technology" icon={ArrowRight}>
        <p className="mb-4">
          At the heart of GameCraft lies Claude Sonnet 3.5, a state-of-the-art
          AI model that understands and translates your ideas into playable
          games.
        </p>
        <div className="bg-indigo-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Key Features:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Advanced natural language processing</li>
            <li>Real-time game code generation</li>
            <li>Seamless integration with web technologies</li>
            <li>Continuous learning and improvement</li>
          </ul>
        </div>
      </WhitepaperSection>

      <WhitepaperSection title="Token Economics" icon={Coins}>
        <p className="mb-4">
          The $GC token is the lifeblood of the GameCraft ecosystem, designed to
          reward creators and fuel the platform's growth.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Token Details:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Total Supply: 1 billion $GC</li>
              <li>Deflationary mechanism</li>
              <li>Listed on pump.fun</li>
            </ul>
          </div>
          <div className="bg-indigo-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Holder Benefits:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Free access with 1M+ tokens</li>
              <li>Governance rights</li>
              <li>Exclusive features</li>
            </ul>
          </div>
        </div>
      </WhitepaperSection>

      <WhitepaperSection title="Roadmap" icon={RocketLaunch}>
        <p className="mb-4">
          Our roadmap outlines the exciting journey ahead for GameCraft. We are
          committed to continuous improvement and innovation, with a development
          cycle of 2 weeks for each minor version.
        </p>

        <RoadmapQuarter
          quarter="Q3"
          year="2024"
          items={[
            'Launch of GameCraft Version 2.0 (July)',
            'Version 2.1: Improve product stability, responsiveness, and prompting',
            'Version 2.2: Implement AI Token Balance with daily free tokens',
            'Version 2.3: Introduce GameSlot purchases and AI Token purchases',
            'Version 2.4: Continuous product strengthening and feature additions',
            'Version 2.5: Mini Major release - Multiple Files that work together',
            'Initiate marketing plan including project partnerships and community engagement',
            'Participate in spaces to introduce GameCraft',
            'Engage with new and established meme coins for game creation partnerships',
          ]}
        />

        <RoadmapQuarter
          quarter="Q4"
          year="2024"
          items={[
            'Versions 2.6 - 2.9: Ongoing product enhancements and feature additions',
            'Preparation for Version 3.0 major release',
            'Continued marketing efforts and partnership expansions',
          ]}
        />

        <RoadmapQuarter
          quarter="Q1"
          year="2025"
          items={[
            'Launch of GameCraft Version 3.0',
            'Major UI redesign for a more professional look',
            'Transition to a creation SaaS model',
            'Separation of the main website from the application',
            'Enhanced user experience and advanced AI capabilities',
          ]}
        />

        <div className="mt-6 p-4 bg-indigo-800 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center">
            <Calendar className="mr-2" />
            Development Cycle
          </h3>
          <p>
            We maintain a robust development cycle of 2 weeks for each minor
            version. This allows us to rapidly iterate, implement user feedback,
            and continuously improve the GameCraft platform.
          </p>
        </div>
      </WhitepaperSection>

      <WhitepaperSection title="Team & Community" icon={Users}>
        <p className="mb-4">
          GameCraft is backed by a passionate team of developers, designers, and
          blockchain experts, united by the vision of democratizing game
          creation.
        </p>
        <div className="bg-indigo-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Our Strengths:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Experienced development team</li>
            <li>Strong and engaged community</li>
            <li>Commitment to continuous innovation</li>
          </ul>
        </div>
      </WhitepaperSection>
    </div>
  );
};

export default WhitepaperPage;
