import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { checkTokenBalance } from '../utils/tokenBalance';
import LoadingSpinner from '../components/LoadingSpinner';
import SpaceInvadersGame from '../components/SpaceInvadersGame';
import { BarChart2, MessageCircle, Twitter } from 'lucide-react';

const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function Home() {
  const { publicKey } = useWallet();
  const [hasAccess, setHasAccess] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [gameVersions, setGameVersions] = useState([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const iframeRef = useRef(null);

  const [tokenAddress, setTokenAddress] = useState(
    process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  );

  useEffect(() => {
    async function checkAccess() {
      if (publicKey) {
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
          setHasAccess(balance >= 10000);
        } catch (error) {
          console.error('Error checking access:', error);
          setBalanceError(
            'Failed to check token balance. Please ensure you have tokens in your wallet and try again.'
          );
          setHasAccess(false);
        } finally {
          setIsCheckingBalance(false);
        }
      }
    }

    checkAccess();
  }, [publicKey, tokenAddress]);

  const generateGame = async (isIteration = false) => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          currentGame: isIteration ? gameVersions[currentVersionIndex] : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate game');
      }

      if (data.modificationApplied && data.htmlFile) {
        const newVersion = {
          htmlFile: data.htmlFile,
          prompt: data.originalPrompt,
        };
        if (isIteration) {
          setGameVersions([
            ...gameVersions.slice(0, currentVersionIndex + 1),
            newVersion,
          ]);
          setCurrentVersionIndex(currentVersionIndex + 1);
        } else {
          setGameVersions([newVersion]);
          setCurrentVersionIndex(0);
        }
        setPrompt('');
      } else {
        setError(
          'No changes were applied. The AI might not have understood the prompt. Please try again with a different prompt.'
        );
        setPrompt(data.originalPrompt);
      }
    } catch (error) {
      console.error('Error generating game:', error);
      setError(
        `Failed to generate or modify game: ${error.message}. Please try again with a different prompt.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const focusGame = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage('focus', '*');
    }
  };

  const currentGame = gameVersions[currentVersionIndex] || { htmlFile: '' };

  const renderGame = () => {
    if (!currentGame.htmlFile) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          No game generated yet
        </div>
      );
    }

    return (
      <iframe
        ref={iframeRef}
        srcDoc={currentGame.htmlFile}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Game Preview"
      />
    );
  };

  return (
    <div className="min-h-screen bg-deep-space text-white">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="clouds"></div>

      <header className="fixed w-full z-50 bg-opacity-30 backdrop-filter backdrop-blur-lg bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-title">
            GC
          </h1>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.pump.fun/GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump"
              className="text-white hover:text-blue-400 transition duration-300 ease-in-out"
            >
              <BarChart2 size={24} />
            </a>
            <a
              href="https://t.me/gamecraftoc"
              className="text-white hover:text-blue-400 transition duration-300 ease-in-out"
            >
              <MessageCircle size={24} />
            </a>
            <a
              href="https://x.com/gc_gamecraft"
              className="text-white hover:text-blue-400 transition duration-300 ease-in-out"
            >
              <Twitter size={24} />
            </a>
            <a href="https://www.pump.fun/GUHZxRtarCVNaH3hSzVvRWSjpSAHDPJK38d79aHapump">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                Buy $GC
              </button>
            </a>
            {publicKey ? (
              <WalletMultiButton className="connect-wallet-button" />
            ) : null}
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {!publicKey ? (
          <div className="max-w-4xl mt-10 mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-title">
              GameCraft
            </h1>
            <h3 className="text-3xl font-bold mb-4 font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-title">
              Craft your own games with only one prompt
            </h3>
            <p className="mb-16">powered by Claude Sonnet 3.5</p>
            <SpaceInvadersGame />
            <h3 className="text-xl mt-32 mb-8 font-bold font-orbitron text-transparent bg-clip-text bg-white">
              To test our latest Beta Version you need to hold at least
              1,000,000 <b>$GC</b> tokens
            </h3>
            <WalletMultiButton className="connect-wallet-button" />
          </div>
        ) : isCheckingBalance ? (
          <div className="max-w-2xl mx-auto bg-blue-800 bg-opacity-50 p-8 rounded-lg text-center animate-pulse shadow-neon">
            <h2 className="text-2xl font-bold mb-4 font-orbitron">
              Checking Token Balance...
            </h2>
            <LoadingSpinner />
          </div>
        ) : balanceError ? (
          <div className="max-w-2xl mx-auto bg-red-800 bg-opacity-50 p-8 rounded-lg text-center shadow-neon">
            <h2 className="text-2xl font-bold mb-4 font-orbitron">
              Error Checking Balance
            </h2>
            <p className="text-xl mb-4">{balanceError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition duration-200"
            >
              Retry
            </button>
          </div>
        ) : !hasAccess ? (
          <div className="max-w-2xl mt-10 mx-auto bg-red-800 bg-opacity-50 p-8 rounded-lg text-center shadow-neon">
            <h2 className="text-2xl font-bold mb-4 font-orbitron">
              Access Denied
            </h2>
            <p className="text-xl mb-4">
              You need at least 1,000,000 tokens to access the game generator.
              Your current balance: {tokenBalance}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition duration-200"
            >
              Refresh Balance
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn mt-16">
            <section className="bg-glass p-6 rounded-lg shadow-neon">
              <h2 className="text-2xl font-semibold mb-4 font-orbitron">
                Create or Modify Your Game
              </h2>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-grow p-3 bg-purple-800 border border-purple-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
                  placeholder="e.g. A simple platformer game with a jumping character"
                />
                <button
                  onClick={() => generateGame(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:opacity-50 transition duration-200"
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? 'Generating...' : 'Generate New Game'}
                </button>
                <button
                  onClick={() => generateGame(true)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold disabled:opacity-50 transition duration-200"
                  disabled={
                    isGenerating || !prompt.trim() || currentVersionIndex === -1
                  }
                >
                  Modify Current Game
                </button>
              </div>
            </section>

            {error && (
              <div className="bg-red-600 bg-opacity-80 p-4 rounded-md animate-shake">
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2 bg-glass p-6 rounded-lg shadow-neon">
                <h2 className="text-2xl font-semibold mb-4 font-orbitron">
                  Game Preview
                </h2>
                <div
                  className="border border-purple-700 rounded-md overflow-hidden cursor-pointer aspect-w-3 aspect-h-2 bg-black"
                  onClick={focusGame}
                >
                  {isGenerating ? <LoadingSpinner /> : renderGame()}
                </div>
                {currentGame.htmlFile && (
                  <p className="mt-2 text-sm text-gray-400">
                    Click on the game area to enable controls
                  </p>
                )}
              </section>

              <section className="bg-glass p-6 rounded-lg shadow-neon">
                <h2 className="text-2xl font-semibold mb-4 font-orbitron">
                  Version History
                </h2>
                {gameVersions.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {gameVersions.map((version, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVersionIndex(index)}
                        className={`w-full text-left p-2 rounded-md transition duration-200 ${
                          index === currentVersionIndex
                            ? 'bg-blue-600 text-white'
                            : 'bg-purple-800 text-gray-300 hover:bg-purple-700'
                        }`}
                      >
                        <span className="font-semibold">
                          Version {index + 1}
                        </span>
                        <p className="text-sm truncate">{version.prompt}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    No versions yet. Generate your first game!
                  </p>
                )}
              </section>
            </div>

            <section className="bg-glass p-6 rounded-lg shadow-neon">
              <h2 className="text-2xl font-semibold mb-4 font-orbitron">
                Game Code
              </h2>
              <textarea
                value={currentGame.htmlFile}
                readOnly
                className="w-full h-64 p-3 bg-purple-800 border border-purple-600 rounded-md text-white font-mono text-sm resize-none"
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
