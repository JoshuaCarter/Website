
export class Vector2 {
	static up = new Vector2(0, -1);
	static down = new Vector2(0, 1);
	static left = new Vector2(-1, 0);
	static right = new Vector2(1, 0);
	static zero = new Vector2(0, 0);

	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(v: Vector2) {
		return new Vector2(this.x + v.x, this.y + v.y);
	}
	sub(v: Vector2) {
		return new Vector2(this.x - v.x, this.y - v.y);
	}
	mul(v: (Vector2 | number)) {
		if (v instanceof Vector2) {
			return new Vector2(this.x * v.x, this.y * v.y);
		} else {
			return new Vector2(this.x * v, this.y * v);
		}
	}
	div(v: (Vector2 | number)) {
		if (v instanceof Vector2) {
			return new Vector2(this.x / v.x, this.y / v.y);
		} else {
			return new Vector2(this.x / v, this.y / v);
		}
	}
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	norm() {
		let m = this.mag();
		return new Vector2(this.x / m, this.y / m);
	}
	inv() {
		return new Vector2(-this.x, -this.y);
	}
	dot(v:Vector2) {
		return this.x * v.x + this.y * v.y;
	}
}