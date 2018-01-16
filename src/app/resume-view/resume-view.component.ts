import { Component, OnInit, HostBinding, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Globals } from "../globals";

@Component({
	selector: 'app-resume-view',
	templateUrl: './resume-view.component.html',
	styleUrls: ['./resume-view.component.css']
})
export class ResumeViewComponent implements OnInit {

	width: number = 0;

	constructor() {
	}

	ngOnInit() {
		this.onResize(window.innerWidth);
	}

	@HostListener("window:resize", ['$event.target.innerWidth'])
	onResize(width) {
		if (width > 900) {
			this.width = 900;
		} else {
			this.width = width;
		}
	}
}
