/**
 * SimpleImage.js
 * An image library with a simple API, well-suited for CS0/CS1-style courses.
 *
 * by Wade Fagen-Ulmschneider <http://wadefagen.com>
 * License: MIT
 */
(function() {
	"use strict";

	function SimpleImage(canvas, readOnly = false) {
		// Store the canvas and context
		this.canvas = canvas;
		this.context = canvas.getContext('2d');;

		// Store options
		this.readOnly = readOnly;

		// Read image data from canvas
		this.width = canvas.width;
		this.height = canvas.height;
		this.imageData = this.context.getImageData(0, 0, this.width, this.height);
		this.data = this.imageData.data;
	}

	SimpleImage.prototype = {
		render: function() {
			this.context.putImageData(this.imageData, 0, 0);
		},

		_getStartIndex: function (x, y) {
			if (Math.floor(x) !== x) { console.warn("Non-integer value for x given; using Math.floor(x)."); }
			if (Math.floor(y) !== y) { console.warn("Non-integer value for y given; using Math.floor(y)."); }
			return ((Math.floor(y) * this.width) + Math.floor(x)) * 4;
		},

		getRGB: function (x, y) {
			var i = this._getStartIndex(x, y);
			return {
				r: this.data[i],
				g: this.data[i+1],
				b: this.data[i+2],
				a: this.data[i+3]
			};
		},

		setRGB: function (x, y, pixel) {
			if (this.readOnly) {
				throw("A call to set a pixel in a SimpleImage was made to a read-only SimpleImage.");
			}

			if (!("r" in pixel && "g" in pixel && "b" in pixel)) {
				throw("A call to SimpleImage#setRGB was made with a pixel that did not have an r, g, and b value.");
			}

			if (!("a" in pixel)) {
				pixel.a = 255;
			}

			var i = this._getStartIndex(x, y);
			this.data[i] = pixel.r;
			this.data[i+1] = pixel.g;
			this.data[i+2] = pixel.b;
			this.data[i+3] = pixel.a;
		},

		// Converts RGB to HSL, based off of tinycolor.js conversion function
		// <https://bgrins.github.io/TinyColor/docs/tinycolor.html>
		getHSL: function(x, y) {
			var rgb = this.getRGB(x, y);
			var r = bound01(rgb.r, 255),
			    g = bound01(rgb.g, 255),
					b = bound01(rgb.b, 255),
					a = bound01(rgb.a, 255);

			var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h, s, l = (max + min) / 2;

	    if (max == min) {
	        h = s = 0; // achromatic
	    } else {
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max) {
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }

	        h /= 6;
	    }

	    return { h: h * 360, s: s, l: l, a: a };
		},

		// Converts HSL to RGB, based off of tinycolor.js conversion function
		// <https://bgrins.github.io/TinyColor/docs/tinycolor.html>
		setHSL: function(x, y, pixel) {
			var h = bound01(pixel.h, 360),
			    s = bound01(pixel.s, 1),
					l = bound01(pixel.l, 1),
					a = 1;

			if ("a" in pixel) {
				a = bound01(pixel.a, 1);
			}

			function hue2rgb(p, q, t) {
	        if(t < 0) t += 1;
	        if(t > 1) t -= 1;
	        if(t < 1/6) return p + (q - p) * 6 * t;
	        if(t < 1/2) return q;
	        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	        return p;
	    }

			var r, g, b;
	    if(s === 0) {
	        r = g = b = l; // achromatic
	    } else {
	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return this.setRGB(x, y, { r: r * 255, g: g * 255, b: b * 255, a: a * 255 });
		},
	}


	// Take input from [0, n] and return it as [0, 1]
	function bound01(n, max) {
	    if (isOnePointZero(n)) { n = "100%"; }

	    var processPercent = isPercentage(n);
	    n = Math.min(max, Math.max(0, parseFloat(n)));

	    // Automatically convert percentage into number
	    if (processPercent) {
	        n = parseInt(n * max, 10) / 100;
	    }

	    // Handle floating point rounding errors
	    if ((Math.abs(n - max) < 0.000001)) {
	        return 1;
	    }

	    // Convert into [0, 1] range if it isn't already
	    return (n % max) / parseFloat(max);
	}


	// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
	// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
	function isOnePointZero(n) {
	    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
	}

	// Check to see if string passed in is a percentage
	function isPercentage(n) {
	    return typeof n === "string" && n.indexOf('%') != -1;
	}

	// Node: Export function
	if (typeof module !== "undefined" && module.exports) {
	    module.exports = SimpleImage;
	}
	// AMD/requirejs: Define the module
	else if (typeof define === 'function' && define.amd) {
	    define(function () {return SimpleImage;});
	}
	// Browser: Expose to window
	else {
	    window.SimpleImage = SimpleImage;
	}
})();
