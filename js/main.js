const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const FONT = "arial";


class test
{
    constructor(x)
    {
        console.log('test',x);    
    }
}

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
        this.createUI();
        this.createMap();

        this.gameLayer = this.add.layer();
        this.gameLayer.name = 'gameLayer';
        
        this.createInteractable();
        this.createPlayer();
        
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
        this.createUICam();
    }

    update()
    {
        this.graphics.clear();
        if(this.player){this.player.update();}
    }

    createUICam()
    {
        this.uiCam = this.cameras.add(0, 0, game.config.width, game.config.height).setName('ui');
        this.uiCam.ignore(this.scene.scene.children.list.filter(layer => layer !== UIBase.layer));
    }

    createPlayer()
    {
        this.player = new Player(this, 'dude', 300, 300);
        this.physics.add.collider(this.player, this.mapCol);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.ignore(UIBase.layer);
    }

    createUI()
    {
        new UIMain(this);
        new UIBag(this, 60, 0);
        new UIItem(this, 200, 200);
        new UICount(this, 200, 200);
        new UIMessage(this, 200, 200);        
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