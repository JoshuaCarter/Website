import { Component } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { DataService } from "./data.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';

	url: string = "";
	timeoutID: any;

	constructor(private router: Router) {
		//sub to router events
		this.router.events.subscribe((event) => {
			//if navigated to new page (doesn't wait for transitions)
			if (event instanceof NavigationEnd && 
				!event.url.includes("(") && //not if opening sub-outlet
				this.url != event.url) //not if closing sub-outlet
			{
				//store url so can check if moving to same route above
				this.url = event.url;
				//clear current timeout (unlikely)
				clearTimeout(this.timeoutID);
				//scroll window to top after 250ms (after fade out, before fade in)
				this.timeoutID = setTimeout(() => {
					window.scrollTo(0, 0);
				}, 250);
			}
		});
	}
}
