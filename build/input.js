var Input = (function () {
    function Input(window) {
        this._window = window;
    }
    Input.prototype.registerKeybinds = function () {
        var _this = this;
        document.body.addEventListener('keydown', function (e) {
            if (e.key === "Enter") {
                _this._window.togglePause();
            }
        });
        document.body.addEventListener('keydown', function (e) {
            if (e.key === "ArrowLeft") {
                _this._window.skipBack();
            }
        });
        document.body.addEventListener('keydown', function (e) {
            if (e.key === "ArrowRight") {
                _this._window.skipForward();
            }
        });
        document.body.addEventListener('keydown', function (e) {
            if (e.key === "m") {
                _this._window.toggleMute();
            }
        });
        document.body.addEventListener('keydown', function (e) {
            if (e.key === "t") {
                _this._window.addPausePoint();
            }
        });
        document.body.addEventListener('keydown', function (e) {
            if (e.key === "d") {
                _this._window.downloadTimeData();
            }
        });
    };
    return Input;
}());
export { Input };
//# sourceMappingURL=input.js.map