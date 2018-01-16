import { GameObject, GameObjectArgs } from "./game_object";
import { Vector2 } from "./vector2";

export class NameField extends GameObject {
	area: HTMLTextAreaElement;
	textColor: string;
	onSubmit: () => any;

	constructor(args: GameObjectArgs, textColor:string, onSubmit: () => any) {
		super(args);

		this.textColor = textColor;
		this.onSubmit = onSubmit;
		this.display = 'none';

		this.area = document.createElement('textarea');
		this.area.setAttribute('maxlength', '10');
		this.area.setAttribute('spellcheck', 'false');
		this.area.oninput = (e) => { this.onInput(e) };
		this.area.onkeydown = (e) => { this.onEnter(e) };
		
		this.canvas.nativeElement.appendChild(this.area);
	}

	render() {
		super.render();

		let margin = new Vector2(this.size.x * .05, this.size.y * .15);

		this.area.style.cssText = `
			display: ${this.display};
			position: absolute;
			background-color: ${this.color};
			overflow: hidden;
			background-color: rgba(0,0,0,0);
			width: ${this.size.x - margin.x}px;
			height: ${this.size.y - margin.y}px;
			left: ${this.position.x + margin.x / 2}px;
			top: ${this.position.y + margin.y / 2}px;
			text-align: center;
			color: ${this.textColor};
			font-size: ${this.size.y * .75}px;
			font-family: Consolas, Monospace;
			font-weight: 700;
			border: none;
			outline: none;
			resize: none;
		`;
	}

	focus() {
		this.area.focus();
	}

	onInput(e) {
		this.area.value = this.area.value.replace(/[^0-9a-zA-Z_]/, '');
	}

	onEnter(e) {
		if(e.key == "Enter") {
			this.onSubmit();
		}
	}

	getText() {
		return this.area.value;
	}
}