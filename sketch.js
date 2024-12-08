let vehicles = [];
let imageFusee;
let bullets = [];
let mode = "wander";
let debugCheckbox;
let particleA,particleB;
// Equivalent du tableau de véhicules 
const flock = [];
let fishImage;
let KingImage;
let requinImage;
let meduseImage;
let alignSlider, cohesionSlider, separationSlider;
let labelNbBoids;
const posYSliderDeDepart =200;
let meduse ;
let target;
let requin=[];
let nbVehicles = 10;
// center point
let centerX = 0.0, centerY = 0.0;

let radius = 45, rotAngle = -100;
let accelX = 0.0, accelY = 0.0;
let deltaX = 0.0, deltaY = 0.0;
let springing = 0.0009, damping = 0.98;

//corner nodes
let nodes = 5;

//zero fill arrays
let nodeStartX = [];
let nodeStartY = [];
let nodeX = [];
let nodeY = [];
let angle = [];
let frequency = [];

// soft-body dynamics
let organicConstant = 1.0;

let qtree

var p, b = [],
  clock = 0;


function preload() {
  // on charge une image de fusée pour le vaisseau
  imageFusee = loadImage('assets/vehicule.png');
  KingImage = loadImage('assets/theKing.png');
  fishImage = loadImage('assets/goldenFish.png');
  requinImage = loadImage('assets/shark.png');
  meduseImage = loadImage('assets/meduse.png');

}

function setup() {

//tank properties
rectMode(CENTER);
  strokeJoin(ROUND);
  p = new Player();

  createCanvas(windowWidth, windowHeight);
  let boundary = new Rectangle(800, 800, 1920, 1920);
  qtree = new QuadTree(boundary, 4);
  for (let i = 0; i < 300; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let p = new Point(x, y);
    qtree.insert(p);
  }



  particleA = new Particle(320,300);
  particleB = new Particle(320, 300)

  // On cree des sliders pour régler les paramètres
  creerSlidersPourProprietesVehicules();
  creerSlidersPourProprietesBoids();
  creerSliderPourNombreDeVehicules(nbVehicles);

  creerSliderPourLongueurCheminDerriereVehicules(0);

  for(let i=0; i < nbVehicles; i++) {
    let vehicle = new Vehicle(100, 100, imageFusee);
    vehicles.push(vehicle);
  }
  
  // On créer les "boids". Un boid en anglais signifie "un oiseau" ou "un poisson"
  // Dans cet exemple c'est l'équivalent d'un véhicule dans les autres exemples
  for (let i = 0; i < 100; i++) {
    const b = new Boid(random(width), random(height), fishImage);
    b.r = random(8, 40);
    flock.push(b);
  }
  //

    //center shape in window
    centerX = width / 2;
    centerY = height / 2;
  
    //initialize arrays to 0
    for (let i = 0; i < nodes; i++){
      nodeStartX[i] = 0;
      nodeStartY[i] = 0;
      nodeY[i] = 0;
      nodeY[i] = 0;
      angle[i] = 0;
    }
  
    // iniitalize frequencies for corner nodes
    for (let i = 0; i < nodes; i++){
      frequency[i] = random(5, 12);
    }
  
    noStroke();
    frameRate(50);

  //

  // Créer un label avec le nombre de boids présents à l'écran
   labelNbBoids = createP("Nombre de boids : " + flock.length);
  // couleur blanche
  labelNbBoids.style('color', 'white');
  labelNbBoids.position(10, posYSliderDeDepart+180);

  // target qui suit la souris
  target = createVector(mouseX, mouseY);
  target.r = 50;

  // requin prédateur
  requin = new Boid(width/2, height/2, requinImage);
  requin.r = 100;
  requin.maxSpeed = 15;
  requin.maxForce = 0.5;
}
//Tank player , shoot bullets



//movement stats:

var acc = 5; //acceleration; should be more than 0
var fric = 0.975; //friction; should stay between 0 and 1
var maxVel = 10; //maximum velocity; should be more than 0

//tank stats:

var rad = 34; //tank's body size (34 is more or less equal to a level 45 tank)
var reload = 10; //spamtime delay (60 = 1 second)
var count = 2; //number of bullets to be shot simultaneously
var diffuse = 0.25; //diffusion of the bullets
var speed = 25; //speed of the bullets
var base = 5; //starting size of the bullets
var time = 40; //number of frames the bullet will exist for (60 frames = 1 sec)

//background:

