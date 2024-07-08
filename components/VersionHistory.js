import React, { useEffect } from 'react';
import { Copy, Trash2 } from 'lucide-react';

const VersionHistory = ({
  gameVersions,
  currentVersionIndex,
  setCurrentVersionIndex,
  deleteVersion,
}) => {
  const sortedVersions =
    gameVersions && gameVersions.length > 0
      ? gameVersions.sort((a, b) => a.version_number - b.version_number)
      : [];

  useEffect(() => {
    if (sortedVersions.length > 0) {
      setCurrentVersionIndex(sortedVersions.length - 1);
    }
  }, [sortedVersions, setCurrentVersionIndex]);

  const handleDeleteVersion = async (versionId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this version? This action cannot be undone.'
      )
    ) {
      await deleteVersion(versionId);
    }
  };

  const handleCopyHTML = async () => {
    if (sortedVersions.length > 0 && currentVersionIndex !== -1) {
      const currentVersion = sortedVersions[currentVersionIndex];
      try {
        await navigator.clipboard.writeText(currentVersion.html_content);
        alert('HTML copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy HTML: ', err);
        alert('Failed to copy HTML. Please try again.');
      }
    }
  };

  const handleCopyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt);
      alert('Prompt copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy prompt: ', err);
      alert('Failed to copy prompt. Please try again.');
    }
  };

  const truncatePrompt = (prompt, maxLength = 40) => {
    return prompt.length > maxLength
      ? prompt.slice(0, maxLength) + '...'
      : prompt;
  };

  return (
    <section className="bg-glass p-6 rounded-lg shadow-neon col-span-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold font-orbitron">
          Version History
        </h2>
        <button
          onClick={handleCopyHTML}
          className="p-2 bg-blue-400 hover:bg-blue-600 rounded-full text-white"
          title="Copy current version HTML"
        >
          <Copy size={20} />
        </button>
      </div>
      {sortedVersions.length > 0 ? (
        <div className="space-y-2 overflow-y-auto flex-grow">
          {sortedVersions.map((version, index) => (
            <div
              key={version.id}
              className={`flex flex-col p-2 rounded-md ${
                index === currentVersionIndex
                  ? 'bg-purple-600'
                  : 'bg-purple-800'
              }`}
            >
              <button
                onClick={() => setCurrentVersionIndex(index)}
                className="flex-grow text-left font-semibold text-white"
              >
                Version {version.version_number}
              </button>
              <div className="text-xs text-gray-400 mt-1">
                {truncatePrompt(version.prompt)}
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleCopyPrompt(version.prompt)}
                  className="p-1 bg-green-500 hover:bg-green-600 rounded-md text-white text-sm"
                  title="Copy prompt"
                >
                  <Copy size={16} />
                </button>
                {sortedVersions.length > 1 && (
                  <button
                    onClick={() => handleDeleteVersion(version.id)}
                    className="p-1 bg-red-500 hover:bg-red-600 rounded-md text-white text-sm"
                    title="Delete version"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">
          No versions yet. Generate your first game!
        </p>
      )}
    </section>
  );
};

export default VersionHistory;
