import {balls,counterBall, ball1, createBall, createNodeInfoBalls, deleteBall} from './ball.js';

import {drawWord} from './worldSprite.js';

const canvas=document.querySelector('canvas');
const ctx=canvas.getContext('2d');

const sprite=document.getElementById('sprite');
const $bricks=document.querySelector('#bricks');
const $bricks2=document.querySelector('#bricks2');
const powerUp=document.getElementById('powerup');
const spriteC = document.getElementById('spriteC');

const player_name=document.getElementById('player_name');
const tbody=document.getElementById('tbody');
const reloadGame=document.getElementById('reloadGame');
const newStart=document.getElementById('newStart');

// const container_balls=document.getElementById('container_balls');

//player info
const lives_player=document.querySelector('#lives');
const score_player=document.querySelector('#score');
const level_player=document.querySelector('#level');
const container_sounds=document.getElementById('container_sounds');
const container_extra=document.getElementById('container_extra');

canvas.width=1241; //1820 920
canvas.height=890;
// canvas.width=448;
// canvas.height=400;
// Variables del juego
let score=0;
let lives=10;
let level=1;
let dx_ballDefault=-5;

function initGameSound(){
    const body = document.querySelector('body');
    const sound=document.createElement('audio');
    sound.id='init_sound';
    sound.src='./assets/sounds/init_game.ogg';

   body.appendChild(sound);
    document.getElementById('init_sound').play();
    sound.onended = function() {
        sound.remove();
    };

}

let traying=0;
const dataPlayingPlayer=[];
const updateTable=()=>{
    
    tbody.innerHTML='';
    dataPlayingPlayer.sort((a, b)=>b.score-a.score);
    dataPlayingPlayer.forEach((player, index)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`
        <td class="rankingPlaye">${index+1}</td>
        <td class="rankingPlaye">${traying}</td>
        <td class="rankingPlaye">${player.player}</td>
        <td class="rankingPlaye">${level}</td>
        <td class="rankingPlaye">${score}</td>
        `;
        tbody.appendChild(tr);
    })
}
const optionModal={
    backdrop:'static',
    focus:true,
    keyboard:false,
}
const modalInitGame=document.getElementById('modal_initial_game');
const myModal = new bootstrap.Modal(modalInitGame, optionModal);
myModal.show();
modalInitGame.addEventListener('hidden.bs.modal', event => {
    const player=document.getElementById('player1').value;  

    dataPlayingPlayer.push({
        ranking:dataPlayingPlayer.length+1,
        player:player,
        score:0,
        level:1,
        date:new Date().toLocaleDateString()
    });
    updateTable();
    player_name.textContent=player;
    setStateName=true;
  })
  modalInitGame.addEventListener('shown.bs.modal', event => {
    initGameSound();
  })

reloadGame.addEventListener('click', event => {
    document.location.reload();

})
newStart.addEventListener('click', event => {
    traying++
    updateTable();
});


  const modalGameOver=document.getElementById('modal_game_over');
  const myModalGameOver = new bootstrap.Modal(modalGameOver, optionModal);

function resetGameOver(){
    score=0;
    lives=3;
    level=1;
    dx_ballDefault=-5;
    PADDLE_SENSITIVITY=12;
    paddleHeight=10;
    paddleWidth=50;
    paddleWidth2 = paddleWidth * 3;
    paddleHeight2 = paddleHeight * 2;
    paddleX=(canvas.width-paddleWidth2)/2;
    paddleY=canvas.height-paddleHeight2 - 50;
    rightPressed=false;
    leftPressed=false;
    addBall=false;
    initForwardBall=false;
    paused = false ;
    levenInit=0
    globalVariables.enableShoot=false;
    globalVariables.enableAddBall=false;
    shoot=false;
    shootWidth=33;
    shootHeight=32;
    setStateName=false;
    bricksCount=[];
    shoots=[];
    shoot=false;
    counterShoot=0;

    brickRowCount=2;
    brickColumnCount=5;
    brickWidth=93;
    brickHeight=48;
    brickPadding=20;
    brickOffsetTop=50;
    brickOffsetLeft=(canvas.width - ((brickWidth + brickPadding)*brickColumnCount))/2 ;
    
    arrPowerUp=[];

    // const modalGameOver=document.getElementById('modal_game_over');
    // const myModal = new bootstrap.Modal(modalGameOver, optionModal);
    // myModal.show();
    // modalGameOver.addEventListener('hidden.bs.modal', event => {
    //     document.location.reload();
    // })
}



