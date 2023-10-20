import { JSONHelper } from "./jsonhelper.js";

export class Window {

    // [File stuff]
    FILETYPES = [".mp4", ".mpeg"]
    private videoFile: File;
    // Time data JSON
    private timeDataFile: File;

    // [Video stuff]
    private video: HTMLVideoElement;

    // [Time management stuff]
    // Holds the times the video will pause.
    private timeData: TimeData[];
    // The index of the next time the video will pause.
    private timeIndex = 0;

    constructor() {

        // Get the video and JSON files so we can start to play them.
        this.getFiles();
    }

    public togglePause(): void {

        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }

        if (this.video.paused) {
            this.video.play();
        }
        else {
            this.video.pause();
        }
    }

    public pause(): void {

        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }

        this.video.pause();
    }

    public play(): void {

        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }

        this.video.play();
    }

    public toggleMute(): void {

        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }

        this.video.muted = !this.video.muted;
    }

    public seekTime(time: number): void {

        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }

        this.video.currentTime = time;
    }

    private getFiles() {

        // Add a little input field (Yep - doing this the lazy way).
        let input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;

        const inputAcceptTypes = this.FILETYPES.toString() + ",.json";
        input.accept = inputAcceptTypes;

        // We want to be able to get JSON too.
        input.onchange = _this => {

            // Get video file from files input.
            this.videoFile = this.getFirstFileWithTerms(input.files, this.FILETYPES);
            if (this.videoFile === null) {
                // Give up.
                console.error("Could not find a matching video file.");
                input = document.createElement('input');
                return;
            }

            // Get time data JSON file from user input.
            this.timeDataFile = this.getFirstFileWithTerm(input.files, ".json");
            if (this.timeDataFile != null) {
                
                const reader = new FileReader();
                reader.readAsText(this.timeDataFile)

                reader.onloadend = () => {
                    // Load time data
                    const jsonData = reader.result as string;
                    this.timeData = JSONHelper.parseData(jsonData);
                };
            }

            // Hide the field now the user has chosen a videoFile.
            input.hidden = true;

            // Play the video videoFile in a window.
            this.createWindow();
        };

        document.getElementsByTagName("body")[0].appendChild(input);
    }

    private getFirstFileWithTerms(list: FileList, terms: string[]) : File {

        // Check if a term exists within any of the files
        for (let i = 0; i < list.length; i++) {
            for (let t = 0; t < terms.length; t++) {
                if (list[i].name.split(terms[t]).length > 1) {
                    return list[i];
                }
            }           
        }

        return null;
    }

    private getFirstFileWithTerm(list: FileList, term: string) : File {

        // Check if a term exists within any of the files
        for (let i = 0; i < list.length; i++) {
            if (list[i].name.split(term).length > 1) {
                return list[i];
            } 
        }

        return null;
    }

    private createWindow() {

        this.video = document.createElement('video');

        // Read the videoFile into the video player.
        const fileReader = new FileReader();
        fileReader.onloadend = (event: any) => {
            const arrayBuffer = event.target.result;
            const fileType = "video/mpeg";
            const blob = new Blob([arrayBuffer], { type: fileType });
            const src = URL.createObjectURL(blob);

            // Video options.
            this.video.src = src;
            this.video.autoplay = true;

            // Configure window size.
            this.setVideoSize();
        };

        // Read and play the video.
        fileReader.readAsArrayBuffer(this.videoFile);
        document.body.appendChild(this.video);

        document.title = this.videoFile.name.split(".")[0];

        this.hideScrollBars();

        // Event listeners.
        this.video.ontimeupdate = () => { this.onTimeChanged(); };
        addEventListener("resize", () => { this.setVideoSize(); });
        this.registerKeybinds();
    }

    private hideScrollBars(): void {
        document.documentElement.style.overflow = 'hidden';
    }

    private setVideoSize(): void {
        this.video.width = document.body.clientWidth;
        this.video.height = document.body.clientHeight;
    }

    private registerKeybinds(): void {

        // Play/Pause the video.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "Enter") {
                this.togglePause();
            }
        });

        // Move back 1 second.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "ArrowLeft") {
                this.skipBack();
            }
        });

        // Skip forward 1 second.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "ArrowRight") {
                this.skipForward();
            }
        });

        // Mute/Unmute the video.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "m") {
                this.toggleMute();
            }
        });

        // Add a pause spot.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "t") {
                this.addTimeData(this.video.currentTime);
            }
        });

        // Download all pause time information.
        document.body.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === "t") {
                this.downloadTimeData();
            }
        });
    }

    private addTimeData(newTime): void {

        // Add new data to array
        const newTimeData: TimeData = { time: newTime };
        this.timeData.push(newTimeData);

        // Re-sort the array (lowest => highest)
        this.timeData.sort((a, b) => a.time - b.time);
        this.recalculateTimeIndex();

        // Increment the time index so we don't hit it as soon as we keep going.
        this.timeIndex++;
    }

    private downloadTimeData(): void {

        // Turn time data into JSON we can use.
        const serialised = JSON.stringify(this.timeData);
        
        // Create file.
        const downloadJSON = new File(["\ufeff"+serialised], this.videoFile.name.replace(".mp4", "") + ".json", {type: "text/plain:charset=UTF-8"});

        // Create hidden element to download the file.
        const downloadURL = window.URL.createObjectURL(downloadJSON);
        const downloadElement = document.createElement("a");
        downloadElement.href = downloadURL;
        downloadElement.download = this.videoFile.name.replace(".mp4", "") + ".json";
        downloadElement.click();
        window.URL.revokeObjectURL(downloadURL);
    }

    private skipBack(): void {

        this.video.currentTime -= 1;

        this.recalculateTimeIndex();
    }

    private skipForward(): void {

        this.video.currentTime += 1;

        this.recalculateTimeIndex();
    }

    private recalculateTimeIndex() {

        // Sync the time index to the point we are at in the video.
        for (let i = 0; i < this.timeData.length; i++) {
            this.timeIndex = i;
            if (this.video.currentTime < this.timeData[i].time) {
                return;
            }
        }
    }

    private onTimeChanged(): void {

        console.log(this.video.currentTime);

        if (this.video.paused) {
            return;
        }

        if (this.video.currentTime > this.timeData[this.timeIndex]?.time) {
            this.pause();

            // Point to the next time
            this.timeIndex++;
        }
    }
}