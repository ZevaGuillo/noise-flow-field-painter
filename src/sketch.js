const strokeWeightInput = document.getElementById("strokeWeight");
const angleInput = document.getElementById("angle");
const drawLengthInput = document.getElementById("drawLength");
const details = document.getElementById("details");
const fileInput = document.getElementById("file-input");

let userImage = null;
let imgNamesDefect = ["img1.jpg", "img2.jpg"];
let renderedImages = [];
let drawLength = 500;
let noiseScale = 0.005;
let strokeLength = 5;
let imgIndex = -1;
let frame;
let isLoadImg = false;

// load user image
let reader = new FileReader();
reader.addEventListener('load', function(){
  let result = reader.result;
  let img = loadImage(result);
  setTimeout(function(){
    setup()
  },100);
  userImage = img;
  isLoadImg = true;
}, false);

fileInput.addEventListener('change', function(){
  reader.readAsDataURL(fileInput.files[0]);
  
}, false);


// TODO: poner listenres

// P5
function preload() {
  // Pre-load all images.
  imgNamesDefect.forEach((img) => {
    renderedImages.push(loadImage("./src/images/" + img));
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  changeImage();
  resizeImages();
}

function resizeImages(){
  const canva = document.querySelector('canvas');
  let screenW = parseInt(canva.style.width.replace('px',''));
  let screenH = parseInt(canva.style.height.replace('px',''));
  if (isLoadImg) {
    userImage.resize(screenW, screenH);
    return;
  }
  for(let i = 0; i < renderedImages.length; i++){
    let imgs = renderedImages[i];
    imgs.resize(screenW, screenH);
  }
}


function  Pixelshapes(img) {
  translate(width / 2 - img.width / 2, height / 2 - img.height / 2);

  // The smaller the stroke is the more the spawn count increases to capture more detail.
  let count = map(frame, 0, drawLength, 2, 800);

  for (let i = 0; i < count; i++) {
    // Pick a random point on the image.
    let x = int(random(img.width));
    let y = int(random(img.height));

    // Convert coordinates to its index.
    let index = (y * img.width + x) * 4;

    // Get the pixel's color values.
    let r = img.pixels[index];
    let g = img.pixels[index + 1];
    let b = img.pixels[index + 2];
    let a = img.pixels[index + 3];

    stroke(r, g, b, a);

    // Start with thick strokes and decrease over time.
    let sw = map(frame, 0, drawLength, 30, 5);
    strokeWeight(sw);

    push();
    translate(x, y);

    // Rotate according to the noise field so there's a 'flow' to it.
    let n = noise(x * noiseScale, y * noiseScale);
    rotate(radians(map(n, 0, 1, -360, 360)));

    let lengthVariation = random(0.75, 1.25);
    line(0, 0, strokeLength * lengthVariation, 0);

    // Draw a highlight for more detail.
    stroke(min(r * 3, 255), min(g * 3, 255), min(b * 3, 255), random(100));
    strokeWeight(sw * 0.5);

    line(0, -sw * 0.15, strokeLength * lengthVariation, -sw * 0.15);
    pop();
  }

}

function draw() {
  if (frame > drawLength) {
    return;
  }

  if(isLoadImg){
    userImage.loadPixels();
    Pixelshapes(userImage)
  }else{
    Pixelshapes(renderedImages[imgIndex])
  }
  
  frame++;
}

function changeImage() {
  clear()
  frame = 0;
  noiseSeed(int(random(1000)));
  
  imgIndex++;
  if (imgIndex >= imgNamesDefect.length) {
    imgIndex = 0;
  }

	renderedImages[imgIndex].loadPixels();
}

function mousePressed() {
  changeImage();
}

function keyPressed() {
  saveCanvas("noiseFieldPainter", "png");
}

function windowResized() {
  clear()
  setup();
  resizeCanvas(windowWidth, windowHeight);
}

// function resizeScreen(){
  
// }