const globalVariables={
    enableShoot:false,
    enableAddBall:false,
    enableOnFire:false,
    spacedY:0,
    spacedX:0,
}

const aleatorioEntre = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
const resetBall=(ball)=>{
    ball.x=paddleX + paddleWidth2/2;
    ball.y=paddleY;
    ball.dx=-5;
    ball.dy=-5;

}

/* Variables de la paleta */
let PADDLE_SENSITIVITY=12 //8;

let paddleHeight=10; //10
let paddleWidth=50;  //50
let paddleWidth2 = paddleWidth * 3;
let paddleHeight2 = paddleHeight * 2;

let paddleX=(canvas.width-paddleWidth2)/2;
let paddleY=canvas.height-paddleHeight2 - 50;

let rightPressed=false;
let leftPressed=false;
let addBall=false;

let initForwardBall=false;
let paused = false ;
let levenInit=0
// let enableShoot=false;
// let enableAddBall=false;
let shootWidth=33;
let shootHeight=32;

let setStateName=false;

const fps = 60
  
let msPrev = window.performance.now()
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / fps
let frames = 0
let framesPerSec = fps;

let shoots=[];
let shoot=false;
let counterShoot=0;


/* Variables de los ladrillos*/

let brickRowCount=2;  //6
let brickColumnCount=5; //13
let brickWidth=93;    //32
let brickHeight=48;   //16
let brickPadding=20;   //0
let brickOffsetTop=50; //80
let brickOffsetLeft=(canvas.width - ((brickWidth + brickPadding)*brickColumnCount))/2 ; //16
let bricksCount=[];
let arrPowerUp=[];

const BRICK_STATUS={ACTIVE:1, DESTROYED:0};

const typeShoot=[
    {
        type:1, 
        color:'#ff0000', 
        ds:8, 
        resistance:1, 
        indestructible: false
    }, 
];

const levelGame=[{level:1, profile:0}, {livel:2, profile:1},{livel:3, profile:2} ];


const profileBricks=[
    {color:'#ff0000', pounds:50, resistance:1, indestructible: false},
    {color:'#ff0000', pounds:70, resistance:2, indestructible: false},
    {color:'#ff0000', pounds:100, resistance:3, indestructible: false},
]

const typePowerUp=[
    {
        type:1, 
        name:'addBall',
        sprite:powerUp,
        numSprite:8,
        initialSprite:0,
        spriteInitX:98,
        spriteInitY:114,
        widthSprite:51,
        heightSprite:28,
        spacingDraw:10,
        controlGiro:100,
        dx:0,
        dy:5,
        isTiming:true,
        timeDuration:7000,
        state:true,
        staticSprite:'./assets/img/addBall.png',
    },
    {
        type:2, 
        name:'onFire', 
        sprite:powerUp,
        numSprite:8,
        initialSprite:0,
        spriteInitX:98,
        spriteInitY:41,
        widthSprite:51,
        heightSprite:28,
        spacingDraw:10,
        controlGiro:20,
        dx:0,
        dy:5,
        isTiming:true,
        timeDuration:5000,
        state:true,
        staticSprite:'./assets/img/fire1.png',
    }, 
    {
        type:3, 
        name:'onFire2', 
        sprite:powerUp,
        numSprite:9,
        initialSprite:0,
        spriteInitX:8,
        spriteInitY:151,
        widthSprite:51,
        heightSprite:25,
        spacingDraw:16,
        controlGiro:20,
        dx:0,
        dy:5,
        isTiming:false,
        timeDuration:1000,
        state:true,
        staticSprite:'',
    }
];
const createPoweUp=(brick)=>{
    const type=typePowerUp.find(x=>x.type==brick.extra);
    if(type !==undefined){
        if( type.state==true){
            arrPowerUp.push({
                x:brick.x,
                y:brick.y,
                xi:brick.x,
                yi:brick.y,
                dx:type.dx,
                dy:type.dy,
                type:type.type,
                name:type.name,
                sprite:type.sprite,
                numSprite:type.numSprite,
                spriteInitX:type.spriteInitX,
                spriteInitY:type.spriteInitY,
                widthSprite:type.widthSprite,
                heightSprite:type.heightSprite,
                spacingDraw:type.spacingDraw,
                timeDuration:type.timeDuration,
                isTiming:type.isTiming,
                state:true,
                controlGiro:type.controlGiro,
                counterSeg:0,
                initialSprite:type.initialSprite,
                staticSprite:type.staticSprite,

            });
        }
    }
   
    
}

