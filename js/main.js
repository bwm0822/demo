const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const FONT = "arial";

class Main extends Phaser.Scene
{    
    constructor()
    {
        super({ key: "Main" });

        // super({
        //     key: 'Main',
        //     physics: {
        //         matter: {
        //             debug: true,
        //         }
        //     }
        // });
    }
    
    preload()
    {
        this.load.image("sky","assets/sky.png");
        this.load.image("ground","assets/platform.png");
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('btn', 'assets/20.png');
        this.load.image('bar', 'assets/bar.png');
        this.load.image('icon', 'assets/政_拜登.jpg');
        //Player.preload(this);
        this.load.atlas('dude', 'assets/dude.png', 'assets/dude_atlas.json');
        this.load.atlas('itemPack', 'assets/ItemPack.png', 'assets/ItemPack_atlas.json');
        this.load.atlas('iconPack', 'assets/iconPack.png', 'assets/iconPack_atlas.json');
        this.load.spritesheet('iconP', 'assets/iconPack.png', { frameWidth: 48, frameHeight: 48 });
        this.load.animation('dude_anim', 'assets/dude_anim.json');
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });   

        this.load.plugin('rexcirclemaskimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcirclemaskimageplugin.min.js', true);
        
        this.load.image('tiles', 'assets/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
    }

    create()
    {


        this.createMap();

        this.gameLayer = this.add.layer();
        this.gameLayer.name = 'gameLayer';
        

        this.createInteractable();

        //new Role(this, 'dude', 100, 100);
        this.role = new Player(this, 'dude', 300, 300);
        this.physics.add.collider(this.role, this.mapCol);

        // this.add.sprite(100, 300, 'itemPack','itempack_1').setInteractive()
        // .on('pointerdown', () => {console.log('itempack_1')})
        // .on('pointerover', () => {console.log('over')})
        //this.gameLayer.add([this.role]);
        this.createUI();
        console.log(this.gameLayer);

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });

    }

    update()
    {
        this.graphics.clear();
        this.role.update();
    }

    createUI()
    {

        new UIBag(this, 60, 0);
        new UIItem(this, 200, 200);
        new UICount(this, 200, 200);

        const btn = this.add.sprite(0,0,'iconPack','iconPack_123').setOrigin(0,0).setInteractive();
        btn.on('pointerup', ()=>{
            if(this.scale.isFullscreen)
            {
                btn.setFrame('iconPack_123').setOrigin(0,0);
                this.scale.stopFullscreen();
            }
            else
            {
                btn.setFrame('iconPack_3').setOrigin(0,0);
                this.scale.startFullscreen();
            }
        });



        this.rexUI.add.roundRectangle(100,0,100,50,10,0x003c8f).setOrigin(0,0).setInteractive()
        .on('pointerdown', () => {
            //scroll.add([{icon:'itemPack/itempack_1',count:2}]);
            UIBag.show();
            //UIItem.show(Bag.items[0]);
            //UICount.show(1,5,1);
        });

        //this.children.bringToTop(this.uiLayer);
        
    }

    createMap()
    {
        this.mapLayer = this.add.layer();
        this.mapLayer.name = 'mapLayer';
        let map = this.make.tilemap({key: 'map'});
        this.tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles');
        this.layer1 = map.createLayer('Tile Layer 1', this.tileset, 0, 0);
        //this.layer1.setCollisionByProperty({collides: true});
        //this.layer1.setCollisionBetween(68, 68);
        this.mapLayer.add(this.layer1);
        this.setMapCollisions(map);
    }

    setMapCollisions(map)
    {
        this.mapCol = this.physics.add.staticGroup();
        map.forEachTile((tile) => {
            let tD = tile.tileset.tileData[tile.index-1];
            if(tD)
            {
                //console.log(tile.index);
                tD.objectgroup.objects.forEach((obj) => {
                    let colBoxX = tile.pixelX + obj.x;
                    let colBoxY = tile.pixelY + obj.y;
                    let colBoxW = obj.width;
                    let colBoxH = obj.height;
                    //console.log(colBoxX, colBoxY, colBoxW, colBoxH);
                    let t = this.add.zone(colBoxX+(colBoxW/2),colBoxY+(colBoxH/2), colBoxW,colBoxH);
                    //this.physics.add.existing(t, true)
                    this.mapCol.add(t);
                    this.mapLayer.add(t);
                });
            }
        })
    }

    createInteractable()
    {
        this.interactables = this.physics.add.group();
        new ItemDrop(this, 'bomb', 400, 300);
        new ItemDrop(this, 'itempack_0', 400, 200);
    }



}