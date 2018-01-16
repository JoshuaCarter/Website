import { ElementRef } from '@angular/core';

import { Vector2 } from './vector2';
import { GameObject } from './game_object';
import { Block } from './block';
import { Ball } from './ball';
import { Paddle } from './paddle';
import { Label } from './label';
import { Input } from './input';
import { NameField } from './name_field';
import { Button } from './button';
import { Sound } from './sound';

export class Game {
	//ref to canvas html element
	canvas: ElementRef;
	//scalar to keep sizes relative to canvas
	ratio: number;
	//size of canvas element
	canvasSize: Vector2;

	//input for moving paddle
	input: Input;
	//sound mananger
	sound: Sound;
	//flag to stop requesting animation frames
	gameClosed: boolean = false;
	//time in ms since game launch
	gameTime: number = 0;
	//time since last animation frame
	deltaTime: number = 0;

	//game objects
	blocks: Block[] = [];
	paddle: Paddle;
	ball: Ball;

	//music
	bgMusic: HTMLAudioElement;
	//screen text
	alertText: Label;

	//used in collision calcs
	prevBallPos: Vector2;
	//used to animate dying blocks
	dyingBlocks: Block[] = [];

	//how many frames paddle delta effects ball dir
	influenceFrames: number = 0;
	//frames before game starts
	countDownFrames: number = 200;
	//game over text
	gameOverFrames: number = 120;
	//game over flag
	gameOver: boolean = false;
	//close game btn
	closeGameBtn: Button;

	//game over event
	GameOver: (score: number, name: string) => void;
	//close game event
	CloseGame: () => void;

	//score
	scoreText: Label;
	points: number = 10;
	score: number = 0;
	combo: number = 1;
	nameField: NameField;

	constructor(canvas:ElementRef, onCloseGame:() => void, onGameOver: (score:number, name:string) => void) {
		this.canvas = canvas;
		this.CloseGame = onCloseGame;
		this.GameOver = onGameOver;

		this.input = new Input();

		this.sound = new Sound();
		this.sound.load("assets/bounce.mp3");
		this.sound.load("assets/bg_music.mp3");
		this.sound.play("bg_music", false, true);

		this.initCanvas();
		this.initCloseBtn();
		this.initObjects();
	}

	destroy() {
		//stop game loop
		this.gameClosed = true;
		//destroy music
		this.sound.destroy();
		//destroy input event listeners
		this.input.destroy();
	}

	run() {
		//run game update on next animation frame
		window.requestAnimationFrame((ts) => { this.update(ts) });
	}

	update(ts) {
		//calc delta time (in sec)
		this.deltaTime = (ts - this.gameTime) / 1000;
		//store game time (in ms)
		this.gameTime = ts;
		
		//queue next animation frame
		if(!this.gameClosed) {
			this.run();
		}

		//game running
		if (!this.gameOver) {
			//only update ball after count down
			this.countDownFrames--;
			if (this.countDownFrames <= 0) {
				this.updateBall();
			}

			this.updateBlocks();
			this.updatePaddle();
			this.updateText();

			this.input.update();
		}
		//else game over
		else {
			//count down frames
			this.gameOverFrames--;

			//when game over countdown done
			if (this.gameOverFrames == 0) {
				//setup game over screen
				this.initGameOver();
			}

			//dying blocks need updating if game ends due to no blocks left
			this.updateBlocks();
		}
	}

	rel(val:number) {
		return val * this.ratio;
	}

	initSize(size: number) {
		//base size for calculating ratio
		let baseSize = 300;

		//calc ratio so that everything can be scaled up/down according to screen size
		this.ratio = size / 300;

		//scaled size for canvas
		this.canvasSize = new Vector2(this.rel(baseSize), this.rel(baseSize));
	}

