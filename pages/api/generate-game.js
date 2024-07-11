import Anthropic from '@anthropic-ai/sdk';
import { Pool } from 'pg';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, currentGame, publicKey, gameId, isIteration } = req.body;

    try {
      console.log('Generating game with prompt:', prompt);

      let context = `You are a HTML5 Game Developer with 30 years of experienc ein the Field
      
Follow these instructions precisely:

1. Game Functionality:
   - The game MUST work perfectly when the HTML is loaded in a browser.
   - Implement the exact gameplay mechanics described in the prompt.
   - If the prompt modifies an existing game, apply ONLY the requested changes.

2. Game Design:
   - The game is rendered in a 375x667 pixels container.
   - Responsive: Adapt to the container size and make it mobile responsive without it being scrollable.
   - Visuals: Clean, appealing graphics using HTML5 Canvas or DOM elements.

3. Essential Components:
   - Game loop: Use requestAnimationFrame for smooth updates.
   - Score system: Implement and display prominently.
   - Start/End conditions: Clear game start and end states.

4. Code Quality:
   - Write clean, well-commented code.
   - Do NOT use external libraries or frameworks.
   - Optimize for performance (efficient rendering, minimal DOM manipulation).

6. Strict Requirements:
   - NO placeholder code or comments like "Add game logic here".
   - FULLY implement all game features mentioned in the prompt.
   - DO NOT use browser alerts. Implement custom in-game messages.
   - Write as LESS code as possible WITHOUT loosing functionality, logic or style.
   - For images, use: src="https://gamecraft.rocks/uploads/${publicKey}/[image-name]"

7. Testing:
   - Mentally run through the game logic to ensure it works as intended.
   - Verify that ALL prompt requirements are met before submitting.

Most importantly:

- DO ONLY RETURN THE HTML CODE. DO NOT EXPLAIN OR COMMENT ON THE CODE. Your response should contain ONLY the HTML code for the game.
- VERY IMPORTANT: Do NOT use browser alerts for in-game messages. Implement custom in-game messages instead.

Add this to the code so it always prevents zooming on double-tap:

// Add this to prevent zooming on double-tap
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
    }
    }, { passive: false });
    
    // Disable double-tap zoom on the entire document
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
        }
        lastTouchEnd = now;
        }, false);

        
We will have massive losses if you do not follow these instructions, which could harm us heavily. Please follow the instructions carefully!

`;

      if (currentGame != '<div>New Game</div>') {
        context += `\nHere is the current game code to enhance and modify:\n\n
${currentGame}
\n\nAnalyze this code carefully. Preserve its core functionality while implementing the requirements of the following prompt:\n
`;
      } else {
        context += 'Now, create an amazing game based on the following prompt:';
      }

      const fullPrompt = `${context}\n<prompt>\n${prompt}\n</prompt>`;

      console.log('Sending prompt to Anthropic:', fullPrompt);

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 4096,
        system:
          'You are a master game developer with expertise in creating engaging HTML5 games. You are always returning full HTML code for the games without any additional comments.',
        messages: [{ role: 'user', content: fullPrompt }],
      });

      console.log('Received response from Anthropic');

      if (!message.content || message.content.length === 0) {
        throw new Error('No content received from Anthropic');
      }

      console.log('AI Response:', message.content[0].text);

      const htmlFile = parseGameCode(message.content[0].text);

      if (!htmlFile) {
        console.error('Failed to parse game code from Anthropic response');
        throw new Error('Failed to parse game code from Anthropic response');
      }

      console.log('Successfully parsed game code');

      // Save the game and its new version to the database
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        let game;
        if (isIteration && gameId) {
          // Update existing game
          const updateGameQuery =
            'UPDATE games SET updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, title';
          const gameResult = await client.query(updateGameQuery, [gameId]);
          game = gameResult.rows[0];
        } else {
          // Create new game
          const createGameQuery =
            'INSERT INTO games (user_public_key, title) VALUES ($1, $2) RETURNING id, title';
          const gameResult = await client.query(createGameQuery, [
            publicKey,
            'Awesome HTML5 Game',
          ]);
          game = gameResult.rows[0];
        }

        // Get the latest version number
        const versionQuery =
          'SELECT MAX(version_number) as max_version FROM game_versions WHERE game_id = $1';
        let versionResult = await client.query(versionQuery, [game.id]);
        const latestVersion = versionResult.rows[0].max_version || 0;
        const newVersionNumber = latestVersion + 1;

        // Insert new game version
        const insertVersionQuery =
          'INSERT INTO game_versions (game_id, version_number, html_content, prompt) VALUES ($1, $2, $3, $4) RETURNING id, version_number';
        versionResult = await client.query(insertVersionQuery, [
          game.id,
          newVersionNumber,
          htmlFile,
          prompt,
        ]);
        const newVersion = versionResult.rows[0];

        await client.query('COMMIT');

        res.status(200).json({
          htmlFile: htmlFile,
          modificationApplied: true,
          originalPrompt: prompt,
          gameId: game.id,
          gameTitle: game.title,
          versionId: newVersion.id,
          versionNumber: newVersion.version_number,
        });
      } catch (dbError) {
        await client.query('ROLLBACK');
        throw dbError;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({
        error: 'An unexpected error occurred',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// ... (previous code remains the same)

function parseGameCode(content) {
  console.log('Parsing game code from content');

  // Try to find HTML code wrapped in code blocks
  let htmlMatch = content.match(/```html([\s\S]*?)```/);

  if (htmlMatch) {
    console.log('Found HTML code wrapped in code blocks');
    return htmlMatch[1].trim();
  }

  // If no code blocks, try to extract everything between <html> tags
  htmlMatch = content.match(/<html[\s\S]*<\/html>/i);

  if (htmlMatch) {
    console.log('Found HTML code between <html> tags');
    return htmlMatch[0].trim();
  }

  // If still no match, look for a <div id="game-container"> as a starting point
  htmlMatch = content.match(/<div id="game-container"[\s\S]*<\/div>/i);

  if (htmlMatch) {
    console.log('Found game container div');
    // Wrap the game container in a basic HTML structure
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML5 Game</title>
</head>
<body>
    ${htmlMatch[0]}
</body>
</html>
    `.trim();
  }

  // If we still haven't found any HTML, check if the entire content is valid HTML
  if (
    content.trim().startsWith('<!DOCTYPE html>') ||
    content.trim().startsWith('<html>')
  ) {
    console.log('Entire content appears to be valid HTML');
    return content.trim();
  }

  console.error('No valid HTML code found in the content');
  return null;
}

// ... (rest of the code remains the same)