const drawPowerUp=()=>{
    for(let i=0; i<arrPowerUp.length; i++){
        const powerUp=arrPowerUp[i];
        const dy=powerUp.dy;
        const dx=powerUp.dx;
        const spacingDraw=powerUp.spacingDraw
        const controlGiro=powerUp.controlGiro;
        const leghtSeg=(canvas.height-powerUp.yi-50)/controlGiro;
        const segYi=powerUp.yi+leghtSeg*powerUp.counterSeg;
        const segYf=segYi+leghtSeg;
    
        let dinamycX=powerUp.spriteInitX+((powerUp.widthSprite+powerUp.spacingDraw)*powerUp.initialSprite);
        
        powerUp.y+=dy;
        powerUp.x+=dx;
        ctx.drawImage(
            powerUp.sprite, //imagen
            dinamycX,
            // powerUp.spriteInitX, //coordenada x del recorte
            powerUp.spriteInitY, //coordenada y del recorte
            powerUp.widthSprite, // tamaño del recorte
            powerUp.heightSprite, // tamaño del recorte
            powerUp.x, // posicion x del dibujo
            powerUp.y, // posicion y del dibujo
            powerUp.widthSprite, // escalado del dibujo
            powerUp.heightSprite // escalado del dibujo
        );
        powerUp.counterSeg+=powerUp.y>segYf?1:0;
        powerUp.initialSprite+=powerUp.y>segYf?1:0;

        if(powerUp.y>canvas.height-20 ){
            // powerUp.counterSeg=0;
            powerUp.state=false;
            arrPowerUp.splice(i, 1);
        }
        if( powerUp.initialSprite>=powerUp.numSprite){
            powerUp.initialSprite=0;
            // counterSeg=0
            // paused=true    
        }
    }
};

function powerDuration(powerUp, variable){
    if(powerUp.isTiming==true){

        let powerUpTimeDuration=powerUp.timeDuration;
        if(powerUpTimeDuration > 0){
            const id=aleatorioEntre(1000, 9999);
            const div=document.createElement('div');
            div.id=`power_${id}`;
            div.classList.add('powerUp');
            const img=document.createElement('img');
            img.src=powerUp.staticSprite;
            div.appendChild(img);
            const span=document.createElement('span');
            span.id=`powerUpTimeCounter_${id}`;
            span.classList.add('powerUpTime');
            span.textContent=powerUpTimeDuration/1000;
            div.appendChild(span);
            container_extra.appendChild(div);
            const p1 = setInterval(() => {
                powerUpTimeDuration -= 1000;
                globalVariables[variable]=true;
                document.getElementById(`powerUpTimeCounter_${id}`).textContent=powerUpTimeDuration/1000;
                if(powerUpTimeDuration <= 0){
                    clearInterval(p1);
                    globalVariables[variable]=false;
                    document.getElementById(`power_${id}`).remove();
                }
            }, 1000);
        }
    }
    
}

function detectedCollisionPowerUp(){
    for(let i=0; i<arrPowerUp.length; i++){
        const powerUp=arrPowerUp[i];
        if(powerUp.y>paddleY-powerUp.heightSprite && powerUp.y<paddleY+paddleHeight2 && powerUp.x>paddleX && powerUp.x<paddleX+paddleWidth2){
            // console.log('colision con power up', powerUp.name)
            if(powerUp.type==2){
                globalVariables.enableShoot=true;
                powerDuration(powerUp,'enableShoot')
            }
            if(powerUp.type==1){
                globalVariables.enableAddBall=true;
                powerDuration(powerUp,'enableAddBall')
            }
            arrPowerUp.splice(i, 1);
        }
    }

}

