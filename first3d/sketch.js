let house
let camera
let x = -100, y = -10, z = 0
function setup() {
    createCanvas(600, 600, WEBGL)
    // createCanvas(windowWidth, windowHeight, WEBGL)
    angleMode(DEGREES)
    house = loadModel('cottage/cottage.obj')
    camera = createCamera()
    setCamera(camera)
}

function draw() {
    background(200)
    camera.setPosition(x, y, z)
    camera.lookAt((x + 0.001) % 360, y, z % 360)
    normalMaterial()
    rotateX(180)
    model(house)

    if (keyIsPressed === true) {
        if (key === 'w') x += 5
        else if (key === 's') x -= 5
        else if (key === 'a') z -= 5
        else if (key === 'd') z += 5
        else if (key === ' ') y -= 5
        else if (key === 'Shift') y += 5
        console.log({ x, y, z, key, keyCode })
    }

}
