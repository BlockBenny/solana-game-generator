// File: pages/api/upload.js

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default async function handler(req, res) {
  const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  const publicDir = path.join(process.cwd(), 'public');
  const uploadDir = path.join(publicDir, 'uploads', walletAddress);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (req.method === 'POST') {
    const existingFiles = fs
      .readdirSync(uploadDir)
      .filter((file) => path.extname(file).toLowerCase() === '.png');
    if (existingFiles.length >= MAX_FILES) {
      return res
        .status(400)
        .json({ error: `Maximum of ${MAX_FILES} PNG files allowed` });
    }

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
      filter: function ({ name, originalFilename, mimetype }) {
        return mimetype === 'image/png';
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds 5MB limit' });
        }
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const file = files.file?.[0];
      if (!file) {
        return res
          .status(400)
          .json({ error: 'No PNG file uploaded or file type not allowed' });
      }

      const uniqueFilename = `${file.originalFilename}`;
      const finalPath = path.join(uploadDir, uniqueFilename);

      fs.renameSync(file.filepath, finalPath);

      const publicUrl = `/uploads/${walletAddress}/${uniqueFilename}`;

      return res.status(200).json({
        id: uniqueFilename,
        name: file.originalFilename,
        path: publicUrl,
      });
    });
  } else if (req.method === 'GET') {
    try {
      const files = fs.readdirSync(uploadDir);
      const fileList = files
        .filter((file) => path.extname(file).toLowerCase() === '.png')
        .map((file) => {
          const filePath = path.join(uploadDir, file);
          const stats = fs.statSync(filePath);
          return {
            id: file,
            name: file,
            path: `/uploads/${walletAddress}/${file}`,
            size: stats.size,
          };
        });

      return res.status(200).json(fileList);
    } catch (error) {
      console.error('Error reading directory:', error);
      return res.status(500).json({ error: 'Failed to fetch uploaded files' });
    }
  } else if (req.method === 'DELETE') {
    const { fileId } = req.query;

    if (!fileId) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    const filePath = path.join(uploadDir, fileId);

    try {
      if (
        fs.existsSync(filePath) &&
        path.extname(filePath).toLowerCase() === '.png'
      ) {
        fs.unlinkSync(filePath);
        return res.status(200).json({ message: 'File deleted successfully' });
      } else {
        return res.status(404).json({ error: 'PNG file not found' });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      return res.status(500).json({ error: 'Failed to delete file' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