function agruparEnPares(arr,gr) {
    let resultado = [];
    let arr2=arr.flat(gr);
    let arr3=arr2.sort((a, b)=>a.color-b.color);
    for (let i = 0; i < arr3.length; i += gr) {
        resultado.push(arr3.slice(i, i + gr));
    }
    return resultado;
}
function agruparEnPares2(arr){
    let resultado = [];
    for (let i = 0; i < arr.length; i++) {
        
        resultado.push(arr[i].sort((a, b)=>a.color-b.color));
    }
    return resultado;
}

const createAllBricks=async (level)=>{
    const {profile}=level;
    for(let c=0; c<brickColumnCount; c++){
        let initColor=0;
        bricksCount[c]=[]; // inicializar el array vacio
        for(let r=0; r<brickRowCount; r++){
            //calcular la posicion de cada ladrillo en la pantalla
            const bricksX=(c*(brickWidth+brickPadding+globalVariables.spacedX))+brickOffsetLeft;
            const bricksY=(r*(brickHeight+brickPadding+globalVariables.spacedY))+brickOffsetTop;
      
            const randomColor=initColor;
            initColor++;
            if(initColor>7){
                initColor=0;
            }

            const resistance=profileBricks[profile].resistance;
            let impact_sound;
            if(resistance>1){
                impact_sound='./assets/sounds/first_impact.ogg';

            }
            else if(resistance<=1){
                impact_sound='./assets/sounds/last_impact.ogg';

            }
            const id=aleatorioEntre(1000, 9999);
            const sound=`<audio id=b_${id} src="${impact_sound}"></audio>`;

            const FA= aleatorioEntre(1, 4)
            //asignar el color al ladrillo
            bricksCount[c][r]={
                id,
                x:bricksX, 
                y:bricksY, 
                status:BRICK_STATUS.ACTIVE, 
                color:randomColor,
                pounds:profileBricks[profile].pounds,
                resistance:resistance,
                indestructible: false,
                sound:sound,
                extra: FA
            };
        }
    }
    // bricksCount=agruparEnPares(bricksCount,brickRowCount);
    bricksCount=agruparEnPares2(bricksCount);
    // console.log(bricksCount)
}

const drawText=({resistance:text, x, y, color='#fff', font='16px Arial'})=>{
    ctx.font=font;
    ctx.fillStyle=color;
    ctx.lineWidth = 6;
    ctx.fillText(text, x+brickWidth/2, y+brickHeight/2);
}

await createAllBricks(levelGame[levenInit]);

function obtenerNegativoColor(hexColor) {
    // Extraer los componentes RGB del color hexadecimal
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // Obtener el negativo de cada componente RGB
    const negR = 255 - r;
    const negG = 255 - g;
    const negB = 255 - b;

    // Convertir los valores del negativo de RGB a formato hexadecimal
    const negHex = '#' + ((1 << 24) + (negR << 16) + (negG << 8) + negB).toString(16).slice(1);

    return negHex;
}