var gridSize = 22; //size of background grid (22 is equivalent to level 45 tank's FOV)
var dimensions = [36, 36]; //size of the canvas

function Player() {
  this.pos = createVector(width / 2, height / 2);
  this.vel = new p5.Vector();
  this.wasd = [];
  this.heading = new p5.Vector();
  this.math = function() {
    this.wasd[0] = (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) ? acc : 0;
    this.wasd[1] = (keyIsDown(LEFT_ARROW) || keyIsDown(65)) ? acc : 0;
    this.wasd[2] = (keyIsDown(DOWN_ARROW) || keyIsDown(83)) ? acc : 0;
    this.wasd[3] = (keyIsDown(UP_ARROW) || keyIsDown(87)) ? acc : 0;
    this.move = createVector(this.wasd[0] - this.wasd[1], this.wasd[2] - this.wasd[3]);
    this.vel.x = (abs(this.vel.x) > maxVel) ? maxVel * Math.sign(this.vel.x) : this.vel.x + this.move.x;
    this.vel.y = (abs(this.vel.y) > maxVel) ? maxVel * Math.sign(this.vel.y) : this.vel.y + this.move.y;
    this.vel.mult(fric);
    this.mag = max(abs(this.vel.x), abs(this.vel.y));
    this.dist = dist(0, 0, this.vel.x, this.vel.y);
    this.pos.add(this.vel.x * this.mag / this.dist, this.vel.y * this.mag / this.dist);
    this.heading.set(mouseX - this.pos.x, mouseY - this.pos.y);
  }
  this.constrain = function() {
    if (this.pos.x < rad) {
      this.pos.x = rad;
      this.vel.x = 0;
    }
    if (this.pos.x > width - rad) {
      this.pos.x = width - rad;
      this.vel.x = 0;
    }
    if (this.pos.y < rad) {
      this.pos.y = rad;
      this.vel.y = 0;
    }
    if (this.pos.y > height - rad) {
      this.pos.y = height - rad;
      this.vel.y = 0;
    }
  }
  this.sprite = function() {
    translate(this.pos.x, this.pos.y);
    rotate(this.heading.heading());
    fill(153);
    stroke(85);
    strokeWeight(3);
    rect(40, -23, 85, 12);
    rect(40, 23, 85, 12);
    rect(40, -23, 65, 12);
    rect(40, 23, 65, 12);
    rect(-35, -28, 15, 60, 10);//behind
    fill(0, 178, 225);
    ellipse(0, 0, rad * 2, rad * 2);
    resetMatrix();
  }
}

