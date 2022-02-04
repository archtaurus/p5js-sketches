let offestX = 0
let speedX = 0.05
let offsetY = 0
let speedY = 0
let noiseScale = 0.05
let fps = 0

function setup() {
    createCanvas(300, 300)
    noiseDetail(4, 0.5)
    pixelDensity(1)
    frameRate(30)
    noStroke()
}

function draw() {
    loadPixels()
    for (let y = 0; y < height; y++) {
        const noiseY = offsetY + y * noiseScale
        for (let x = 0; x < width; x++) {
            const noiseX = offestX + x * noiseScale
            const noise2D = noise(noiseX, noiseY)
            const noiseV = map(noise2D, 0, 1, 0, 255)
            const index = (x + width * y) * 4
            pixels[index + 0] = noiseV
            pixels[index + 1] = noiseV
            pixels[index + 2] = noiseV
            pixels[index + 3] = 255
        }
    }
    updatePixels()
    offestX += speedX
    offsetY += speedY
}

function keyPressed() {
    isLooping() ? noLoop() : loop()
}
