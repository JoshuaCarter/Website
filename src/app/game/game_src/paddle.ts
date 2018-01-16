import { ElementRef } from '@angular/core';
import { Vector2 } from './vector2';
import { GameObject, GameObjectArgs } from './game_object';

export class Paddle extends GameObject {
	deltas: number[] = [];
	line: HTMLDivElement;

	constructor(args: GameObjectArgs) {
		super(args);

		this.line = document.createElement('div');
		this.canvas.nativeElement.appendChild(this.line);

		this.line.style.cssText = `
			position: absolute;
			background-color: #111;
			width: 100%;
			height: 1px;
			left: 0;
			top: ${this.position.y + this.size.y / 2}px;
			pointer-events: none;
		`;
		this.line.style.zIndex = '-1';
	}

	getMotion() {
		let motion = 0;
		
		if(this.deltas.length > 0) {		
			for(let i = 0; i < this.deltas.length; ++i) {
				motion += this.deltas[i];
			}
			motion /= this.deltas.length;
		}

		this.deltas = [];
		return motion;
	}

	translate(delta:Vector2) {
		this.deltas.push(delta.x);
		if(this.deltas.length > 5) {
			this.deltas.splice(0, 1);
		}

		super.translate(delta);
	}

	render() {
		super.render();
		this.html.style.borderRadius = `${this.size.y / 3}px`;
		this.html.style.border = "1px solid black";
	}

	destroy() {
		super.destroy();

		this.line.parentNode.removeChild(this.line);
	}
}