	initCanvas() {
		//inner window size
		let win = new Vector2(document.body.clientWidth, document.body.clientHeight);

		//room for nav and close button
		let topOffset = 50;

		//common properties for both wider/taller styles
		let commonStlyes = `
			box-sizing: content-box;
			position: fixed;
			overflow: hidden;
			background-color: #392D3A;
			border: 2px solid #61C9A8;
			border-radius: 5px;
		`;

		//if screen wider than tall
		if (win.x >= win.y - topOffset) {
			//x/y size of game window
			this.initSize(win.y - topOffset - 17);

			//style canvas
			this.canvas.nativeElement.style = `
				${commonStlyes}
				width: ${this.canvasSize.x}px;
				height: ${this.canvasSize.y}px;
				left: calc(50% - ${this.canvasSize.x / 2}px - 2px);
				top: ${topOffset}px;		
			`;
		} 
		//else screen taller than wide
		else {
			//x/y size of game window
			this.initSize(win.x - 24);

			//style canvas
			this.canvas.nativeElement.style = `
				${commonStlyes}
				width: ${this.canvasSize.x}px;
				height: ${this.canvasSize.y}px;
				left: calc(50% - ${this.canvasSize.x / 2}px - 2px);
				top: calc(50% - ${this.canvasSize.y / 2}px + ${topOffset / 2}px);			
			`;
		}
	}

	initCloseBtn() {
		let size = Math.ceil(20);

		this.closeGameBtn = new Button({
			canvas: this.canvas,
			color: 'transparent',
			position: new Vector2(this.rel(300) - size - 5, 5),
			size: new Vector2(size, size)
		}, '#A53737', 'gray', 'white', '&#x2715;', this.CloseGame);

		this.closeGameBtn.render();
	}

	initObjects() {
		//make blocks
		let cols = 11;
		let rows = 7;
		let size = new Vector2(20, 11);
		let gap = 2;
		let left = (300 - (cols * size.x) - (cols * gap)) / 2;
		
		for (let x = 0; x < cols; ++x) {
			for (let y = 0; y < rows; ++y) {
				let margin = new Vector2(left + (x * gap), 30 + (y * gap));

				let block = new Block({ 
					canvas: this.canvas,
					color: "#CDB499",
					position: new Vector2(this.rel(margin.x + x * size.x), this.rel(margin.y + y * size.y)),
					size: new Vector2(this.rel(size.x), this.rel(size.y)),

				}, "#A53737");

				block.render();
				this.blocks.push(block);
			}
		}

		//make paddle
		{
			let size = new Vector2(70, 6);

			this.paddle = new Paddle({
				canvas: this.canvas,
				color: "#239A73",
				position: new Vector2(this.rel(150 - size.x / 2), this.rel(285 - size.y)),
				size: new Vector2(this.rel(size.x), this.rel(size.y)),
			});

			this.paddle.render();
		}

		//make ball
		{
			let diameter = this.rel(8);
			let speed = this.rel(100);
			let maxSpeed = this.rel(200);
			let speedInc = (maxSpeed - speed) / 10;

			this.ball = new Ball({
				canvas: this.canvas,
				color: "#C4F4E4",
				position: new Vector2(this.rel(150) - diameter / 2, this.rel(150)),
				size: new Vector2(diameter, diameter),
				
			}, diameter, speed, maxSpeed, speedInc);

			this.ball.render();
		}

		//make text
		this.alertText = new Label({
			canvas: this.canvas,
			color: "#F22",
			position: new Vector2(this.rel(0), this.rel(180)),
			size: new Vector2(this.rel(300), this.rel(50)),

		}, "");

		this.alertText.render();

		//make text input
		{
			this.nameField = new NameField({
				canvas: this.canvas,
				color: '#110D11',
				position: new Vector2(this.rel(10), this.rel(120)),
				size: new Vector2(this.rel(280), this.rel(60))
			}, '#C4F4E4', () => { this.onScoreSubmit() });

			this.nameField.render();
		}
	}

