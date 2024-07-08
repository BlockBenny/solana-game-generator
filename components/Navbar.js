import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  BarChart2,
  MessageCircle,
  Twitter,
  Menu,
  X,
  FileText,
  HelpCircle,
  Grid,
} from 'lucide-react';
import CustomWalletButton from './CustomWalletButton';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const ClientSideWalletMultiButton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <WalletMultiButtonDynamic className="connect-wallet-button" />;
};

export default function Navbar() {
  const { publicKey } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed w-full z-50 bg-opacity-30 backdrop-filter backdrop-blur-lg bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-title"
            >
              <img src="/logo.png" alt="GameCraft" height={50} width={80} />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
            <SocialLinks />
            <BuyButton />
            <CustomWalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-4 items-center">
            <NavLinks mobile />
            <div className="flex flex-col space-y-4 items-center">
              <SocialLinks mobile />
              <BuyButton mobile />
              <CustomWalletButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const NavLinks = ({ mobile }) => (
  <nav className={`${mobile ? 'flex flex-col space-y-4' : 'flex space-x-6'}`}>
    <Link
      href="/how-it-works"
      className="text-white hover:text-blue-400 transition duration-300 ease-in-out flex items-center"
    >
      <HelpCircle size={20} className="mr-2" />
      How it works
    </Link>
    <Link
      href="/whitepaper"
      className="text-white hover:text-blue-400 transition duration-300 ease-in-out flex items-center"
    >
      <FileText size={20} className="mr-2" />
      Whitepaper
    </Link>
    {/* <Link
      href="/community-games"
      className="text-white hover:text-blue-400 transition duration-300 ease-in-out flex items-center"
    >
      <Grid size={20} className="mr-2" />
      Community Games
    </Link> */}
  </nav>
);

const SocialLinks = ({ mobile }) => (
  <div className={`flex ${mobile ? 'flex-col space-y-4' : 'space-x-4'}`}>
    <a
      href="https://dexscreener.com/solana/GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump"
      className="text-white hover:text-blue-400 transition duration-300 ease-in-out flex items-center"
    >
      <BarChart2 size={24} className="mr-2" />
      {mobile && 'DEX Screener'}
    </a>
    <a
      href="https://t.me/gamecraftoc"
      className="text-white hover:text-blue-400 transition duration-300 ease-in-out flex items-center"
    >
      <MessageCircle size={24} className="mr-2" />
      {mobile && 'Telegram'}
    </a>
    <a
      href="https://x.com/gc_gamecraft"
      className="text-white hover:text-blue-400 transition duration-300 ease-in-out flex items-center"
    >
      <Twitter size={24} className="mr-2" />
      {mobile && 'Twitter'}
    </a>
  </div>
);

const BuyButton = ({ mobile }) => (
  <a
    href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump&inputMint=sol&outputMint=GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump"
    className={mobile ? 'w-full' : ''}
  >
    <button
      className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg ${
        mobile ? 'w-full' : ''
      }`}
    >
      Buy $GC
    </button>
  </a>
);
