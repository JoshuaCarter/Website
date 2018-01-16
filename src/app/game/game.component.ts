import { Component, OnInit, ViewChild, ElementRef, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Globals } from "../globals";
import { fadeInOut } from "../_animations/fadeInOut";
import { DataService } from '../data.service';
import { Game } from './game_src/game';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css'],
	animations: [fadeInOut]
})
export class GameComponent implements OnInit, OnDestroy {
	@HostBinding('@fadeInOut') anim = true;

	@ViewChild('canvas')
	canvas: ElementRef;

	router: Router;
	game: Game;

	constructor(router: Router, private dataService:DataService) {
		this.router = router;
	}

	ngOnInit() {
		this.game = new Game(
			this.canvas, 
			() => { this.closeGame() }, 
			(score, name)=>{ this.gameOver(score, name) }
		);
		this.game.run();
	}

	ngOnDestroy() {
		this.game.destroy();
	}

	closeGame() {
		this.router.navigate(
			[
				'/home', {
					outlets: { 'game-outlet': null }
				}
			]
		);
	}

	gameOver(score: number, name: string) {
		this.dataService.setScore(score);
		this.dataService.setName(name);

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