import { ElementRef } from '@angular/core';
import { Vector2 } from './vector2';

export interface GameObjectArgs {
	position: Vector2;
	size: Vector2;
	color: string;
	canvas: ElementRef;
}

export class GameObject {
	position: Vector2;
	size: Vector2;
	color: string;
	canvas: ElementRef;
	html: HTMLDivElement;
	display: string = 'inline';

	constructor(args:GameObjectArgs) {
		this.position = args.position;
		this.size = args.size;
		this.color = args.color;
		this.canvas = args.canvas;

		this.html = document.createElement('div');
		this.canvas.nativeElement.appendChild(this.html);
	}

	render() {
		this.html.style.cssText = `
			display: ${this.display};
			position: absolute;
			background-color: ${this.color};
			width: ${this.size.x}px;
			height: ${this.size.y}px;
			left: ${this.position.x}px;
			top: ${this.position.y}px;
			pointer-events: none;
		`;
	}

	destroy() {
		this.html.parentNode.removeChild(this.html);
	}

	translate(delta: Vector2) {
		this.position = this.position.add(delta);
	}
}