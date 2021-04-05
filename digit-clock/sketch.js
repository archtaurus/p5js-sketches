function setup() {
    createCanvas(600, 400)
    noStroke()
    frameRate(2)
    fill(0, 255, 255)
    textSize(100)
    textFont("Ubuntu Mono")
    textAlign(CENTER, CENTER)
}

function draw() {
    background(0, 100, 100)
    text(`${hour().toString().padStart(2, '0')}:${minute().toString().padStart(2, '0')}:${second().toString().padStart(2, '0')}`, width / 2, height / 2)
}