function Bullet(d) {
  this.pos = createVector(p.pos.x, p.pos.y);
  this.heading = p.heading.heading();
  this.time = 0;
  this.dist = 0;
  this.opacity = 255;
  this.display = function() {
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    translate(this.dist + abs(d) * 200 + 50, this.dist * d);
    rotate(-this.heading);
    fill(240, 78, 84, this.opacity);
    stroke(85, this.opacity);
    strokeWeight(3);
    ellipse(0, 0, rad , rad );
    resetMatrix();
    this.time++;
    this.dist += speed;
  }
}
function moveShape() {
  //move center point
  deltaX = mouseX - centerX;
  deltaY = mouseY - centerY;

  // create springing effect
  deltaX *= springing;
  deltaY *= springing;
  accelX += deltaX;
  accelY += deltaY;

  // move predator's center
  centerX += accelX;
  centerY += accelY;

  // slow down springing
  accelX *= damping;
  accelY *= damping;

  // change curve tightness
  organicConstant = 1 - ((abs(accelX) + abs(accelY)) * 0.1);

  //move nodes
  for (let i = 0; i < nodes; i++){
    nodeX[i] = nodeStartX[i] + sin(radians(angle[i])) * (accelX * 2);
    nodeY[i] = nodeStartY[i] + sin(radians(angle[i])) * (accelY * 2);
    angle[i] += frequency[i];
  }}
  function drawShape() {
    // Calculate the dome-like body
    for (let i = 0; i < nodes; i++) {
      nodeStartX[i] = centerX + cos(radians(rotAngle)) * radius;
      nodeStartY[i] = centerY + sin(radians(rotAngle)) * radius;
      rotAngle += 360.0 / nodes;
    }
  
    // Draw the jellyfish body
    curveTightness(organicConstant);
    fill(200, 100, 255, 150); // Semi-transparent purple
    stroke(150, 50, 200); // Purple outline
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < nodes; i++) {
      curveVertex(nodeX[i], nodeY[i]);
    }
    for (let i = 0; i < nodes - 1; i++) {
      curveVertex(nodeX[i], nodeY[i]);
    }
    endShape(CLOSE);
  
    // Draw tentacles with smooth motion
    for (let i = 0; i < nodes; i++) {
      let tentacleStartX = nodeX[i];
      let tentacleStartY = nodeY[i];
  
      // Use sine wave for smooth oscillation
      let time = frameCount * 0.3; // Adjust speed of oscillation
      let waveX = sin(time + i) * 10; // Gentle horizontal waving
      let tentacleEndX = tentacleStartX + waveX;
      let tentacleEndY = tentacleStartY + 80; // Fixed length for tentacles
  
      // Bezier control points for realistic curvature
      let controlPoint1X = tentacleStartX + waveX / 2;
      let controlPoint1Y = tentacleStartY + 30; // Adjust curvature
      let controlPoint2X = tentacleEndX - waveX / 2;
      let controlPoint2Y = tentacleStartY + 60; // Adjust curvature
  
      // Tentacle appearance
      stroke(150, 50, 200, 150); // Semi-transparent purple
      strokeWeight(1.5);
      noFill();
  
      // Draw tentacle as a smooth bezier curve
      bezier(
        tentacleStartX,
        tentacleStartY,
        controlPoint1X,
        controlPoint1Y,
        controlPoint2X,
        controlPoint2Y,
        tentacleEndX,
        tentacleEndY
      );
    }
  }/*
function  takeDamage(amount) {
    
    this.health -= amount; // Reduce obstacle health
    if (this.health%10===0) {
      let i = this.health ;
      requin.splice(i, 1);
      console.log('Obstacle destroyed!'); // Log message when destroyed
    }
  }
  function killShark(bullet) {
    let distance = p5.Vector.dist(requin.pos, bullet.pos); // Distance between bullet and shark
    if (distance < requin.r) { // Check collision
      requin.takeDamage(50); // Shark takes damage
      return true; // Indicate the bullet hit
    }
    return false; // No collision
  }*/
  
  
  

function creerSlidersPourProprietesVehicules() {
  // paramètres de la fonction custom de création de sliders :
  // label, min, max, val, step, posX, posY, propriete des véhicules
  creerUnSlider("Rayon du cercle", 10, 200, 50, 1, 10, 20, "wanderRadius");
  creerUnSlider("Distance du cercle", 10, 400, 100, 1, 10, 40, "distanceCercle");
  creerUnSlider("Deviation maxi", 0, PI/2, 0.3, 0.01, 10, 60, "displaceRange");
  creerUnSlider("Vitesse maxi", 1, 20, 4, 0.1, 10, 80, "maxSpeed");
  creerUnSlider("Max force", 0.05, 1, 0.2, 0.1, 10, 100, "maxForce");

  // checkbox pour debug on / off
  debugCheckbox = createCheckbox('Debug ', false);
  debugCheckbox.position(10, 140);
  debugCheckbox.style('color', 'white');

  debugCheckbox.changed(() => {
    Vehicle.debug = !Vehicle.debug;
  });
}
function creerSlidersPourProprietesBoids() {
 
  // Quelques sliders pour régler les "poids" des trois comportements de flocking
 // flocking en anglais c'est "se rassembler"
 // rappel : tableauDesVehicules, min max val step posX posY propriété

 creerUnSliderBoids("Poids alignment", flock, 0, 50, 1.5, 10, 10, posYSliderDeDepart, "alignWeight");
 creerUnSliderBoids("Poids cohesion", flock, 0, 50, 1, 10, 10, posYSliderDeDepart+30, "cohesionWeight");
 creerUnSliderBoids("Poids séparation", flock, 0, 50, 3, 10, 10, posYSliderDeDepart+60,"separationWeight");
 creerUnSliderBoids("Poids boundaries", flock, 0, 50, 10, 10, 10, posYSliderDeDepart+90,"boundariesWeight");
 
 creerUnSliderBoids("Rayon des boids", flock, 4, 40, 6, 10, 10, posYSliderDeDepart+120,"r");
 creerUnSliderBoids("Perception radius", flock, 15, 60, 25, 10, 10, posYSliderDeDepart+150,"perceptionRadius");
 


}

