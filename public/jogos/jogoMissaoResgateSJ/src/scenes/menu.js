import SoundManager from './SoundManager.js'

export default class Menu extends Phaser.Scene {

  constructor () {
    super('Menu')
  }

  preload () {
    this.load.setBaseURL('public/assets/')
    this.load.image('fundoMenu', 'telas/Tela_Menu.png')
    this.load.image('botaoJogar', 'botoes/Botao_Jogar_menu.png')
    this.load.image('botaoConfiguracoes', 'botoes/Botao_configuracoes_menu.png')
    this.load.image('botaoExtras', 'botoes/Botao_extras_menu.png')


    const sonsParaCarregar = [
      { key: 'abertura', path: 'sons/abertura.mp3' },
      { key: 'musica', path: 'sons/musica.mp3' }]
    sonsParaCarregar.forEach(({ key, path }) => {
      this.load.audio(key, path)
    })
    this.load.on('loaderror', (file) => {
      console.warn(`Arquivo não encontrado, ignorando: ${file.key}`)
    })
  }

  create () {
    const { width, height } = this.scale
    this.SoundManager = new SoundManager(this)
    this.SoundManager.create()
    this.SoundManager.tocarMusica('musica')

    // Fundo
    const fundoMenu = this.add.image(width / 2, height / 2, 'fundoMenu')

    const scaleX = width / fundoMenu.width
    const scaleY = height / fundoMenu.height
    fundoMenu.setScale(Math.max(scaleX, scaleY))

    // ESCALA DOS BOTÕES
    const escalaBotao = 0.5

    // ..:: BOTÃO JOGAR ::..
    const botaoJogar = this.add.image(width / 2, 250, 'botaoJogar')
    botaoJogar.setScale(escalaBotao)
    botaoJogar.setInteractive()

    // aumentar escala quando o mouse está sobre o botão
    botaoJogar.on('pointerover', () => {
      this.tweens.add({
        targets: botaoJogar,
        scale: escalaBotao * 1.1,
        duration: 100
      })

      botaoJogar.setTint(0xE6B967)
    })

    // voltar escala ao padrão quando o mouse não está sobre o botão
    botaoJogar.on('pointerout', () => {
      this.tweens.add({
        targets: botaoJogar,
        scale: escalaBotao,
        duration: 100
      })

      botaoJogar.clearTint()
    })

    // Mudar cena ao clicar no botão
    botaoJogar.on('pointerdown', () => {
      this.SoundManager.pararMusica()
      this.SoundManager.tocarAbertura()
      this.scene.start('Jogo')
    })

    // ..:: BOTÃO CONFIGURAÇÕES ::..
    const botaoConfiguracoes = this.add.image(width / 2, 380, 'botaoConfiguracoes')
    botaoConfiguracoes.setScale(escalaBotao)
    botaoConfiguracoes.setInteractive()

    // aumentar escala quando o mouse está sobre o botão
    botaoConfiguracoes.on('pointerover', () => {
      this.tweens.add({
        targets: botaoConfiguracoes,
        scale: escalaBotao * 1.1,
        duration: 100
      })

      botaoConfiguracoes.setTint(0xE6B967)
    })

    // voltar escala ao padrão quando o mouse não está sobre o botão
    botaoConfiguracoes.on('pointerout', () => {
      this.tweens.add({
        targets: botaoConfiguracoes,
        scale: escalaBotao,
        duration: 100
      })

      botaoConfiguracoes.clearTint()
    })

    // Entrar na cena de configurações
    botaoConfiguracoes.on('pointerdown', () => {
      this.SoundManager.pararMusica()
      this.SoundManager.tocarAbertura()
      this.scene.start('Configuracao')
    })

    // ..:: BOTÃO EXTRAS ::..
    const botaoExtras = this.add.image(width / 2, 510, 'botaoExtras')
    botaoExtras.setScale(escalaBotao)
    botaoExtras.setInteractive()

    // aumentar escala quando o mouse está sobre o botão
    botaoExtras.on('pointerover', () => {
      this.tweens.add({
        targets: botaoExtras,
        scale: escalaBotao * 1.1,
        duration: 100
      })

      botaoExtras.setTint(0xE6B967)
    })

    // voltar escala ao padrão quando o mouse não está sobre o botão
    botaoExtras.on('pointerout', () => {
      this.tweens.add({
        targets: botaoExtras,
        scale: escalaBotao,
        duration: 100
      })

      botaoExtras.clearTint()
    })

    // Entra na cena de extras
    botaoExtras.on('pointerdown', () => {
      this.SoundManager.pararMusica()
      this.SoundManager.tocarAbertura()
      this.scene.start('Extras')
    })

  }
}
