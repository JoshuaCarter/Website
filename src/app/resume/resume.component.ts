import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { Globals } from "../globals";
import { fadeInOut } from "../_animations/fadeInOut";

@Component({
	selector: 'app-resume',
	templateUrl: './resume.component.html',
	styleUrls: ['./resume.component.css'],
	animations: [fadeInOut]
})
export class ResumeComponent implements OnInit {
	@HostBinding('@fadeInOut') anim = true;

	router: Router;

	constructor(router:Router) {
		this.router = router;
	}

	ngOnInit() {
	}

	onView() {
		this.router.navigate(['/resume-view']);
	}

	onDown() {
		let link = document.createElement("a");
		link.href = "../assets/joshua-carter-resume.pdf";
		link.download = "joshua-carter-resume.pdf";
		link.dispatchEvent(new MouseEvent('click'));
	}
}
