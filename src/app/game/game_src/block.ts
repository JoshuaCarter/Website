import { ElementRef } from '@angular/core';
import { Vector2 } from './vector2';
import { GameObject, GameObjectArgs } from './game_object';


export class Block extends GameObject {
	dyingColor: string;

	constructor(args: GameObjectArgs, dyingColor: string) {
		super(args);

		this.dyingColor = dyingColor;
	}

	render() {
		super.render();

		this.html.style.border = "1px solid black";
	}

	fade(dt) {
		if (this.html.style.opacity == "") {
			this.html.style.opacity = "1";
			this.html.style.backgroundColor = this.dyingColor;
		} else {
			let op = +this.html.style.opacity;
			op -= 3 * dt;
			this.html.style.opacity = op.toString();

			if (op <= 0) {
				return false;
			}
		}

		return true;
	}
}