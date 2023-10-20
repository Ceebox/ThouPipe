import { Input } from "./input.js";
import { JSONHelper } from "./jsonhelper.js";
var Window = (function () {
    function Window() {
        this.FILETYPES = [".mp4", ".mpeg"];
        this.timeIndex = 0;
        this.getFiles();
    }
    Window.prototype.togglePause = function () {
        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }
        if (this.video.paused) {
            this.video.play();
        }
        else {
            this.video.pause();
        }
    };
    Window.prototype.play = function () {
        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }
        this.video.play();
    };
    Window.prototype.pause = function () {
        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }
        this.video.pause();
    };
    Window.prototype.toggleMute = function () {
        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }
        this.video.muted = !this.video.muted;
    };
    Window.prototype.skipBack = function () {
        this.seekTime(this.video.currentTime - 1);
    };
    Window.prototype.skipForward = function () {
        this.seekTime(this.video.currentTime + 1);
    };
    Window.prototype.addPausePoint = function () {
        this.addTimeData(this.video.currentTime);
    };
    Window.prototype.downloadTimeData = function () {
        var serialised = JSON.stringify(this.timeData);
        var downloadJSON = new File(["\ufeff" + serialised], this.videoFile.name.replace(".mp4", "") + ".json", { type: "text/plain:charset=UTF-8" });
        var downloadURL = window.URL.createObjectURL(downloadJSON);
        var downloadElement = document.createElement("a");
        downloadElement.href = downloadURL;
        downloadElement.download = this.videoFile.name.replace(".mp4", "") + ".json";
        downloadElement.click();
        window.URL.revokeObjectURL(downloadURL);
    };
    Window.prototype.seekTime = function (time) {
        if (this.video === undefined || this.video.duration === Number.NaN) {
            return;
        }
        this.video.currentTime = time;
        this.recalculateTimeIndex();
    };
    Window.prototype.getFiles = function () {
        var _this_1 = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        var inputAcceptTypes = this.FILETYPES.toString() + ",.json";
        input.accept = inputAcceptTypes;
        input.onchange = function (_this) {
            _this_1.videoFile = _this_1.getFirstFileWithTerms(input.files, _this_1.FILETYPES);
            if (_this_1.videoFile === null) {
                input = document.createElement('input');
                console.error("Could not find a matching video file.");
                return;
            }
            _this_1.timeDataFile = _this_1.getFirstFileWithTerm(input.files, ".json");
            if (_this_1.timeDataFile != null) {
                var reader_1 = new FileReader();
                reader_1.readAsText(_this_1.timeDataFile);
                reader_1.onloadend = function () {
                    var jsonData = reader_1.result;
                    _this_1.timeData = JSONHelper.parseData(jsonData);
                };
            }
            input.hidden = true;
            _this_1.createWindow();
        };
        document.getElementsByTagName("body")[0].appendChild(input);
    };
    Window.prototype.createWindow = function () {
        var _this_1 = this;
        this.video = document.createElement('video');
        var fileReader = new FileReader();
        fileReader.onloadend = function (event) {
            var arrayBuffer = event.target.result;
            var fileType = "video/mpeg";
            var blob = new Blob([arrayBuffer], { type: fileType });
            var src = URL.createObjectURL(blob);
            _this_1.video.src = src;
            _this_1.video.autoplay = true;
            _this_1.setVideoSize();
        };
        fileReader.readAsArrayBuffer(this.videoFile);
        document.body.appendChild(this.video);
        document.title = this.videoFile.name.split(".")[0];
        this.hideScrollBars();
        this.video.ontimeupdate = function () { _this_1.onTimeChanged(); };
        addEventListener("resize", function () { _this_1.setVideoSize(); });
        var input = new Input(this);
        input.registerKeybinds();
    };
    Window.prototype.getFirstFileWithTerms = function (list, terms) {
        for (var i = 0; i < list.length; i++) {
            for (var t = 0; t < terms.length; t++) {
                if (list[i].name.split(terms[t]).length > 1) {
                    return list[i];
                }
            }
        }
        return null;
    };
    Window.prototype.getFirstFileWithTerm = function (list, term) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].name.split(term).length > 1) {
                return list[i];
            }
        }
        return null;
    };
    Window.prototype.hideScrollBars = function () {
        document.documentElement.style.overflow = 'hidden';
    };
    Window.prototype.setVideoSize = function () {
        this.video.width = document.body.clientWidth;
        this.video.height = document.body.clientHeight;
    };
    Window.prototype.addTimeData = function (newTime) {
        var newTimeData = { time: newTime };
        this.timeData.push(newTimeData);
        this.timeData.sort(function (a, b) { return a.time - b.time; });
        this.recalculateTimeIndex();
        this.timeIndex++;
    };
    Window.prototype.recalculateTimeIndex = function () {
        for (var i = 0; i < this.timeData.length; i++) {
            this.timeIndex = i;
            if (this.video.currentTime < this.timeData[i].time) {
                return;
            }
        }
    };
    Window.prototype.onTimeChanged = function () {
        var _a;
        if (this.video.paused) {
            return;
        }
        if (this.video.currentTime > ((_a = this.timeData[this.timeIndex]) === null || _a === void 0 ? void 0 : _a.time)) {
            this.pause();
            this.timeIndex++;
        }
    };
    return Window;
}());
export { Window };
//# sourceMappingURL=window.js.map