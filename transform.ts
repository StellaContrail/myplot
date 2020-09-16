/// <reference path="./myplot.ts" />
/// <reference path="./util.ts" />

function convertXYtoWH(configs: IConfig, graphStart: Vector2, graphEnd: Vector2, pos: Vector2): Vector2 {
    let graphWH: Vector2 = graphEnd.minus(graphStart);
    let ratioWtoX = graphWH.x / (configs.range.xmax - configs.range.xmin);
    let ratioHtoY = graphWH.y / (configs.range.ymax - configs.range.ymin);

    let XAxisHeight = configs.size.height - graphEnd.y;
    return new Vector2( (pos.x - configs.range.xmin) * ratioWtoX + graphStart.x, configs.size.height - ( (pos.y - configs.range.ymin) * ratioHtoY + XAxisHeight) );
}

function calculateStartPoint(configs: IConfig) {
    let start = new Vector2(
        configs.style.font.size * 3 + configs.style.padding + configs.style.border.width,
        configs.style.font.size + configs.style.padding + configs.style.border.width
    );
    return start;
}

function calculateEndPoint(configs: IConfig) {
    let end = new Vector2(
        configs.size.width - ( configs.style.font.size + configs.style.border.width ),
        configs.size.height - ( configs.style.font.size + configs.style.border.width ) - configs.style.font.size * 2
    );
    return end;
}

function isInside(configs: IConfig, x: number, y: number): Boolean {
    if (configs.range.xmin <= x && x <= configs.range.xmax) {
        if (configs.range.ymin <= y && y <= configs.range.ymax) {
            return true;
        }
    }
    return false;
}