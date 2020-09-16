function $(e: string): HTMLElement {
    if (e[0] == '.') {
        return document.getElementById(e.slice(1));
    } else {
        return document.querySelector(e);
    }
}

class Vector2 {
    x: number;
    y: number;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    plus(b: Vector2) {
        return new Vector2(this.x + b.x, this.y + b.y);
    }
    minus(b: Vector2) {
        return new Vector2(this.x - b.x, this.y - b.y);
    }
    multi(lambda: number) {
        return new Vector2(this.x * lambda, this.y * lambda);
    }
}

function evaluate(func: (x: number) => number, configs: IConfig) {
    let dh = (configs.range.xmax - configs.range.xmin) / (configs.samples - 1);
    let x: number[] = [];
    let y: number[] = [];
    let t = configs.range.xmin;
    for (let i = 0; i < configs.samples; i++) {
        t += dh;
        x.push( t );
        y.push(func(t));
    }
    return { x: x, y: y };
}