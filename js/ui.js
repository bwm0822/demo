
class UIBase
{
    static layer = null;
    constructor(scene)
    {
        if(!UIBase.layer) 
        {
            UIBase.layer = scene.add.layer(); 
            UIBase.layer.name = 'uiLayer';
        }
        this.x = game.config.width/2;
        this.y = game.config.height/2;
        this.scene = scene;
        this.root = null;
    }

    text(text='', fontSize=24, fontFamily=FONT, other={})    
    {
        return this.scene.add.text(0,0,text,{fontSize:fontSize,fontFamily:fontFamily,...other});
    }

    rect(color=COLOR_PRIMARY, radius=10, alpha=1)
    {
        return this.scene.rexUI.add.roundRectangle(0,0,0,0,radius,color,alpha);
    }

    sprite(atlas, frame, name)
    {
        let sprite = this.scene.add.sprite(0,0,atlas,frame);
        if(name) {sprite.name=name;}
        return sprite;
        //return this.scene.add.sprite(0,0,atlas,frame);
    }

    getLayer()
    {
        return this.root.getLayer();
    }

    addLayer()
    {
        UIBase.layer.add(this.root.getLayer());
    }

}

class UIMain extends UIBase
{
    static instance = null;
    constructor(scene)
    {
        super(scene);
        UIMain.instance = this;
        this.root = scene.rexUI.add.overlapSizer({space:0})
            .addBackground(this.rect(0, 0, 0))
            .add(this.createBar(),{align:'left-top',expand:{width:true}})
            .layout()//.drawBounds(this.scene.add.graphics(), 0xff0000);
        
        this.onResize();
        //scene.scale.on('resize', this.onResize, this);
        this.addLayer();
    }

    onResize()
    {
        let viewport = this.scene.rexUI.viewport;
        this.root.setPosition(viewport.centerX, viewport.centerY)
                .setMinSize(viewport.width, viewport.height)
                .layout()
    }

    createBar()
    {
        let bar = this.scene.rexUI.add.sizer(0,0,0,0,{orientation: 'x'})
                    .addBackground(this.rect(0xffffff, 0, 0.25))
                    .add(this.scene.rexUI.add.buttons({
                        buttons:[this.sprite('iconPack','iconPack_27', 'info'),
                                this.sprite('iconPack','iconPack_161', 'bag')],
                        }),{proportion: 1,key:'group_1'})
                    .add(this.scene.rexUI.add.buttons({
                        buttons:[this.sprite('iconPack','iconPack_123')],
                        }),{proportion: 0,key:'group_2'})
                    .layout()

        bar.getElement('group_1').on('button.click', (button, index, pointer, event)=>{
            switch(button.name)
            {
                case 'info': break;
                case 'bag': UIBag.show(); break;
            }
        })
        .on('button.down', (button)=>{button.setAlpha(0.5);})
        .on('button.up', (button)=>{button.setAlpha(1);})
        //.on('button.out', function (button) {button.setAlpha(1);});

        bar.getElement('group_2').on('button.click', (button, index, pointer, event)=>{
            if(this.scene.scale.isFullscreen)
            {
                button.setFrame('iconPack_123');
                this.scene.scale.stopFullscreen();
            }
            else
            {
                button.setFrame('iconPack_3');
                this.scene.scale.startFullscreen();
            }
        })
        .on('button.down', (button)=>{button.setAlpha(0.5);})
        .on('button.up', (button)=>{button.setAlpha(1);})

        return bar;

    }
}


class UIBag extends UIBase
{
    static instance = null;
    constructor(scene, cSize, orientation)
    {
        super(scene);
        UIBag.instance = this;
        this.cSize = cSize;
        this.root = scene.rexUI.add.sizer(this.x,this.y,{orientation:orientation==0?1:0,space:5})
            .addBackground(this.rect())
            .add(this.createHeader(),{ proportion: 0, expand: true, key:'header'})
            .add(this.createPanel(cSize, orientation),{key:'panel'})
            .layout()//.drawBounds(this.scene.add.graphics(), 0xff0000);

        this.hide();
        this.addLayer();
    }