	initGameOver() {
		//kill all game objects
		this.ball.destroy();
		this.paddle.destroy();
		for (let block of this.blocks) {
			block.destroy();
		}

		//top text
		this.alertText.text = "Enter Name:";
		this.alertText.position = new Vector2(0, this.rel(50));
		this.alertText.color = "#61C9A8";
		this.alertText.render();

		//name input
		this.nameField.display = 'default';
		this.nameField.render();
		this.nameField.focus();

		//score text
		this.scoreText = new Label({
			canvas: this.canvas, 
			color: '#F7D9B9',
			position: new Vector2(0, this.rel(200)),
			size: new Vector2(this.rel(300), this.rel(50))
		}, this.score.toString());

		this.scoreText.render();
	}

	updateBall() {
		//contrain ball's speed
		if (this.ball.speed > this.ball.maxSpeed) {
			this.ball.speed = this.ball.maxSpeed;
		}
		//move ball
		let move = this.ball.direction.mul(this.ball.speed * this.deltaTime);
		this.ball.translate(move);

		//contrain to bounds on top
		if (this.ball.position.y < 0) {
			this.ball.position.y = 0;
			this.ball.direction.y = -this.ball.direction.y;
			this.sound.play("bounce", true);
		}
		//left
		if (this.ball.position.x > this.canvasSize.x - this.ball.diameter) {
			this.ball.position.x = this.canvasSize.x - this.ball.diameter;
			this.ball.direction.x = -this.ball.direction.x;
			this.sound.play("bounce", true);

		}
		//right
		if (this.ball.position.x < 0) {
			this.ball.position.x = 0;
			this.ball.direction.x = -this.ball.direction.x;
			this.sound.play("bounce", true);
		}

		//if ball off bottom of screen (game over)
		if (this.ball.position.y > this.canvasSize.y + this.rel(50)) {
			this.gameOver = true;
		}		

		//render changes
		this.ball.render();
	}

	updateBlocks() {
		//store collision result with biggest area of overlap
		let info = null;
		let block = null;
		let index = 0;

		//check all blocks for collision with ball
		for (let i = 0; i < this.blocks.length; ++i) {
			let b: Block = this.blocks[i];

			//check for collision
			let r = this.boxCollision(
				this.ball.position,
				new Vector2(this.ball.diameter, this.ball.diameter),
				b.position,
				b.size);

			//if collision occurred and no prior collision or this is a bigger one
			if (r.collision && (info == null || info.area < r.area)) {
				//store for later use
				info = r;
				block = b;
				index = i;
			}
		}

		//check if collision was found above
		if (info != null) {
			//vals for pushing ball out of intersection
			let invDir = this.ball.direction.inv();
			let distance: number = 0;

			//if ball approached the block vertically
			if (this.prevBallPos.y + this.ball.diameter < block.position.y ||
				this.prevBallPos.y > block.position.y + block.size.y) {
				//use y axis to calc push-back dist to undo intersection
				distance = info.overlap.y / Math.abs(invDir.y);
				//reflect y dir because it approached vertically
				this.ball.direction.y = -this.ball.direction.y;
			}
			//else must have appraoched horizontally
			else {
				//use x axis to calc push-back dist to undo intersection
				distance = info.overlap.x / Math.abs(invDir.x);
				//reflect x dir because it approached horizontally
				this.ball.direction.x = -this.ball.direction.x;
			}

			//undo interection / move block back along inverse dir
			this.ball.translate(invDir.mul(distance));
			//render/bounce
			this.ball.render();
			this.sound.play("bounce", true);

			this.dyingBlocks.push(block);
			this.blocks.splice(index, 1);

			//add to score
			this.score += this.points * this.combo;
			this.combo += 1;
		}

		//track ball's previous pos for next time
		this.prevBallPos = this.ball.position;

		//fade dying blocks
		for (let i = 0; i < this.dyingBlocks.length; ++i) {
			let b = this.dyingBlocks[i];

			//if cannot fade further
			if (!b.fade(this.deltaTime)) {
				//destroy block
				b.destroy();
				this.dyingBlocks.splice(i, 1);
				i--;
			}
		}

		//if no more blocks, game over
		if(this.blocks.length == 0) {
			this.gameOver = true;
		}
	}

