let ball
const g = 0.980665

function setup() {
    createCanvas(200, 400)
    ball = new Ball({ position: createVector(width / 2, 50), color: 'green' })
    // ball.applyForce(createVector(3, 0))
    // noLoop()
}

function draw() {
    background(200, 64)
    ball.applyForce(createVector(0, g))
    const e1 = map(ball.势能, 0, 343.23275, 0, height)
    const e2 = map(ball.动能, 0, 343.23275, 0, height)
    noStroke()
    fill(255, 0, 0, 255)
    rect(0, 0, 20, e2)
    rect(width - 20, height - e2, 20, e2)
    fill(0, 0, 255, 255)
    rect(0, height - e1, 20, e1)
    ball.show()
    ball.move()
}

function mousePressed() {
    redraw()
}

function keyPressed() {
    if (key == ' ') isLooping() ? noLoop() : loop()
}

class Ball {

    constructor(params = {}) {
        this.forces = []
        this.velocity = params.velocity || createVector()
        this.position = params.position || createVector(width / 2, height / 2)
        this.mass = params.mass || 1
        this.color = params.color || color(0, 0, 0, 64)
        this.radius = params.radius || 10
        this.diameter = this.radius * 2
    }

    get 动能() {
        return 0.5 * this.mass * this.velocity.mag() ** 2
    }

    get 势能() {
        return this.mass * g * (height - this.position.y)
    }

    get force() {
        return (this.forces.length === 0) ? createVector() : this.forces.reduce((sum, f) => sum.add(f))
    }

    get acceleration() {
        return p5.Vector.div(this.force, this.mass)
    }

    applyForce(force) {
        this.forces.push(force)
    }

    show() {
        stroke(64)
        strokeWeight(1)
        fill(this.color)
        ellipse(this.position.x, this.position.y, this.diameter)
    }

    move() {
        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        while (this.position.x < 0 || width <= this.position.x || this.position.y < 0 || height <= this.position.y) {
            if (this.position.x < 0 || width <= this.position.x) {
                this.velocity.x = -this.velocity.x
                this.position.x = -this.position.x
                if (this.position.x < 0) this.position.x += width * 2 - 1
            }
            if (this.position.y < 0 || height <= this.position.y) {
                this.velocity.y = -this.velocity.y
                this.position.y = -this.position.y
                if (this.position.y < 0) this.position.y += height * 2 - 1
            }
        }
        this.forces = []
    }

}