    createHeader()
    {
        let header = this.scene.rexUI.add.sizer(0,0,0,0,{orientation: 0})
            .add(this.scene.rexUI.add.label({text:this.text('背包',20),space:{left:10}}),{proportion:1})
            .add(this.scene.rexUI.add.buttons({buttons:[this.scene.add.sprite(0,0,'iconPack','iconPack_168').setDisplaySize(20,20)]}),{key:'btn-close'})
        
        header.getElement('btn-close')
        .on('button.click', ()=>{this.hide();})
        .on('button.down', (button)=>{button.setAlpha(0.5);})
        //.on('button.over', (button)=>{button.getElement('icon').setAlpha(0.5);})
        .on('button.out', (button)=>{button.setAlpha(1);});

        return header;
    }

    createPanel(cSize, orientation)
    {
        let left = 5, right = 5, top = 5, bottom = 5;
        let row = 4, col = 5;
        let space = 5;
        let w = (cSize + space) * col - space + left + right;
        let h = (cSize + space) * row - space + top + bottom;

        this.scroll = this.scene.rexUI.add.scrollablePanel({
            //name: 'panel',
            x: 0,
            y: 0,
            width: w,
            height: h,
            scrollMode: orientation,
            background: this.rect(COLOR_LIGHT, 0),
            panel: {child: this.createCells(space, orientation)},
            space: {left:left, right:right, top:top, bottom:bottom, panel:0},
            slider: {
                track: this.rect(COLOR_PRIMARY,5),
                thumb: this.rect(COLOR_DARK, 5),
                //position: 'left'
            },
        })
        
        return this.scroll;
    }

    createCells(space, orientation=0)
    {
        this.cells = this.scene.rexUI.add.fixWidthSizer({
            name: 'cells',
            orientation: orientation, 
            space: {item:space, line:space}
        })
        .setChildrenInteractive()
        .on('child.click', function (child, index, pointer, event) {
            UIItem.show(Bag.items[child.name]);
        })
        .on('child.over', function (child) {
            child.getElement('background').setStrokeStyle(4, 0xff0000);
        })
        .on('child.out', function (child) {
            child.getElement('background').setStrokeStyle();
        })
        //.on('child.pressstart', function (child) {child.setScale(0.8);})

        return this.cells;
    
    }

    cell(i, cSize, icon, count)
    {
        let [atlas, frame] = icon.split('/');
        let cell = this.scene.rexUI.add.badgeLabel({
            name: i,
            space: { left: 5, right: 5, top: 5, bottom: 5 },
            background: this.rect(0xa4d4ff, 10),
            //main: scene.add.sprite(0, 0, atlas, frame).setDisplaySize(cSize-10,cSize-10),
            main: this.scene.rexUI.add.overlapSizer(0,0,cSize-10,cSize-10)
                    .add(this.sprite(atlas,frame),{aspectRatio:true}),
            rightBottom: this.text(count, 14, FONT,{
                            color: 'yellow',
                            align: 'right',
                            backgroundColor: '#260e04',
                            padding: { left: 3, right: 3, top: 0, bottom: 0 }
                        })
            });
        return cell;
    }

    add(items)
    {
        items.forEach((item,i) => {
            let data = ItemDB.get(item.id);
            this.cells.add(this.cell(i,this.cSize, data.icon, item.count));
        });
        this.root.layout()//.drawBounds(this.scene.add.graphics(), 0xff0000);
    }

    show()
    {
        this.cells.clear(true);
        this.root.show();
        this.add(Bag.items);
        this.root.modal({cover: {color: 0x0,alpha: 0.5,}})
        this.scene.children.bringToTop(this.getLayer());
    }

    hide()
    {
        this.root.hide();
    }

    refresh()
    {
        if(this.root.visible){this.show();}
    }

    static show()
    {
        if(UIBag.instance) {UIBag.instance.show();}
    }

    static hide()
    {
        if(UIBag.instance) {UIBag.instance.hide();}
    }

