const canvas = document.getElementById("game");
const ctx=canvas.getContext("2d");

const GAME_WIDTH= 800;
const GAME_HEIGHT= 200;

let scaleRatio= null;

function setScreen(){
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height= GAME_HEIGHT * scaleRatio;
}

setScreen();
//Use setTimeout on Safari mobile rotation otherwise works fine on desktop 
window.addEventListener("resize", ()=> setTimeout(setScreen, 500));

if(screen.orientation){
    screen.orientation.addEventListener("change", setScreen);
}

function getScaleRatio(){
    const screenHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
    );
    const screenWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth 
    );
    //window is wider than the game width
    if(screenWidth/ screenHeight < GAME_WIDTH / GAME_HEIGHT){
        return screenHeight / GAME_HEIGHT
    } else {
        return screenWidth / GAME_WIDTH
    }
}

function clearScreen(){
    ctx.fillStyle="red";
    ctx.fillRect(0,0,canvas.width, canvas.height)
}

function gameLoop() {
    clearScreen();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);