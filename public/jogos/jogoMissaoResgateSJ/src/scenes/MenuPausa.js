export default class MenuPausa extends Phaser.Scene {

    constructor() {
        super('MenuPausa')
    }

    preload() {
        //Sprites do menu em jogo
        this.load.image('menuPausa', 'public/assets/telas/menu/menuPausa.png');
        this.load.image('reiniciar', 'public/assets/telas/menu/reiniciar.png');
        this.load.image('voltar', 'public/assets/telas/menu/voltar.png');
        this.load.image('menos', 'public/assets/telas/menu/btn_menos.png');
        this.load.image('mais', 'public/assets/telas/menu/btn_mais.png');
        this.load.spritesheet('volume', 'public/assets/telas/menu/volumeMenu.png', { frameWidth: 485, frameHeight: 138 });
        this.load.spritesheet('indicadorDificuldade', 'public/assets/telas/menu/Dificuldade.png', { frameWidth: 612, frameHeight: 100 });
    }


    create() {
        const { width, height } = this.scale

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setScrollFactor(0)

        const centroX = width / 2;

        // Mapeamento da dificuldade para o frame do sprite (mesma ordem do configuracoes.js)
        const dificuldades = ['pacifica', 'facil', 'normal', 'dificil']
        const dificuldadeAtual = window.dificuldade || 'normal'
        let frameIndicador = dificuldades.indexOf(dificuldadeAtual)
        if (frameIndicador === -1) frameIndicador = 2 // fallback: normal

        // Sprite de dificuldade acima do menu
        this.add.image(centroX, 140, 'indicadorDificuldade', frameIndicador)
            .setScrollFactor(0)

        // Texto orientando o jogador
        this.add.text(centroX, 60, 'Vá nas configurações no Menu principal para alterar a dificuldade', {
            fontSize: '20px',
            color: '#ffffff',
            alpha: 0.8,
            align: 'center',
            wordWrap: { width: 600 }
        })
            .setOrigin(0.5, 0)
            .setScrollFactor(0)

        const conjuntoMenu = this.add.container(width / 2, height / 2);
        const menu = this.add.image(centroX, 420, 'menuPausa')
        menu.setScale(0.7);

        const reiniciar = this.add.image(centroX, 350, 'reiniciar')
        reiniciar.setScale(0.7)
            .setInteractive();

        const voltar = this.add.image(width / 2.0, 460, 'voltar')
        voltar.setScale(0.4)
            .setInteractive();

        const volume = this.add.sprite(centroX + 3, 560, 'volume', 2)
        volume.setScale(0.7)
            .setOrigin(0.5)
            .setScrollFactor(0);

        const botaoMenos = this.add.image(centroX - 180, 560, 'menos')
            .setScale(0.3)
            .setInteractive()

        const botaoMais = this.add.image(centroX + 180, 560, 'mais')
            .setScale(0.3)
            .setInteractive()

        const jogo = this.scene.get('Jogo');
        const atualizarVolumeVisual = () => {
            const indice = jogo.soundManager._indiceVolume

            // inverte porque o spritesheet está ao contrário
            volume.setFrame(4 - indice)
        }

        atualizarVolumeVisual()

        reiniciar.on('pointerover', () => {
            reiniciar.setTint(0xE6B967);
            this.tweens.add({
                targets: reiniciar,
                scale: 0.77,
                duration: 100
            });
        });
        reiniciar.on('pointerout', () => {
            reiniciar.clearTint();

            this.tweens.add({
                targets: reiniciar,
                scale: 0.7,
                duration: 100
            });
        });
        reiniciar.on('pointerdown', () => {
            this.scene.stop('Jogo');
            this.sound.stopAll();
            this.scene.start('Jogo');

        });




        voltar.on('pointerover', () => {
            voltar.setTint(0xE6B967);
            this.tweens.add({
                targets: voltar,
                scale: 0.44,
                duration: 100
            });
        });

        voltar.on('pointerout', () => {
            voltar.clearTint();

            this.tweens.add({
                targets: voltar,
                scale: 0.4,
                duration: 100
            });
        });

        voltar.on('pointerdown', () => {
            const jogo = this.scene.get('Jogo')
            if (jogo && jogo.soundManager) {
                jogo.soundManager.destroy()
            }
            this.sound.stopAll()
            this.scene.stop('Jogo')
            this.scene.stop('MenuPausa')
            this.scene.start('Menu')
        });

        botaoMenos.on('pointerover', () => {
            botaoMenos.setTint(0xE6B967)

            this.tweens.add({
                targets: botaoMenos,
                scale: 0.35,
                duration: 100
            })
        })

        botaoMenos.on('pointerout', () => {
            botaoMenos.clearTint()

            this.tweens.add({
                targets: botaoMenos,
                scale: 0.3,
                duration: 100
            })
        })
        botaoMenos.on('pointerdown', () => {
            jogo.soundManager.diminuirVolume()
            atualizarVolumeVisual()
        })

        botaoMais.on('pointerover', () => {
            botaoMais.setTint(0xE6B967)

            this.tweens.add({
                targets: botaoMais,
                scale: 0.35,
                duration: 100
            })
        })

        botaoMais.on('pointerout', () => {
            botaoMais.clearTint()

            this.tweens.add({
                targets: botaoMais,
                scale: 0.3,
                duration: 100
            })
        })
        botaoMais.on('pointerdown', () => {
            jogo.soundManager.aumentarVolume()
            atualizarVolumeVisual()
        })

        // ESC para voltar
        const sairMenu = this.input.keyboard.once('keydown-ESC', () => {
            this.scene.resume('Jogo')
            this.scene.stop()
        })
    }
}
