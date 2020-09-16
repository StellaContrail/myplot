function $(e) {
    if (e[0] == '.') {
        return document.getElementById(e.slice(1));
    }
    else {
        return document.querySelector(e);
    }
}
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.plus = function (b) {
        return new Vector2(this.x + b.x, this.y + b.y);
    };
    Vector2.prototype.minus = function (b) {
        return new Vector2(this.x - b.x, this.y - b.y);
    };
    Vector2.prototype.multi = function (lambda) {
        return new Vector2(this.x * lambda, this.y * lambda);
    };
    return Vector2;
}());
function evaluate(func, configs) {
    var dh = (configs.range.xmax - configs.range.xmin) / (configs.samples - 1);
    var x = [];
    var y = [];
    var t = configs.range.xmin;
    for (var i = 0; i < configs.samples; i++) {
        t += dh;
        x.push(t);
        y.push(func(t));
    }
    return { x: x, y: y };
}
/// <reference path="./myplot.ts" />
/// <reference path="./util.ts" />
function convertXYtoWH(configs, graphStart, graphEnd, pos) {
    var graphWH = graphEnd.minus(graphStart);
    var ratioWtoX = graphWH.x / (configs.range.xmax - configs.range.xmin);
    var ratioHtoY = graphWH.y / (configs.range.ymax - configs.range.ymin);
    var XAxisHeight = configs.size.height - graphEnd.y;
    return new Vector2((pos.x - configs.range.xmin) * ratioWtoX + graphStart.x, configs.size.height - ((pos.y - configs.range.ymin) * ratioHtoY + XAxisHeight));
}
function calculateStartPoint(configs) {
    var start = new Vector2(configs.style.font.size * 3 + configs.style.padding + configs.style.border.width, configs.style.font.size + configs.style.padding + configs.style.border.width);
    return start;
}
function calculateEndPoint(configs) {
    var end = new Vector2(configs.size.width - (configs.style.font.size + configs.style.border.width), configs.size.height - (configs.style.font.size + configs.style.border.width) - configs.style.font.size * 2);
    return end;
}
function isInside(configs, x, y) {
    if (configs.range.xmin <= x && x <= configs.range.xmax) {
        if (configs.range.ymin <= y && y <= configs.range.ymax) {
            return true;
        }
    }
    return false;
}
/// <reference path="./myplot.ts" />
/// <reference path="./transform.ts" />
/// <reference path="./util.ts" />
/// <reference path="./draw.ts" />
function setTitle(configs, text) {
    var graphWidth = calculateEndPoint(configs).x - calculateStartPoint(configs).x;
    var widthOffset = calculateStartPoint(configs).x;
    drawText(configs, text, new Vector2(widthOffset + graphWidth * .5, configs.style.font.size), false);
}
function setXLabel(configs, text) {
    var graphWidth = calculateEndPoint(configs).x - calculateStartPoint(configs).x;
    var widthOffset = calculateStartPoint(configs).x;
    drawText(configs, text, new Vector2(widthOffset + graphWidth * .5, configs.size.height - configs.style.font.size * .5), false);
}
function setYLabel(configs, text) {
    var graphHeight = calculateEndPoint(configs).y - calculateStartPoint(configs).y;
    var heightOffset = calculateStartPoint(configs).y;
    drawText(configs, text, new Vector2(.5 * configs.style.font.size, heightOffset + .5 * graphHeight), true);
}
function setBorder(configs) {
    var start = calculateStartPoint(configs).minus((new Vector2(1, 1)).multi(configs.style.border.width));
    var end = calculateEndPoint(configs).plus((new Vector2(1, 1)).multi(configs.style.border.width));
    drawRectangle(configs, start, end);
}
function setXTics(configs, digits) {
    if (digits === void 0) { digits = 0; }
    configs.context.save();
    var dx = (configs.range.xmax - configs.range.xmin) / (configs.style.tics.x - 1);
    var startPos = calculateStartPoint(configs);
    var endPos = calculateEndPoint(configs);
    var graphWidth = endPos.x - startPos.x;
    var dw = graphWidth / (configs.style.tics.x - 1);
    var ticsHeight = 5;
    for (var i = 0; i < configs.style.tics.x; i++) {
        var w = startPos.x + dw * i;
        var x = (dx * i + configs.range.xmin).toFixed(digits);
        configs.context.moveTo(w, endPos.y);
        configs.context.lineTo(w, endPos.y - ticsHeight);
        configs.context.stroke();
        drawText(configs, x.toString(), new Vector2(w, endPos.y + configs.style.font.size), false);
    }
    configs.context.restore();
}
function setYTics(configs, digits) {
    if (digits === void 0) { digits = 0; }
    configs.context.save();
    var dy = (configs.range.ymax - configs.range.ymin) / (configs.style.tics.y - 1);
    var startPos = calculateStartPoint(configs);
    var endPos = calculateEndPoint(configs);
    var graphHeight = endPos.y - startPos.y;
    var dh = graphHeight / (configs.style.tics.y - 1);
    var ticsHeight = 5;
    for (var i = 0; i < configs.style.tics.y; i++) {
        var h = endPos.y - dh * i;
        var y = (dy * i + configs.range.ymin).toFixed(digits);
        configs.context.moveTo(startPos.x, h);
        configs.context.lineTo(startPos.x + ticsHeight, h);
        configs.context.stroke();
        drawText(configs, y.toString(), new Vector2(startPos.x - configs.style.font.size * (digits + 1), h), false);
    }
    configs.context.restore();
}
function setGrid(configs) {
    configs.context.save();
    var startPos = calculateStartPoint(configs);
    var endPos = calculateEndPoint(configs);
    var graphWidth = endPos.x - startPos.x;
    var graphHeight = endPos.y - startPos.y;
    var dw = graphWidth / (configs.style.tics.x - 1);
    var dh = graphHeight / (configs.style.tics.y - 1);
    configs.context.strokeStyle = "#d3d3d3";
    configs.context.setLineDash([2, 2]);
    for (var i = 0; i < configs.style.tics.x; i++) {
        var w = startPos.x + dw * i;
        if (w == startPos.x || Math.abs(w - endPos.x) < 0.001)
            continue;
        configs.context.beginPath();
        configs.context.moveTo(w, endPos.y);
        configs.context.lineTo(w, startPos.y);
        configs.context.stroke();
    }
    for (var i = 0; i < configs.style.tics.y; i++) {
        var h = endPos.y - dh * i;
        if (Math.abs(h - startPos.y) < 0.001 || h == endPos.y)
            continue;
        configs.context.beginPath();
        configs.context.moveTo(startPos.x, h);
        configs.context.lineTo(endPos.x, h);
        configs.context.stroke();
    }
    configs.context.restore();
}
function setZeroAxis(configs) {
    configs.context.save();
    var startPos = calculateStartPoint(configs);
    var endPos = calculateEndPoint(configs);
    var graphWidth = endPos.x - startPos.x;
    var graphHeight = endPos.y - startPos.y;
    configs.context.strokeStyle = "#363636";
    configs.context.lineWidth = 0.5;
    if (configs.range.xmin * configs.range.xmax <= 0) {
        var ratio = (0 - configs.range.xmin) / (configs.range.xmax - configs.range.xmin);
        configs.context.beginPath();
        configs.context.moveTo(startPos.x + ratio * graphWidth, endPos.y);
        configs.context.lineTo(startPos.x + ratio * graphWidth, startPos.y);
        configs.context.stroke();
    }
    if (configs.range.ymin * configs.range.ymax <= 0) {
        var ratio = (configs.range.ymax - 0) / (configs.range.ymax - configs.range.ymin);
        configs.context.beginPath();
        configs.context.moveTo(startPos.x, ratio * graphHeight + startPos.y);
        configs.context.lineTo(endPos.x, ratio * graphHeight + startPos.y);
        configs.context.stroke();
    }
    configs.context.restore();
}
function init(configs) {
    configs.context.save();
    var startPos = calculateStartPoint(configs);
    var endPos = calculateEndPoint(configs);
    configs.context.fillStyle = "#FFFFFF";
    configs.context.fillRect(startPos.x, startPos.y, endPos.x - startPos.x, endPos.y - startPos.y);
    configs.context.restore();
}
function initAll(configs) {
    configs.context.save();
    configs.context.fillStyle = "#FFFFFF";
    configs.context.fillRect(0, 0, configs.size.width, configs.size.height);
    configs.context.restore();
}
/// <reference path="util.ts" />
/// <reference path="ui.ts" />
var MyPlot = /** @class */ (function () {
    // TODO: default parameters are not working as intended.
    function MyPlot(configs) {
        this.configs = {
            el: configs.el,
            parent: document.getElementById(configs.el.slice(1)),
            size: configs.size || { width: 600, height: 300 },
            context: null,
            range: configs.range || { xmin: -10, xmax: 10, ymin: -10, ymax: 10, yAutoScaled: true },
            samples: configs.samples || 1000,
            style: {
                border: configs.style.border || { width: 0.7 },
                font: configs.style.font || { size: 15 },
                padding: configs.style.padding || 10,
                tics: configs.style.tics || { x: 5, y: 5 }
            }
        };
        var canvas = this.insertCanvasNode(this.configs.parent, this.configs.size);
        this.configs.context = canvas.getContext("2d");
        setBorder(this.configs);
    }
    MyPlot.prototype.insertCanvasNode = function (parent, size) {
        parent.insertAdjacentHTML('beforeend', '<canvas width="' + size.width + '" height="' + size.height + '"></canvas>');
        return parent.lastElementChild;
    };
    // TODO: Is there a better way to access methods defined in different files?
    MyPlot.prototype.setTitle = function (title) {
        setTitle(this.configs, title);
    };
    MyPlot.prototype.setXLabel = function (label) {
        setXLabel(this.configs, label);
    };
    MyPlot.prototype.setYLabel = function (label) {
        setYLabel(this.configs, label);
    };
    MyPlot.prototype.setXRange = function (xmin, xmax) {
        if (xmin > xmax) {
            throw new Error("Invalid Range");
        }
        this.configs.range.xmin = xmin;
        this.configs.range.xmax = xmax;
    };
    MyPlot.prototype.setYRange = function (ymin, ymax) {
        if (ymin > ymax) {
            throw new Error("Invalid Range");
        }
        this.configs.range.ymin = ymin;
        this.configs.range.ymax = ymax;
    };
    MyPlot.prototype.setXTics = function (digits) {
        setXTics(this.configs, digits);
    };
    MyPlot.prototype.setYTics = function (digits) {
        setYTics(this.configs, digits);
    };
    MyPlot.prototype.setGrid = function () {
        setGrid(this.configs);
    };
    MyPlot.prototype.setZeroAxis = function () {
        setZeroAxis(this.configs);
    };
    MyPlot.prototype.init = function () {
        init(this.configs);
    };
    MyPlot.prototype.initAll = function () {
        initAll(this.configs);
    };
    MyPlot.prototype.plot = function (func, lined) {
        var data = evaluate(func, this.configs);
        drawData(this.configs, data.x, data.y, lined);
    };
    return MyPlot;
}());
console.log("MyPlot is loaded");
/// <reference path="./myplot.ts" />
/// <reference path="./util.ts" />
function drawText(configs, text, pos, isRotated) {
    configs.context.save();
    configs.context.textAlign = "center";
    configs.context.textBaseline = "middle";
    configs.context.font = configs.style.font.size + "px sans-serif";
    if (isRotated) {
        configs.context.rotate(-.5 * Math.PI);
        configs.context.fillText(text, -pos.y, pos.x);
        configs.context.rotate(.5 * Math.PI);
    }
    else {
        configs.context.fillText(text, pos.x, pos.y);
    }
    configs.context.restore();
}
function drawRectangle(configs, start, end, isFilled) {
    configs.context.save();
    if (isFilled) {
        configs.context.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }
    else {
        configs.context.lineWidth = configs.style.border.width;
        configs.context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }
    configs.context.restore();
}
function drawPoints(configs, x, y) {
    configs.context.save();
    configs.context.beginPath();
    for (var i = 0; i < x.length; i++) {
        var pos = convertXYtoWH(configs, calculateStartPoint(configs), calculateEndPoint(configs), new Vector2(x[i], y[i]));
        if (isInside(configs, x[i], y[i])) {
            configs.context.moveTo(pos.x, pos.y);
            configs.context.arc(pos.x, pos.y, 1.5, 0, 2 * Math.PI);
        }
    }
    configs.context.fill();
    configs.context.restore();
}
function drawLines(configs, x, y) {
    configs.context.save();
    configs.context.beginPath();
    var initial_pos = convertXYtoWH(configs, calculateStartPoint(configs), calculateEndPoint(configs), new Vector2(x[0], y[0]));
    configs.context.moveTo(initial_pos.x, initial_pos.y);
    for (var i = 1; i < x.length; i++) {
        var pos = convertXYtoWH(configs, calculateStartPoint(configs), calculateEndPoint(configs), new Vector2(x[i], y[i]));
        configs.context.lineTo(pos.x, pos.y);
    }
    configs.context.stroke();
    configs.context.restore();
}
function drawData(configs, x, y, isLined) {
    configs.context.save();
    // Clipping
    var startPos = calculateStartPoint(configs);
    var endPos = calculateEndPoint(configs);
    configs.context.beginPath();
    configs.context.moveTo(startPos.x, startPos.y);
    configs.context.lineTo(startPos.x, endPos.y);
    configs.context.lineTo(endPos.x, endPos.y);
    configs.context.lineTo(endPos.x, startPos.y);
    configs.context.clip();
    if (isLined) {
        drawLines(configs, x, y);
    }
    else {
        drawPoints(configs, x, y);
    }
    configs.context.restore();
}
//# sourceMappingURL=myplot.js.map