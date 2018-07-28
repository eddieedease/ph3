import 'phaser';




var Game1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function Game1() {
            Phaser.Scene.call(this, {
                key: 'game1',
                active: true,
            });
        },

    preload: function () {

        // the loader
        var progress = this.add.graphics();

        this.load.on('progress', function (value) {

            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, 270, 800 * value, 60);

        });

        this.load.on('complete', function () {

            progress.destroy();

        });

        // load bitmapfont
        this.load.bitmapFont('pixelfont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');


        this.load.image('hud', 'assets/hud.png')

        //this.load.image('picA', 'assets/pics/lance-overdose-loader-eye.png');
        // tilemap json
        this.load.image('tiles', 'assets/tilemaps/tileset.png');

        this.load.tilemapTiledJSON({
            key: 'tileset',
            url: 'assets/tilemaps/tileset.json'
        });

        this.load.spritesheet('walker', 'assets/spritesheets/walker2.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet('playertemplate', 'assets/spritesheets/templatechar.png', {
            frameWidth: 48,
            frameHeight: 56
        });

    },

    create: function () {
        // INPUT KEYBOARD SWITCH GAME
        this.input.keyboard.on('keyup_ONE', function (event) {
            console.log('Starting');
            var game2 = this.scene.get('game2');
            game2.reloadScene();
            this.scene.switch('game2');
        }, this);

        this.debugGraphics = this.add.graphics();


        // loading the json tilemap
        this.map = this.make.tilemap({
            key: 'tileset'
        });



        var tiles = this.map.addTilesetImage('tileset', 'tiles');
        var layer1 = this.map.createStaticLayer(0, tiles, 0, 0);
        this.layercol = this.map.createStaticLayer(2, tiles, 0, 0);

        this.layercol.visible = false;
        this.map.setCollisionBetween(41, 44);


        // walker config form png sequense
        var walkerup = {
            key: 'walkerup',
            frames: this.anims.generateFrameNumbers('walker', {
                start: 64,
                end: 79
            }),
            frameRate: 20,
            repeat: -1
        };

        var walkerdown = {
            key: 'walkerdown',
            frames: this.anims.generateFrameNumbers('walker', {
                start: 0,
                end: 15
            }),
            frameRate: 20,
            repeat: -1
        };

        var walkerside = {
            key: 'walkerside',
            frames: this.anims.generateFrameNumbers('walker', {
                start: 16,
                end: 31
            }),
            frameRate: 20,
            repeat: -1
        };

        var walkeridle = {
            key: 'walkeridle',
            frames: this.anims.generateFrameNumbers('walker', {
                start: 16,
                end: 16
            }),
            frameRate: 20,
            repeat: -1
        };


        this.anims.create(walkerup);
        this.anims.create(walkerdown);
        this.anims.create(walkerside);
        this.anims.create(walkeridle);

        // player
        // walker config form png sequense
        var playerup = {
            key: 'playerup',
            frames: this.anims.generateFrameNumbers('playertemplate', {
                start: 6,
                end: 8
            }),
            frameRate: 5,
            repeat: -1
        };

        var playerdown = {
            key: 'playerdown',
            frames: this.anims.generateFrameNumbers('playertemplate', {
                start: 3,
                end: 5
            }),
            frameRate: 5,
            repeat: -1
        };

        var playerside = {
            key: 'playerside',
            frames: this.anims.generateFrameNumbers('playertemplate', {
                start: 0,
                end: 2
            }),
            frameRate: 5,
            repeat: -1
        };

        var playeridle = {
            key: 'playeridle',
            frames: this.anims.generateFrameNumbers('playertemplate', {
                start: 4,
                end: 4
            }),
            frameRate: 5,
            repeat: -1
        };

        this.anims.create(playerup);
        this.anims.create(playerdown);
        this.anims.create(playerside);
        this.anims.create(playeridle);
         // hud camera
         


        this.cameras.main.setSize(900, 700);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        //this.cameras.main.roundPixels(true);
        
        // the walker
        this.player = this.physics.add.sprite(300, 70, 'playertemplate').setScale(1);


        // collision tileset and player
        this.physics.add.collider(this.player, this.layercol);


        var layer2 = this.map.createStaticLayer(1, tiles, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        // var controlConfig = {
        //     camera: this.cameras.main,
        //     left: this.cursors.left,
        //     right: this.cursors.right,
        //     up: this.cursors.up,
        //     down: this.cursors.down,
        //     speed: 0.5
        // };

        // this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);


        // follow player
        this.cameras.main.startFollow(this.player, true, 0.7, 0.7);

       

        // this.cameras.main.setZoom(2);
        this.cameras.main.roundPixels = true;
        // camera shake
        this.input.on('pointerdown', function () {

            // this.cameras.main.shake(100);
            this.cameras.main.flash();


        }, this);

        this.helpText = this.add.text(16, 16, 'Press 1 | 2', {
            fontSize: '18px',
            fill: '#ffffff'
        });
        this.helpText.setScrollFactor(0);

        this.hud = this.add.image(config.width/2, config.height - 100, 'hud').setScrollFactor(0);

       
        this.missiontext = this.add.bitmapText(500, 560, 'pixelfont', "Status: ", 30).setScrollFactor(0);
        this.missiontext_explain = this.add.bitmapText(500, 590, 'pixelfont', "Exploring...", 20).setScrollFactor(0);
        this.missiontext_explain.setTint(0xFFFFFF);
    },
    update: function (time, delta) {
        // this.controls.update(delta);
        this.player.setVelocity(0);

        var _newstate;


        if (this.cursors.left.isDown) {
            _newstate = 'sideways';
            this.player.setVelocityX(-300);
            this.player.setFlipX(true);
            // this.cameras.main.followOffset.x = 300;
        } else if (this.cursors.right.isDown) {
            _newstate = 'sideways';
            this.player.setVelocityX(300);
            this.player.setFlipX(false);
            // this.cameras.main.followOffset.x = -300;
        } else if (this.cursors.up.isDown) {
            _newstate = 'up';
            this.player.setVelocityY(-300);
            // this.cameras.main.followOffset.x = -300;
        } else if (this.cursors.down.isDown) {
            _newstate = 'down';
            this.player.setVelocityY(300);
            // this.cameras.main.followOffset.x = -300;
        } else {
            _newstate = 'idle';
        }
        this.update_checkPlayerAnimation(_newstate);

        // debug funtion
        // this.debug();

    },
    update_checkPlayerAnimation(_newstate) {
        // lets check if the animation needs to be changed
        if (this.player_animstate !== _newstate) {
            this.player_animstate = _newstate;
            switch (_newstate) {
                case 'sideways':
                    this.player.play('playerside');
                    break;
                case 'idle':
                    this.player.play('playeridle');
                    break;
                case 'up':
                    this.player.play('playerup');
                    break;
                case 'down':
                    this.player.play('playerdown');
                    break;
            }
        } else {
            // Do nothing and keep animation going
        }
    },
    debug() {
        this.debugGraphics.clear();
        this.map.renderDebug(this.debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });
    }


});


