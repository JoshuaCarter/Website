import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostBinding, HostListener } from '@angular/core';
import { Router } from "@angular/router";
import { Http } from "@angular/http";

import { fadeInOut } from "../_animations/fadeInOut";
import { DataService } from "../data.service";
import { Globals } from '../globals';

@Component({
	selector: 'app-scores',
	templateUrl: './scores.component.html',
	styleUrls: ['./scores.component.css'],
	animations: [fadeInOut]
})
export class ScoresComponent implements OnInit, OnDestroy {
	@HostBinding('@fadeInOut') anim = true;

	@ViewChild('searchInput')
	searchInput: ElementRef;
	@ViewChild('scrollDiv')
	scrollDiv: ElementRef;
	@ViewChild('scrollThumb')
	scrollThumb: ElementRef;

	//readonly srvUrl: string = "http://localhost/website/src/server/webserver.php";
	readonly srvUrl: string = "http://www.joshuacarter.com.au/server/webserver.php";

	items: 
	{ 
		rank: number, 
		name: string, 
		score: number, 
		highlight: boolean
	}[] = [];

	name: string;
	score: number;
	focus: boolean;
	page: number = 0;
	pageMax: number = 0;
	pageSize: number = 50;
	pageText: string = "LOADING";

	constructor(private router: Router, private dataService: DataService, private http: Http) {
		this.name = this.dataService.getNameOnce();
		this.score = this.dataService.getScoreOnce();
	}

	ngOnInit() {
		//if have score to insert
		if (this.name != null && this.score != null) {
			//send score to server
			this.postScore();
			//flag to focus new score when page recieved
			this.focus = true;
		} 
		//just fetch 1st page of scores
		else {			
			//fetch scores to view
			this.fetchPage();
		}

		if(Globals.is_touch_device()) {
			//this.scrollDiv.nativeElement.style.width = "calc(100% + 40px)";
			this.scrollDiv.nativeElement.style.paddingRight = "20px";
		}

		if(Globals.is_touch_device()) {
			document.body.classList.add("touch-action-none");
			document.body.classList.add("ovr-hide");
		}
	}

	ngOnDestroy() {
		if (Globals.is_touch_device()) {
			document.body.classList.remove("touch-action-none");
			document.body.classList.remove("ovr-hide");
		}
	}

	populateTable(count:number) {
		let packet = {
			type: 'populate',
			count: count.toString(),
			data: []
		};

		for(let i = 0; i < count; ++i) {
			packet.data.push({
				name: 'bot',
				score: Math.floor(Math.random() * 1000).toString()
			});
		}

		this.http.post(this.srvUrl, JSON.stringify(packet)).subscribe(() => {
			this.page = 0;
			this.fetchPage();
		});
	}

	/**
	 * 	Update fake scrollbar to reflect real scrollbar
	 * 	[options]
	 * 	"reset"		resets scrollbar to top (for loading next/prev page)
	 * 	"scroll"	scrolls by custom scroll distance (for wheel events)
	 * 	"focus"		scrolls to newly inserted score (for after game)
	 */

	@HostListener('window:resize')
	onScroll(option = "", event = null) {
		
		if (option == "reset") {
			//resets scrollbar position
			this.scrollDiv.nativeElement.scrollTop = 0;
		}
		else if(option == "scroll") {
			//up or down?
			let d = event.deltaY > 0 ? 1 : -1;
			//size of item x2
			let increment = 31 * 2;
			//move up/down by size of score item x2
			this.scrollDiv.nativeElement.scrollTop += d * increment;
		}
		else if(option == "focus") {
			//get li elements
			let lis = this.scrollDiv.nativeElement.firstElementChild.children;
			//iterate over all
			for(let i = 0; i < lis.length; ++i) {
				//if a match for new score
				if (this.items[i].name == this.name && this.items[i].score == this.score) {
					//scroll to item
					lis[i].scrollIntoView();
					//only focus first match
					break;
				}
			}
		}

		//height of scrollable content
		let contentHeight = this.scrollDiv.nativeElement.scrollHeight;
		//how far up that content is scrolled
		let contentTop = this.scrollDiv.nativeElement.scrollTop;
		//height of scrollbar track
		let trackHeight = this.scrollDiv.nativeElement.clientHeight;
		//relation of track height to content height
		let rel = trackHeight / contentHeight;
		//y pos for scroll thumb
		let top = contentTop * rel;
		//height of scroll thumb (+1px to bridge gap to bottom)
		let height = trackHeight * rel + 1;

		//update fake scrollbar thumb div
		this.scrollThumb.nativeElement.style.top = top + "px";
		this.scrollThumb.nativeElement.style.height = height + "px";

		//prevent window from scrolling
		if (event != null) {
			event.preventDefault();
		}
	}

