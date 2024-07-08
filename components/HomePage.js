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
            className="mb-8"
          />
        </div>
        <p className="text-xl mb-8">
          Experience the future of game development with AI-powered creation.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8 items-center">
          <Link
            href="/how-it-works"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded flex items-center justify-center w-4/5 sm:w-auto"
          >
            How It Works
          </Link>
          <div className="w-full sm:w-auto">
            <CustomWalletButton />
          </div>
        </div>
        <p className="text-sm text-purple-300">
          Hold at least 1 million $GC tokens for free access to our platform.
        </p>
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

      <div className="bg-purple-900 bg-opacity-50 p-8 rounded-lg shadow-lg mb-16">
        <h3 className="text-2xl font-bold mb-4">Try It Out!</h3>
        <p className="mb-4">
          Here's an example of what you can create with GameCrafter:
        </p>
        <SpaceInvadersGame />
      </div>
    </div>
  );
};

export default HomePage;
