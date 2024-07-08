import React, { useRef, useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const GamePreview = ({ gameVersions, currentVersionIndex, isGenerating }) => {
  const iframeRef = useRef(null);
  const [previewType, setPreviewType] = useState('mobile');

  useEffect(() => {
    const currentGame = gameVersions[currentVersionIndex];
    if (iframeRef.current && currentGame?.html_content) {
      iframeRef.current.srcdoc = currentGame.html_content;
    }
  }, [gameVersions, currentVersionIndex]);

  const focusGame = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage('focus', '*');
    }
  };

  const renderGame = () => {
    const currentGame = gameVersions[currentVersionIndex];
    if (!currentGame || !currentGame.html_content) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          No game generated yet
        </div>
      );
    }

    return (
      <iframe
        ref={iframeRef}
        srcDoc={currentGame.html_content}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Game Preview"
      />
    );
  };

  const renderMobilePreview = () => {
    return (
      <div className="flex justify-center items-center h-full bg-gray-900">
        <div className="w-[375px] h-[667px] bg-white rounded-3xl overflow-hidden shadow-lg relative">
          <div className="bg-gray-200 h-6 flex items-center justify-center">
            <div className="w-16 h-4 bg-black rounded-full"></div>
          </div>
          {/* <div className="bg-[#0088cc] h-14 flex items-center px-4">
            <div className="text-white font-bold">Telegram Game Bot</div>
          </div> */}
          <div className="h-[calc(100%-5rem)] overflow-hidden">
            {renderGame()}
          </div>
        </div>
      </div>
    );
  };

  const renderWebsitePreview = () => {
    return (
      <div className="w-[600px] h-[400px] bg-white rounded-lg overflow-hidden shadow-lg mx-auto">
        {renderGame()}
      </div>
    );
  };

  return (
    <section className="bg-glass p-6 rounded-lg shadow-neon col-span-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold font-orbitron">Game Preview</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${
              previewType === 'mobile'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-200 text-purple-800'
            }`}
            onClick={() => setPreviewType('mobile')}
          >
            Mobile
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              previewType === 'website'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-200 text-purple-800'
            }`}
            onClick={() => setPreviewType('website')}
          >
            Website
          </button>
        </div>
      </div>
      <div
        className="border border-purple-700 rounded-md overflow-hidden cursor-pointer bg-black"
        onClick={focusGame}
        style={{ height: previewType === 'website' ? '400px' : '667px' }}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center h-full text-white">
            <LoadingSpinner />
          </div>
        ) : previewType === 'website' ? (
          renderWebsitePreview()
        ) : (
          renderMobilePreview()
        )}
      </div>
    </section>
  );
};

export default GamePreview;