	onSearch() {
		//hack for filling DB
		if (this.searchInput.nativeElement.value == "sqlpopbot") {
			this.searchInput.nativeElement.value = "";
			this.populateTable(1000);
			return;
		}

		//if have value to search for
		if (this.searchInput.nativeElement.value != "") {
			let searchName = this.searchInput.nativeElement.value;
			this.searchInput.nativeElement.value = "";

			this.pageText = searchName;

			let packet = {
				type: 'score',
				action: 'search',
				name: searchName,
				rows: this.pageSize.toString()
			};

			this.http.post(this.srvUrl, JSON.stringify(packet))
				.subscribe((r) => { this.handleSearch(r) });
		}
		//if no value go to first page
		else {
			this.page = 0;
			this.fetchPage();
		}
	}

	onSearchKey(event) {
		if(event.key == "Enter") {
			this.onSearch();
		}
	}

	handleSearch(response) {
		//clear items
		this.items = [];

		//parse data
		let data = JSON.parse(response.text());

		//pull items out
		let highlighted = false;
		for (let i = 0; i < data.length; ++i) {

			//create list item
			let item = {
				name: data[i]['name'],
				score: parseInt(data[i]['score']),
				rank: parseInt(data[i]['rank']),
				highlight: false,
			};

			this.items.push(item);
		}

		if(data.length == 0) {
			this.pageText = "No results";
		}
	}

	getNextPage() {
		this.page++;
		this.page = Math.min(this.page, this.pageMax);
		this.fetchPage();
	}

	getPrevPage() {
		this.page--;
		this.page = Math.max(this.page, 0);
		this.fetchPage();
	}

	fetchPage() {
		let packet = {
			type: 'score',
			action: 'fetch',
			offset: this.page.toString(),
			rows: this.pageSize.toString()
		};

		this.http.post(this.srvUrl, JSON.stringify(packet))
			.subscribe((r) => { this.handleScores(r) });
	}

	postScore() {
		let packet = {
			type: 'score',
			action: 'insert_fetch',
			name: this.name,
			score: this.score.toString(),
			rows: this.pageSize.toString()
		};

		this.http.post(this.srvUrl, JSON.stringify(packet))
			.subscribe((r) => { this.handleScores(r) });
	}

	handleScores(response) {
		
		//parse data
		let data = JSON.parse(response.text());

		//set page
		this.page = data[0].page;
		this.pageMax = data[0].last_page;

		//container for items
		let tempItems = [];

		//pull items out
		let highlighted = false;
		for (let i = 0; i < data.length-1; ++i) {

			//create list item
			let item = {
				name: data[i+1]['name'],
				score: parseInt(data[i+1]['score']),
				rank: this.page * this.pageSize + i + 1,
				highlight: false,
			};

			//if item is the newly inserted one
			if (!highlighted && item.name == this.name && item.score == this.score) {
				//highlight it
				item.highlight = true;
				highlighted = true;
			}

			//add to temp container
			tempItems.push(item);
		}

		//replace bound items array with temp container (avoids scrollToItem calls during array population)
		this.items = tempItems;

		//set page text out
		let pageBase = (this.page * this.pageSize);
		this.pageText = (pageBase + 1).toString() + " - " + (pageBase + this.items.length).toString();

		//reset for new page by default
		let option = "reset"
		if(this.focus) {
			//or focus new score if should
			option = "focus";
			//but only once
			this.focus = false;
		}

		//reset scrollbar (on next 'frame' so that scrollHeight is set and elements generated)
		setTimeout(() => { this.onScroll(option); }, 1);
	}

	closeScores() {
		this.router.navigate(
			[
				'/home', {
					outlets: { 'game-outlet': null }
				}
			]
		);
	}
}
