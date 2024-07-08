import React, { useState, useRef } from 'react';

const FileUploader = ({
  walletAddress,
  uploadedFiles,
  handleFileUpload,
  handleDeleteImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      try {
        await handleFileUpload(files[0]);
        setUploadError(null);
      } catch (error) {
        setUploadError(error.message);
      }
    }
  };

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        await handleFileUpload(files[0]);
        setUploadError(null);
      } catch (error) {
        setUploadError(error.message);
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="bg-glass p-6 rounded-lg shadow-neon col-span-12">
      <h2 className="text-2xl font-semibold mb-4 font-orbitron">
        Upload PNG Files
      </h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2">
          <p className="text-sm text-gray-300 mb-4">
            Maximum 5 files per user. Do NOT upload images copyrighted content.
            We are not responsible for any misuse of this service and can delete
            any content at any time.
          </p>
          <div
            className={`border-2 border-dashed rounded-lg p-4 ${
              isDragging
                ? 'border-purple-400 bg-purple-700'
                : 'border-purple-300 bg-purple-800'
            } transition duration-200`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="text-center">
              <p className="text-lg mb-2">Drag and drop PNG files here</p>
              <p>or</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200">
                Select PNG Files
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png"
              className="hidden"
              onChange={handleFileSelect}
              disabled={!walletAddress}
            />
          </div>
          {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
        </div>

        <div className="w-full md:w-1/2">
          {uploadedFiles && uploadedFiles.length > 0 && (
            <div className="bg-purple-800 rounded-lg p-4 overflow-y-auto max-h-64">
              <h3 className="text-lg font-semibold mb-2 text-purple-300">
                Uploaded Files: {uploadedFiles.length}/5
              </h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file) => (
                  <li
                    key={file.id}
                    className="flex justify-between items-center text-purple-300"
                  >
                    <span className="truncate">{file.name}</span>
                    <div className="flex items-center space-x-2">
                      <img
                        src={file.path}
                        alt={file.name}
                        className="w-10 h-10 object-cover"
                      />
                      <button
                        onClick={() => handleDeleteImage(file.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FileUploader);
