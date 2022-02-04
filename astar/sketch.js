/**
 * A* path finder
 * @file astar.js
 * @author 赵鑫<7176466@qq.com>
 */

/**
 * 节点类
 */
class Node {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.visited = false
        this.visitor = null
        this.reachable = true
        this.neighbors = new Set()
    }

    connect(node) {
        this.neighbors.add(node)
        node.neighbors.add(this)
    }

    get reachableNeighbors() {
        const neighbors = new Set()
        for (const neighbor of this.neighbors) {
            if (neighbor.reachable) neighbors.add(neighbor)
        }
        return neighbors
    }

    euclideanDistanceTo(node) {
        return Math.abs(this.x - node.x) + Math.abs(this.y - node.y)
    }

    visit(node) {
        if (!node.reachable || node.visited) return false
        node.visited = true
        node.visitor = this
        return true
    }
}

/**
 * 场地类
 */
class Field {
    constructor(width, height, cols, rows) {
        this.cols = cols
        this.rows = rows
        this.width = width
        this.height = height
        this.nodeW = width / cols
        this.nodeH = height / rows
        this.grid = null
        this.start = null
        this.end = null
        this.current = null
        this.initGrid()
    }

    initGrid() {
        this.grid = new Array()
        for (let r = 0, y = this.nodeH / 2; r < this.rows; r++, y += this.nodeH) {
            const row = new Array()
            for (let c = 0, x = this.nodeW / 2; c < this.cols; c++, x += this.nodeW) {
                row.push(new Node(x, y, this.nodeW, this.nodeH))
            }
            this.grid.push(row)
        }

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols - 1; x++) {
                this.grid[y][x].connect(this.grid[y][x + 1])
            }
        }

        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows - 1; y++) {
                this.grid[y][x].connect(this.grid[y + 1][x])
            }
        }

        this.start = this.grid[0][0]
        this.end = this.grid[this.cols - 1][this.rows - 1]
        this.current = this.start
    }

    findPath() {}
}

/********** 以上是 astar.js  **********/

document.addEventListener('contextmenu', (event) => event.preventDefault())

let field

Node.prototype.show = function (color) {
    stroke(0)
    rectMode(CENTER)
    if (color) fill(color)
    else if (this.visited) fill('green')
    else fill(this.reachable ? 'darkgreen' : 'black')
    rect(this.x, this.y, this.w, this.h)
}

Field.prototype.addRamdonWalls = function (ratio = 0.2) {
    for (let y = 2; y < this.cols - 2; y++) {
        for (let x = 2; x < this.rows - 2; x++) {
            this.grid[y][x].reachable = random() > ratio
        }
    }
}

Field.prototype.show = function () {
    for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
            this.grid[y][x].show()
        }
    }
    if (this.start) this.start.show('yellow')
    if (this.end) this.end.show('orange')
}

function setup() {
    createCanvas(800, 800)
    field = new Field(width, height, 20, 20)
    field.addRamdonWalls()
    noLoop()
}

function draw() {
    field.findPath()
    field.show()
}

function mousePressed(event) {
    if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY > height) return false
    const row = Math.floor(mouseY / field.nodeH)
    const col = Math.floor(mouseX / field.nodeW)
    const node = field.grid[row][col]
    switch (mouseButton) {
        case 'left': {
            node.reachable = !node.reachable
            break
        }
        case 'center': {
            if (node !== field.start) {
                node.reachable = true
                field.end = node
            }
            break
        }
        case 'right': {
            if (node !== field.end) {
                node.reachable = true
                field.start = node
            }
            break
        }
    }
    field.current = field.start
    noLoop()
    // clear all processing data here
    return false
}

function keyPressed() {
    switch (key.toLowerCase()) {
        case 'r': {
            field.initGrid()
            field.addRamdonWalls()
            noLoop()
            break
        }
        case ' ': {
            isLooping() ? noLoop() : loop()
            break
        }
    }
}
