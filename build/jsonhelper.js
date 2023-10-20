var JSONHelper = (function () {
    function JSONHelper() {
    }
    JSONHelper.parseData = function (jsonData) {
        var data = [];
        var json = JSON.parse(jsonData);
        json.forEach(function (time) {
            var timeData = { time: time };
            data.push(time);
        });
        data.sort(function (a, b) { return a.time - b.time; });
        return data;
    };
    return JSONHelper;
}());
export { JSONHelper };
//# sourceMappingURL=jsonhelper.js.map