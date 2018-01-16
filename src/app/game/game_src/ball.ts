import { ElementRef } from '@angular/core';
import { Vector2 } from './vector2';
import { GameObject, GameObjectArgs } from './game_object';

export class Ball extends GameObject {
	diameter: number;
	speed: number;
	maxSpeed: number;
	speedInc: number;
	direction: Vector2 = new Vector2(0, 1);

	constructor(args: GameObjectArgs, diameter:number, speed:number, maxSpeed:number, speedInc:number) {
		super(args);

		this.diameter = diameter;
		this.speed = speed;
		this.maxSpeed = maxSpeed;
		this.speedInc = speedInc;
	}

	render() {
		super.render();
		this.html.style.border = "1px solid black";
		this.html.style.borderRadius = '50%';
	}
}