    static refresh()
    {
        if(UIBag.instance) {UIBag.instance.refresh();}
    }
}

class UIItem extends UIBase
{
    static instance = null;
    constructor(scene)
    {
        super(scene);
        UIItem.instance = this;
        this.root = scene.rexUI.add.sizer(this.x,this.y,{orientation:'y',space:{left:5,right:5,top:5,bottom:5,item:5}})
            .addBackground(this.rect().setStrokeStyle(5, COLOR_DARK))
            .add(this.createHeader(),{align:'right'})
            .add(this.createName(),{key:'name', expand:true})
            .add(this.createIcon(),{key:'icon'})
            .add(this.createDescript(),{key:'descript', expand:true})
            .add(this.createAction(),{key:'action'})
            .layout()//.drawBounds(this.scene.add.graphics(), 0xff0000);
            //.setChildrenInteractive();  // 阻斷click事件傳遞到下層UI
        this.hide();

        this.item;
        this.addLayer();
    }

    hide()
    {
        this.root.hide();
    }

    createHeader()
    {
        let btn = this.scene.rexUI.add.buttons({buttons:[this.scene.add.sprite(0,0,'iconPack','iconPack_168').setDisplaySize(20,20)]});
        
        btn.on('button.click', ()=>{this.hide();})
        .on('button.down', (button)=>{button.setAlpha(0.5);})
        //.on('button.over', (button)=>{button.getElement('icon').setAlpha(0.5);})
        .on('button.out', (button)=>{button.setAlpha(1);});

        return btn;
    }

    createName()
    {
        return this.scene.rexUI.add.label({
            background: this.rect(COLOR_DARK, 0),
            text: this.text(),
            align: 'center'
        });
    }

    createIcon()
    {
        return this.scene.rexUI.add.badgeLabel({
            space: 0,
            background: this.rect(COLOR_LIGHT, 0),
            main: this.scene.rexUI.add.overlapSizer(0,0,200,100)
                    .add(this.sprite(),{aspectRatio:true, key:'texture'}),
            rightBottom: this.text('', 20, FONT, {
                            backgroundColor: '#260e04',
                            padding: {left: 5, right: 5, top: 5, bottom: 5}
                        })
        })
    }

    createDescript()
    {
        return this.scene.rexUI.add.textArea({
            x: 0,
            y: 0,
            //width: undefined,
            height: 100,
            scrollMode: 'y',
            background: this.rect(COLOR_DARK, 0),
            //text: this.scene.rexUI.wrapExpandText(this.text('',16)),
            text: this.text('',16),
            space: {left:5, right:5, top:5, bottom:5, panel:0},
            slider: {
                track: this.rect(COLOR_PRIMARY,5),
                thumb: this.rect(COLOR_LIGHT, 5),
                // position: 'left'
            },
            //content:'test',
        });
    }

    createAction()
    {
        let act = this.scene.rexUI.add.buttons({buttons:[
            this.text('[使用]',16),
            this.text('[丟棄]',16),
            ],
            space:{item:30}
        })

        act.on('button.click', (button, index, pointer, event)=>{
            if(index==0) {this.useItem();}
            else if(index==1) {this.dropItem();}
        })
        .on('button.down', function (button) {button.setAlpha(0.5);})
        .on('button.up', function (button) {button.setAlpha(1);})
        .on('button.out', function (button) {button.setAlpha(1);});

        return act;
    }

    useItem()
    {
        this.hide();
        Player.useItem(this.item.id);
        UIBag.refresh();
    }

    async dropItem()
    {
        try
        {
            let cnt = 1;
            if(this.item.count > 1)
            {
                cnt = await UICount.show(1,this.item.count,1);
            }
            Player.drop(this.item.id, cnt);
            UIBag.refresh();
            this.hide();
        }
        catch(e)
        {
            console.log('cancel');
        }
    }


