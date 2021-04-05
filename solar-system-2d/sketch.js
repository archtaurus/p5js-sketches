const planets = {}

function setup() {
    createCanvas(600, 600)
    planets.sun = new Planet('Sun', color('rgba(255, 200, 100, 1)'), 20, 0)
}

function draw() {
    background(0)
    translate(width / 2, height / 2)
    Object.values(planets).forEach(planet => {
        planet.show()
    })
}
