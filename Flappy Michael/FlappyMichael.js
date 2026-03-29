    var block = document.getElementById("block");
var hole = document.getElementById("hole");
var character = document.getElementById("character");
var jumping = 0;
var counter = 0;

hole.addEventListener('animationiteration', () => {
    var random = -((Math.random()*300)+150);
    hole.style.top = random + "px";
    // Randomize block background image
    var images = [
        '../photos/GarinFraley.png',
        '../photos/touchingED1.png',
        '../photos/touchingED2.png',
        '../photos/touchingED3.png'
    ];
    var imgIndex = Math.floor(Math.random() * images.length);
    block.style.backgroundImage = 'url(' + images[imgIndex] + ')';
    counter++;
});

setInterval(function(){
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    if(jumping==0){
        character.style.top = (characterTop+3)+"px";
    }
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
    var cTop = -(500-characterTop);
    if((characterTop>480)||((blockLeft<20)&&(blockLeft>-50)&&((cTop<holeTop)||(cTop>holeTop+130)))){
        alert("Game over. Score: "+(counter-1));
        character.style.top = 100 + "px";
        counter=0;
    }
},10);

function jump(){
    jumping = 1;
    let jumpCount = 0;
    var jumpInterval = setInterval(function(){
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        if((characterTop>6)&&(jumpCount<15)){
            character.style.top = (characterTop-5)+"px";
        }
        if(jumpCount>20){
            clearInterval(jumpInterval);
            jumping=0;
            jumpCount=0;
        }
        jumpCount++;
    },10);
}