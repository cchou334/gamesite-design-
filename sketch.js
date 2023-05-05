const size = 96

let floor1, floor2, pass1, pass2, room1, room2, car, characters
let roomEntranceX, roomEntranceY
let room = 0
let person
let carX, carY, carSpeed = 3

// 加载所有素材图片
function preload() {
  floor1 = loadImage('floor1.png')
  floor2 = loadImage('floor2.png')
  pass1 = loadImage('pass1.png')
  pass2 = loadImage('pass2.png')
  room1 = loadImage('room1.png')
  room2 = loadImage('room2.png')
  car = loadImage('car.png')
  characters = loadImage('characters.png')
}

function setup() {
  createCanvas(size * 14, size * 7)
  background(255)
  angleMode(DEGREES)
  stroke(0)
  noFill()
  init()

  // car的初始位置
  carX = 100
  carY = height - 80
}

function draw() {
  background('red')

  // 判断按了哪个方向键 上下左右
  if (keyIsPressed) {
    if (key == 'ArrowUp') { // 上
      person.direction = 3
      if (person.y >= 2) { // 避免小人出界
        person.y -= 2
      }
    } else if (key == 'ArrowDown') {// 下
      person.direction = 0
      if (person.y <= height - person.h - 2) { // 避免小人出界
        person.y += 2
      }
    } else if (key == 'ArrowLeft') {// 左
      person.direction = 1
      if (person.x >= 2) { // 避免小人出界
        person.x -= 2
      }
    } else if (key == 'ArrowRight') {// 右
      person.direction = 2
      if (person.x <= height - person.w - 2) { // 避免小人出界
        person.x += 2
      }
    }
  }

  // 判断当前页面属于哪个room
  if (room == 0) {
    drawRoom0()
  } else if (room == 1) {
    drawRoom1()
    drawCar()
    drawPerson()

    // 判断小人与绿色控制器的距离，如果<=90,则进入room 2
    if (dist(person.x, person.y, roomEntranceX, roomEntranceY) <= 90) {
      room = 2
      init()
    }
  } else if (room == 2) {
    drawRoom2()
    drawCar()
    drawPerson()

    // 判断小人与绿色控制器的距离，如果<=90,则进入room 1
    if (dist(person.x, person.y, roomEntranceX, roomEntranceY) <= 90) {
      room = 1
      init()
    }
  }
}

// 绘制car
function drawCar() {
  if (carX <= 0 || carX >= width - 239) {
    carSpeed *= -1
  }
  carX += carSpeed
  image(car, carX, carY, 239 * 0.5, 144 * 0.5)
}

// 开始的画面，选择room1 or room2
function drawRoom0() {
  background(122, 122, 110)
  fill(7, 89, 20)

  let x1 = width / 2 - 50 - 96
  let y = height / 2 - 132
  image(room1, x1, y, 96, 132)
  text('Room1', x1 + 20, y + 150)

  let x2 = width / 2 + 50
  image(room2, x2, y, 96, 132)
  text('Room2', x2 + 20, y + 150)

  // 这里判断鼠标选了room 1还是room 2
  if (mouseIsPressed) {
    if (mouseX >= x1 && mouseX <= x1 + 96 && mouseY >= y && mouseY <= y + 132) {
      room = 1
    } else if (mouseX >= x2 && mouseX <= x2 + 96 && mouseY >= y && mouseY <= y + 132) {
      room = 2
    }
  }
}

// 绘制room1的背景和绿色控制器
function drawRoom1() {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 14; j++) {
      const x = j * size
      const y = i * size
      image(floor1, x, y, size, size)
      if (i == 3 && j == 2) {
        image(pass1, x + 3, y + 3, 90, 90)

        roomEntranceX = x + 3
        roomEntranceY = y + 3
      }
    }
  }
}

// 绘制room2的背景和绿色控制器
function drawRoom2() {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 14; j++) {
      const x = j * size
      const y = i * size
      image(floor2, x, y, size, size)
      if (i == 2 && j == 6) {
        image(pass2, x + 3, y + 3, 90, 90)

        roomEntranceX = x + 3
        roomEntranceY = y + 3
      }
    }
  }
}


function init() {
  person = { // 代表小人，定义了位置（x和y) direction是行走的方向
    idx: 0,
    x: 0,
    y: 0,
    w: 72,
    h: 96,
    direction: 0
  }
}

// 绘制小人，就是从图片characters.png中复制出一帧图片，然后不断变换
function drawPerson() {
  copy(characters, (person.idx % 3) * person.w, person.direction * person.h, person.w, person.h, person.x, person.y, person.w, person.h)
  if (frameCount % 20 == 0) { // 每隔1/3秒，变换一次行走的动作
    person.idx++
  }
}

