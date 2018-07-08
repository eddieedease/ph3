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
var cursors;


function preload() {
    this.load.image('bg', 'assets/bg.png');
    this.load.image('johnny', 'assets/johnny.png');
}

function create() {
    console.log(game);
    this.bg = this.add.image(0, 0, 'bg').setOrigin(0);
   //  Set the camera and physics bounds to be the size of 4x4 bg images
   this.cameras.main.setBounds(0, 0, 1230, 700);
   this.cameras.main.setSize(900, 700);
   this.physics.world.setBounds(0, 0, 1230, 700);


    
 

    cursors = this.input.keyboard.createCursorKeys();

    player =  this.physics.add.image(20, config.height - 230, 'johnny');

    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player);

    // this.cameras.main.followOffset.set(-300, 0);




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

function update ()
{
    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-500);
        player.setFlipX(true);
        // this.cameras.main.followOffset.x = 300;
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(500);
        player.setFlipX(false);
        // this.cameras.main.followOffset.x = -300;
    }

    // if (cursors.up.isDown)
    // {
    //     player.setVelocityY(-500);
    // }
    // else if (cursors.down.isDown)
    // {
    //     player.setVelocityY(500);
    // }
}