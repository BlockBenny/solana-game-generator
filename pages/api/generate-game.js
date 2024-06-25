import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, currentGame } = req.body;

    try {
      console.log('Generating game with prompt:', prompt);

      let context = `Create a simple, interactive HTML5 game based on this prompt. The game should fit in a 400x400 pixel area, be fully playable, and use keyboard controls if necessary. Provide a complete HTML file including internal CSS and JavaScript. The game must be entirely self-contained within this single HTML file. 

Important: 
1. Place all game content (canvas, divs, etc.) inside a div with id="game-container". 
2. The game-container div should have a width of 600px and a height of 400px.
3. Include all necessary CSS within a <style> tag in the <head> section.
4. Include all JavaScript within a <script> tag at the end of the <body> section.
5. Ensure that the game is fully functional and playable when this HTML is loaded in a browser.
6. Always wrap your entire HTML code (including <!DOCTYPE html>) in \`\`\`html and \`\`\` tags.

Here's a basic structure to follow:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Title</title>
    <style>
        /* Your CSS here */
        #game-container {
            width: 600px;
            height: 400px;
            /* Other styles */
        }
    </style>
</head>
<body>
    <div id="game-container">
        <!-- Your game content here -->
    </div>
    <script>
        // Your JavaScript here
    </script>
</body>
</html>
\`\`\``;

      if (currentGame) {
        context +=
          ' Here is the current game code to iterate upon:\n\n' +
          `${currentGame.htmlFile}\n\n` +
          'Please modify this code based on the new prompt, ensuring to provide a complete, self-contained HTML file:';
      }

      const fullPrompt = `${context}\n\nNew prompt: ${prompt}`;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 4096,
        messages: [{ role: 'user', content: fullPrompt }],
      });

      console.log('Received response from Anthropic');

      if (!message.content || message.content.length === 0) {
        throw new Error('No content received from Anthropic');
      }

      const htmlFile = parseGameCode(message.content[0].text);

      if (!htmlFile) {
        console.error(
          'Failed to parse game code. AI response:',
          message.content[0].text
        );
        throw new Error('Failed to parse game code from Anthropic response');
      }

      console.log('Successfully parsed game code');

      res.status(200).json({
        htmlFile: htmlFile,
        modificationApplied: true,
        originalPrompt: prompt,
      });
    } catch (error) {
      console.error('Error generating game:', error);
      res.status(500).json({
        error: 'Failed to generate or modify game',
        details: error.message,
        htmlFile: currentGame?.htmlFile || '',
        modificationApplied: false,
        originalPrompt: prompt,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function parseGameCode(content) {
  console.log('Parsing game code from content');
  const htmlMatch = content.match(/```html([\s\S]*?)```/);
  if (!htmlMatch) {
    console.error('No HTML code block found in the content');
    return null;
  }
  const htmlCode = htmlMatch[1].trim();
  if (!htmlCode.includes('<div id="game-container"')) {
    console.error('No game-container div found in the HTML');
    return null;
  }
  return htmlCode;
}
