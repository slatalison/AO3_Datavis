var total =50;
var systems;
var gravity;
var repeller;
function setup() {

  var myCanvas = createCanvas(windowWidth - 395 ,windowHeight - 105);
    myCanvas.parent("canvasForP5");

  
  systems = [];
  for(var i =0;i<total;i++){
    systems.push(new Particle(createVector(floor(random(width)),floor(random(height)))));
  }

}

function draw() {
  
  background(253);
  for(var i=0;i<systems.length;i++){
    systems[i].show();

    for(var j=0;j<systems.length;j++){
      var distance = dist(systems[i].location.x,systems[i].location.y,systems[j].location.x,systems[j].location.y);
      strokeWeight(0.5);

      if(distance<130){
        var lineAlpha = map(distance,0,200,255,0);
        stroke(235,lineAlpha);
        line(systems[i].location.x,systems[i].location.y,systems[j].location.x,systems[j].location.y);

      }

    }
    systems[i].update();
  }




}
function mousePressed(){
systems.push(new Particle(createVector(mouseX,mouseY)));
}