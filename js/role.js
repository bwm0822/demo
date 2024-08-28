
class Bar extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, w, h, color=0xff0000, s=1)
    {
        super(scene, x, y);
        this.scene = scene;
        this.s = s;
        this.bg = scene.add.rectangle(0,0,w,h,0,0).setStrokeStyle(s, 0xffffff);
        this.bg.setOrigin(0,0.5);
        this.add(this.bg);
        this.fg = scene.add.rectangle(s/2,0,w-s,h-s,color);
        this.fg.setOrigin(0,0.5);
        this.add(this.fg);
        //scene.add.existing(this);
    }

    set(p)
    {
        this.fg.width = (this.bg.width-this.s) * p;
    }
}

class Role extends Phaser.GameObjects.Container
{
    constructor(scene, id, x, y)
    {
        super(scene, x, y);

        this.scene = scene;
        this.setDataEnabled();
        let role = RoleDB.get(id);
        this.data.set({'id':id, 'name':role.name, 'anim':role.anim});
        let [atlas, frame] = role.icon.split('/');
        this.sprite = scene.add.sprite(0, 0, atlas,frame);
        this.add([this.sprite]);
        this.setSize(this.sprite.width, this.sprite.height);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        scene.gameLayer.add(this);
        
        //this.createHp(scene, 30, 3);
        //this.createDetect(scene);
        //this.createKeys(scene);

        this.setInteractive();
    }

    updateDepth()
    {
        let depth = this.y + this.height/2;
        this.setDepth(depth);
        this.debug(depth.toFixed(1));
    }

    createHp(scene)
    {
        this.hp = new Bar(scene, -this.width/2, -this.height/2, this.width, 5);
        this.add(this.hp);
    }

    // updateAnim(vx,vy)
    // {
    //     let anim = this.data.values.anim;
    //     if (vx>0)
    //     {
    //         this.sprite.flipX = false;
    //         this.sprite.anims.play(anim.walk, true);
    //     }
    //     else if (vx<0)
    //     {
    //         this.sprite.flipX = true;
    //         this.sprite.anims.play(anim.walk, true);
    //     }
    //     else if (vy<0)
    //     {
    //         this.sprite.flipX = false;
    //         this.sprite.anims.play(anim.idle);
    //     }
    //     else if (vy>0)
    //     {
    //         this.sprite.flipX = false;
    //         this.sprite.anims.play(anim.idle);
    //     }
    // }

    updateAnim(vx,vy,dir)
    {
        //console.log(vx,vy,dir);
        let anim = this.data.values.anim;
        if (dir=='left')
        {
            this.sprite.flipX = true;
            if(vx > 0){this.sprite.anims.play(anim.forwardRight, true);}
            else if(vx < 0){this.sprite.anims.play(anim.backwardRight, true);}
            else {this.sprite.anims.play(anim.idleRight);}
        }
        else if (dir=='right')
        {
            this.sprite.flipX = false;
            if(vx > 0){this.sprite.anims.play(anim.forwardRight, true);}
            else if(vx < 0){this.sprite.anims.play(anim.backwardRight, true);}
            else {this.sprite.anims.play(anim.idleRight);}
        }
        else if (dir=='up')
        {
            this.sprite.flipX = false;
            if(vy > 0){this.sprite.anims.play(anim.forwardUp, true);}
            else if(vy < 0){this.sprite.anims.play(anim.backwardUp, true);}
            else {this.sprite.anims.play(anim.idleUp);}
        }
        else if (dir=='down')
        {
            this.sprite.flipX = false;
            if(vy > 0){this.sprite.anims.play(anim.forwardDown, true);}
            else if(vy < 0){this.sprite.anims.play(anim.backwardDown, true);}
            else {this.sprite.anims.play(anim.idleDown);}
        }
    }

    debug(text)
    {
        if(!this.dbg)
        {
            this.dbg = this.scene.add.text(0,this.height/2,'', {fontSize: '12px', fill: '#fff'});
            this.add(this.dbg);
        }
        this.dbg.setText(text);
    }

    debugDraw()
    {
        let circle = new Phaser.Geom.Circle(this.x, this.y, 50);
        this.scene.graphics.strokeCircleShape(circle);
    }
}


class Player extends Role
{
    static instance = null;
    constructor(scene, id, x, y)
    {
        super(scene, id, x, y);
        Player.instance = this;

        this.createHp(scene);
        this.createDetect(scene);
        this.enableCtrl(scene);

        let role = RoleDB.get(id);
        this.data.set({hp:role.prop.life, hpmax:role.prop.life});
        this.data.events.on('changedata-hp', ()=>{
            this.hp.set(this.data.values.hp/this.data.values.hpmax);
        });

        this.weapon = new Gun(scene, 5, 10);
        this.add(this.weapon);
        this.dir='down';
    }

