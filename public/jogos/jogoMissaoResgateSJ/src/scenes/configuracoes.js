export default class Configuracao extends Phaser.Scene {

  constructor() {
    super('Configuracao')
  }

  preload() {
    this.load.setBaseURL('public/assets/')
    this.load.image('fundoMenu', 'telas/Tela_Menu.png')
    this.load.image('fundoConfiguracao', 'telas/menu/menuConfiguracoes.png')
    this.load.image('botaoVoltarMenu', 'telas/menu/voltar.png')
    this.load.image('botaoControles', 'telas/menu/controles.png')
    this.load.image('menos', 'telas/menu/btn_menos.png');
    this.load.image('mais', 'telas/menu/btn_mais.png');
    this.load.spritesheet('volume', 'telas/menu/volumeMenu.png', { frameWidth: 485, frameHeight: 138 });
    this.load.spritesheet('botaoDificuldade', 'telas/menu/Dificuldade.png', { frameWidth: 612, frameHeight: 100})
  }

  create() {
    const { width, height } = this.scale

    // Lista de dificuldades na mesma ordem dos frames do sprite
    const dificuldades = ['pacifica', 'facil', 'normal', 'dificil']

    // Dificuldade inicial do jogo: normal (frame 2), a não ser que já
    // exista uma escolha salva anteriormente pelo jogador.
    if (!window.dificuldade) {
      window.dificuldade = 'normal'
    }

    // Fundo do menu (atrás do painel)
    const fundoMenu = this.add.image(width / 2, height / 2, 'fundoMenu')
    fundoMenu.setScale(Math.max(width / fundoMenu.width, height / fundoMenu.height))

    // Painel de configurações (por cima do fundo)
    const fundoConfiguracao = this.add.image(width / 2, height / 2, 'fundoConfiguracao')

    const scaleX = width / fundoConfiguracao.width
    const scaleY = height / fundoConfiguracao.height
    fundoConfiguracao.setScale(Math.min(scaleX, scaleY))

    // ESCALA DO BOTÃO
    const escalaBotao = 0.5

    // ..:: BOTÃO DE DIFICULDADE (topo do painel, abaixo do título) ::..
    const escalaBotaoDificuldade = 1

    // Índice do frame atual, de acordo com a dificuldade já definida
    let indiceDificuldade = dificuldades.indexOf(window.dificuldade)
    if (indiceDificuldade === -1) indiceDificuldade = 2 // normal

    const botaoDificuldade = this.add.image(width / 2 + 3, height - 490, 'botaoDificuldade')
    botaoDificuldade.setScale(escalaBotaoDificuldade)
    botaoDificuldade.setFrame(indiceDificuldade)
    botaoDificuldade.setInteractive({ useHandCursor: true })

    botaoDificuldade.on('pointerover', () => {
      this.tweens.add({
        targets: botaoDificuldade,
        scale: escalaBotaoDificuldade * 1.1,
        duration: 100
      })
      botaoDificuldade.setTint(0xE6B967)
    })

    botaoDificuldade.on('pointerout', () => {
      this.tweens.add({
        targets: botaoDificuldade,
        scale: escalaBotaoDificuldade,
        duration: 100
      })
      botaoDificuldade.clearTint()
    })

    // Ao clicar, avança para a próxima dificuldade (cicla entre as 4)
    botaoDificuldade.on('pointerdown', () => {
      indiceDificuldade = (indiceDificuldade + 1) % dificuldades.length
      botaoDificuldade.setFrame(indiceDificuldade)
      window.dificuldade = dificuldades[indiceDificuldade]
      console.log('Dificuldade selecionada:', window.dificuldade)
    })

    // ..:: BOTÃO CONTROLES (entre dificuldade e volume) ::..
    const posYBotaoControles = (height - 490 + 500) / 2

    const botaoControles = this.add.image(width / 2, posYBotaoControles, 'botaoControles')
    botaoControles.setScale(escalaBotao)
    botaoControles.setInteractive({ useHandCursor: true })

    botaoControles.on('pointerover', () => {
      this.tweens.add({
        targets: botaoControles,
        scale: escalaBotao * 1.1,
        duration: 100
      })
      botaoControles.setTint(0xE6B967)
    })

    botaoControles.on('pointerout', () => {
      this.tweens.add({
        targets: botaoControles,
        scale: escalaBotao,
        duration: 100
      })
      botaoControles.clearTint()
    })

    botaoControles.on('pointerdown', () => {
      this.scene.stop('Menu')
      this.scene.start('Controles')
    })

    // ..:: BOTÃO AUMENTAR/DIMINUIR VOLUME MÚSICA ::..
    // O volume do Phaser (this.sound) é global ao jogo todo, não é
    // por-cena. Por isso, ao contrário do MenuPausa (que lê o índice de
    // dentro de jogo.soundManager._indiceVolume), aqui guardamos o índice
    // em uma variável global (window.indiceVolume), já que a cena 'Jogo'
    // pode nem ter sido iniciada ainda quando este menu é aberto direto
    // pelo Menu principal.
    const niveisVolume = [0, 0.25, 0.5, 0.75, 1]

    if (window.indiceVolume === undefined) {
      window.indiceVolume = 2 // começa em 0.5, mesmo padrão do SoundManager
      this.sound.setVolume(niveisVolume[window.indiceVolume])
    }

    const volume = this.add.sprite(width / 2 + 3, 490, 'volume', 4 - window.indiceVolume)
    volume.setScale(0.888)
    volume.setOrigin(0.5)
    volume.setScrollFactor(0);

    const botaoMenos = this.add.image(width / 2 - 240, 480, 'menos')
    botaoMenos.setScale(0.3)
    botaoMenos.setInteractive()

    const botaoMais = this.add.image(width / 2 + 240, 480, 'mais')
    botaoMais.setScale(0.3)
    botaoMais.setInteractive()

    const atualizarVolumeVisual = () => {
      // inverte porque o spritesheet está ao contrário
      volume.setFrame(4 - window.indiceVolume)
    }

    const aplicarVolume = () => {
      this.sound.setVolume(niveisVolume[window.indiceVolume])

      // Se a cena Jogo já existir e tiver um soundManager próprio,
      // mantém o índice interno dela sincronizado também (assim o
      // MenuPausa, que lê jogo.soundManager._indiceVolume, continua
      // mostrando o valor correto caso o jogo já esteja rodando).
      const jogo = this.scene.get('Jogo')
      if (jogo && jogo.soundManager) {
        jogo.soundManager._indiceVolume = window.indiceVolume
      }
    }

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
      window.indiceVolume = Phaser.Math.Clamp(window.indiceVolume - 1, 0, niveisVolume.length - 1)
      aplicarVolume()
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
      window.indiceVolume = Phaser.Math.Clamp(window.indiceVolume + 1, 0, niveisVolume.length - 1)
      aplicarVolume()
      atualizarVolumeVisual()
    })


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

  update() {
  }
}