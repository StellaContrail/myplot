# MyPlot
Lightweight plotting library for Javascript

## Concept
This library aims for fastest plotting speed with Canvas *at the sacrifice of design/functionality*.

### Why Canvas ?
A lot of other plotting libraries use SVG format because of the browser compatibility, although SVG is usually slower than Canvas.

SVG vs canvas: how to choose :
https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/samples/gg193983(v=vs.85)

For those who perform numerical simulations, speed and accuracy are more important than design and compatibility.

## Note
It's still in development and far from completion.
No recommendation for practical use.

## Usage
#### HTML
The plot canvas is inserted into the div tag with ``` id="plot" ```.
```HTML
<div id="plot"></div>
```
#### Javascript
Instantiate a library class with initial configuration.
```Javascript
let myplot = new MyPlot({
  el: ".plot",
  size: { width: 800, height: 600 },
  range: { xmin: -10, xmax: 10, ymin: -1, ymax: 1 },
  style: { tics: { x: 5, y: 7 } },
  samples: 70,
});
```
You can also enable other basic features for plotting.  
Such as Title, Labels, Tics, Grid, and zeroAxises.
```Javascript
myplot.setTitle("Plot Title");
myplot.setXLabel("X");
myplot.setYLabel("Y");
myplot.setXTics();
myplot.setYTics(1);
myplot.setGrid();
myplot.setZeroAxis();
```
Finally you can plot with ``` MyPlot.plot(func(x: number): number, isLined: boolean) ```.
```Javascript
myplot.plot((x) => {
  return Math.cos(x);
}, true);
```

