import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';


@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
	@ViewChild('nav')
	htmlNav: ElementRef;

	itemSize = 44;

	constructor() { }

	ngOnInit() {
	}

	menuExpand() {
		// only if using collapsed nav menu
		if(document.body.clientWidth > 450){
			return;
		}

		// expand menu and change color
		let items = document.getElementsByTagName("a");
		this.htmlNav.nativeElement.style.maxHeight = (this.itemSize * items.length).toString() + "px";
		this.htmlNav.nativeElement.style.backgroundColor = "rgba(64, 50, 65, 1)";
	}

	menuCollapse() {
		// only if using collapsed nav menu
		if (document.body.clientWidth > 450) {
			return;
		}

		// collapse menu and reset color
		this.htmlNav.nativeElement.style.maxHeight = this.itemSize + "px";
		this.htmlNav.nativeElement.style.backgroundColor = "rgba(76, 59, 77, 0.8)";
	}

	onNavigate() {
		// timeout used as route change cancels menu collapse
		setTimeout(() => {
			// auto collapse menu and reset color on page change
			this.menuCollapse();
		}, 0);
	}

	onEmail(ele) {
		//create element to hold text
		let tempEle = document.createElement("input");
		//add email
		tempEle.value = "joshua.carter.dev@gmail.com";
		//add ele to dom
		document.body.appendChild(tempEle);
		//select it
		tempEle.select();

		//try to copy-to-clipboard
		try {
			//do copy
			document.execCommand("copy");

			//inform user of copy
			this.copyMessage(ele);
		}
		//else show it for the user to copy
		catch(e) {
			//show
			this.showEmail(ele, tempEle.value);
		}

		//remove ele from dom
		document.body.removeChild(tempEle);

		//prevent link from going anywhere
		return false;
	}

	copyMessage(emailEle) {
		//make text ele
		let msgEle = document.createElement("span");
		//set message text
		msgEle.textContent = "Email copied to clipboard";
		//get content ele
		let contentEle = document.getElementById("content");
		//add to dom
		contentEle.appendChild(msgEle);

		//style ele
		msgEle.style.cssText = `
			position: absolute;
			margin: 5px;
			padding: 5px;
			color: #55ECBA;
			background: #392D3A;
			border: 1px solid black;
			border-radius: 3px;
			top: ${emailEle.offsetTop + emailEle.offsetHeight + 5}px;
			left: ${window.innerWidth > 450 ? "auto" : "0px"};
			right: ${window.innerWidth > 450 ? "0px" : "auto"};

			opacity: 0;
			transition: opacity 2s ease-in;
		`;

		//set timeout to remove ele
		setTimeout(() => {
			contentEle.removeChild(msgEle);
		}, 2000);
	}

	showEmail(emailEle, email) {
		//make text ele
		let txtEle = document.createElement("input");
		txtEle.type = "text";
		//set message text
		txtEle.value = email;
		//get content ele
		let contentEle = document.getElementById("content");
		//add to dom
		contentEle.appendChild(txtEle);
		//select text
		let input = <HTMLInputElement>txtEle;
		input.select();

		//style ele
		txtEle.style.cssText = `
			position: absolute;
			width: 165px;
			margin: 5px;
			padding: 5px;
			color: #55ECBA;
			background: #392D3A;
			border: 1px solid black;
			border-radius: 3px;
			top: ${emailEle.offsetTop + emailEle.offsetHeight + 5}px;
			left: ${window.innerWidth > 450 ? "auto" : "0px"};
			right: ${window.innerWidth > 450 ? "0px" : "auto"};
			outline: none;
		`;

		//set blur listener to remove text field
		txtEle.addEventListener("blur", () => {
			contentEle.removeChild(txtEle);
		});
	}
}