    update()
    {
        this.getDir();

        this.ctrl();
        this.updateDepth();
        this.debugDraw();

        if(this.weapon)
        {
            this.weapon.aim(this.getPoint());
            //console.log(Math.abs(this.weapon.rotation), Phaser.Math.TAU);
            if(this.scene.input.activePointer.isDown)
            {
                this.weapon.shoot(this.getPoint());
            }
        }

    }

    damage(dmg)
    {
        this.data.values.hp -= dmg;
        if(this.data.values.hp <= 0)
        {
            this.data.values.hp = 0;
            this.scene.player = null;
            this.destroy();
        }
    }

    createDetect(scene)
    {
        this.rect = scene.add.zone(20, 0, 25, 25);
        scene.physics.add.existing(this.rect);
        this.add(this.rect);
        scene.physics.add.overlap(this.rect, scene.interactables, this.ontouch, null, this);
    }

    updateDetect(vx,vy)
    {
        if (vx>0){this.rect.x=20;this.rect.y=0;}
        else if (vx<0){this.rect.x=-20;this.rect.y=0;}
        else if (vy<0){this.rect.x=0;this.rect.y=-20;}
        else if (vy>0){this.rect.x=0;this.rect.y=20;}

        if(this.dir == 'left'){this.weapon.setPosition(-5, 10);}
        else if(this.dir == 'right'){this.weapon.setPosition(5, 10);}
        else if(this.dir == 'up'){this.weapon.setPosition(0, -5);}
        else if(this.dir == 'down'){this.weapon.setPosition(0,5);}
    }

    enableCtrl(scene)
    {
        this.press={left:0, right:0, up:0, down:0};
        this.keys = scene.input.keyboard.createCursorKeys();
    }

    getPress()
    {
        if(this.keys.left.isDown){this.press.left=3;}
        else{this.press.left=Math.max(0, this.press.left-1);}
        if(this.keys.right.isDown){this.press.right=3;}
        else{this.press.right=Math.max(0, this.press.right-1);}
        if(this.keys.up.isDown){this.press.up=3;}
        else{this.press.up=Math.max(0, this.press.up-1);}
        if(this.keys.down.isDown){this.press.down=3;}
        else{this.press.down=Math.max(0, this.press.down-1);}
        return this.press;
    }

    ctrl()
    {        
        this.getPress();

        let vx=0,vy=0,speed=150;
        if(this.press.left>0){vx+=-speed;}
        if(this.press.right>0){vx+=speed;}
        if(this.press.up>0){vy+=-speed;}
        if(this.press.down>0){vy+=speed;}
        this.body.maxSpeed = speed;
        this.body.setVelocity(vx,vy);

        this.updateDetect(vx,vy);
        this.updateAnim(vx,vy,this.dir);
    }

    drop(id, count)
    {
        Bag.remove(id, count);
        let x = this.x + Phaser.Math.Between(-20, 20);
        let y = this.y + Phaser.Math.Between(-20, 20);
        let data = ItemDB.get(id);
        eval(`new ${data.class}(this.scene, id, x, y, count)`);

        UIMessage.show(`丟棄 ${count} ${data.name}`);
    }

    pickup(item)
    {
        let dist = Phaser.Math.Distance.BetweenPoints(this, item);
        //console.log(dist);
        if(dist < 50)
        {
            Bag.add(item.data.get('id'), item.data.get('count'));
            UIMessage.show(`撿起 ${item.data.get('count')} ${item.data.get('name')}`);
            item.destroy();
        }
    }

    getPoint()
    {
        let x = this.scene.input.activePointer.worldX;
        let y = this.scene.input.activePointer.worldY;
        return {x:x, y:y};
    }

    getDir(x,y)
    {
        if(this.weapon)
        {
            if(Math.abs(this.weapon.rotation) > Phaser.Math.TAU)
            {
                this.dir = 'left';
            }
            else
            {
                this.dir = 'right';
            }
        }
        else
        {
            if(x>0){this.dir = 'right';}
            else if(x<0){this.dir = 'left';}
            else if(y<0){this.dir = 'up';}
            else if(y>0){this.dir = 'down';}
        }
    }

    
    static drop(id, count)
    {
        if(Player.instance){Player.instance.drop(id, count);}
    }

}