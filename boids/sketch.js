/**
 * @see http://red3d.com/cwr/boids/
 * @see http://red3d.com/cwr/steer/
 */

let title = 'BOIDS'
let flock, homeX, homeY
let totalBoids = 256
let alignment = 10.0 // ratio of alignment, steer towards the average heading of local flockmates
let cohesion = 10.0 // ratio of cohesion, steer to move toward the average position of local flockmates
let separation = 10.0 // ratio of separation, steer to avoid crowding local flockmates
let homesickness = 10.0 // ratio of homesickness, steer to avoid leaving home
let perception = 100 // boid perception distance
let backgroundColorSolid = 'rgba(0, 0, 64, 1)'
let backgroundColorTransparent = 'rgba(0, 0, 64, 0.25)'
let showInfo = false
let showPerception = false
let showTail = true
let isOpen = false
let noEye = false
let minVelocity = 3
let maxVelocity = 5
let maxAcceleration = 0.5

function setup() {
    createCanvas(800, 800)
    flock = new Flock(totalBoids)
    homeX = random(width)
    homeY = random(height)
}

function draw() {
    background(showTail ? backgroundColorTransparent : backgroundColorSolid)
    flock.move()
    flock.draw()
    if (showInfo) {
        noStroke()
        fill(255)
        text(`SKETCH: ${title}`, 20, 30)
        text(`TOTAL BOIDS: ${flock.boids.length}`, 20, 60)
        text(`AVG. VELOCITY: ${flock.avgVelocity.toFixed(2)}`, 20, 90)
        text(`ALIGNMENT: x${alignment.toFixed(0)}`, 20, 120)
        text(`COHESION: x${cohesion.toFixed(0)}`, 20, 150)
        text(`SEPARATION: x${separation.toFixed(0)}`, 20, 180)
        text(`HOMESICKNESS: x${homesickness.toFixed(0)}`, 20, 210)
        text(`PERCEPTION: ${perception} px`, 20, 240)
        text(`EYE: ${noEye ? 'OFF' : 'ON'}`, 20, 270)
        text(`FPS: ${frameRate().toFixed(0)}`, 20, 300)
    }
    if (0 <= mouseX && mouseX < width && 0 <= mouseY && mouseY < height) {
        homeX = mouseX
        homeY = mouseY
        stroke('red')
        strokeWeight(20)
        point(homeX, homeY)
    }
}

function mousePressed() {
    if (!isLooping()) redraw()
}

function keyPressed() {
    console.log({ keyCode })
    if (keyCode === 32) isLooping() ? noLoop() : loop()
    if (keyCode === 73) showInfo = !showInfo
    if (keyCode === 80) showPerception = !showPerception
    if (keyCode === 84) showTail = !showTail
    if (keyCode === 79) isOpen = !isOpen
    if (keyCode === 69) noEye = !noEye
    else if (key === 'a') alignment += 1
    else if (key === 'A') alignment += 10
    else if (key === 'z') alignment = Math.max(alignment - 1, 0)
    else if (key === 'Z') alignment = Math.max(alignment - 10, 0)
    else if (key === 's') separation += 1
    else if (key === 'S') separation += 10
    else if (key === 'x') separation = Math.max(separation - 1, 0)
    else if (key === 'X') separation = Math.max(separation - 10, 0)
    else if (key === 'd') cohesion += 1
    else if (key === 'D') cohesion += 10
    else if (key === 'c') cohesion = Math.max(cohesion - 1, 0)
    else if (key === 'C') cohesion = Math.max(cohesion - 10, 0)
    else if (key === 'f') homesickness += 1
    else if (key === 'F') homesickness += 10
    else if (key === 'v') homesickness = Math.max(homesickness - 1, 0)
    else if (key === 'V') homesickness = Math.max(homesickness - 10, 0)
    else if (key === 'g') perception += 10
    else if (key === 'G') perception += 100
    else if (key === 'b') perception = Math.max(perception - 10, 0)
    else if (key === 'B') perception = Math.max(perception - 100, 0)
}

function p5VectorLimit(vector, minMag, maxMag) {
    vector.limit(maxMag)
    if (vector.mag() < minMag) vector.setMag(minMag)
    return vector
}

class Boid {
    constructor(position, velocity) {
        this.id = uuidv4()
        this.position = position
        this.velocity = velocity
        this.externalForces = []
        this.mass = 1
    }

