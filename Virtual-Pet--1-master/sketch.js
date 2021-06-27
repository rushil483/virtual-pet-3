//Create variables here
var Dog;
var dog;
var happyDog;
var database;
var foodS;
var foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var bedroomImg;
var gardenImg;
var washroom;
var Hungry;
var gameState;
var readState;



function preload()
{
	//load images here
  Dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
  sadDog = loadImage("images/Dog.png");
}

function setup() {
  database = firebase.database();
	createCanvas(400, 500);

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  dog = createSprite(250,300,150,150);
  dog.addImage(Dog);
  dog.scale = 0.2;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  
}


function draw() {
  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}


function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);


  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour() 
  })
}

   function addFoods(){
     foodS++;
     database.ref('/').update({
       Food : foodS
     })
    }
  

function update(state){
  database.ref('/').update({
    gameState:state
  });
}