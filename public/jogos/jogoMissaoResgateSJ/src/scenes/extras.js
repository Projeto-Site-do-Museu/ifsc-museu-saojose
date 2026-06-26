export default class Extras extends Phaser.Scene {
  
  constructor () {
    super('Extras')
  }

  preload () {
    this.load.setBaseURL('public/assets/')
    this.load.image('fundoMenu', 'telas/Tela_Menu.png')
    this.load.image('fundoExtras', 'telas/menu/Extras.png')
    this.load.image('botaoVoltarMenu', 'telas/menu/voltar.png')
  }

  create () {
    const { width, height } = this.scale

    // Fundo do menu (atrás do painel)
    const fundoMenu = this.add.image(width / 2, height / 2, 'fundoMenu')
    fundoMenu.setScale(Math.max(width / fundoMenu.width, height / fundoMenu.height))

    // Painel de extras (por cima do fundo)
    const fundoExtras = this.add.image(width / 2, height / 2, 'fundoExtras')

    const scaleX = width / fundoExtras.width
    const scaleY = height / fundoExtras.height
    fundoExtras.setScale(Math.min(scaleX, scaleY))

    // ESCALA DO BOTÃO
    const escalaBotao = 0.5

    // ..:: BOTÃO VOLTAR AO MENU ::..
    const botaoVoltarMenu = this.add.image(width / 2, height - 110, 'botaoVoltarMenu')
    botaoVoltarMenu.setScale(escalaBotao)
    botaoVoltarMenu.setInteractive()

    // Aumentar escala quando o mouse está sobre o botão
    botaoVoltarMenu.on('pointerover', () => {
      this.tweens.add({
        targets: botaoVoltarMenu,
        scale: escalaBotao * 1.1,
        duration: 100
      })
      botaoVoltarMenu.setTint(0xE6B967)
    })

    // Voltar escala ao padrão quando o mouse não está sobre o botão
    botaoVoltarMenu.on('pointerout', () => {
      this.tweens.add({
        targets: botaoVoltarMenu,
        scale: escalaBotao,
        duration: 100
      })
      botaoVoltarMenu.clearTint()
    })

    // Voltar para o Menu ao clicar
    botaoVoltarMenu.on('pointerdown', () => {
      this.scene.start('Menu')
    })
  }

  update () {
  }
}