import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { path: filePath } = req.query;
  const fullPath = path.join(process.cwd(), 'public', 'uploads', ...filePath);

  if (!fs.existsSync(fullPath)) {
    res.status(404).end('File not found');
    return;
  }

  const fileContent = fs.readFileSync(fullPath);
  const contentType =
    path.extname(fullPath) === '.html'
      ? 'text/html'
      : 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.send(fileContent);
}
