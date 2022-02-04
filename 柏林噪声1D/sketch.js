let offset = 0
let ratio = 0.01
let speed = 0.01

function setup() {
    createCanvas(600, 600)
    noiseDetail(2, 0.5)
    strokeWeight(2)
    stroke('blue')
    noFill()
}

function draw() {
    background(200)
    beginShape()
    for (let x = 0; x < width; x++) {
        const y = noise(offset + x * ratio) * height
        vertex(x, y)
    }
    endShape()
    offset += speed
}
