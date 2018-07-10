import 'phaser';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 900,
    height: 700,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);


var player;
var player_animstate;
var cursors;


function preload() {

    this.load.image('bg', 'assets/bg.png');
    this.load.image('johnny', 'assets/johnny.png');
    this.load.image('bubble', 'assets/bubble.png');
    // load our atlasfile
    this.load.atlas('ss', 'assets/spritesheets/ss.png', 'assets/spritesheets/ss.json');

}

function create() {
    console.log(game);
    this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(0, 0, 1230, 700);
    this.cameras.main.setSize(900, 700);
    this.physics.world.setBounds(0, 0, 1230, 700);


    //  This frame is in the 1st atlas file (set0/data0)


    cursors = this.input.keyboard.createCursorKeys();

    this.add.image(1000, config.height - 230, 'johnny');
    var thisbubble = this.add.image(1000, config.height - 590, 'bubble').setAlpha(0.0);;

    this.tweens.add({
        targets: thisbubble,
        y : config.height - 390,
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

    player = this.physics.add.sprite(50, config.height - 160, 'ss').play('idle').setScale(0.5);


    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player);

    // this.cameras.main.followOffset.set(-300, 0);

    this.input.keyboard.on('keydown', function (event) {

        console.log(event.key);

    });


    // this.tweens.add({
    //     targets: this.johnny,
    //     x: 450,
    //     y:0,
    //     duration: 1200,
    //     ease: 'Power2',
    //     yoyo: true,
    //     loop: -1
    // });

}

// UPDATE FUNCTION
function update() {
    player.setVelocity(0);

    var _newstate;


    if (cursors.left.isDown) {
        _newstate = 'moving';
        player.setVelocityX(-300);
        player.setFlipX(true);
        // this.cameras.main.followOffset.x = 300;
    } else if (cursors.right.isDown) {
        _newstate = 'moving';
        player.setVelocityX(300);
        player.setFlipX(false);
        // this.cameras.main.followOffset.x = -300;
    } else {
        _newstate = 'idle';
    }
    update_checkPlayerAnimation(_newstate);
    // Endless movement
    if (player.x < 40 ){
        console.log('outofboundsleft');
        player.x = 1200;
    } 
    
    if (player.x > 1200){
        player.x = 40;
    }
  
}

function update_checkPlayerAnimation(_newstate) {
    // lets check if the animation needs to be changed
    if (player_animstate !== _newstate) {
        player_animstate = _newstate;
        switch (_newstate) {
            case 'moving':
            player.play('run');
                break;
            case 'idle':
            player.play('idle');
                break;

        }
    } else {
        // Do nothing and keep animation going
    }
}