	updatePaddle() {

		//move paddle (must do even if delta is zero for motion buffering)
		this.paddle.translate(new Vector2(this.input.deltaX, 0));

		//constrain to bounds
		if (this.paddle.position.x > this.canvasSize.x - this.paddle.size.x) {
			this.paddle.position.x = this.canvasSize.x - this.paddle.size.x;

		} else if (this.paddle.position.x < 0) {
			this.paddle.position.x = 0;
		}

		//render changes
		this.paddle.render();

		//paddle collision
		let ballLeft = this.ball.position.x;
		let ballRight = this.ball.position.x + this.ball.diameter;
		let ballBot = this.ball.position.y + this.ball.diameter;
		let ballTop = this.ball.position.y;
		let paddleLeft = this.paddle.position.x;
		let paddleRight = this.paddle.position.x + this.paddle.size.x;
		let paddleTop = this.paddle.position.y;
		let paddleBot = this.paddle.position.y + this.paddle.size.y;

		//check for collision
		if (ballLeft < paddleRight && ballRight > paddleLeft &&
			ballBot > paddleTop && ballTop < paddleBot &&
			this.ball.direction.y > 0) {
			//reflect ball's velocity
			this.ball.direction.y = -this.ball.direction.y;

			//put ball flush with paddle
			this.ball.position.y = this.paddle.position.y - this.ball.diameter;
			//render/bounce
			this.ball.render();
			this.sound.play("bounce", true);

			//reset combo
			this.combo = 1;

			//speed up ball
			this.ball.speed += this.ball.speedInc;

			//num of frames to influence ball's x velocity
			this.influenceFrames = 3;
		}

		//apply paddle motion to ball direction
		if (this.influenceFrames > 0) {

			//influence balls's x velocity by paddle motion (relative to canvas)
			let inf = this.paddle.getMotion() / this.canvasSize.x;
			this.ball.direction.x += inf * 10;
			this.ball.direction = this.ball.direction.norm();

			//independant normalised X/Y dirs
			let dirX = this.ball.direction.x < 0 ? -1 : 1;
			let dirY = this.ball.direction.y < 0 ? -1 : 1;

			//if ball dir more horizontal than vertical
			if (Vector2.up.dot(this.ball.direction) < .5) {
				//contrain dir to 50% horizontal
				let dir = new Vector2(dirX, dirY);
				this.ball.direction = dir.norm();
			}

			this.influenceFrames--;
		}
	}

	updateText() {
		//if counting down
		if (this.countDownFrames > 140) {
			this.alertText.text = "3";
			this.alertText.render();
		} else if (this.countDownFrames > 80) {
			this.alertText.text = "2";
			this.alertText.render();
		} else if (this.countDownFrames > 20) {
			this.alertText.text = "1";
			this.alertText.render();
		} else if (this.countDownFrames > 0) {
			this.alertText.text = "Go!";
			this.alertText.render();
		} else if (this.gameOver) {
			//game over
			this.alertText.text = "Game Over!";
			this.alertText.render();
		} else {
			//hide text
			this.alertText.text = "";
			this.alertText.render();
		}
	}

	onScoreSubmit() {
		let name = this.nameField.getText();
		if(name.length > 0) {
			this.GameOver(this.score, name);
		}
	}

	boxCollision(pos1:Vector2, size1:Vector2, pos2:Vector2, size2:Vector2) {
		let r = { collision: false, overlap: null, area: 0 };

		//true if no collision
		if (pos1.x > pos2.x + size2.x || pos1.x + size1.x < pos2.x ||
			pos1.y > pos2.y + size2.y || pos1.y + size1.y < pos2.y) {
			return r;
		} 
		//else colliding
		else {
			r.collision = true;
			r.overlap = new Vector2(
				Math.min(pos1.x + size1.x, pos2.x + size2.x) - Math.max(pos1.x, pos2.x),
				Math.min(pos1.y + size1.y, pos2.y + size2.y) - Math.max(pos1.y, pos2.y));
			r.area = r.overlap.x * r.overlap.y;
			return r;
		}
	}
}