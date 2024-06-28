import fs from 'fs';
import path from 'path';

export default function Game({ htmlContent }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'public', 'game0.html');
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      htmlContent,
    },
  };
}
