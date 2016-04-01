var lights = 50,
    pixelsToSend = new Uint8ClampedArray(lights * 3),
    pixelsStored = {},
    ms = 50,
    anim = 1000;

/* Set Default Light Color to Off */
for (var i = 0; i < lights; i++) {
    pixelsStored[i] = {
        current: {
            r: 0,
            g: 0,
            b: 0
        },
        steps: {
            r: 0,
            g: 0,
            b: 0
        }

    }
}

/* Calculate steps */
var steps = anim / ms;
var calledSteps = 0;

/* Call setPixel() to set the colors */
function setPixel(arr, red, grn, blu) {

    if (typeof (arr) == "string" || typeof (arr) == "number") {
        arr = [parseInt(arr)];
    }

    arr.forEach(function (e, i, a) {

        pixelsStored[e].steps = {
            r: (red - pixelsStored[e].current.r) / steps,
            g: (grn - pixelsStored[e].current.g) / steps,
            b: (blu - pixelsStored[e].current.b) / steps
        };

    });

}

/* Call renderPixels to send / animate the transition */
function renderPixels() {

    calledSteps++;

    for (var i = 0; i < lights; i++) {
        pixelsToSend[i * 3 + 0] = pixelsStored[i].current.r;
        pixelsToSend[i * 3 + 1] = pixelsStored[i].current.g;
        pixelsToSend[i * 3 + 2] = pixelsStored[i].current.b;
        pixelsStored[i].current.r += pixelsStored[i].steps.r;
        pixelsStored[i].current.g += pixelsStored[i].steps.g;
        pixelsStored[i].current.b += pixelsStored[i].steps.b;
    }
    if (steps >= calledSteps) {
        setTimeout(renderPixels, ms);
    } else {
        calledSteps = 0;
    }

    console.log(pixelsToSend);

    //SPI2.send4bit(pixelsToSend, 0b0001, 0b0011);
}


/* test */
for (var i = 0; i < lights; i++) {
    setPixel(i, Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
}

renderPixels();

setTimeout(function () {
    for (var i = 0; i < lights; i++) {
        setPixel(i, Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
    }

    renderPixels();
}, 3000);