function drawBall({x, y, ballRadius, color='#fff', initializated_state=false}){
   
    if(!initializated_state){
        ctx.beginPath();
        // ctx.arc(x, y-ballRadius, ballRadius, 0, Math.PI*2);
        ctx.arc(paddleX+paddleWidth2/2, paddleY-ballRadius, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

    }else{

        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}

function drawPaddle(){
  
  
    ctx.drawImage(
        sprite, //imagen
        29, //coordenada x del recorte
        174, //coordenada y del recorte
        paddleWidth, // tamaño del recorte
        paddleHeight, // tamaño del recorte
        paddleX, // posicion x del dibujo
        paddleY, // posicion y del dibujo
        paddleWidth2, // escalado del dibujo
        paddleHeight2, // escalado del dibujo
        );
}


async function drawBricks(){

    
    for(let c=0; c<brickColumnCount; c++){
        for(let r=0; r<brickRowCount; r++){
            const currentBrick=bricksCount[c][r];

            if(currentBrick.status==BRICK_STATUS.DESTROYED){
                continue;
            }
            
            const clipX = currentBrick.color * 96 //32

            ctx.drawImage(
                $bricks2, // imagen: $bricks
                clipX,
                0,
                brickWidth, // 32
                brickHeight, // 16
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
              )

              drawText(currentBrick)
           
        }
    }
}
 
function drawUI() {
    ctx.fillText(`FPS: ${framesPerSec}`, 5, 10)
    lives_player.textContent=`Vidas: ${lives}`;
    score_player.textContent=`Puntos: ${score}`;
    level_player.textContent= `Nivel: ${level}`;
}

const distancia = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
function updateBrick(brick){
    const color=brick.color;
    const id=brick.id;
    let impact_sound;
    // const pounds=brick.pounds;
    const resistance=brick.resistance;
    if(resistance>1){
        impact_sound='./assets/sounds/first_impact.ogg';
    }
    else if(resistance<=1){
        impact_sound='./assets/sounds/last_impact.ogg';
    }
    const sound=`<audio id=b_${id} src="${impact_sound}"></audio>`;
    brick.sound=sound;

}
function collisionDetection(ball){

    let dx=ball.dx;
    let dy=ball.dy;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricksCount[c][r]
            if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            const isBallSameXAsBrick =
                ball.x + ball.ballRadius >= currentBrick.x &&
                ball.x - ball.ballRadius<= currentBrick.x + brickWidth

            const isBallSameYAsBrick =
                ball.y + ball.ballRadius>= currentBrick.y &&
                ball.y - ball.ballRadius<= currentBrick.y + brickHeight

            if (isBallSameXAsBrick && isBallSameYAsBrick) {
                container_sounds.innerHTML = currentBrick.sound;
                ball.dy = -dy;
                // ball.dx = -dx;
                
                if (ball.defaultBall) {
                    ball1.dx = Math.random() < 0.5 ? -5 : 5;
                }
                if(!currentBrick.indestructible){
                    
                    currentBrick.resistance--;
                    updateBrick(currentBrick);
                    if(currentBrick.resistance==0){
                        currentBrick.status = BRICK_STATUS.DESTROYED;
                        score+=currentBrick.pounds;
                        updateTable();
                        createPoweUp(currentBrick)
                    }
                }
                playAndRemoveSound(`b_${currentBrick.id}`);
            }else{
                
            }
        }
    }
  
}

function controlLevel(){
   
    const bricksN=bricksCount.flat(2).filter(l=>l.status==BRICK_STATUS.ACTIVE && l.indestructible==false).length

    if(bricksN==0){
        level++;
        lives++;
        levenInit++;
        brickRowCount+=brickRowCount<9?1:0;
        brickColumnCount+=brickColumnCount<7?1:0;
        brickOffsetLeft=(canvas.width - ((brickWidth + brickPadding)*brickColumnCount))/2 ;
        resetBall(ball1);
        // console.log('levelgame==>',levelGame[levenInit])
        const newLevel=levelGame[levenInit];
        createAllBricks(newLevel? newLevel:levelGame[levelGame.length-1]);
        // paused=true;
        shoots=[];
        initForwardBall=false;
        ball1.initializated_state=false;
        if(level>1){
            balls.length=0;
            document.getElementById('container_balls').innerHTML='';
        }
  
    }
    if(ball1.initializated_state==false){
        // console.log('ball1 no iniciada')

    }
}

function initEvents(){
 +
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    // document.addEventListener('mousemove', mouseMoveHandler, false);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleAddBall);
    document.addEventListener('keydown', handleInitBall);
    document.addEventListener('keydown', handleShoot);

    function keyDownHandler(e){
        if((e.key=='Right' || e.key=='ArrowRight') && setStateName){
            rightPressed=true;
        }
        else if((e.key=='Left' || e.key=='ArrowLeft') && setStateName){
            leftPressed=true;
        }
    }

    function keyUpHandler(e){
        if(e.key=='Right' || e.key=='ArrowRight'){
            rightPressed=false;
        }
        else if(e.key=='Left' || e.key=='ArrowLeft'){
            leftPressed=false;
        }
    }

    function handleKeyDown(event) {
        if (event.code === 'KeyP') { // 32 es el código de la tecla de barra espaciadora
        // if (event.keyCode === 32) { // 32 es el código de la tecla de barra espaciadora
            paused = !paused; // Cambiar el estado de pausa
            // console.log('pausa', paused)
            drawWord({word:paused?'Pausa !':'', x:canvas.width/2, y:canvas.height/2, sx:2, sy:2})
            // initForwardBall=true
        }
    }

    function handleAddBall(event){
        if(event.keyCode==70 && globalVariables.enableAddBall){ //letra f
            createBall();
            addBall=true;
        }
    }
    function handleInitBall(event){
        if((event.key=='Up' || event.key=='ArrowUp')&& setStateName){
            initForwardBall=true;
        }
    }
    function handleShoot(event){
        if(event.code=='Space'){
            if(globalVariables.enableShoot){

                createShoot()
            }
        }
    }
}

