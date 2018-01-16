
export class Sound {

	//audio files
	sounds = new Map<string, HTMLAudioElement>();

	constructor() {
	}

	destroy() {
		for(let key of Array.from(this.sounds.keys())) {
			let sound = this.sounds.get(key);
			sound.pause();
			sound = null;
		}
	}

	load(file:string) {
		let name = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
		let sound = new Audio(file);
		this.sounds.set(name, sound);
	}

	play(name:string, reset:boolean = false, loop:boolean = false) {
		let sound = this.sounds.get(name);
		if(sound != undefined) {
			sound.currentTime = reset ? 0 : sound.currentTime;
			sound.loop = loop;
			sound.play();
		}
	}
}