var Game2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function Game2() {
            Phaser.Scene.call(this, {
                key: 'game2',
                active: false
            });
        },

    preload: function () {
        // the loader
        var progress = this.add.graphics();

        this.load.on('progress', function (value) {

            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, 270, 800 * value, 60);

        });

        this.load.on('complete', function () {

            progress.destroy();

        });



        this.load.image('bg', 'assets/bg.png');
        this.load.image('johnny', 'assets/johnny.png');
        this.load.image('bubble', 'assets/bubble.png');
        // load our atlasfile
        this.load.atlas('ss', 'assets/spritesheets/ss.png', 'assets/spritesheets/ss.json');

        this.load.audio('audio_bg', [
            'assets/audio/bg1.ogg',
            'assets/audio/bg1.mp3'
        ]);
    },

    create: function () {



        console.log(game);
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, 1230, 700);
        this.cameras.main.setSize(900, 700);
        this.physics.world.setBounds(0, 0, 1230, 700);


        //  This frame is in the 1st atlas file (set0/data0)


        this.cursors = this.input.keyboard.createCursorKeys();

        this.add.image(1000, config.height - 230, 'johnny');
        var thisbubble = this.add.image(1000, config.height - 590, 'bubble').setAlpha(0.0);;

        this.tweens.add({
            targets: thisbubble,
            y: config.height - 390,
            alpha: 1,
            duration: 400,
            ease: 'back',
            //  yoyo: true,
            // delay: 1000,
            // repeat: 2 // set -1 for infinite
        });

        var textureFrames = this.textures.get('ss').getFrameNames();
        var animFrames = [];
        animFrames.push({
            key: 'ss',
            frame: textureFrames[3]
        });
        this.anims.create({
            key: 'idle',
            frames: animFrames,
            repeat: -1
        });

        // all the frames for running
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('ss'),
            repeat: -1
        });


        // // future REFS
        // var config = {
        //     key: 'explode',
        //     frames: this.anims.generateFrameNumbers('boom', { frames: [ 0, 1, 2, 1, 2, 3, 4, 0, 1, 2 ] }),
        //     frameRate: 20
        // };

        this.player = this.physics.add.sprite(50, config.height - 160, 'ss').play('idle').setScale(0.5);


        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player);




        // play some music
        this.bgmusic = this.sound.add('audio_bg');

        this.bgmusic.play();







        // this.cameras.main.followOffset.set(-300, 0);

        this.input.keyboard.on('keydown', function (event) {

            console.log(event.key);

        });

        // Mouseclick to start other event
        this.input.keyboard.on('keyup_TWO', function (event) {

            console.log('Starting');
            this.scene.switch('game1');
            this.bgmusic.stop();
        }, this);


        this.helpText = this.add.text(16, 16, 'Press 1 | 2', {
            fontSize: '18px',
            fill: '#ffffff'
        });
        this.helpText.setScrollFactor(0);
    },
    update: function () {
        //this.pic.rotation -= 0.02;
        this.player.setVelocity(0);

        var _newstate;


        if (this.cursors.left.isDown) {
            _newstate = 'moving';
            this.player.setVelocityX(-300);
            this.player.setFlipX(true);
            // this.cameras.main.followOffset.x = 300;
        } else if (this.cursors.right.isDown) {
            _newstate = 'moving';
            this.player.setVelocityX(300);
            this.player.setFlipX(false);
            // this.cameras.main.followOffset.x = -300;
        } else {
            _newstate = 'idle';
        }
        this.update_checkPlayerAnimation(_newstate);
        // Endless movement
        if (this.player.x < 40) {
            console.log('outofboundsleft');
            this.player.x = 1200;
        }

        if (this.player.x > 1200) {
            this.player.x = 40;
        }
    },

    update_checkPlayerAnimation(_newstate) {

        // lets check if the animation needs to be changed
        if (this.player_animstate !== _newstate) {
            this.player_animstate = _newstate;
            switch (_newstate) {
                case 'moving':
                    this.player.play('run');
                    break;
                case 'idle':
                    this.player.play('idle');
                    break;

            }
        } else {
            // Do nothing and keep animation going
        }
    }

    ,

    shutdown: function () {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();

    },

    reloadScene: function () {

        console.log("yihah");
        if (this.bgmusic) {
            this.bgmusic.play();
        }
        // 
    }



});



var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 900,
    height: 700,
    physics: {
        default: 'arcade',
    },
    scene: [Game1, Game2]
};




var game = new Phaser.Game(config);