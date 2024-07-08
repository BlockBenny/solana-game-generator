import { useState, useCallback, useEffect } from 'react';
import logger from '../utils/logger';

export function useUploadedFiles(gameId) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const fetchUserFiles = useCallback(async () => {
    if (!gameId) return;

    try {
      const response = await fetch(`/api/upload?gameId=${gameId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch uploaded files');
      }
      const files = await response.json();
      setUploadedFiles(files);
    } catch (error) {
      logger.error('Error fetching user files:', error);
    }
  }, [gameId]);

  useEffect(() => {
    fetchUserFiles();
  }, [fetchUserFiles, gameId]);

  const handleFileUpload = useCallback(
    async (file) => {
      if (!file || !gameId) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`/api/upload?gameId=${gameId}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'File upload failed');
        }

        const uploadedFile = await response.json();
        setUploadedFiles((prevFiles) => [...prevFiles, uploadedFile]);
        await fetchUserFiles(); // Refresh the list of uploaded files
      } catch (error) {
        logger.error('Error uploading file:', error);
        throw error;
      }
    },
    [gameId, fetchUserFiles]
  );

  const handleDeleteImage = useCallback(
    async (fileId) => {
      if (!gameId) return;

      try {
        const response = await fetch(
          `/api/upload?gameId=${gameId}&fileId=${fileId}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'File deletion failed');
        }

        setUploadedFiles((prevFiles) =>
          prevFiles.filter((file) => file.id !== fileId)
        );
        await fetchUserFiles(); // Refresh the list of uploaded files
      } catch (error) {
        logger.error('Error deleting image:', error);
        throw error;
      }
    },
    [gameId, fetchUserFiles]
  );

  return {
    uploadedFiles,
    fetchUserFiles,
    handleFileUpload,
    handleDeleteImage,
  };
}
