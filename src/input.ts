import { Window } from "./window.js";

export class Input {

    private _window: Window;

    public constructor(window: Window) {
        this._window = window;
    }

    public registerKeybinds(): void {

        // Play/Pause the video.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "Enter") {
                this._window.togglePause();
            }
        });

        // Move back 1 second.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "ArrowLeft") {
                this._window.skipBack();
            }
        });

        // Skip forward 1 second.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "ArrowRight") {
                this._window.skipForward();
            }
        });

        // Mute/Unmute the video.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "m") {
                this._window.toggleMute();
            }
        });

        // Add a pause spot.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "t") {
                this._window.addPausePoint();
            }
        });

        // Download all pause time information.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "d") {
                this._window.downloadTimeData();
            }
        });
    }
}