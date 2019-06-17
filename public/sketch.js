let current = {
  color: '#000',
  weight: 1
};
let socket;
let pg;

// p5.js装载函数，只调用一次
function setup() {
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);

  // 初始化socket连接
  socket = io.connect('http://localhost:8080');

  // 接收socket服务器的广播信息
  socket.on('drawing', data => {
    const { x0, y0, x1, y1, color, weight } = data;
    pg.stroke(color);
    pg.strokeWeight(weight);
    pg.line(x0 * width, y0 * height, x1 * width, y1 * height);
  });
}

function draw() {
  image(pg, 0, 0);
}

function windowResized() {
  // 当窗口变大才重新调整画布
  if (windowWidth > width || windowHeight > height) {
    resizeCanvas(windowWidth, windowHeight);
    let oldPg = pg;
    pg = createGraphics(windowWidth, windowHeight);
    pg.image(oldPg, 0, 0);
  }
}

// 画直线
function drawLine(x0, y0, x1, y1) {
  pg.stroke(current.color);
  pg.strokeWeight(current.weight);
  pg.line(x0, y0, x1, y1);
  socket.emit('drawstart', {
    x0: x0 / width,
    y0: y0 / height,
    x1: x1 / width,
    y1: y1 / height,
    color: current.color,
    weight: current.weight
  });
}

// 鼠标点击处理
function mousePressed() {
  if (mouseButton === LEFT) {
    current.x = mouseX;
    current.y = mouseY;
  }
}

// 鼠标拖动处理
function mouseDragged(e) {
  if (mouseButton === LEFT) {
    if (e.target.tagName === 'CANVAS') {
      drawLine(current.x, current.y, mouseX, mouseY);
      current.x = mouseX;
      current.y = mouseY;
    }
  }
}

function changeColor(color) {
  current.color = '#' + color;
}

function changeWeight(weight) {
  current.weight = weight;
}
