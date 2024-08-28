

class ItemDrop extends Phaser.GameObjects.Container
{
    constructor(scene, id, x, y, count=1) 
    {
        super(scene, x, y);
        this.scene = scene;
        let data = ItemDB.get(id);
        this.setDataEnabled();
        this.data.set({'id':id, 'count':count, 'name':data.name});
        let [atlas, frame] = data.icon.split('/'); 
        this.sprite = scene.add.sprite(0,0,atlas,frame)
        this.add([this.sprite]);
        this.setSize(this.sprite.width, this.sprite.height);
        //scene.add.existing(this);
        scene.interactables.add(this);
        scene.gameLayer.add(this);
        
        this.setInteractive().on('pointerup', () => {this.onpointerup();});
        this.updateDepth();
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

    updateDepth()
    {
        let depth = this.y + this.height/2;
        this.setDepth(depth);
        //this.debug(depth.toFixed(1));
    }

    onpointerup()
    {
        if(this.scene.player){this.scene.player.pickup(this);}
    }

}


class Gun extends Phaser.GameObjects.Container
{
    constructor(scene, x, y)
    {
        super(scene, x, y);
        this.scene = scene;
        let sprite = scene.add.rectangle(0, 0, 20, 10, 0xffffff).setOrigin(0, 0.5);
        this.muzzle = scene.add.zone(20,0);
        this.add([sprite, this.muzzle]);
        scene.gameLayer.add(this);
        //this.gun.setDepth(1000)
        //this.updateDepth();
        this.ready = true;

    }

    aim(target)
    {
        let w = this.pWorld(this.muzzle);

        let angle = Phaser.Math.Angle.Between(w.x, w.y, target.x, target.y);
        this.rotation = angle;

        //let line = new Phaser.Geom.Line(w.x, w.y, target.x, target.y);
        //this.scene.graphics.strokeLineShape(line);
    }

    shoot()
    {

        if(this.ready)
        {
            console.log('shoot');
            this.ready = false;
            this.scene.time.delayedCall(250, () => {this.ready = true;});
            this.createBullet();
        } 
    }

    createBullet()
    {
        let w = this.pWorld(this.muzzle);
        new Bullet(this.scene, w.x, w.y, this.rotation);   
    }

    pWorld(p)
    {
        // get position in world space
        if(!this.tempMatrix){this.tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();}
        p.getWorldTransformMatrix(this.tempMatrix)//, this.tempParentMatrix);
        const d = this.tempMatrix.decomposeMatrix();
        return {x:d.translateX, y:d.translateY};
    }

    
}

class Bullet extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, angle)
    {
        super(scene, x, y);
        this.scene = scene;
        let sprite = scene.add.rectangle(-5, 0, 10, 5, 0x00ff00);
        this.add(sprite);
        let r = sprite.height;
        scene.gameLayer.add(this);
        scene.physics.world.enable(this);
        this.body.setCircle(r, -r, -r);
        this.setDepth(1000);
        this.setAngle(angle * Phaser.Math.RAD_TO_DEG);
        this.scene.physics.velocityFromRotation(angle, 250, this.body.velocity);
        this.scene.time.delayedCall(2000, () => {this.destroy();});

        this.collide = scene.physics.add.collider(this, scene.mapCol, () => {this.destroy();});
    }


}