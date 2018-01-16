
export const Globals = Object.freeze({
	// Properties ---------------------------------------------------------------

	skipLocationChange: true,

	//Methods -------------------------------------------------------------------

	is_touch_device: () => {
		return 'ontouchstart' in window        // works on most browsers 
			|| navigator.maxTouchPoints;       // works on IE10/11 and Surface
	},
});