function creerUnSlider(label, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);
  
  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY+17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    vehicles.forEach(vehicle => {
      vehicle[propriete] = slider.value();
    });
  });
}
function creerUnSliderBoids(label, tabVehicules, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);
  
  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY+17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    tabVehicules.forEach(vehicle => {
      vehicle[propriete] = slider.value();
    });
  });

  return slider;
}

function creerSliderPourNombreDeVehicules(nbVehicles) {
   // un slider pour changer le nombre de véhicules
  // min, max, valeur, pas
  let nbVehiclesSlider = createSlider(1, 200, 10, 1);
  nbVehiclesSlider.position(160, 185);
  let nbVehiclesLabel = createP("Nb de véhicules : " + nbVehicles);
  nbVehiclesLabel.position(10, 170);
  nbVehiclesLabel.style('color', 'white');
  // écouteur
  nbVehiclesSlider.input(() => {
    // on efface les véhicules
    vehicles = [];
    // on en recrée
    for(let i=0; i < nbVehiclesSlider.value(); i++) {
      let vehicle = new Vehicle(100, 100, imageFusee);
      vehicles.push(vehicle);
    }
    // on met à jour le label
    nbVehiclesLabel.html("Nb de véhicules : " + nbVehiclesSlider.value());
  });
}

function creerSliderPourLongueurCheminDerriereVehicules(l) {
  let slider = createSlider(0, 150, l, 1);
  slider.position(160, 162);
  let label = createP("Longueur trainée : " + l);
  label.position(0, 145);
  label.style('color', 'white');
  // écouteur
  slider.input(() => {
    label.html("Longueur trainée : " + slider.value());
    vehicles.forEach(vehicle => {
      vehicle.path = [];
      vehicle.pathLength = slider.value();
    });
  });
}
function checkBulletSharkCollision(bullet, boid) {
  if (!boid) return false;
  let d = p5.Vector.dist(bullet.pos, boid.pos);
  if (d < boid.r + bullet.size/2) {
    boid.takeDamage(25); // Each bullet does 25 damage
    return true;
  }
  return false;
}


