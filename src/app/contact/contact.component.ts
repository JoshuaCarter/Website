import { Component, OnInit, HostListener, ViewChild, ElementRef, HostBinding } from '@angular/core';

import { fadeInOut } from "../_animations/fadeInOut";

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.css'],
	animations: [fadeInOut]
})
export class ContactComponent implements OnInit {
	@HostBinding('@fadeInOut') anim = true;

	name: string;
	email: string;
	message: string;
	copy: boolean;

	@ViewChild('nameInput')
	htmlName: ElementRef;
	@ViewChild('emailInput')
	htmlEmail: ElementRef;
	@ViewChild('feedback')
	htmlFeedback: ElementRef;

	constructor() { }

	ngOnInit() {
		this.resetFields();
	}

	resetFields() {
		this.name = "";
		this.email = "";
		this.message = "";
		this.copy = true;
	}

	isEmailValid() {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(this.email);
	}

	isNameValid() {
		return this.name.length > 0;
	}

	updateName() {
		if (this.isNameValid()) {
			this.htmlName.nativeElement.classList.add("valid");
			this.htmlName.nativeElement.classList.remove("invalid");
		} else {
			this.htmlName.nativeElement.classList.remove("valid");
			this.htmlName.nativeElement.classList.add("invalid");
		}
	}

	updateEmail() {
		if (this.isEmailValid()) {
			this.htmlEmail.nativeElement.classList.add("valid");
			this.htmlEmail.nativeElement.classList.remove("invalid");
		} else {
			this.htmlEmail.nativeElement.classList.remove("valid");
			this.htmlEmail.nativeElement.classList.add("invalid");
		}
	}

	onSubmit() {
		let msg = "";

		if(this.isNameValid() && this.isEmailValid()) {
			//Send request to backend here

			if (this.copy) {
				msg += "Message and copy sent.";
			} else {
				msg += "Message sent.";
			}

			this.resetFields();
			this.htmlEmail.nativeElement.classList.remove("valid");
			this.htmlEmail.nativeElement.classList.remove("invalid");
			this.htmlName.nativeElement.classList.remove("valid");
			this.htmlName.nativeElement.classList.remove("invalid");

		} else {
			msg += "Message not sent:";
			if(!this.isNameValid()) {
				msg += "\n- Enter your name.";
			}
			if(!this.isEmailValid()) {
				msg += "\n- Enter a valid email address.";
			}
		}

		this.htmlFeedback.nativeElement.style = "visibility:visible";
		this.htmlFeedback.nativeElement.firstElementChild.innerText = msg;
	}
}
