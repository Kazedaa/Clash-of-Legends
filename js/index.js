const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 0.7
canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)

const background = new Sprite({
    position:{x:0,y:0},
    imageSrc:'./BackGrounds/background.png'
})

const shop = new Sprite({
    position:{x:600,y:128},
    imageSrc:'./BackGrounds/shop.png',
    scale:2.75,
    frames:6,
    isAnimatable: true,
    animationSpeed: 10
})

const player = new Fighter({
    position:{x:50,y:0},
    velocity:{x:0,y:10},
    offset:{x:400,y:228},
    imageSrc:'./WindFighter/PNG/idle/idle_',
    isAnimatable:true,
    animationSpeed:10,
    scale:3,
    frames:8,
    sprites:{
        idle:{
            imageSrc:'./WindFighter/PNG/idle/idle_',
            frames:8
        },
        run:{
            imageSrc:'./WindFighter/PNG/run/run_',
            frames:8
        },
        j_down:{
            imageSrc:'./WindFighter/PNG/j_down/j_down_',
            frames:3
        },
        j_up:{
            imageSrc:'./WindFighter/PNG/j_up/j_up_',
            frames:3
        },
        attack:{
            imageSrc:'./WindFighter/PNG/1_atk/1_atk_',
            frames:6
        },
        react:{
            imageSrc:'./WindFighter/PNG/take_hit/take_hit_',
            frames:6
        },
        death:{
            imageSrc:'./WindFighter/PNG/death/death_',
            frames:19
        },
    },
    attackBox:{
        offset:{x:50,y:50},
        width:120,
        height:100
    },
    facing: 1
})

const enemy = new Fighter({
    position:{x:900,y:0},
    velocity:{x:0,y:10},
    offset:{x:400,y:228},
    imageSrc:'./MetalFighter/PNG/01_idle/01_idle_',
    isAnimatable:true,
    animationSpeed:10,
    scale:3,
    frames:8,
    sprites:{
        idle:{
            imageSrc:'./MetalFighter/PNG/01_idle/01_idle_',
            frames:8
        },
        run:{
            imageSrc:'./MetalFighter/PNG/02_run/02_run_',
            frames:8
        },
        j_down:{
            imageSrc:'./MetalFighter/PNG/03_jump_down/03_jump_down_',
            frames:3
        },
        j_up:{
            imageSrc:'./MetalFighter/PNG/03_jump_up/03_jump_up_',
            frames:3
        },
        attack:{
            imageSrc:'./MetalFighter/PNG/07_1_atk/07_1_atk_',
            frames:6
        },
        react:{
            imageSrc:'./MetalFighter/PNG/12_take_hit/12_take_hit_',
            frames:6
        },
        death:{
            imageSrc:'./MetalFighter/PNG/13_death/13_death_',
            frames:6
        },
    },
    attackBox:{
        offset:{x:50,y:50},
        width:200,
        height:100
    },
    facing: -1
})

const keys = {
    a:{
        pressed: false
    } ,
    d:{
        pressed: false
    } ,
    ArrowRight:{
        pressed: false
    } ,
    ArrowLeft:{
        pressed: false
    }
}

gameOver()

function runGame(){
    window.requestAnimationFrame(runGame)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    //player movement
    player.velocity.x = 0
    player.switchSprite("idle")
    if (keys.a.pressed && player.lastKey==='a'){
        player.velocity.x = -5
        player.switchSprite("run")
    }else if (keys.d.pressed && player.lastKey==='d') {
        player.velocity.x = 5
        player.switchSprite("run")
    }
    if (player.velocity.y < 0){
        player.switchSprite("j_up")
    }else if (player.velocity.y > 0){
        player.switchSprite("j_down")
    }

    //enemy movement
    enemy.velocity.x = 0
    enemy.switchSprite("idle")
    if (keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite("run")
    }else if (keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite("run")
    }
    if (enemy.velocity.y < 0){
        enemy.switchSprite("j_up")
    }else if (enemy.velocity.y > 0){
        enemy.switchSprite("j_down")
    }

    //enemy collision detection
    if(rectangularCollision({rectangle1:player, rectangle2:enemy}) && player.isAttacking &&  player.currentFrame===player.sprites.attack.frames){
        enemy.takeHit()
        player.isAttacking = false
        // document.querySelector('#enemyHealth').style.width = enemy.health +'%'
        gsap.to('#enemyHealth',{width:enemy.health + '%'})
    }

    //if player misses
    if(player.isAttacking && player.currentFrame===player.sprites.attack.frames){
        player.isAttacking = false
    }

    //player collision detection
    if(rectangularCollision({rectangle1:enemy, rectangle2:player}) && enemy.isAttacking && enemy.currentFrame===enemy.sprites.attack.frames){
        player.takeHit()
        enemy.isAttacking = false
        // document.querySelector('#playerHealth').style.width = player.health +'%'
        gsap.to('#playerHealth',{width:player.health + '%'})
    }

    //if enemy misses
    if(enemy.isAttacking && enemy.currentFrame===enemy.sprites.attack.frames){
        enemy.isAttacking = false
    }

    //end game based on health
    if (enemy.health * player.health <=0){
        winner({player:player, enemy:enemy, timerId:timerId})
    }
}
runGame()

window.addEventListener('keydown', (event)=>{
    if (!player.dead){
        switch(event.key){
            case 'd':
                player.lastKey = 'd'
                player.facing = 1
                keys.d.pressed = true
                player.attackBox.offset.x = player.width
                break
            case 'a':
                player.lastKey = 'a'
                player.facing = -1
                player.attackBox.offset.x =-player.attackBox.width
                keys.a.pressed = true
                break
            case 'w':
                player.velocity.y = -20
                break
            case 's':
                player.attack()
                break
        }
    }

    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                enemy.lastKey = 'ArrowRight'
                enemy.facing = 1
                enemy.attackBox.offset.x = enemy.width
                keys.ArrowRight.pressed = true
                break
            case 'ArrowLeft':
                enemy.lastKey = 'ArrowLeft'
                enemy.facing = -1
                enemy.attackBox.offset.x =-enemy.attackBox.width
                keys.ArrowLeft.pressed = true
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case 'd':
            player.lastKey = 'd'
            keys.d.pressed = false
            break
        case 'a':
            player.lastKey = 'a'
            keys.a.pressed = false
            break
        case 'ArrowRight':
            enemy.lastKey = 'ArrowRight'
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            enemy.lastKey = 'ArrowLeft'
            keys.ArrowLeft.pressed = false
            break
    }
})