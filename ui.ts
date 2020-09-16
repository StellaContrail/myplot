/// <reference path="./myplot.ts" />
/// <reference path="./transform.ts" />
/// <reference path="./util.ts" />
/// <reference path="./draw.ts" />

function setTitle(configs: IConfig, text: string) {
    let graphWidth = calculateEndPoint(configs).x - calculateStartPoint(configs).x;
    let widthOffset = calculateStartPoint(configs).x;
    
    drawText(configs, text,
        new Vector2(widthOffset + graphWidth * .5, configs.style.font.size), false
    );
}

function setXLabel(configs: IConfig, text: string) {
    let graphWidth = calculateEndPoint(configs).x - calculateStartPoint(configs).x;
    let widthOffset = calculateStartPoint(configs).x;
    drawText(configs, text,
        new Vector2(widthOffset + graphWidth * .5, configs.size.height - configs.style.font.size * .5), false
    );
}

function setYLabel(configs: IConfig, text: string) {
    let graphHeight = calculateEndPoint(configs).y - calculateStartPoint(configs).y;
    let heightOffset = calculateStartPoint(configs).y;
    drawText(configs, text,
        new Vector2(.5 * configs.style.font.size, heightOffset + .5 * graphHeight), true
    );
}

function setBorder(configs: IConfig) {
    let start = calculateStartPoint(configs).minus((new Vector2(1, 1)).multi(configs.style.border.width));
    let end = calculateEndPoint(configs).plus((new Vector2(1, 1)).multi(configs.style.border.width));

    drawRectangle(configs, start, end)
}

function setXTics(configs: IConfig, digits = 0) {
    configs.context.save();
    let dx = (configs.range.xmax - configs.range.xmin) / (configs.style.tics.x - 1);
    let startPos = calculateStartPoint(configs);
    let endPos = calculateEndPoint(configs);
    let graphWidth = endPos.x - startPos.x;
    let dw = graphWidth / (configs.style.tics.x - 1);
    const ticsHeight = 5;
    for (let i = 0; i < configs.style.tics.x; i++) {
        let w = startPos.x + dw * i;
        let x = (dx * i + configs.range.xmin).toFixed(digits);
        configs.context.moveTo(w, endPos.y);
        configs.context.lineTo(w, endPos.y - ticsHeight);
        configs.context.stroke();
        drawText(configs, x.toString(), new Vector2(w, endPos.y + configs.style.font.size), false);
    }
    configs.context.restore();
}

function setYTics(configs: IConfig, digits = 0) {
    configs.context.save();
    let dy = (configs.range.ymax - configs.range.ymin) / (configs.style.tics.y - 1);
    let startPos = calculateStartPoint(configs);
    let endPos = calculateEndPoint(configs);
    let graphHeight = endPos.y - startPos.y;
    let dh = graphHeight / (configs.style.tics.y - 1);
    const ticsHeight = 5;
    for (let i = 0; i < configs.style.tics.y; i++) {
        let h = endPos.y - dh * i;
        let y = (dy * i + configs.range.ymin).toFixed(digits);
        configs.context.moveTo(startPos.x, h);
        configs.context.lineTo(startPos.x + ticsHeight, h);
        configs.context.stroke();
        drawText(configs, y.toString(), new Vector2(startPos.x - configs.style.font.size * (digits + 1), h), false);
    }
    configs.context.restore();
}

function setGrid(configs: IConfig) {
    configs.context.save();
    let startPos = calculateStartPoint(configs);
    let endPos = calculateEndPoint(configs);
    let graphWidth = endPos.x - startPos.x;
    let graphHeight = endPos.y - startPos.y;
    let dw = graphWidth / (configs.style.tics.x - 1);
    let dh = graphHeight / (configs.style.tics.y - 1);
    configs.context.strokeStyle = "#d3d3d3";
    configs.context.setLineDash([2, 2]);
    for (let i = 0; i < configs.style.tics.x; i++) {
        let w = startPos.x + dw * i;
        if (w == startPos.x || Math.abs(w - endPos.x) < 0.001) continue;
        
        configs.context.beginPath();
        configs.context.moveTo(w, endPos.y);
        configs.context.lineTo(w, startPos.y);
        configs.context.stroke();
    }
    for (let i = 0; i < configs.style.tics.y; i++) {
        let h = endPos.y - dh * i;
        if (Math.abs(h - startPos.y) < 0.001 || h == endPos.y) continue;
        
        configs.context.beginPath();
        configs.context.moveTo(startPos.x, h);
        configs.context.lineTo(endPos.x, h);
        configs.context.stroke();
    }
    configs.context.restore();
}

function setZeroAxis(configs: IConfig) {
    configs.context.save();
    let startPos = calculateStartPoint(configs);
    let endPos = calculateEndPoint(configs);
    let graphWidth = endPos.x - startPos.x;
    let graphHeight = endPos.y - startPos.y;
    configs.context.strokeStyle = "#363636";
    configs.context.lineWidth = 0.5;
    if (configs.range.xmin * configs.range.xmax <= 0) {
        let ratio = (0 - configs.range.xmin) / (configs.range.xmax - configs.range.xmin);
        configs.context.beginPath();
        configs.context.moveTo(startPos.x + ratio * graphWidth, endPos.y);
        configs.context.lineTo(startPos.x + ratio * graphWidth, startPos.y);
        configs.context.stroke();
    }
    if (configs.range.ymin * configs.range.ymax <= 0) {
        let ratio = (configs.range.ymax - 0) / (configs.range.ymax - configs.range.ymin);
        configs.context.beginPath();
        configs.context.moveTo(startPos.x, ratio * graphHeight + startPos.y);
        configs.context.lineTo(endPos.x, ratio * graphHeight + startPos.y);
        configs.context.stroke();
    }
    configs.context.restore();
}

function init(configs: IConfig) {
    configs.context.save();
    let startPos = calculateStartPoint(configs);
    let endPos = calculateEndPoint(configs);

    configs.context.fillStyle = "#FFFFFF";
    configs.context.fillRect(startPos.x, startPos.y, endPos.x - startPos.x, endPos.y - startPos.y);
    configs.context.restore();
}

function initAll(configs: IConfig) {
    configs.context.save();

    configs.context.fillStyle = "#FFFFFF";
    configs.context.fillRect(0, 0, configs.size.width, configs.size.height);

    configs.context.restore();
}