    get externalForce() {
        let sum = createVector()
        this.externalForces.forEach((force) => sum.add(force))
        return sum
    }

    get acceleration() {
        return this.externalForce.div(this.mass).limit(maxAcceleration)
    }

    distanceTo(other) {
        return dist(this.position.x, this.position.y, other.position.x, other.position.y) || 0.0000001
    }

    angleTo(other) {
        const a = this.velocity.heading()
        const b = p5.Vector.sub(other.position, this.position).heading()
        return Math.abs(a - b)
    }

    move() {
        this.velocity.add(this.acceleration)
        p5VectorLimit(this.velocity, minVelocity, maxVelocity)
        this.position.add(this.velocity)
        if (!isOpen) {
            this.position.x = (this.position.x + width) % width
            this.position.y = (this.position.y + height) % height
        }
    }

    draw() {
        push()
        translate(this.position.x, this.position.y)
        rotate(this.velocity.heading() + HALF_PI)
        strokeWeight(1)
        stroke('rgba(255, 255, 255, 0.8)')
        fill('rgba(200, 200, 255, 0.4)')
        triangle(0, -5, -3, 5, 3, 5)
        if (showPerception) {
            noStroke()
            fill('rgba(255, 200, 255, 0.01)')
            circle(0, 0, perception * 2)
        }
        pop()
    }
}

class Flock {
    constructor(total = 128) {
        // 随机生成所有的boid
        this.boids = []
        for (let i = 0; i < total; i++) {
            const position = createVector(random(width), random(height))
            const velocity = p5.Vector.random2D().setMag(1)
            this.boids.push(new Boid(position, velocity))
        }
    }

    // 所有boids的平均速率
    get avgVelocity() {
        let velocity = 0
        this.boids.forEach((boid) => (velocity += boid.velocity.mag()))
        return velocity / this.boids.length
    }

    // 更新所有boids
    move() {
        // 当前boids的快照
        window.boids = _.cloneDeep(this.boids)

        // 更新所有boids各自所受的外力
        for (let boid of this.boids) {
            let numberOfNeighbors = 0
            let neighborsAvgVelocity = createVector()
            let neighborsAvgPosition = createVector()
            let totalSeparation = createVector()
            for (let other of window.boids) {
                if (other.id != boid.id) {
                    const distance = boid.distanceTo(other)
                    if (boid.distanceTo(other) <= perception) {
                        if (noEye || boid.angleTo(other) <= QUARTER_PI * 2) {
                            numberOfNeighbors += 1
                            neighborsAvgVelocity.add(other.velocity)
                            neighborsAvgPosition.add(other.position)
                            const repulsion = p5.Vector.sub(boid.position, other.position)
                                .normalize()
                                .mult((perception / distance) ** 2)
                            totalSeparation.add(repulsion)
                        }
                    }
                }
            }

            boid.externalForces = []
            if (numberOfNeighbors > 0) {
                // 对齐性：向群体的平均航向移动
                neighborsAvgVelocity.div(numberOfNeighbors)
                boid.externalForces.push(neighborsAvgVelocity.mult(alignment))

                // 一致性：向群体的平均位置移动
                neighborsAvgPosition.div(numberOfNeighbors)
                const distance = dist(neighborsAvgPosition.x, neighborsAvgPosition.y, boid.position.x, boid.position.y)
                boid.externalForces.push(
                    neighborsAvgPosition
                        .sub(boid.position)
                        .normalize()
                        .mult(cohesion * distance ** 2)
                )

                // 分离性：移动以避免过于拥挤
                boid.externalForces.push(totalSeparation.mult(separation * 10))
            }

            // 改变兴趣点
            if (random() > 0.9999) {
                homeX = random(width)
                homeY = random(height)
            }
            // 趋巢性：向巢(兴趣点)中心位置移动
            const distance = dist(homeX, homeY, boid.position.x, boid.position.y)
            const centripetalForce = p5.Vector.sub(createVector(homeX, homeY), boid.position)
                .normalize()
                .mult(0.001 * homesickness * distance ** 2)
            boid.externalForces.push(centripetalForce)
        }

        // 更新所有boids的位置
        for (let boid of this.boids) boid.move()
    }

    draw() {
        for (let boid of this.boids) boid.draw()
    }
}