function ballMovement(ball){
    
    let x, y, dx, dy;
    if(ball.defaultBall && ball.initializated_state==false){
        ball.x=paddleX + paddleWidth2/2;
        ball.y=paddleY;
        ball.initializated_state=true;
        ball.dx=0.1;
    }
    const ballRadius=ball.ballRadius;
    x=ball.x;
    y=ball.y;
    dx=ball.dx;
    dy=ball.dy;
    ball.x=x+dx;
    ball.y=y+dy;
    
   

    if(
        ball.x+dx>canvas.width-ballRadius ||  //colision con pared derecha
        ball.x+dx<ballRadius // colision con pared izquierda 
        ){
        ball.dx=-dx;
    }
    // colision con pared arriba
    if(y+dy<ballRadius){
        ball.dy=-(dy-1);
        // ball.dx=dx+1;sdfsd
    }


    
    // colision con la paleta
    const isBallSameXAsthePaddle = ball.x>paddleX && ball.x<paddleX+paddleWidth2;
    const isBallTouchingPaddle = ball.y+ball.dy>paddleY;

    if(isBallSameXAsthePaddle && isBallTouchingPaddle ){
        ball.dy=-dy; //cambiar la direccion de la pelota hacia arriba
        if(ball.defaultBall){
            container_sounds.innerHTML=ball.sound;
            playAndRemoveSound('default_ball')
        }
    }
    else if(ball.y+dy>canvas.height-ballRadius || ball.y + dy > paddleY + paddleHeight2){
        // si la peloca colisiona con la parte inferior del canvas
        // console.log('GAME OVER');
        if(ball.defaultBall){
            initForwardBall=false;
            ball.initializated_state=false
            lives--; // solo resta vida si la pelota por defecto cae
        }else{
            ball.repeat--;
            document.querySelector(`#container_balls #ball_extra_id_${ball.id} span`).textContent=ball.repeat;
            if(ball.repeat==0){
                deleteBall(ball);
                // addBall=false;
            }
        }
        if(!lives){
            drawWord({word:'GAME OVER !', x:canvas.width/2, y:canvas.height/2, sx:2, sy:2})
            // alert('GAME OVER');
            myModalGameOver.show();
            // resetGameOver();
            // document.location.reload();
        }
        else{
            // setTimeout(resetBall, 2000);
            resetBall(ball)
      
        }

    }
        //colision con otra pelota
   
        for(let i=0; i<balls.length; i++){
            if(balls[i].repeat>0){
                if(ball.id!=balls[i].id){
                    const isBallSameXAsBall = ball.x>balls[i].x && ball.x<balls[i].x+balls[i].ballRadius;
                    const isBallSameYAsBall = ball.y>balls[i].y && ball.y<balls[i].y+balls[i].ballRadius;
                    const d= Math.sqrt(Math.pow(ball.x-balls[i].x, 2) + Math.pow(ball.y-balls[i].y, 2));
                    // if(isBallSameXAsBall && isBallSameYAsBall){
                    if(d<ballRadius+balls[i].ballRadius){
                        ball.dx=-(dx+0.01);
                        ball.dy=-(dy+ 0.01);
                       
                        ball.collisionWhitOtherBall--;
                    }
                    if(ball.collisionWhitOtherBall==0){
                        ball.x=ball.x+10;
                        ball.y=ball.y+10;
                        balls[i].x=balls[i].x-10;
                        balls[i].y=balls[i].y-10;
                        ball.collisionWhitOtherBall=!ball.defaultBall?20:100;
                    }
                }
            }
        }
}

