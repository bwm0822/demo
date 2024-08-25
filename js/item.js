

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
        scene.add.existing(this);
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



class ItemDrop_old
{
    constructor(scene, id, x, y) 
    {
        this.scene = scene;
        this.data = ItemDB.get(id);
        this.id = id;
        let [atlas, frame] = this.data.icon.split('/'); 
        this.sprite = scene.add.sprite(0,0,atlas,frame)
                    .setInteractive()
                    .on('pointerdown', () => {this.pickup();});
        this.sprite.x = x;
        this.sprite.y = y;
        //scene.physics.world.enable(this.sprite);
        scene.interactables.add(this.sprite);
        scene.gameLayer.add(this.sprite);
        this.updateDepth();
    }

    updateDepth()
    {
        let depth = this.sprite.y + this.sprite.height/2;
        this.sprite.setDepth(depth);
    }

    pickup()
    {
        Bag.add(this.id, 1);
        this.destroy();
    }

    destroy()
    {
        this.sprite.destroy();
        Object.keys(this).forEach((key) => this[key]=undefined);

    }
}