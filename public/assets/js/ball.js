const canvas=document.querySelector('canvas');
const ctx=canvas.getContext('2d');
const container_balls=document.getElementById('container_balls');

canvas.width=920; //1820
canvas.height=890;


export const ball1={
    id:0,
    x:canvas.width/2, 
    y:canvas.height-70, 
    dx:-5, 
    dy:-5,
    ballRadius:10,
    defaultBall:true,
    color:'#fff',
    repeat: true,
    collisionWhitOtherBall:100,
    initializated_state:false,
    sound:`<audio id="default_ball" src="./assets/sounds/ball_paddle.ogg"></audio>`,
};

export let counterBall=1;
export let balls=[];
export const createBall=()=>{
    
    balls.push({
        id:counterBall,
        x:ball1.x, 
        y:ball1.y, 
        dx:-5, 
        dy:-5,
        ballRadius:10,
        defaultBall:false,
        color:'#'+ ('000000'+Math.floor(Math.random()*16777215).toString(16)).slice(-6),
        repeat: 3,
        collisionWhitOtherBall: 20,
        initializated_state:true
    });
    counterBall++;
    createNodeInfoBalls(balls[balls.length-1]);
    // console.log('balls',balls)
};

export const createNodeInfoBalls=(ball)=>{
    const extraBall=document.createElement('div');
    extraBall.id=`ball_extra_id_${ball.id}`;
    extraBall.classList.add('con-ball', 'd-flex', 'align-items-center', 'justify-content-center');
    extraBall.innerHTML=`Bola extra <span class="ms-2 ball-info d-flex align-items-center justify-content-center" style="background:${ball.color}; width:30px; height:30px; border-radius:50%">${ball.repeat}</span>`;

    container_balls.appendChild(extraBall);

}
export const deleteBall=(ball)=>{
    // balls.splice(balls.indexOf(ball), 1);
    balls=balls.filter(b=>b.repeat>0);
    document.querySelector(`#container_balls #ball_extra_id_${ball.id}`).remove();

}