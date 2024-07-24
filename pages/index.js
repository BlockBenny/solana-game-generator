import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { checkTokenBalance } from '../utils/tokenBalance';
import Navbar from '../components/Navbar';
import HomePage from '../components/HomePage';
import GameCreationPage from '../components/GameCreationPage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { publicKey } = useWallet();
  const [hasAccess, setHasAccess] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [tokenAddress] = useState(process.env.NEXT_PUBLIC_TOKEN_ADDRESS);

  const checkAccess = useCallback(async () => {
    if (!publicKey) return;

    setIsCheckingBalance(true);
    setBalanceError(null);

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
      });

      const balance = await checkTokenBalance(
        publicKey.toBase58(),
        tokenAddress
      );

      setTokenBalance(balance);
      setHasAccess(true);
    } catch (error) {
      console.error('Error checking access:', error);
      setBalanceError('Failed to check token balance. Please try again.');
      setHasAccess(false);
    } finally {
      setIsCheckingBalance(false);
    }
  }, [publicKey, tokenAddress]);

  useEffect(() => {
    let timeoutId;
    if (publicKey) {
      timeoutId = setTimeout(checkAccess, 1000); // Delay check by 1 second
    }
    return () => clearTimeout(timeoutId);
  }, [publicKey, checkAccess]);

  const renderContent = () => {
    if (!publicKey) {
      return <HomePage />;
    }

    if (isCheckingBalance) {
      return (
        <div className="max-w-2xl mx-auto bg-blue-800 bg-opacity-50 p-8 rounded-lg text-center shadow-neon">
          <h2 className="text-2xl font-bold mb-4 font-orbitron">
            Checking Token Balance...
          </h2>
          <LoadingSpinner />
        </div>
      );
    }

    if (balanceError) {
      return (
        <div className="max-w-2xl mx-auto bg-red-800 bg-opacity-50 p-8 rounded-lg text-center shadow-neon">
          <h2 className="text-2xl font-bold mb-4 font-orbitron">
            Error Checking Balance
          </h2>
          <p className="text-xl mb-4">{balanceError}</p>
          <button
            onClick={checkAccess}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition duration-200"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!hasAccess) {
      return (
        <div className="max-w-2xl mt-10 mx-auto bg-red-800 bg-opacity-50 p-8 rounded-lg text-center shadow-neon">
          <h2 className="text-2xl font-bold mb-4 font-orbitron">
            Access Denied
          </h2>
          <p className="text-xl mb-4">
            You do not have enough tokens to access this game. You need at least
            100,000 $GC tokens. (This is a temporal offer) Your current balance
            is {tokenBalance} $GC tokens.
          </p>
          <button
            onClick={checkAccess}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition duration-200"
          >
            Refresh Balance
          </button>
        </div>
      );
    }

    return <GameCreationPage />;
  };

  return (
    <div className="min-h-screen bg-deep-space text-white">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="clouds"></div>

      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {renderContent()}
      </main>
    </div>
  );
}