    show(item)
    {
        this.item = item;
        this.root.show();
        let data = ItemDB.get(item.id);
        let [atlas, frame] = data.icon.split('/');
        this.root.getElement('name').setText(data.name);
        this.root.getElement('texture',true).setTexture(atlas, frame);
        this.root.getElement('icon').getElement('rightBottom').setText(item.count);
        //this.root.getElement('descript').getElement('panel').setText(data.descript);
        this.root.getElement('descript').setText(data.descript);
        this.root.layout()//.drawBounds(this.scene.add.graphics(), 0xff0000);
        this.root.modal({cover: {color: 0x0,alpha: 0.5,}});

        this.root.setInteractive();

        this.scene.children.bringToTop(this.getLayer());
    }

    hide()
    {
        this.root.hide();
    }

    static show(item)
    {
        if(UIItem.instance) {UIItem.instance.show(item);}
    }

    static hide()
    {
        if(UIItem.instance) {UIItem.instance.hide();}
    }
}

class UICount extends UIBase
{
    static instance = null;
    constructor(scene)
    {
        super(scene);
        UICount.instance = this;
        this.range = 0;
        this.min = 0;
        this.count = 0;
        this.reject;
        this.resolve;

        this.root = scene.rexUI.add.sizer(this.x,this.y, 200, 50,{orientation:'y',space:5})
            .addBackground(this.rect())
            .add(this.label(),{key:'label'})
            .add(this.createButtons(),{key:'button'})
            .layout()//.drawBounds(this.scene.add.graphics(), 0xff0000);

        this.hide();
        this.addLayer();
    }

    label()
    {
        return this.scene.rexUI.add.sizer({orientation: 'x'})
            .add(this.slider(),{key:'slider', padding:5})
            .add(this.scene.rexUI.add.label({
                width: 40,
                height: 30,
                background: this.rect(COLOR_LIGHT,5),
                text: this.text('0',20),
                align: 'center',
                //space: 10,
            }),{key:'text',padding:5})
    }

    slider()
    {
        let slider = this.scene.rexUI.add.slider({
            orientation: 'x',
            width: 150,
            //value: 0,
            track: this.rect(COLOR_DARK, 10),
            thumb: this.rect(COLOR_LIGHT, 15),
            input: 'drag',
            //gap: 0,
            valuechangeCallback:  (value) =>{
                this.count = Math.round((value * this.range) + this.min);
                this.root?.getElement('text',true)?.setText(this.count).layout();
            }
        })
        //.setDepth(1);

        return slider;
    }

    createButtons()
    {
        let act = this.scene.rexUI.add.buttons({buttons:[
            this.text('[取消]',16),
            this.text('[確定]',16),
            ],
            space:{item:30}
        })

        act.on('button.click', (button, index, pointer, event)=>{
            if(index==0) {this.hide();this.reject();}
            else if(index==1) {this.hide();this.resolve(this.count);}
        })
        .on('button.down', function (button) {button.setAlpha(0.5);})
        .on('button.up', function (button) {button.setAlpha(1);})
        .on('button.out', function (button) {button.setAlpha(1);});

        return act;
    }

    show(min,max,step)
    {
        let slider = this.root.getElement('slider',true);
        this.min = min;
        this.range = max - min;
        slider.gap = step / (max - min);
        slider.value = 0;
        slider.value = 1;

        this.root.show()
        .modal({cover: {color: 0x0,alpha: 0.5,}})

        return new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        })

    }

    hide()
    {
        this.root.hide();
    }

    static show(min,max,step)
    {
        if(UICount.instance) {return UICount.instance.show(min,max,step);}
    }
}

class UIMessage extends UIBase
{
    static instance = null;
    constructor(scene)
    {
        super(scene);
        UIMessage.instance = this;
        this.root = scene.rexUI.add.toast({
            x: this.x,
            y: this.y*2,
    
            background: this.rect(0, 10, 0.5),
            text: this.text(),
            space: 10,
    
            duration: {
                in: 250,
                hold: 1000,
                out: 250,
            },
        }).setOrigin(0.5, 1);

        this.addLayer();
    }

    show(text)
    {
        this.root.showMessage(text).bringToTop();
    }

    static show(text)
    {
        if(UIMessage.instance) {UIMessage.instance.show(text);}
    }
}