import { GameObject, GameObjectArgs } from "./game_object";
import { Vector2 } from "./vector2";

export class Button extends GameObject {
	colorHover: string;
	textColor: string;
	textColorHover: string;
	textContent: string;
	onClick: () => any;

	hovering: boolean = false;

	constructor(args: GameObjectArgs, colorHover: string, textColor: string, textColorHover: string, textContent: string, onClick: () => void) {
		super(args);

		this.colorHover = colorHover;
		this.textColor = textColor;
		this.textColorHover = textColorHover;
		this.textContent = textContent;
		this.onClick = onClick;

		this.html.onclick = this.onClick;
		this.html.addEventListener("mouseover", (e) => { this.onMouseOver(e) });
		this.html.addEventListener("mouseout", (e) => { this.onMouseOut(e) });
	}

	render() {
		this.html.innerHTML = this.textContent;

		this.html.style.cssText = `
			display: ${this.display};
			position: absolute;
			color: ${this.hovering ? this.textColorHover : this.textColor};
			background-color: ${this.hovering ? this.colorHover : this.color};
			border-radius: 50%;
			width: ${this.size.x}px;
			height: ${this.size.y}px;
			left: ${this.position.x}px;
			top: ${this.position.y}px;
			text-align: center;
			line-height: ${this.size.y}px;
			font-size: calc(${this.size.y}px - 5px);
			font-family: Consolas, monospace;
			cursor: pointer;
			user-select: none;
		`;
	}

	onMouseOver(event) {
		this.hovering = true;
		this.render();
	}

	onMouseOut(event) {
		this.hovering = false;
		this.render();
	}
}