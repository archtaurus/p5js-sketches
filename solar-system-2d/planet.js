class Planet {
    constructor(name, color, diameter, distance, angle = 0) {
        this.name = name
        this.color = color
        this.diameter = diameter
        this.distance = distance
        this.angle = angle
    }
    show() {
        fill(this.color)
        ellipse(0, 0, this.diameter)
    }
}
