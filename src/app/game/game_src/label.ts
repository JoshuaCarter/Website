import { GameObject, GameObjectArgs } from "./game_object";

export class Label extends GameObject {
	text: string;

	constructor(args:GameObjectArgs, text:string) {
		super(args);

		this.text = text;
	}

	render() {
		super.render();

		this.html.textContent = this.text;

		this.html.style.cssText += `
			overflow: hidden;
			user-select: none;
			cursor: default;
			text-align: center;
			background-color: rgba(0,0,0,0);
			color: ${this.color};
			font-size: ${this.size.y * .75}px;
			font-family: Helvetica, sans-serif;
			font-weight: 700;
			text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
		`;
	}
}