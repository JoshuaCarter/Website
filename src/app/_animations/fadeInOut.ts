import { trigger, animate, transition, style, keyframes } from '@angular/animations';

//object given to animation array in component decorator
export const fadeInOut =
	//trigger name for host binding to component
	trigger('fadeInOut', [
		
		//transition for component ENTERING view, alias for 'void => *'
		transition(':enter', [
			//animate with keyframes to simulate a delay (note duration 2x leave transition)
			animate('500ms', keyframes([
				/**
				 * Initial state
				 * [opacity: -1]
				 * 		so that it remains hidden until 250ms (when it reaches)
				 * 		0, then grows to 1 by 500ms
				 * [position: fixed]
				 * 		to stop entering component from screwing up the
				 * 		location of the (still) leaving component, changes
				 * 		halfway between keyframes (ugh) so changes at 250ms
				 * 
				 * Final state
				 * 		visible and positioned normally
				 */
				style({ opacity: 0, position: 'fixed', offset: 0 }),
				style({ opacity: 0, position: 'fixed', offset: .59 }),
				style({ opacity: 0, position: 'static', offset: .6 }),
				style({ opacity: 1, position: 'static', offset: 1 })
			]))
		]),

		//transition for component LEAVING view, alias for '* => void'
		transition(':leave', [
			//initial state
			style({ opacity: 1 }),
			//animate opacity to 0 
			animate('250ms', style({ opacity: 0 }))
		]),		
	]);