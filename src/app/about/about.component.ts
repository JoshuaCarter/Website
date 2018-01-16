import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

	tipEle: HTMLElement = null;
	iEle: HTMLElement = null;

	constructor() { }

	ngOnInit() {
	}

	onTip(event) {
		//if tip already showing
		if (this.tipEle != null) {
			//if same tip showing
			if (this.tipEle == event.target ||
				this.tipEle == event.target.firstElementChild) {
				//hide and return
				this.onBlur();
				event.stopPropagation();
				return;
			}
			//else hide the different tip
			this.onBlur();
		}

		//store tip, show it, and prevent blur from instantly hiding it
		this.tipEle = event.target.firstElementChild;
		this.tipEle.style.display = "inline-block";
		event.stopPropagation();

		//store i icon element and change it's color
		this.iEle = event.target;
		this.iEle.style.color = "#61C9A8";
		
		//move to far left so it can expand to natural width (or max width)
		this.tipEle.style.left = "0px";
		//store width (with room for margin)
		let naturalWidth = this.tipEle.offsetWidth + 20;

		//if enough room to fit tip or enough to look good, position to right
		let room = document.body.clientWidth - (this.iEle.offsetLeft + this.iEle.offsetWidth);
		if (room > 200 || room > naturalWidth) {
			this.tipEle.style.right = "auto";
			this.tipEle.style.top =	(this.iEle.offsetTop - 8) + "px";
			this.tipEle.style.left = (this.iEle.offsetLeft + this.iEle.offsetWidth) + "px";
		}
		//else position below
		else {
			this.tipEle.style.left = "auto";
			this.tipEle.style.top = (this.iEle.offsetTop + this.iEle.offsetHeight + 2) + "px";
			this.tipEle.style.right = 0 + "px";
		}

		//correct width (shrink-wrap to fit)
		let h = this.tipEle.offsetHeight;
		for (let i = this.tipEle.offsetWidth; i > 0; --i) {
			//reduce width by 1px
			this.tipEle.style.width = i - 1 + "px";

			//if it increases height (due to text wrap)
			if (this.tipEle.offsetHeight > h) {
				//undo decrease in height and break out
				this.tipEle.style.width = i + 1 + "px";
				break;
			}
		}
	}

	onBlur() {
		//if showing tip
		if(this.tipEle != null) {
			//hide it and null ref
			this.tipEle.style.display = "none";
			this.tipEle = null;
			//revert i ele color null ref
			this.iEle.style.color = "gray";
			this.iEle = null;
		}
	}
}
