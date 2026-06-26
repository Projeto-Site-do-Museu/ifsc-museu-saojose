export default class Abertura extends Phaser.Scene {
  
    constructor () {
    super('Abertura')
  }

  preload () {
    this.load.setBaseURL('public/assets/')
    this.load.image('fundoAbertura', 'telas/tela_inicial_1280x720.png')
  } 

  create () {
    const { width, height } = this.scale

    const fundoAbertura = this.add.image(width / 2, height / 2, 'fundoAbertura')

    const scaleX = width / fundoAbertura.width
    const scaleY = height / fundoAbertura.height

    const scale = Math.max(scaleX, scaleY)

    fundoAbertura.setScale(scale)
    .setInteractive()
      .on('pointerdown', () => {
      this.scene.start('Menu')  
    })
  }

  update () {
  }
}