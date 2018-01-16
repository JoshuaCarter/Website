
export class Input {

	deltaX: number = 0;

	//mouse
	mouseDown: boolean = false;
	mouseX: number = 0;
	//keys
	keyLeftDown: boolean = false;
	keyRightDown: boolean = false;
	keySpeed: number = 12;
	//touch
	touching: boolean = false;
	touchX: number = 0;

	//listeners
	private lis_mouse_down: any;
	private lis_mouse_up: any;
	private lis_mouse_move: any;
	private lis_key_down: any;
	private lis_key_up: any;
	private lis_touch_start: any;
	private lis_touch_move: any;
	private lis_touch_end: any;

	constructor() {
		this.lis_mouse_down = document.addEventListener("mousedown", (event) => { this.onevent(event) });
		this.lis_mouse_up = document.addEventListener("mouseup", (event) => { this.onevent(event) });
		this.lis_mouse_move = document.addEventListener("mousemove", (event) => { this.onevent(event) });
		this.lis_key_down = document.addEventListener("keydown", (event) => { this.onevent(event) });
		this.lis_key_up = document.addEventListener("keyup", (event) => { this.onevent(event) });
		this.lis_touch_start = document.addEventListener("touchstart", (event) => { this.onevent(event) });
		this.lis_touch_move = document.addEventListener("touchmove", (event) => { this.onevent(event) });
		this.lis_touch_end = document.addEventListener("touchend", (event) => { this.onevent(event) });

		//disable touch scrolling of page in background
		document.body.classList.add('touch-action-none');
	}

	destroy() {
		document.removeEventListener("mousedown", this.lis_mouse_down);
		document.removeEventListener("mouseup", this.lis_mouse_up);
		document.removeEventListener("mousemove", this.lis_mouse_move);
		document.removeEventListener("keydown", this.lis_key_down);
		document.removeEventListener("keyup", this.lis_key_up);
		document.removeEventListener("touchstart", this.lis_touch_start);
		document.removeEventListener("touchmove", this.lis_touch_move);
		document.removeEventListener("touchend", this.lis_touch_end);

		//enable touch scrolling of page
		document.body.classList.remove('touch-action-none');
	}

	update() {
		//update delta if left key held down
		if(this.keyLeftDown) {
			this.deltaX = -this.keySpeed;
		}
		//update delta if right key held down
		else if(this.keyRightDown) {
			this.deltaX = this.keySpeed;
		}
		//otherwise reset delta
		else {
			this.deltaX = 0;
		}	
	}

	onevent(event = null) {
		//mb1 on canvas
		if (event.type == "mousedown" && event.target.id == "canvas") {
			this.mouseDown = true;
			this.mouseX = event.x;
		}
		//move after holding mb1 on canvas
		else if (event.type == "mousemove" && this.mouseDown == true) {
			this.deltaX += event.x - this.mouseX;
			this.mouseX = event.x;
		}
		//release mb1
		else if (event.type == "mouseup") {
			this.mouseDown = false;
		}
		//press left or right arrow
		else if(event.type == "keydown") {
			//left
			if (event.key == "ArrowLeft" || event.key == "Left") {
				this.keyLeftDown = true;
			}
			//right
			else if (event.key == "ArrowRight" || event.key == "Right") {
				this.keyRightDown = true;
			}
		}
		//release left or right arrow
		else if(event.type == "keyup") {
			//left
			if (event.key == "ArrowLeft" || event.key == "Left") {
				this.keyLeftDown = false;
			}
			//right
			else if (event.key == "ArrowRight" || event.key == "Right") {
				this.keyRightDown = false;
			}
		}
		//screen touched
		else if(event.type == "touchstart") {
			this.touchX = event.changedTouches[0].clientX;
			this.touching = true;
		}
		//drag after touching screen
		else if (event.type == "touchmove" && this.touching) {
			this.deltaX += event.changedTouches[0].clientX - this.touchX;
			this.touchX = event.changedTouches[0].clientX;
		}
		//touch released
		else if (event.type == "touchend") {
			this.touching = false;
		}
	}
}