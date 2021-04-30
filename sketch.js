/*const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;*/

var engine, world;
var earth, earthImg;
var goodObstaclesGroup, badObstaclesGroup;
var goodObstacle1, goodObstacle2, goodObstacle3;
var badObstacle1, badObstacle2, badObstacle3, badObstacle4;
var back1, backImg;
var endSprite, endImg, startBgImg;
var bomb, bombImg, bombGroup, replayImg, playImg;
var score = 0;
var gameState = "serve";
var star=[];
var maxStarFall=30;

var spooky,tapImg,tapGroup,fireImg,fireGroup;


function preload() {
  earthImg = loadImage("earth.png");
  badObstacle1 = loadImage("thunder.png");
  badObstacle3 = loadImage("garbage.png");
  badObstacle4 = loadImage("smoke.png");
  goodObstacle1 = loadImage("lightOff.png");
  goodObstacle2 = loadImage("3rs.png");
  backimg = loadImage("back2.png");
  endImage = loadImage("end.png")
  bombImg = loadImage("bomb.png");
  startBgImg = loadImage("back1.jpg");
  replayImg = loadImage("restart.png");
  playImg = loadImage("start.png")
  spooky = loadSound("spooky sound.mp3");
  tapImg = loadAnimation("tap1.png","tap2.png","tap3.png", "tap4.png");
  fireImg = loadAnimation("fire1.png","fire2.png");
  //goodObstacle3=loadImage("");
}



