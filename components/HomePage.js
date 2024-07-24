import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SpaceInvadersGame from './SpaceInvadersGame';
import dynamic from 'next/dynamic';
import { Zap, Code, Share2 } from 'lucide-react';
import CustomWalletButton from './CustomWalletButton';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const ClientSideWalletMultiButton = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <WalletMultiButtonDynamic className="connect-wallet-button" />;
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-purple-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
    <Icon className="w-12 h-12 mb-4 text-purple-400" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="relative inline-block">
          <Image
            src="/v2.png"
            alt="GameCrafter Version 2.0"
            width={900}
            height={450}
            className="mb-6"
          />
        </div>
        <p className="text-xl mb-16">
          Experience the future of game development with AI-powered game
          creation. Describe your game idea and let GameCrafter do the rest.
          Instantly launch your game as HTML5 and share it with the world.
          Connect your SOLANA wallet and start creating!
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16 items-center">
          <div className="w-full sm:w-auto">
            <CustomWalletButton />
          </div>
        </div>
        <p className="text-xl mb-4">
          Our $GC token will launch on the BASE chain (ETH/GC)
        </p>
        <p className="text-xl">
          You can find more informations about our upcoming token launch in our
          Telegram channel!
        </p>
        <a href="https://t.me/gamecraftoc">
          <button className="mt-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition duration-200">
            Join Telegram
          </button>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon={Zap}
          title="AI-Powered Creation"
          description="Transform your ideas into playable games with advanced AI technology."
        />
        <FeatureCard
          icon={Code}
          title="No Coding Required"
          description="Create complex games without writing a single line of code."
        />
        <FeatureCard
          icon={Share2}
          title="Instant Sharing"
          description="Share your creations instantly with friends or the GameCrafter community."
        />
      </div>
    </div>
  );
};

export default HomePage;