// appelée 60 fois par seconde
function draw() {
  clear();
  for (let boid of flock) {
    //boid.edges();
    boid.flock(flock);
    //boid.seek(vehicle);

    boid.fleeWithTargetRadius(vehicles);
    
    
    

    // Existing logic of the function
    boid.update();
    boid.show();
  }  
  //background(0, 0, 0, 20);
//tank start
if (mouseIsPressed) {
    if (clock == 0) {
      for (var i = 0; i < count; i++) {
        b.push(new Bullet(random(-diffuse, diffuse)));
      }
    }
    //speed of reload
    clock = (clock > reload) ? 0 : clock + 1;
  } else {
    clock = 0;
  }
  for (var i = 0; i < b.length; i++) {
    b[i].display();
    if (b[i].time > time) {
      b[i].opacity -= 0;
    }
    if (b[i].opacity < 1) {
      b.splice(i, 1);
    }
  }
  p.math();
  p.constrain();
  p.sprite();

//tank end
  //quadtree 
  qtree.show();
   // on dessine la cible qui suit la souris
   target.x = mouseX;
   target.y = mouseY;
   fill("red");
   noStroke();
   imageMode(CENTER);
   image(KingImage, target.x, target.y, target.r, target.r);
 


  stroke(0, 255, 0);
  rectMode(CORNER);
  let range = new Rectangle(mouseX, mouseY, 25, 25);
  
  // This check has been introduced due to a bug discussed in https://github.com/CodingTrain/website/pull/556
 //

  drawShape();
  moveShape();
 
  particleA.collide(particleB);

  particleA.update();
  particleB.update();

  particleA.edges();
  particleB.edges();

  particleA.show();
  particleB.show();

  labelNbBoids.html("Nombre de boids : " + flock.length);

  

  vehicles.forEach(vehicle => {
    vehicle.applyBehaviors();

    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });
  
 
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();

    // Check collision with shark
    if (requin && checkBulletSharkCollision(bullets[i], requin)) {
      bullets.splice(i, 1); // Remove bullet on hit
      continue;
    }

    // Remove bullets that go offscreen
    if (bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }


  // dessin du requin
  let wanderForce = requin.wander();
  wanderForce.mult(1);
  requin.applyForce(wanderForce);

  // calcul du poisson le plus proche
  let seekForce;
  let rayonDeDetection = 250;
  
  // dessin du cercle en fil de fer jaune
  noFill();
    noStroke();
  ellipse(requin.pos.x, requin.pos.y, rayonDeDetection*4, rayonDeDetection*4);

  
switch (mode){
case "predator":
  let closest = requin.getVehiculeLePlusProche(flock);
  if (closest) {
    // distance entre le requin et le poisson le plus proche
    let d = p5.Vector.dist(requin.pos, closest.pos);
    if(d < rayonDeDetection) {
      // on fonce vers le poisson !!!
      seekForce = requin.seek(closest.pos);
      seekForce.mult(7);
      requin.applyForce(seekForce);
    }
    if (d < 5) {
      // on mange !!!!
      // on retire le poisson du tableau flock
      let index = flock.indexOf(closest);
      flock.splice(index, 1);
    }
  }
break;
case"wander":
requin.wander(); 
break;
case"kill":
let nearest = requin.getVehiculeLePlusProche(vehicles);
if (nearest) {
  // distance entre le requin et le poisson le plus proche
  let d = p5.Vector.dist(requin.pos, nearest.pos);
  if(d < rayonDeDetection) {
    // on fonce vers le poisson !!!
    seekForce = requin.seek(nearest.pos);
    seekForce.mult(7);
    requin.applyForce(seekForce);
  }
  if (d < 5) {
    // on mange !!!!
    // on retire le poisson du tableau flock
    let index = vehicles.indexOf(nearest);
    vehicles.splice(index, 1);
  }
}



}
  requin.edges();
  requin.update();
  requin.show();

//si les plongeurs sont tous mort game over 
  if(vehicles.length<=0){
    noLoop();
    displayGameOverScreen();
  }
  textSize(20); // Set text size
  fill(255, 127, 80);
  
   let a = 20; // Small margin from the left edge
   let c;
    c = height - 600; // Small margin from the bottom edge (100 pixels above)

  // Display the instructions
  textStyle(BOLD);
  textSize(25); // Set text size
  text("Game Controls(UPPER CASE):", a, c-20);
  textStyle(NORMAL);
  fill(255)
  text("Press D for Debug", a, c + 30);
  text("Press P for Predator", a, c + 70);
  text("Press K for Kill", a, c + 110);
  text("Press W for Wander", a, c + 150);
  text("mouse drag to spawn fish", a, c + 190);
  fill(222, 49, 99);
  textStyle(BOLD);
  textSize(25); // Set text size
  text("Vehicule Controls(lower case):",a,c+320);
  textStyle(NORMAL);
  text("Press w to go up", a, c + 370);
  text("Press a to go left", a, c + 410);
  text("Press s to go down", a, c + 450);
  text("Press d to go right", a, c + 490);
  text("mouse click to shoot", a, c + 530);


}
function displayGameOverScreen() {
  textSize(92);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  textSize(32);
  text(" Score:"+vehicles.length, width / 2, height / 2+60);
  textSize(15);
  text("Click to Try Again", width / 2, height / 2 + 120);
  
}
function mousePressed() {
  /* let randomColor = color(random(255), random(255), random(255));
   let randomSize = random(5, 100);
   obstacles.push(new Obstacle(mouseX, mouseY, randomSize, randomColor));
   */if (!isLooping()) { // If the game is not running
     resetGame();
     loop(); // Restart the game loop
   } else {
    /* let randomColor = color(random(255), random(255), random(255));
     let randomSize = random(5, 100);
     obstacles.push(new Obstacle(mouseX, mouseY, randomSize, randomColor));
   */}
 }
function resetGame() {
  // Reset all necessary variables
  vehicles = [];
  target = createVector(mouseX, mouseY);
  flock.length = 0;
  obstacles = [];
  mode ="wander";
  

  // Reinitialize the game
  setup();
}
function mouseDragged() {
  
  const b = new Boid(mouseX, mouseY, fishImage);
  
  b.r = random(8, 40);

  flock.push(b);
  

}

function keyPressed() {
  if (key === 'D') {
    Vehicle.debug = !Vehicle.debug;
     Boid.debug = !Boid.debug;
    
    // changer la checkbox, elle doit être checkée si debug est true
    debugCheckbox.checked(Vehicle.debug,Boid.debug);
  
  }else if (key === 'R') {
    // On donne une taille différente à chaque boid
    flock.forEach(b => {
      b.r = random(8, 40);
    });
}else if (key === 'P') {
  mode = "predator";
}else if (key === 'W'){
  mode = "wander";
}else if (key === 'K') {
  mode = "kill";
}
}
