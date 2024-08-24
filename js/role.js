
// class Role_old extends Phaser.GameObjects.Container
// {
//     static instance = null;
//     constructor(scene, id, x, y)
//     {
//         super(scene, x, y);
//         Role.instance = this;
//         this.scene = scene;
//         let data = RoleDB.get(id);

//         let [atlas, frame] = data.icon.split('/');
//         this.sprite = scene.add.sprite(0, 0, atlas,frame);
//         this.add([this.sprite]);
//         this.setSize(this.sprite.width, this.sprite.height);
//         scene.add.existing(this);
//         scene.physics.world.enable(this);
//         scene.gameLayer.add(this);
//         //this.body.setCollideWorldBounds(true);
        
//         this.createHp(scene, 30, 3);
//         this.createDetect(scene);
//         this.createKeys(scene);

//         this.setInteractive();
        
//         //this.createAnim();
//     }

//     createDetect(scene)
//     {
//         this.rect = scene.add.zone(20, 0, 25, 25);
//         scene.physics.add.existing(this.rect);
//         this.add(this.rect);
//         scene.physics.add.overlap(this.rect, scene.interactables, this.ontouch, null, this);
//     }

//     ontouch(a,b)
//     {
//         //console.log('touch',a,b);
//     }

//     updateDetect(vx,vy)
//     {
//         if (vx>0){this.rect.x=20;this.rect.y=0;}
//         else if (vx<0){this.rect.x=-20;this.rect.y=0;}
//         else if (vy<0){this.rect.x=0;this.rect.y=-20;}
//         else if (vy>0){this.rect.x=0;this.rect.y=20;}
//     }

//     updateDepth()
//     {
//         let depth = this.y + this.height/2;
//         this.setDepth(depth);
//         this.debug(depth.toFixed(1));
//     }

//     createHp(scene, w, h)
//     {
//         this.hp_w = w;
//         this.hp_h = h;
//         this.hbar = scene.add.image(-this.hp_w/2,-30,'bar');
//         this.hbar.displayWidth = w;
//         this.hbar.displayHeight = h;
//         this.hbar.setOrigin(0,0.5);
//         this.setDataEnabled();
//         this.data.set({'hp':100, 'hpmax':100});
//         this.add(this.hbar);
//     }

//     hp()
//     {
//         this.hbar.displayWidth = this.hp_w * this.data.values.hp / this.data.values.hpmax;
//     }

//     createKeys(scene)
//     {
//         this.press={left:0, right:0, up:0, down:0};
//         this.keys = scene.input.keyboard.createCursorKeys();
//     }

//     getPress()
//     {
//         if(this.keys.left.isDown){this.press.left=3;}
//         else{this.press.left=Math.max(0, this.press.left-1);}
//         if(this.keys.right.isDown){this.press.right=3;}
//         else{this.press.right=Math.max(0, this.press.right-1);}
//         if(this.keys.up.isDown){this.press.up=3;}
//         else{this.press.up=Math.max(0, this.press.up-1);}
//         if(this.keys.down.isDown){this.press.down=3;}
//         else{this.press.down=Math.max(0, this.press.down-1);}
//         return this.press;
//     }

//     // createAnim()
//     // {
//     //     this.sprite.anims.create({
//     //         key: 'dude_left',
//     //         frames: this.sprite.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
//     //         frameRate: 10,
//     //         repeat: -1
//     //     });

//     //     this.sprite.anims.create({
//     //         key: 'dude_turn',
//     //         frames: [ { key: 'dude', frame: 4 } ],
//     //         frameRate: 20
//     //     });

//     //     this.sprite.anims.create({
//     //         key: 'dude_right',
//     //         frames: this.sprite.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
//     //         frameRate: 10,
//     //         repeat: -1
//     //     });

//     //     this.sprite.anims.create({
//     //         key: 'dude_walk',
//     //         frames: this.sprite.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
//     //         frameRate: 10,
//     //         repeat: -1
//     //     });
//     // }

