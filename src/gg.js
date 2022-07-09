const fileInput = document.getElementById('file-input');
var imgNames = ['img1.jpg','img2.jpg']; 
var imgs = [];
let presentarimg;

let reader = new FileReader();
reader.addEventListener('load', function(){
  let result = reader.result;
  let img = loadImage(result);
  presentarimg = img


}, false);

fileInput.addEventListener('change', function(){
  reader.readAsDataURL(fileInput.files[0]);
  
}, false);


var drawLength = 500;
var noiseScale = 0.005;
var strokeLength = 5;
var imgIndex = -1;

var frame;
let userImage =null

function preload() {
  // Pre-load all images.
  for (let i = 0; i < imgNames.length; i++) {
    
    imgs.push(loadImage('./src/images/'+imgNames[i]));
    console.log(loadImage('./src/images/'+imgNames[i]));
    presentarimg = loadImage('./src/images/'+imgNames[i])
    console.log(presentarimg)
  }
}


function setup() {


  let Screen = 600;
  createCanvas(Screen,Screen);
  background(65);
  changeImage();
  imgs[0].resize((imgs[0].width*Screen)/imgs[0].height, (imgs[0].height*Screen)/imgs[0].width);
}

function draw() {
  if (frame > drawLength) {
    return;
  }
    if (userImage != null) {
    image(userImage, 0, 0, width, height);
  }
  presentarimg.loadPixels();
  let img = presentarimg;
  
  translate(
		width / 2 - img.width / 2,
		height / 2 - img.height / 2
	);
  
  // The smaller the stroke is the more the spawn count increases to capture more detail.
  let count = map(frame, 0, drawLength, 2, 800);
  
  for (let i = 0; i < count; i++) {
    // Pick a random point on the image.
    let x = int(random(img.width))
    let y = int(random(img.height))
    
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
  
  frame++;
}


function changeImage() {
  background(255);
  
  frame = 0;
  
  noiseSeed(int(random(1000)));
  
  imgIndex++;
  if (imgIndex >= imgNames.length) {
    imgIndex = 0;
  }
  console.log(imgs[imgIndex], imgIndex)
	
	imgs[imgIndex].loadPixels();
}


function mousePressed() {
  changeImage();
}


function keyPressed() {
  saveCanvas("noiseFieldPainter", "jpg");
}