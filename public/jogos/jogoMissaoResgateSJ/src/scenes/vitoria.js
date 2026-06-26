export default class Vitoria extends Phaser.Scene {
    constructor () {
        super("Vitoria");
    }

    preload () {
        // carrega sua imagem de vitória
        this.load.image("bgVitoria", "public/assets/telas/vitoria.png");
    }

    create () {
        // fundo ocupando a tela inteira
        this.add.image(0, 0, "bgVitoria")
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);

        // clique em qualquer lugar da tela
        this.input.once("pointerdown", () => {
            this.scene.stop('Vitoria')
            this.scene.start('Menu')
        });

    }
}