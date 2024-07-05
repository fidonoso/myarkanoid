
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const spriteC = document.getElementById('spriteC');

canvas.width=1241; //1820 920
canvas.height=890;

const arrAZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;?!_+=~€$%()\/{}[]<>^*@".split("");

const lettersRxC = [];
// const letters=[]
const sprite={
    coorX:0,
    coorY:0,
    width:512,
    height:512,
    img:'../img/az.png',
    letterPerRow:8,
    leeterPerCol:8,
    
}
const measureLetter={
    width:53,
    height:55,
    spacingH:8.25,
    spacingV:20,
}

let letterOnCanvasConfig={
    factorConstX:16,
    factorConstY:50,
    factorProporcionX:1,
    factorProporcionY:1
}


let spacingBetweenLetters=letterOnCanvasConfig.factorProporcionX*measureLetter.width-letterOnCanvasConfig.factorConstX


measureLetter.spacingH=((sprite.width-2*sprite.coorX)/sprite.letterPerRow)-measureLetter.width

measureLetter.spacingV=((sprite.height-2*sprite.coorY)/sprite.leeterPerCol)-measureLetter.height

for(let c=0;c<sprite.leeterPerCol;c++){
    lettersRxC[c]=[]
    for(let r=0;r<sprite.letterPerRow;r++){
        const l=arrAZ[c*sprite.letterPerRow+r]
        if(l===undefined) break;
        lettersRxC[c][r]={
            letter:arrAZ[c*sprite.letterPerRow+r],
            x:sprite.coorX+(r*(measureLetter.width+measureLetter.spacingH)),
            y:sprite.coorY+(c*(measureLetter.height+measureLetter.spacingV))
        }
    }
    
}
const letters=lettersRxC.flat(2);

const drawLetter = (letter,x,y)=>{

    const letterObj = letters.find((obj)=>obj.letter===letter);

    ctx.drawImage(
        spriteC, //img
        letterObj.x,//coordenada x en el sprite
        letterObj.y, //coordenada y en el sprite
        measureLetter.width, //ancho en el sprite
        measureLetter.height, //alto en el sprite
        x, //coordenada x en el canvas
        y, //coordenada y en el canvas
        measureLetter.width*letterOnCanvasConfig.factorProporcionX, //ancho en el canvas
        measureLetter.height*letterOnCanvasConfig.factorProporcionY //alto en el canvas
    )
}
// const text = {
//     word:"Paused !",
//     x:50,
//     y:50
// };
export function drawWord({word, x, y, sx, sy}){

    letterOnCanvasConfig.factorProporcionX=sx;
    letterOnCanvasConfig.factorProporcionY=sy;
    const largo=word.length*measureLetter.width*sx
    x=x-(largo/2);
    spacingBetweenLetters=letterOnCanvasConfig.factorProporcionX*measureLetter.width-letterOnCanvasConfig.factorConstX
    const wordArr = word.toUpperCase().split("");
    for(let i=0;i<wordArr.length;i++){
        if(wordArr[i]===' '){
            x+= spacingBetweenLetters;
            continue;
        }
        drawLetter(wordArr[i],x,y);
        x+= spacingBetweenLetters;
    }
};

