import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { Globals } from "../globals";
import { fadeInOut } from "../_animations/fadeInOut";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	animations: [fadeInOut]
})
export class HomeComponent implements OnInit {
	@HostBinding('@fadeInOut') anim = true;

	router: Router;

	constructor(router: Router) { 
		this.router = router;
	}

	ngOnInit() {
		
	}

	onPlayGame() {		
		this.router.navigate(
			[
				'/home', {
					outlets: { 'game-outlet': ['game'] } 
				}
			], 
			{ skipLocationChange: Globals.skipLocationChange }
		);
	}

	onHighScores() {
		this.router.navigate(
			[
				'/home', {
					outlets: { 'game-outlet': ['scores'] }
				}
			],
			{ skipLocationChange: Globals.skipLocationChange }
		);
	}
}
