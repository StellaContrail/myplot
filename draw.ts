/// <reference path="./myplot.ts" />
/// <reference path="./util.ts" />

function drawText(configs: IConfig, text: string, pos: Vector2, isRotated: boolean) {
    configs.context.save();

    configs.context.textAlign = "center";
    configs.context.textBaseline = "middle";
    configs.context.font = configs.style.font.size + "px sans-serif"
    if (isRotated) {
        configs.context.rotate(-.5 * Math.PI);
        configs.context.fillText(text, -pos.y, pos.x);
        configs.context.rotate(.5 * Math.PI);
    } else {
        configs.context.fillText(text, pos.x, pos.y);
    }

    configs.context.restore();
}

function drawRectangle(configs: IConfig, start: Vector2, end: Vector2, isFilled?: boolean) {
    configs.context.save();

    if (isFilled) {
        configs.context.fillRect(
            start.x, start.y,
            end.x - start.x,
            end.y - start.y
        );
    } else {
        configs.context.lineWidth = configs.style.border.width;
        configs.context.strokeRect(
            start.x, start.y,
            end.x - start.x,
            end.y - start.y
        );
    }
    
    configs.context.restore();
}

function drawPoints(configs: IConfig, x: number[], y: number[]) {
    configs.context.save();
    configs.context.beginPath();
    for (let i = 0; i < x.length; i++) {
        let pos = convertXYtoWH(configs, calculateStartPoint(configs), calculateEndPoint(configs), new Vector2(x[i], y[i]));
        if (isInside(configs, x[i], y[i])) {
            configs.context.moveTo(pos.x, pos.y);
            configs.context.arc(pos.x, pos.y, 1.5, 0, 2 * Math.PI);
        }
    }
    configs.context.fill();
    configs.context.restore();
}

function drawLines(configs: IConfig, x: number[], y: number[]) {
    configs.context.save();
    configs.context.beginPath();
    let initial_pos = convertXYtoWH(configs, calculateStartPoint(configs), calculateEndPoint(configs), new Vector2(x[0], y[0]));
    configs.context.moveTo(initial_pos.x, initial_pos.y);
    for (let i = 1; i < x.length; i++) {
        let pos = convertXYtoWH(configs, calculateStartPoint(configs), calculateEndPoint(configs), new Vector2(x[i], y[i]));
        configs.context.lineTo(pos.x, pos.y);
    }
    configs.context.stroke();
    configs.context.restore();
}

function drawData(configs: IConfig, x: number[], y: number[], isLined: boolean) {
    configs.context.save();

    // Clipping
    let startPos = calculateStartPoint(configs);
    let endPos = calculateEndPoint(configs);
    configs.context.beginPath();
    configs.context.moveTo(startPos.x, startPos.y);
    configs.context.lineTo(startPos.x, endPos.y);
    configs.context.lineTo(endPos.x, endPos.y);
    configs.context.lineTo(endPos.x, startPos.y);
    configs.context.clip();
    
    if (isLined) {
        drawLines(configs, x, y);
    } else {
        drawPoints(configs, x, y);
    }

    configs.context.restore();
}