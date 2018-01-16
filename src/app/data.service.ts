import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
	private score: number;
	private name: string;

	constructor() { }

	getScoreOnce() {
		let s  = this.score;
		this.score = null;
		return s;
	}

	getNameOnce() {
		let n = this.name;
		this.name = null;
		return n;
	}

	setScore(s:number) {
		this.score = s;
	}

	setName(n:string) { 
		this.name = n;
	}
}
