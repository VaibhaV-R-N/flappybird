const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const scoreBoard = document.querySelector("h1")
scoreBoard.style.left = `${(innerWidth/2)-50}px`

let hint = document.querySelector("h2")
hint.style.top = `${innerHeight/2.75}px`
hint.style.left = `${(innerWidth/2)-200}px`
let i = 0
let hintInterval = setInterval(() => {
    i++
    if (i === 7) {
        hint.innerText = "Good Luck :)"
    }
    if (i === 10) {
        hint.innerText = "You Are Gonna Need It..  ;)"

    }
    if (i === 15) {
        hint.innerText = ""
        clearInterval(hintInterval)
    }
}, 1000)

//images
const imagePipe = new Image()
imagePipe.src = "./images/pipe.png"

const imageRPipe = new Image()
imageRPipe.src = "./images/rpipe.png"

const imageBird = new Image()
imageBird.src = "./images/bird.png"

const imageBird2 = new Image()
imageBird2.src = "./images/bird2.png"

//sounds
const theme = new Audio()
theme.src = "./sound/theme.mp3"
theme.loop = true
theme.play()

const swoosh = new Audio()
swoosh.src = "./sound/swoosh.mp3"

const hit = new Audio()
hit.src = "./sound/hit.mp3"

const point = new Audio()
point.src = "./sound/point.mp3"

const die = new Audio()
die.src = "./sound/die.mp3"

canvas.style.backgroundImage = `url("./images/bg2.png")`
canvas.style.backgroundSize = "100% 100%"
canvas.width = innerWidth
canvas.height = innerHeight

let pair = []
const WIDTH = innerWidth * 0.1
let MINSPD = 1
let score = 0
let reload = 0

// pipes object
function pipes(x, y, x2, y2, dx, w, h, h2) {
    this.p = 0
    this.drawn = 0
    this.collidable = 0
    this.sc = 0
    this.w = w
    this.h = h
    this.h2 = h2
    this.x = x
    this.dx = dx
    this.y = y
    this.x2 = x2
    this.y2 = y2

    this.draw = () => {
        ctx.drawImage(imagePipe, this.x, this.y, this.w, this.h)
        ctx.drawImage(imageRPipe, this.x2, this.y2, this.w, this.h2)
    }

    this.update = () => {

        this.draw()

        this.x -= this.dx
        this.x2 -= this.dx

        if (this.x < (innerWidth / 2 + innerWidth / 4) && this.p === 0) {
            pair.push(makePipes())
            this.p = 1
        }
        if (this.x + this.w < 0) {
            pair.slice(0, 1)
        }

        if ((((birdy.x + birdy.w) > this.x) && (birdy.y >= this.y) && (birdy.y <= (this.y + this.h)) && reload === 0 && this.collidable === 0) ||
            (((birdy.x + birdy.w) > this.x2) && (birdy.y >= this.y2) && (birdy.y <= (this.y2 + this.h2)) && reload === 0 && this.collidable === 0) ||
            (((birdy.y + birdy.w) > this.y) && (birdy.x >= this.x) && (birdy.x <= (this.x + this.w)) && reload === 0 && this.collidable === 0) ||
            ((birdy.y < (this.y2 + this.h2)) && (birdy.x >= this.x2) && (birdy.x <= (this.x2 + this.w)) && reload === 0 && this.collidable === 0) ||
            (birdy.y < 0 && reload === 0 && this.collidable === 0) ||
            ((birdy.y + birdy.w) > innerHeight) && reload === 0 && this.collidable === 0) {
            reload = 1
            theme.pause()
            hit.play()
            hit.onended = () => {
                die.play()
            }
            birdy.ishit = 1
            setTimeout(() => {
                location.reload()
            }, 3000)

        }
        if (birdy.x + birdy.w > this.x + this.w && birdy.x + birdy.w > this.x2 + this.w) {
            this.collidable = 1
        }
        if (birdy.x > (this.x2 + this.w) && this.sc === 0 && birdy.ishit === 0) {
            score++
            this.sc = 1
            scoreBoard.innerText = `${score}`
            point.play()
            MINSPD = (score % 5 === 0 && score !== 0) ? MINSPD += 0.2 : MINSPD += 0
            for (pipe of pair) {
                pipe.dx = (score % 5 === 0 && score !== 0) ? MINSPD += 0.05 : MINSPD += 0
            }
        }

    }

}

//bird object
function bird(x, y, dy, mdy) {
    this.x = x
    this.y = y
    this.dy = dy
    this.mdy = mdy
    this.w = 55
    this.ishit = 0

    this.draw = () => {
        if (birdy.ishit === 1)
            ctx.drawImage(imageBird2, this.x, this.y, this.w + 35, this.w + 35)
        else {
            ctx.drawImage(imageBird, this.x, this.y, this.w, this.w)
        }
    }

    this.update = () => {
        this.draw()
        this.y += this.dy
    }



}
const birdy = new bird(250, 250, 2, 50)

window.addEventListener("resize", e => {

    canvas.width = innerWidth
    canvas.height = innerHeight
    pair = []
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    pair.push(makePipes())

})

window.addEventListener("keypress", e => {
    if (e.key === "w" && birdy.ishit === 0) {
        swoosh.play()
        birdy.y -= birdy.mdy

    }

})

const makePipes = () => {

    let w = WIDTH
    let h = (Math.random() * (innerHeight * 0.4)) + (innerHeight * 0.2)
    let h2 = innerHeight - (h + (innerHeight * 0.2))
    let x = innerWidth + w
    let y = innerHeight - h
    let x2 = innerWidth + w
    let y2 = 0
    let dx = MINSPD

    return new pipes(x, y, x2, y2, dx, w, h, h2)


}
pair.push(makePipes())

const animate = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    requestAnimationFrame(animate)

    for (let pipe of pair) {
        pipe.update()
    }
    birdy.update()


}

animate()