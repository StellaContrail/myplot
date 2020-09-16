/// <reference path="util.ts" />
/// <reference path="ui.ts" />

/*
    For dataset with many points, canvas is better choice for performance.
    ref -> https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/samples/gg193983(v=vs.85)
    Although for old-browsers and large screens, SVG is better.
*/

interface ISize {
    width: number,
    height: number
}
interface IRange {
    xmin: number, xmax: number,
    ymin: number, ymax: number,
    yAutoScaled: boolean
}
interface IStyle {
    border: { width: number },
    font: { size: number },
    padding: number,
    tics: { x: number, y: number }
}

interface IConfig {
    el: string,
    parent: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    size: ISize,
    range: IRange,
    samples: number,
    style: Partial<IStyle>
}

class MyPlot {
    configs: IConfig;
    // TODO: default parameters are not working as intended.
    constructor(configs: Partial<IConfig>) {
        this.configs = {
            el: configs.el,
            parent: document.getElementById(configs.el.slice(1)) as HTMLCanvasElement,
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
        }
        let canvas = this.insertCanvasNode(this.configs.parent, this.configs.size);
        this.configs.context = canvas.getContext("2d") as CanvasRenderingContext2D;

        setBorder(this.configs);
    }

    insertCanvasNode(parent: HTMLCanvasElement, size: ISize): HTMLCanvasElement {
        parent.insertAdjacentHTML('beforeend', '<canvas width="' + size.width + '" height="' + size.height + '"></canvas>');
        return parent.lastElementChild as HTMLCanvasElement;
    }

    // TODO: Is there a better way to access methods defined in different files?
    setTitle(title: string) {
        setTitle(this.configs, title);
    }
    
    setXLabel(label: string) {
        setXLabel(this.configs, label);
    }
    
    setYLabel(label: string) {
        setYLabel(this.configs, label);
    }

    setXRange(xmin: number, xmax: number) {
        if (xmin > xmax) {
            throw new Error("Invalid Range");
        }
        this.configs.range.xmin = xmin;
        this.configs.range.xmax = xmax;
    }
    setYRange(ymin: number, ymax: number) {
        if (ymin > ymax) {
            throw new Error("Invalid Range");
        }
        this.configs.range.ymin = ymin;
        this.configs.range.ymax = ymax;
    }
    setXTics(digits?: number) {
        setXTics(this.configs, digits);
    }
    setYTics(digits?: number) {
        setYTics(this.configs, digits);
    }
    setGrid() {
        setGrid(this.configs);
    }
    setZeroAxis() {
        setZeroAxis(this.configs);
    }
    init() {
        init(this.configs);
    }
    initAll() {
        initAll(this.configs);
    }

    plot(func: (x: number) => number, lined: boolean) {
        let data = evaluate(func, this.configs);
        drawData(this.configs, data.x, data.y, lined);
    }
}

console.log("MyPlot is loaded");