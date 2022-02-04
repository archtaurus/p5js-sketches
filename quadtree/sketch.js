let qtree

function setup() {
    createCanvas(600, 600, P2D)
    qtree = new QuadTree(0, 0, width, height, 4)
    frameRate(30)
    // noLoop()
}

function draw() {
    if (mouseIsPressed) {
        for (let i = 0; i < 10; i++) qtree.push(new Point(mouseX + random(-100, 100), mouseY + random(-100, 100)))
    }
    background(0)
    qtree.show()
    const x = mouseX
    const y = mouseY
    const w = 100
    const h = 100
    stroke('yellowgreen')
    rect(x - w / 2, y - h / 2, w, h)
    const points = qtree.query(x - w / 2, y - h / 2, w, h)
    points.forEach((i) => i.show(5, 'red'))
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.s = 2
        this.c = 128
    }
    setSize(size) {
        this.s = size || this.s
    }
    setColor(color) {
        this.c = color || this.c
    }
    show(size, color) {
        strokeWeight(size || this.s)
        stroke(color || this.c)
        point(this.x, this.y)
    }
}

class QuadTree {
    constructor(x, y, w, h, capacity) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = 128
        this.points = []
        this.subTrees = []
        this.capacity = capacity
    }

    show() {
        if (this.subTrees.length > 0) this.subTrees.forEach((i) => i.show())
        else {
            noFill()
            strokeWeight(1)
            stroke(this.color)
            rect(this.x, this.y, this.w, this.h)
            this.points.forEach((i) => i.show())
        }
    }

    contains(point) {
        return point.x >= this.x && point.x < this.x + this.w && point.y >= this.y && point.y < this.y + this.h
    }

    query(x, y, w, h) {
        if (x >= this.x + this.w || x + w <= this.x || y >= this.y + this.h || y + h <= this.y) return []
        let points = []
        if (this.subTrees.length > 0) {
            for (let tree of this.subTrees) points = points.concat(tree.query(x, y, w, h))
        } else points = points.concat(this.points)
        return points
    }

    push(point) {
        if (this.contains(point)) {
            for (let tree of this.subTrees) if (tree.push(point)) return true
            if (this.points.length === this.capacity) {
                this.split()
                return this.push(point)
            } else {
                point.setColor(this.color)
                this.points.push(point)
                return true
            }
        }
    }

    split() {
        if (this.subTrees.length < 1) {
            const halfW = this.w / 2
            const halfH = this.h / 2
            const northWest = new QuadTree(this.x, this.y, halfW, halfH, this.capacity)
            const northEast = new QuadTree(this.x + halfW, this.y, halfW, halfH, this.capacity)
            const southEast = new QuadTree(this.x + halfW, this.y + halfH, halfW, halfH, this.capacity)
            const southWest = new QuadTree(this.x, this.y + halfH, halfW, halfH, this.capacity)
            this.subTrees = [northWest, northEast, southEast, southWest]
            while (this.points.length > 0) {
                this.push(this.points.pop())
            }
        }
    }
}
