function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <=rectangle2.position.y + rectangle2.height
    )
}

function winner({player,enemy,timerId}){
    clearTimeout(timerId)
    document.querySelector("#gameOver").style.display = "flex"
    if (player.health===enemy.health){
        document.querySelector("#gameOver").innerHTML = "Tie"
    }else if(player.health > enemy.health){
        document.querySelector("#gameOver").innerHTML = "Player Wins!!!"
    }else if(player.health < enemy.health){
        document.querySelector("#gameOver").innerHTML = "Enenmy Wins!!!"
    }
}

let timer = 60
let timerId
function gameOver(){
    timerId = setTimeout(gameOver, 1000)
    if(timer>0){timer
        timer--
        document.querySelector("#timer").innerHTML = timer
    }
    if (!timer){
        winner({player:player, enemy:enemy , timerId:timerId})
    }
}