function getValueFromPx(pxValue) {
    return parseInt(pxValue.split('px')[0])
}

function newElement(tagName, className) {
    elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')

    const border_ = newElement('div', 'border_')
    const body_ = newElement('div', 'body_')
    this.element.appendChild(reverse ? body_ : border_)
    this.element.appendChild(reverse ? border_ : body_)

    this.setHeight = height => body_.style.height = `${height}px`
}

function PairOfBarriers(height, gap, x) {
    this.element = newElement('div', 'pair-of-barriers')

    this.upBarrier = new Barrier(true)
    this.downBarrier = new Barrier(false)

    this.element.appendChild(this.upBarrier.element)
    this.element.appendChild(this.downBarrier.element)

    this.randomGap = () => {
        const upHeight = Math.random() * (height - gap)
        const downHeight = height - gap - upHeight
        this.upBarrier.setHeight(upHeight)
        this.downBarrier.setHeight(downHeight)
    }

    this.getX = () => getValueFromPx(this.element.style.left)
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.randomGap()
    this.setX(x)
}

function Barriers(height, width, gap, space, notifyScore) {
    this.pairs = [
        new PairOfBarriers(height, gap, width),
        new PairOfBarriers(height, gap, width + space),
        new PairOfBarriers(height, gap, width + space * 2),
        new PairOfBarriers(height, gap, width + space * 3),
    ]

    const shift = 3

    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - shift)
    
            if(pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.randomGap()
            }
    
            const middle = width / 2
            const crossedMiddle = pair.getX() + shift >= middle && pair.getX() < middle
            if (crossedMiddle) notifyScore()
        })
    }
}

function Bird(height) {
    let flying = true

    this.element = newElement('img', 'bird')
    this.element.src = 'imgs/bird.png'

    this.getY = () => getValueFromPx(this.element.style.bottom)
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5)
        const maxHeight = height - this.element.clientHeight

        if(newY <= 0) this.setY(0)
        else if(newY > maxHeight) this.setY(maxHeight)
        else this.setY(newY)
    }

    this.setY(height / 2)
    console.log(`altura do passaro: ${this.element.clientHeight}`)
}


function Progress() {
    this.element = newElement('span', 'progress')
    this.updateScore = score => this.element.innerHTML = score
    
    this.updateScore(0)
}

function overlaped(elementA, elementB) {
    const rectA = elementA.getBoundingClientRect()
    const rectB = elementB.getBoundingClientRect()

    const horizontal = (rectA.left + rectA.width >= rectB.left) && (rectB.left + rectB.width >= rectA.left)
    const vertical = (rectA.top + rectA.height >= rectB.top) && (rectB.top + rectB.height >= rectA.top)

    return horizontal && vertical
}

function collided(bird, barriers) {
    let collided = false
    barriers.pairs.forEach(pair => {
        if (!collided) {
            const upBarrier = pair.upBarrier.element
            const downBarrier = pair.downBarrier.element
            collided = overlaped(bird.element, upBarrier) || overlaped(bird.element, downBarrier)
        }
    })

    return collided
}

function FlappyBird() {
    let score = 0

    const gameArea = document.querySelector('[pl-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth

    const progress = new Progress()
    const barries = new Barriers(height, width, 215, 400, () => progress.updateScore(++score))
    const bird = new Bird(height)

    gameArea.appendChild(bird.element)
    gameArea.appendChild(progress.element)
    barries.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const timer = setInterval(() => {
            barries.animate()
            bird.animate()

            if (collided(bird, barries)) {
                clearInterval(timer)
            }
        }, 20);
    }
}

new FlappyBird().start()