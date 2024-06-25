import React, { useEffect, useRef } from 'react';

const SpaceInvadersGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const pepeImage = new Image();
    pepeImage.src = 'pepe.png';
    const shibaImage = new Image();
    shibaImage.src = 'shiba.png';

    const player = {
      x: canvas.width / 2 - 20,
      y: canvas.height - 40,
      width: 40,
      height: 40,
      speed: 5,
    };

    let projectiles = [];
    let enemies = [];
    const enemyRows = 3;
    const enemyCols = 6;
    let gameOver = false;
    let score = 0;
    let level = 1;
    let enemySpeed = 0.2;
    let enemySpeedIncrease = 0.1;

    const keys = {};

    function createEnemies() {
      enemies = [];
      const totalEnemyWidth = enemyCols * 60;
      const startX = (canvas.width - totalEnemyWidth) / 2;
      for (let i = 0; i < enemyRows; i++) {
        for (let j = 0; j < enemyCols; j++) {
          enemies.push({
            x: startX + j * 60,
            y: i * 40 + 30,
            width: 30,
            height: 30,
          });
        }
      }
    }

    function drawPlayer() {
      ctx.drawImage(
        shibaImage,
        player.x,
        player.y,
        player.width,
        player.height
      );
    }

    function drawProjectiles() {
      projectiles.forEach((proj) => {
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(proj.x, proj.y, 5, 10, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#654321';
        ctx.fillRect(proj.x - 3, proj.y - 8, 6, 2);
        ctx.fillRect(proj.x - 3, proj.y - 4, 6, 2);
        ctx.fillRect(proj.x - 3, proj.y, 6, 2);
        ctx.fillRect(proj.x - 3, proj.y + 4, 6, 2);
      });
    }

    function drawEnemies() {
      enemies.forEach((enemy) => {
        ctx.drawImage(pepeImage, enemy.x, enemy.y, enemy.width, enemy.height);
      });
    }

    function checkCollisions() {
      projectiles.forEach((proj, projIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
          if (
            proj.x < enemy.x + enemy.width &&
            proj.x + 5 > enemy.x &&
            proj.y < enemy.y + enemy.height &&
            proj.y + 10 > enemy.y
          ) {
            projectiles.splice(projIndex, 1);
            enemies.splice(enemyIndex, 1);
            score += 10;
          }
        });
      });
    }

    function nextLevel() {
      level++;
      enemySpeed += enemySpeedIncrease;
      createEnemies();
    }

    function update() {
      if (gameOver) return;

      if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
      if (keys.ArrowRight && player.x < canvas.width - player.width)
        player.x += player.speed;

      projectiles.forEach((proj, index) => {
        proj.y -= 5;
        if (proj.y < 0) projectiles.splice(index, 1);
      });

      enemies.forEach((enemy) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) gameOver = true;
      });

      checkCollisions();

      if (enemies.length === 0) {
        nextLevel();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawPlayer();
      drawProjectiles();
      drawEnemies();

      ctx.fillStyle = '#00ff00';
      ctx.font = '20px Courier New';
      ctx.fillText(`Score: ${score}`, 10, 30);
      ctx.fillText(`Level: ${level}`, canvas.width - 100, 30);

      if (gameOver) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '40px Courier New';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '20px Courier New';
        ctx.fillText(
          'Press R to Restart',
          canvas.width / 2 - 150,
          canvas.height / 2 + 40
        );
      }
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    function startGame() {
      gameOver = false;
      score = 0;
      level = 1;
      enemySpeed = 0.2;
      createEnemies();
      projectiles = [];
      player.x = canvas.width / 2 - player.width / 2;
    }

    let imagesLoaded = 0;

    function imageLoaded() {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        startGame();
        gameLoop();
      }
    }

    pepeImage.onload = imageLoaded;
    shibaImage.onload = imageLoaded;

    const handleKeyDown = (e) => {
      keys[e.code] = true;
      if (e.code === 'KeyS' && !gameOver) {
        projectiles.push({ x: player.x + player.width / 2, y: player.y });
      }
      if (e.code === 'KeyR') {
        startGame();
      }
    };

    const handleKeyUp = (e) => {
      keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="">
      <h1 className="text-xl">Example</h1>
      <div className="instructions mb-6">
        Use ← → to move, S to shoot, R to restart
      </div>
      <canvas
        ref={canvasRef}
        width="800"
        height="400"
        id="gameCanvas"
        className="w-full border border-1 border-white"
      ></canvas>
    </div>
  );
};

export default SpaceInvadersGame;
