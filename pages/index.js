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
      setHasAccess(
        tokenBalance > 999999 ||
          publicKey.toBase58() ===
            'GiXJpQtuAKtvyrdN787mJBingdpztQdVueMQkdQsswRH' ||
          publicKey.toBase58() ===
            'FAWKGGnSUWSrmjq71sgouHdQCSDkiMzByjptNqGgbJ84' ||
          publicKey.toBase58() ===
            'EGShkrNzBNqJmJwYrBREkWmLDfxZcXmPU9gAx7DvERxM' ||
          publicKey.toBase58() ===
            'D297mBziKxsLM3rtEAusXFvZXwY9Q7N7nGb2WEmvcf5d' ||
          publicKey.toBase58() ===
            '2pKQdh5nztVoSoar8YHrmzUpXhpqXCScdXNRfPRYYVAk' ||
          publicKey.toBase58() ===
            'Aqjbn6stAFGwNYj32wavwppbcyi4sPk2cPNvzJdHTiDV' ||
          publicKey.toBase58() ===
            'CNascQ1iQjHhSB5dJtskgSKQzEhF57z4CLJRbZESBge4' || // Burn 1
          publicKey.toBase58() ===
            '9TE4sq2qknKJfZVjYdH4b2kq4NAs5vc6fw2qXELWQ6ro' || // Burn 2
          publicKey.toBase58() ===
            'HRhCEc9DyUUFHiSviUMc3SPzPK3dqicjBaqzYCxEDjSx' || // Burn 3
          publicKey.toBase58() ===
            '8YSL5UFYWdPURr1Ax4WZiwFo5LSKQzvvuT3a1LjqQPm1' || // Burn 4
          publicKey.toBase58() ===
            '3ZFELPVVCpZ1pPKFfNLfxtw9wUEqe53pRLhUJWN7SYtp' || // Coin Vader
          publicKey.toBase58() ===
            '259tQUqbVHdvu546YpedwXwU3twwqKtbMgCfdPyzvuet' || // .
          publicKey.toBase58() ===
            'Cja4qiJ42HXgZQuAmjYPkMDyLBd38b1AngtAsEi6obf3' // Skuxxboi
      );
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
            We are currently testing Version 2 of our GameCrafter. General
            access will be granted after testing is complete.
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
