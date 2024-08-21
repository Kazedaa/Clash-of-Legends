class Sprite{
    constructor({position, imageSrc, scale =1, frames=1, isAnimatable = false, animationSpeed,offset={x:0,y:0}}){
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.imageSrc = imageSrc
        this.scale = scale
        this.frames = frames
        this.currentFrame = 0
        this.isAnimatable = isAnimatable
        this.frameTime = 0
        this.animationSpeed = animationSpeed
        this.offset=offset
    }

    draw(){
        c.drawImage(
            this.image,
            this.currentFrame * (this.image.width/this.frames),
            0,
            this.image.width/this.frames,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y-this.offset.y,
            (this.image.width/this.frames) * this.scale,
            this.image.height * this.scale)
    }

    animate(){
        if(this.isAnimatable && this.frameTime%this.animationSpeed===0){
            this.currentFrame+=1
            this.currentFrame%=this.frames
        }
        this.frameTime+=1
    }

    update(){
        this.image.src = this.imageSrc
        this.draw()
        this.animate()
    }
}

class Fighter extends Sprite{
    constructor({
        height,
        position,
        color,
        velocity,
        imageSrc,
        scale,
        frames,
        isAnimatable,
        animationSpeed,
        offset={x:0,y:0},
        attackBox,
        sprites,
        facing
        }){
        super({
            position,
            imageSrc,
            scale,
            frames,
            isAnimatable,
            animationSpeed,
            offset
        })
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.color = color
        this.lastKey
        this.attackBox = {
            position: {
                x:this.position.x-this.offset.x,
                y:this.position.y-this.offset.y
            },
            offset: attackBox.offset,
            width:attackBox.width,
            height:attackBox.height
        }
        this.isAttacking = false
        this.health = 100
        this.currentFrame = 0
        this.frameTime = 0
        this.sprites = sprites
        this.facing = facing
        this.dead = false

        for (const sprite in this.sprites){
            sprites[sprite].image = new Image()
            // sprites[sprite].image.src = sprites[sprite].imageSrc+'1.png'
        }
    }

    draw(){
            c.drawImage(
                this.image,
                this.position.x-this.offset.x,
                this.position.y-this.offset.y,
                this.image.width * this.scale,
                this.image.height * this.scale)
    }
    
    animate(){
        if(this.isAnimatable && this.frameTime%this.animationSpeed===0){
            this.currentFrame+=1
            this.currentFrame%=this.frames
            this.image.src = this.imageSrc+(this.currentFrame+1)+'.png'
        }
        this.frameTime+=1
    }

    update(){
        if(!this.dead) this.animate()
        this.draw()
        this.attackBox.position.x=this.position.x + this.attackBox.offset.x
        this.attackBox.position.y=this.position.y +this.attackBox.offset.y


        // reveal hitboxes

        // c.fillStyle = "black"
        // c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
        // c.fillStyle = "green"
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)


        this.position.y+=this.velocity.y
        this.position.x+=this.velocity.x
        if (this.position.x+this.velocity.x <= 0){
            this.velocity.x = 0
            this.position.x = 0
        } else if(this.position.x+this.width+this.velocity.x >= canvas.width){
            this.velocity.x = 0
            this.position.x = canvas.width - this.width
        }
        if (this.position.y+this.height+this.velocity.y >= canvas.height-96){
            this.velocity.y = 0
            this.position.y = 330
        }else if (this.position.y+this.velocity.y <= 0){
            this.velocity.y+=gravity
            this.position.y = 0
        }else this.velocity.y+=gravity
    }

    attack(){
        if (this.facing===1)this.switchSprite("attack")
        else this.switchSprite("attack_left")
        // this.switchSprite("attack")
        this.isAttacking = true
    }

    takeHit(){
        this.health-=5
        if (this.health <=0){
            this.switchSprite("death")
        }else this.switchSprite("react")
    }

    switchSprite(sprite){
        if(this.imageSrc===this.sprites.attack.imageSrc && this.currentFrame < this.sprites.attack.frames - 1) return
        if(this.imageSrc===this.sprites.react.imageSrc && this.currentFrame < this.sprites.react.frames - 1) return
        if(this.imageSrc===this.sprites.death.imageSrc) {
            if (this.currentFrame === this.sprites.react.frames - 1)this.dead = true
            return
        }
        switch(sprite){
            case "idle":
                if(this.imageSrc!==this.sprites.idle.imageSrc){
                    this.imageSrc = this.sprites.idle.imageSrc
                    this.frames = this.sprites.idle.frames
                    this.currentFrames = 0
                }
                break
                case "idle_left":
                    if(this.imageSrc!==this.sprites.idle_left.imageSrc){
                        this.imageSrc = this.sprites.idle_left.imageSrc
                        this.frames = this.sprites.idle_left.frames
                        this.currentFrames = 0
                    }
                    break
            case "run":
                if(this.imageSrc!==this.sprites.run.imageSrc){
                    this.imageSrc = this.sprites.run.imageSrc
                    this.frames = this.sprites.run.frames
                    this.currentFrames = 0
                }
                break
            case "run_left":
                if(this.imageSrc!==this.sprites.run_left.imageSrc){
                    this.imageSrc = this.sprites.run_left.imageSrc
                    this.frames = this.sprites.run_left.frames
                    this.currentFrames = 0
                }
                break
            case "j_up":
                if(this.imageSrc!==this.sprites.j_up.imageSrc){
                    this.imageSrc = this.sprites.j_up.imageSrc
                    this.frames = this.sprites.j_up.frames
                    this.currentFrames = 0
                }
                break
            case "j_down":
                if(this.imageSrc!==this.sprites.j_down.imageSrc){
                    this.imageSrc = this.sprites.j_down.imageSrc
                    this.frames = this.sprites.j_down.frames
                    this.currentFrames = 0
                }
                break
            case "j_up_left":
                if(this.imageSrc!==this.sprites.j_up_left.imageSrc){
                    this.imageSrc = this.sprites.j_up_left.imageSrc
                    this.frames = this.sprites.j_up_left.frames
                    this.currentFrames = 0
                }
                break
            case "j_down_left":
                if(this.imageSrc!==this.sprites.j_down_left.imageSrc){
                    this.imageSrc = this.sprites.j_down_left.imageSrc
                    this.frames = this.sprites.j_down_left.frames
                    this.currentFrames = 0
                }
                break
            case "attack":
                if(this.imageSrc!==this.sprites.attack.imageSrc){
                    this.imageSrc = this.sprites.attack.imageSrc
                    this.frames = this.sprites.attack.frames
                    this.currentFrames = 0
                }
                break
            case "attack_left":
                if(this.imageSrc!==this.sprites.attack_left.imageSrc){
                    this.imageSrc = this.sprites.attack_left.imageSrc
                    this.frames = this.sprites.attack_left.frames
                    this.currentFrames = 0
                }
                break
            case "react":
                if(this.imageSrc!==this.sprites.react.imageSrc){
                    this.imageSrc = this.sprites.react.imageSrc
                    this.frames = this.sprites.react.frames
                    this.currentFrames = 0
                }
                break
            case "death":
                if(this.imageSrc!==this.sprites.death.imageSrc){
                    this.imageSrc = this.sprites.death.imageSrc
                    this.frames = this.sprites.death.frames
                    this.currentFrames = 0
                }
                break
        }
    }
}