function setup() {
  //engine = Engine.create();
  //world = engine.world;
  //spooky.loop();
  createCanvas(windowWidth, windowHeight);
  fill("white")
  text("Score:" + score, 500, 100);
  
  console.log(score);


  back1 = createSprite(windowWidth / 2, windowHeight  , windowWidth, windowHeight);
  back1.addImage(backimg);
  back1.x = back1.width / 2;
  back1.velocityX = -4;
  back1.scale = 2

  earth = createSprite(200, height-300, 90, 70);
  earth.addImage(earthImg);
  earth.scale = 0.4;

  ground = createSprite(width/2,height-300,width,50);
  ground.x = ground.width / 2;
  ground.visible = true;

  startBg = createSprite(windowWidth / 2, windowHeight / 2, 100, 100);
  startBg.addImage(startBgImg)
  startBg.scale = .5
  startBg.scale = 0.8

  startSprite = createSprite(windowWidth / 2 - 200, windowHeight / 2, 10, 10)
  startSprite.addImage(playImg);

  endSprite = createSprite(windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
  endSprite.addImage(endImage);

  replaySprite = createSprite(windowWidth / 2 - 75, windowHeight / 2 + 300, windowWidth, windowHeight);
  replaySprite.addImage(replayImg);

 /*for (var j = 0; j < maxStarFall; j++) 
  {
    star.push(new Star(random(0,width), random(0,height)));
  }*/

  goodObstaclesGroup = new Group();
  badObstaclesGroup = new Group();
  bombGroup = new Group();
  tapGroup = new Group();
  fireGroup=new Group();
}
function draw() {
  background("white");
  //Engine.update(engine);

  if (gameState === "serve") {
    
    back1.visible = false;
    earth.visible = false;
    ground.visible = false;
    endSprite.visible = false;
    replaySprite.visible = false;
    //endSprite.visible=false;
    if (mousePressedOver(startSprite)) {
      gameState = "play";
      score = 0;
    }
    drawSprites();
  }
  else
    if (gameState === "play") {
    

      console.log("started")
      back1.visible = true;
      earth.visible = true;
      startSprite.visible = false;
      startBg.visible = false;

      ground.visible = false;

      endSprite.visible = false;
      replaySprite.visible = false;
      text("SCORE: "+ score, 500,50);


      ground.velocityX = -2;

      if (ground.x < 0) {
        ground.x = ground.width / 2;
      }

      if (earth.y > 150) {
        if (keyDown("space")) {
          earth.velocityY = -12;
        }
      }
      earth.velocityY = earth.velocityY + 0.8

      if (back1.x < 300) {
        back1.x = back1.width / 2;
      }
      
      
      earth.collide(ground);
       drawSprites();


      /* for(var i=0;i<maxStarFall;i++)
       {
         star[i].display();
         star[i].updateY();
       }*/
      
 
      spawnGoodObstaclesGroup();
      spawnBadObstaclesGroup();
      spawnTap();
      spawnFire();
      for (var i = 0; i < goodObstaclesGroup.length; i++) {
        if (goodObstaclesGroup.get(i).isTouching(earth)) {
          score = score + 10;
          goodObstaclesGroup.get(i).destroy();
        }
      }

      for (var i = 0; i < badObstaclesGroup.length; i++) {
        if (badObstaclesGroup.get(i).isTouching(earth)) {
          score = score - 5;
          badObstaclesGroup.get(i).destroy();
        }


      }
      for(var i=0;i<tapGroup.length;i++)
      {
        if(tapGroup.get(i).isTouching(earth))
        {
          score = score-3;
          tapGroup.get(i).destroy();
        }
      }
      for(var i=0;i<fireGroup.length;i++)
      {
        if(fireGroup.get(i).isTouching(earth))
        {
          score = score-3;
          fireGroup.get(i).destroy();
        }
      }
      if (score > 0) {
        spawnBombs();
      }
      for (var i = 0; i < bombGroup.length; i++) {

        if (bombGroup.get(i).isTouching(earth)) {
          bombGroup.get(i).destroy();

          gameState = "end";

        }
        if (score < 0) {
          score = 0
        }

      }
     
     
    }
    else if (gameState === "end") {

      console.log("ended")
      text("SCORE : " + score, windowWidth / 2 - 100, windowHeight / 2 + 200)
      fill("white")

      if (mousePressedOver(replaySprite)) {
        gameState = "serve";
        score = 0


        console.log(gameState)
      }

      endSprite.scale = 0.8;

      startSprite.visible = false;
      startBg.visible = true;
      back1.visible = false;
      earth.visible = true;
      ground.visible = false;
      endSprite.visible = true;
      replaySprite.visible = true;
      badObstaclesGroup.destroyEach();
      goodObstaclesGroup.destroyEach();
      bombGroup.destroyEach();
      drawSprites();
     

    }
   
      text("SCORE: " + score, 500, 50);
    }

  function spawnGoodObstaclesGroup() {
    var randY = random(200, height - 300);
    if (frameCount % 160 === 0) {
      var obstacle = createSprite(width, randY, 10, 40);
      obstacle.velocityX = -6;

      var rand = Math.round(random(1, 2));
      switch (rand) {
        case 1: obstacle.addImage(goodObstacle1);
          break;
        case 2: obstacle.addImage(goodObstacle2);
          break;
        default: break;
      }
      obstacle.scale = 0.2;
      obstacle.lifetime = width / 4;
      goodObstaclesGroup.add(obstacle);
    }
  }

  function spawnBadObstaclesGroup() {
    var randY = random(250, height - 200);
    if (frameCount % 150 === 0) {
      var obstacle = createSprite(width, randY, 10, 40);
      obstacle.velocityX = -6;

      var rand = Math.round(random(1, 5));
      switch (rand) {
        case 1: obstacle.addImage(badObstacle1);
          break;
        case 2: obstacle.addImage(badObstacle3);
        obstacle.scale = 2;
          break;
        case 3: obstacle.addImage(badObstacle4);
          break;
        default: break;
      }
      obstacle.scale = 0.3;
      obstacle.lifetime = width / 4;
      badObstaclesGroup.add(obstacle);
    }
  }

  function spawnBombs() {
    var randY = random(100, height - 200);
    //write code here to spawn the grinchs
    if (frameCount % 800 === 0) {
      var bomb = createSprite(width, randY, 80, 20);
      bomb.y = Math.round(random(100, 500));
      bomb.addImage(bombImg);
      bomb.scale = .2;
      bomb.velocityX = -6;

      //assign lifetime to the variable
      bomb.lifetime = width / 4;;


      //add each grinch to the group
      bombGroup.add(bomb);
    }

  }
  function spawnTap() {
    var randY = random(10,  height-200);
    //write code here to spawn the grinchs
    if (frameCount % 250 === 0) {
      var tap = createSprite(width-100,randY,40,10);
      tap.y = Math.round(random(100,500));
      tap.addAnimation("running", tapImg);
      tap.scale = .8;
      tap.velocityX = -6;
  
       //assign lifetime to the variable
       tap.lifetime = width/4;
  
  
      //add each grinch to the group
      tapGroup.add(tap);
    }
  
  }
  function spawnFire() {
    var randY = random(100,  height-300);
    //write code here to spawn the grinchs
    if (frameCount % 250 === 0) {
      var fire = createSprite(width,randY,40,10);
      fire.y = Math.round(random(200,400));
      fire.addAnimation("Fire", fireImg);
      fire.scale = .6;
      fire.velocityX = -6;
  
       //assign lifetime to the variable
       fire.lifetime = width/4;
  
  
      //add each grinch to the group
      fireGroup.add(fire);
    }
  
  }
  