//     updateAnim(vx,vy)
//     {
//         if (vx>0)
//         {
//             this.sprite.flipX = false;
//             this.sprite.anims.play('dude_walk', true);
//         }
//         else if (vx<0)
//         {
//             this.sprite.flipX = true;
//             this.sprite.anims.play('dude_walk', true);
//         }
//         else if (vy<0)
//         {
//             this.sprite.flipX = false;
//             this.sprite.anims.play('dude_idle');
//         }
//         else if (vy>=0)
//         {
//             this.sprite.flipX = false;
//             this.sprite.anims.play('dude_idle');
//         }
//     }


//     ctrl()
//     {        
//         this.getPress();

//         let vx=0,vy=0,speed=150;
//         if(this.press.left>0){vx+=-speed;}
//         if(this.press.right>0){vx+=speed;}
//         if(this.press.up>0){vy+=-speed;}
//         if(this.press.down>0){vy+=speed;}
//         this.body.maxSpeed = speed;
//         this.body.setVelocity(vx,vy);

//         this.updateDetect(vx,vy);
//         this.updateAnim(vx,vy);
        
//     }

//     debug(text)
//     {
//         if(!this.dbg)
//         {
//             this.dbg = this.scene.add.text(0,this.height/2,'', {fontSize: '12px', fill: '#fff'});
//             this.add(this.dbg);
//         }
//         this.dbg.setText(text);
//     }

//     debugDraw()
//     {
//         let circle = new Phaser.Geom.Circle(this.x, this.y, 50);
//         this.scene.graphics.strokeCircleShape(circle);
//     }

//     update()
//     {
//         this.ctrl();
//         this.updateDepth();
//         //this.debugDraw();
//     }

//     dropItem(id, count)
//     {
//         Bag.remove(id, count);
//         let x = this.x + Phaser.Math.Between(-20, 20);
//         let y = this.y + Phaser.Math.Between(-20, 20);
//         new ItemDrop(this.scene, id, x, y, count);
//     }

// }

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

    createHp(scene, w, h)
    {
        this.hp_w = w;
        this.hp_h = h;
        this.hbar = scene.add.image(-this.hp_w/2,-30,'bar');
        this.hbar.displayWidth = w;
        this.hbar.displayHeight = h;
        this.hbar.setOrigin(0,0.5);
        this.data.set({'hp':100, 'hpmax':100});
        this.add(this.hbar);
    }

    hp()
    {
        this.hbar.displayWidth = this.hp_w * this.data.values.hp / this.data.values.hpmax;
    }

    updateAnim(vx,vy)
    {
        let anim = this.data.values.anim;
        if (vx>0)
        {
            this.sprite.flipX = false;
            this.sprite.anims.play(anim.walk, true);
        }
        else if (vx<0)
        {
            this.sprite.flipX = true;
            this.sprite.anims.play(anim.walk, true);
        }
        else if (vy<0)
        {
            this.sprite.flipX = false;
            this.sprite.anims.play(anim.idle);
        }
        else if (vy>=0)
        {
            this.sprite.flipX = false;
            this.sprite.anims.play(anim.idle);
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

    dropItem(id, count)
    {
        Bag.remove(id, count);
        let x = this.x + Phaser.Math.Between(-20, 20);
        let y = this.y + Phaser.Math.Between(-20, 20);
        new ItemDrop(this.scene, id, x, y, count);
    }

}


class Player extends Role
{
    static instance = null;
    constructor(scene, id, x, y)
    {
        super(scene, id, x, y);
        Player.instance = this;

        this.createHp(scene, 30, 3);
        this.createDetect(scene);
        this.enableCtrl(scene);
    }

    update()
    {
        this.ctrl();
        this.updateDepth();
        this.debugDraw();
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
        this.updateAnim(vx,vy);
    }

    
    static dropItem(id, count)
    {
        if(Player.instance){Player.instance.dropItem(id, count);}
    }

}