function paddleMovement(){
    if(rightPressed && paddleX<canvas.width-paddleWidth2){
        paddleX+=PADDLE_SENSITIVITY;
    }
    else if(leftPressed && paddleX>0){
        paddleX-=PADDLE_SENSITIVITY;
    }
}


function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

  // a que velocidad de fps queremos que renderice nuestro juego


function playAndRemoveSound(id) {
    const sound = document.getElementById(id);
    sound.play();
    sound.onended = function() {
        sound.remove();
    };
}

function createShoot(){
    const id=aleatorioEntre(1000, 9999);
    const sound=`<audio id=s_${id} src="./assets/sounds/shoot.ogg"></audio>`;
    container_sounds.innerHTML=sound;
    shoots.push({
        id:id,
        type:1,
        x:paddleX+paddleWidth2/2,
        y:paddleY,
        s:paddleY,
        v:0,
        dsy:8,
        dsx:0,
        state:true,
        sound:sound
    });
    playAndRemoveSound(`s_${id}`);
    // const id2=id
    // console.log('id', id, 'id2', id2, id==id2)
    // document.getElementById('shoot').play();
}

function drawShoot(){
 
    const drawShoots=(shoot)=>{
        // console.log('creado')
        
        let posY=shoot.y-30
        let posX=shoot.x-shootWidth/2;
        const ds=shoot.dsy;
        shoot.dsy+=8
        if(posY<0 ){
            shoot.state=false;
        }else{
            shoot.state=true;
            ctx.drawImage(
                sprite, //imagen
                319, //coordenada x del recorte
                216, //coordenada y del recorte
                shootWidth, // tamaño del recorte
                shootHeight, // tamaño del recorte
                posX, // posicion x del dibujo
                posY-=ds, // posicion y del dibujo
                shootWidth, // escalado del dibujo
                shootHeight, // escalado del dibujo
            );
            shoot.s=posY;
            shoot.v=posX
        }
            // console.log('posY', posY) 
    };

    for(let i=0; i<shoots.length; i++){
        if(shoots[i].state){
            drawShoots(shoots[i])
            counterShoot++;
        }
    }
    // console.log('shoots', shoots)
    // if(counterShoot==10){
    //     shoots.shift();
    //     counterShoot=0;
    // }   
    // collisionShoot()
}
   
function collisionShoot(){
    shoots=shoots.filter(s=>s.state==true);
    for(let i=0; i<shoots.length; i++){
        if(shoots[i].state){
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const currentBrick = bricksCount[c][r]
                    if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;
    
                    const isShootSameXAsBrick = shoots[i].v+shootWidth>currentBrick.x && shoots[i].v<currentBrick.x+brickWidth;
                     
                    const isShootSameYAsBrick = shoots[i].s+shootHeight>currentBrick.y && shoots[i].s<currentBrick.y+brickHeight

    
                    if (isShootSameXAsBrick && isShootSameYAsBrick) {
                        shoots[i].state=false;
                        currentBrick.resistance--;
                        if(currentBrick.resistance==0){
                            createPoweUp(currentBrick)
                            currentBrick.status = BRICK_STATUS.DESTROYED;
                            score+=currentBrick.pounds;
                        }
                    }
                }
            }
        }
    }

}
  
function draw(){
    if(!paused ){
        
        controlLevel();
        drawUI();
        clearCanvas();
        if(initForwardBall){
            ballMovement(ball1);
        }
        drawBall(ball1);
        collisionDetection(ball1);
        if(addBall){
            for(let i=0; i<balls.length; i++){
                if(balls[i].repeat>0){
                    drawBall(balls[i]);
                    collisionDetection(balls[i]);
                    ballMovement(balls[i]);
                }
            }          
        }
        drawPaddle();
        drawBricks();
        collisionShoot()
        drawShoot();
        drawPowerUp()
        detectedCollisionPowerUp();
        // drawScore();
        // drawLives();
        paddleMovement(); 
    
        window.requestAnimationFrame(draw);  
       
    }else{
        window.requestAnimationFrame(draw)
    }  
    return;  
}
draw();
initEvents();  