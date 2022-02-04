const windowWidth = 640
const windowHeight = 480
const fpsLimit = 30
const fpsElement = document.getElementById('fps')
const balls = []
const ballInitNumber = 256
const ballInitRadius = 10
const ballInitSpeed = 2
const ballInitColor = 'darkorange'
const ballCollidedColor = 'yellow'
const quadTreeColor = 'yellowgreen'
const backgroundColor = 'darkgreen'
const qtreeCapacity = 4
let qtree = null

function setup() {
    createCanvas(windowWidth, windowHeight)
    frameRate(fpsLimit)
    for (let i = 0; i < ballInitNumber; i++) balls.push(createBall())
}

function createBall() {
    const position = createVector(random(width), random(height))
    const velocity = p5.Vector.random2D().setMag(ballInitSpeed)
    return new Ball(position, velocity, ballInitRadius, ballInitColor)
}

function draw() {
    background(backgroundColor)
    fpsElement.innerText = frameRate().toFixed(1)
    qtree = new QuadTree(0, 0, width, height, qtreeCapacity, balls)
    qtree.show(quadTreeColor)
    balls.forEach((ball) => ball.show())
    balls.forEach((ball) => ball.move())
}

class Ball {
    constructor(position, velocity, radius, color) {
        this.position = position || createVector(width / 2, height / 2)
        this.velocity = velocity || createVector()
        this.acceleration = createVector()
        this.radius = radius || 5
        this.size = radius * 2 || 10
        this.color = color || 128
    }

    get x() {
        return this.position.x
    }

    get y() {
        return this.position.y
    }

    get neighbors() {
        return qtree.query(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
    }

    get collided() {
        return this.neighbors.some((other) => {
            if (this === other) return false
            const distance = p5.Vector.sub(this.position, other.position)
            if (distance.mag() < this.size) {
                this.velocity = distance.normalize().setMag(ballInitSpeed)
                other.velocity = p5.Vector.mult(this.velocity, -1)
                return true
            }
        })
    }

    show(size, color) {
        size = size || this.size
        noStroke()
        fill(this.collided ? ballCollidedColor : color || this.color)
        ellipse(this.position.x, this.position.y, size, size)
    }

    move() {
        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        while (this.position.x < 0 || width <= this.position.x || this.position.y < 0 || height <= this.position.y) {
            if (this.position.x < 0 || width <= this.position.x) {
                this.velocity.x = -this.velocity.x
                this.position.x = -this.position.x
                if (this.position.x < 0) this.position.x += width * 2
            }
            if (this.position.y < 0 || height <= this.position.y) {
                this.velocity.y = -this.velocity.y
                this.position.y = -this.position.y
                if (this.position.y < 0) this.position.y += height * 2
            }
        }
    }
}
