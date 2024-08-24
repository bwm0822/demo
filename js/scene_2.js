
class Scene_2 extends Phaser.Scene
{
    constructor()
    {
        super({ key: "scene_2" });
    }

    preload()
    {
        this.load.image('btn', 'assets/20.png');
    }

    create()
    {
        this.createUI(this);
    }

    createUI(scene)
    {
        let btn = scene.add.image(0, 0, 'btn').setOrigin(0,0).setScale(0.25).setInteractive();
        btn.on('pointerdown', () => {
            btn.setTint(0x00ff00);
            console.log('btn clicked');
            scene.scene.start("Main");
        });

        btn.on('pointerup', () => {
            btn.setTint(0xffffff);
            console.log('btn clicked');
        });
    }
}