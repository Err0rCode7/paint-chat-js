const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

let cur_x = -1;
let cur_y = -1;
let pre_line_x = 0;
let pre_line_y = 0;

function joinPaint() {
  if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    // 우클릭
    canvas.addEventListener("contextmenu", handleCM);
  }

  Array.from(colors).forEach((color) =>
    color.addEventListener("click", handleColorClick)
  );

  if (range) {
    range.addEventListener("input", handleRangeChange);
  }

  if (mode) {
    mode.addEventListener("click", handleModeClick);
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
  }

  socket_paint = io();
  socket_paint.on("paint", (obj) => {
    const { line_x, line_y, pre_line_x, pre_line_y } = obj.linePos;
    const { painting, filling, lineWidth } = obj;
    const { pen_color, fill_color } = obj.color;
    strokeSocketCanvas({
      line_x,
      line_y,
      pre_line_x,
      pre_line_y,
      lineWidth,
      painting,
      filling,
      pen_color,
      fill_color,
    });
  });
}

function socket_process() {
  socket_paint.emit("paint", {
    linePos: {
      line_x: cur_x,
      line_y: cur_y,
      pre_line_x,
      pre_line_y,
    },
    lineWidth: ctx.lineWidth,
    color: {
      pen_color: ctx.strokeStyle,
      fill_color: ctx.fillStyle,
    },
    painting,
    filling,
  });
}

function stopPainting(event) {
  painting = false;
}

function startPainting(event) {
  painting = true;
}

function strokeSocketCanvas(data) {
  const {
    line_x: l_x,
    line_y: l_y,
    pre_line_x: p_x,
    pre_line_y: p_y,
    painting: is_painting,
    filling: is_filling,
    lineWidth,
    pen_color,
    fill_color,
  } = data;
  const tempFillStyle = ctx.fillStyle;
  const tempStrokeStyle = ctx.strokeStyle;
  const tempLineWidth = ctx.lineWidth;
  ctx.fillStyle = fill_color;
  ctx.strokeStyle = pen_color;
  ctx.lineWidth = lineWidth;

  if (painting) {
    ctx.beginPath();
    ctx.moveTo(p_x, p_y);
  } else {
    ctx.beginPath();
    ctx.moveTo(p_x, p_y);
  }
  if (is_painting && !is_filling) {
    ctx.lineTo(l_x, l_y);
    ctx.stroke();
  } else if (is_filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
  ctx.moveTo(cur_x, cur_y);

  ctx.fillStyle = tempFillStyle;
  ctx.strokeStyle = tempStrokeStyle;
  ctx.lineWidth = tempLineWidth;
}

function strokeCanvas(data) {
  // x, y 는 현재 마우스 포인터
  const { cur_x: x, cur_y: y, painting, filling } = data;
  if (!painting) {
    //ctx.beginPath();
    //ctx.moveTo(x, y);
  } else if (!filling) {
    //ctx.lineTo(x, y);
    //ctx.stroke();
    socket_process();
  }
}

function onMouseMove(event) {
  pre_line_x = cur_x == -1 ? event.offsetX : cur_x;
  pre_line_y = cur_y == -1 ? event.offsetY : cur_y;
  cur_x = event.offsetX;
  cur_y = event.offsetY;
  strokeCanvas({ cur_x, cur_y, painting, filling });
}

function onMouseDown(event) {
  painting = true;
}

function onMouseUp(event) {
  stopPainting();
}

function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick(event) {
  if (filling == true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

function handleCanvasClick(event) {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    socket_process();
  }
}

function handleCM(event) {
  // 우클릭 창 안띄우기
  event.preventDefault();
}

function handleSaveClick(evnet) {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  // href 는 다운로드 링크
  link.href = image;
  // downloade 는 다운로드 된 후 이름
  link.download = "PaintJS[💾]";
  link.click();
}
