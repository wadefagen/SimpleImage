# SimpleImage.js

## An image library with a simple API

SimpleImage.js is a simple image library with a minimal API, well-suited for
CS0/CS1-style courses.  Thousands of students have used assignments based off
of SimpleImage.js, building Instagram-like filters and augmented reality
(a la Pokemon GO).


## Download

Download [SimpleImage.js](https://raw.githubusercontent.com/wadefagen/SimpleImage/master/SimpleImage.js) or install it with bower:

    bower install SimpleImage


## Usage

Each SimpleImage requires an HTML canvas, which is used to read and display the
contents of the image.  Initialize the SimpleImage with `new SimpleImage(canvas, [readOnly=true])`.


## Image Methods

### getRGB

Returns the pixel at the specified location as an RGBA pixel.  R, G, B, and A
are each in the range [0, 255].

```js
var pixel = image.getRGB(x, y);  // {r: 200, g: 150, b: 100, a: 50 }
```

### getHSL

Returns the pixel at the specified location as an HSLA pixel.  H is in the range
[0, 360]; S, L and A are in the range [0, 1].

```js
var pixel = image.getHSL(x, y);  // { h: 320, s: 0.6, l: 0.7, a: 0.3 }
```

### setRGB

Changes the pixel at the specified location to the specified RGBA pixel.  `r`, `g`,
`b`, and `a` are each in the range [0, 255].

```js
var pixel = image.getRGB(x, y);
pixel.r = 0;   // remove the red channel, leave g and b unchanged
image.setRGB(x, y, pixel);
```

### setHSL

Changes the pixel at the specified location to the specified HSLA pixel.
`h` is in the range [0, 360]; `s`, `l`, and `a` are in the range [0, 1].

```js
var pixel = image.getHSL(x, y);
pixel.h = 200;   // set the hue to 200 (blue), leaving other channels unchanged
image.setHSL(x, y, pixel);
```


## Other Methods

### render

Renders the image to the canvas.

```js
var canvas = document.getElementById("myCanvas");
var simpleImage = new SimpleImage(canvas);
...
simpleImage.render();
```
