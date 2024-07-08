import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { path: filePath } = req.query;
  const fullPath = path.join(process.cwd(), 'public', 'uploads', ...filePath);

  if (!fs.existsSync(fullPath)) {
    return res.status(404).end('File not found');
  }

  const fileContent = fs.readFileSync(fullPath);
  const contentType = getContentType(path.extname(fullPath));

  res.setHeader('Content-Type', contentType);
  res.send(fileContent);
}

function getContentType(extension) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
  };

  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}
