function Particle(location, color){
  this.location = location.copy();
  this.velocity = createVector(random(0,2),random(0,2));
  this.acceleration = createVector(0,0);
  this.mass = 3;
  

  this.show = function(){
    stroke(245);
    strokeWeight(4);
    point(this.location.x,this.location.y);

  }

  this.update = function(){

    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);

    if(this.location.x < 0){
      this.location.x = width;
      this.velocity = createVector(random(0,2),random(0,2));
    }else if(this.location.x > width){
      this.location.x = 0;
      this.velocity = createVector(random(0,2),random(0,2));
    }

    if(this.location.y < 0){
      this.location.y = height;
      this.velocity = createVector(random(0,2),random(0,2));
    }else if(this.location.y > height){
      this.location.y = 0;
      this.velocity = createVector(random(0,2),random(0,2));
    }

  }

  this.run = function(){
    this.update();
    this.show();
  }

}