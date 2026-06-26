export default class Controles extends Phaser.Scene {

  constructor() {
    super('Controles')
  }

  preload() {
    this.load.setBaseURL('public/assets/')
    this.load.image('fundoMenu', 'telas/Tela_Menu.png')
    this.load.image('fundoConfiguracao', 'telas/menu/menuConfiguracoes.png')
    this.load.image('botaoVoltarMenu', 'telas/menu/voltar.png')
  }

  create() {
    const { width, height } = this.scale

    // Fundo do menu (atrás do painel) — mesmo fundo da tela de Configurações
    const fundoMenu = this.add.image(width / 2, height / 2, 'fundoMenu')
    fundoMenu.setScale(Math.max(width / fundoMenu.width, height / fundoMenu.height))

    // Painel (reaproveitando o mesmo sprite do menu de Configurações)
    const painel = this.add.image(width / 2, height / 2, 'fundoConfiguracao')
    const scaleX = width / painel.width
    const scaleY = height / painel.height
    painel.setScale(Math.min(scaleX, scaleY))

    const topoPainel = painel.getTopCenter().y

    // ..:: Lista de comandos ::..
    const corTextoTitulo = '#3a2418'
    const corTextoDescricao = '#5c4226'
    const corTecla = 0xe9d3a3
    const corTeclaBorda = 0x5c3a1e

    // Posição X (horizontal) onde os textos de descrição começam a ser
    // escritos, ao lado das teclas. Mexa SÓ neste número para mover todos
    // os textos de descrição (Segurar para correr, Interagir, etc.) ao
    // mesmo tempo, para a esquerda (diminuir) ou direita (aumentar).
    const posXTextoDescricao = width / 2 - 20

    const desenharTecla = (x, y, label, largura = 56) => {
      const altura = 48

      const fundo = this.add.rectangle(x, y, largura, altura, corTecla)
      fundo.setStrokeStyle(3, corTeclaBorda)

      this.add.text(x, y, label, {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: corTextoTitulo
      }).setOrigin(0.5)

      return fundo
    }

    // posX é opcional: se não for passado, usa posXTextoDescricao (padrão)
    // offsetYTexto desloca SÓ o texto de descrição, verticalmente, em
    // relação ao y passado para a linha (a tecla não é afetada por isso).
    const desenharLinha = (y, desenharTeclasFn, descricao, posX = posXTextoDescricao, offsetYTexto = 0) => {
      desenharTeclasFn(y)

      this.add.text(posX, y + offsetYTexto, descricao, {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        color: corTextoDescricao
      }).setOrigin(0, 0.5)
    }

    const centroX = width / 2 - 230
    let y = topoPainel + 240
    const espacamento = 64

    // Mover: bloco WASD à esquerda e bloco de Setas à direita, lado a lado
    const baseWasd = centroX - 30
    desenharTecla(baseWasd, y - 26, 'W')
    desenharTecla(baseWasd - 60, y + 26, 'A')
    desenharTecla(baseWasd, y + 26, 'S')
    desenharTecla(baseWasd + 60, y + 26, 'D')

    const baseSetas = centroX + 170
    desenharTecla(baseSetas, y - 26, '↑')
    desenharTecla(baseSetas - 60, y + 26, '←')
    desenharTecla(baseSetas, y + 26, '↓')
    desenharTecla(baseSetas + 60, y + 26, '→')

    // Texto "ou", entre o bloco WASD e o bloco de Setas.
    // Posição X: width / 2 - 161  |  Posição Y: y + 30
    const posXTextoOu = width / 2 - 161
    const posYTextoOu = y + 30
    this.add.text(posXTextoOu, posYTextoOu, 'ou', {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      fontStyle: 'italic',
      color: corTextoDescricao
    }).setOrigin(0.5)

    // Texto "Mover o personagem", a descrição do bloco de movimento.
    // Posição X: width / 2 + 70  |  Posição Y: y + 30
    const posXTextoMover = width / 2 + 70
    const posYTextoMover = y + 30
    this.add.text(posXTextoMover, posYTextoMover, 'Mover o personagem', {
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      color: corTextoDescricao
    }).setOrigin(0, 0.5)
    y += espacamento * 2.2

    // offsetYTextoBotoes: desloca o Y de todos os 4 textos abaixo (Segurar
    // para correr, Interagir, Abrir/fechar inventário, Pausar o jogo) para
    // alinhá-los com a altura real das teclas, que ficam em "linhaY - 40".
    // Mexa SÓ neste número para subir/descer esses 4 textos juntos.
    const offsetYTextoBotoes = -42

    desenharLinha(y, (linhaY) => {
      desenharTecla(centroX + 70, linhaY - 40, 'SHIFT', 100)
    }, 'Segurar para correr', posXTextoDescricao, offsetYTextoBotoes)
    y += espacamento

    desenharLinha(y, (linhaY) => {
      desenharTecla(centroX + 70, linhaY - 40, 'E', 56)
    }, 'Interagir (pegar item / falar com NPC)', posXTextoDescricao, offsetYTextoBotoes)
    y += espacamento

    desenharLinha(y, (linhaY) => {
      desenharTecla(centroX + 70, linhaY - 40, 'I', 56)
    }, 'Abrir / fechar inventário', posXTextoDescricao, offsetYTextoBotoes)
    y += espacamento

    desenharLinha(y, (linhaY) => {
      desenharTecla(centroX + 70, linhaY - 40, 'ESC', 80)
    }, 'Pausar o jogo', posXTextoDescricao, offsetYTextoBotoes)

    // ..:: BOTÃO VOLTAR ::..
    const escalaBotao = 0.5
    const botaoVoltarMenu = this.add.image(width / 2, height - 110, 'botaoVoltarMenu')
    botaoVoltarMenu.setScale(escalaBotao)
    botaoVoltarMenu.setInteractive({ useHandCursor: true })

    botaoVoltarMenu.on('pointerover', () => {
      this.tweens.add({
        targets: botaoVoltarMenu,
        scale: escalaBotao * 1.1,
        duration: 100
      })
      botaoVoltarMenu.setTint(0xE6B967)
    })

    botaoVoltarMenu.on('pointerout', () => {
      this.tweens.add({
        targets: botaoVoltarMenu,
        scale: escalaBotao,
        duration: 100
      })
      botaoVoltarMenu.clearTint()
    })

    // Volta para a tela de Configurações (de onde este menu é aberto)
    botaoVoltarMenu.on('pointerdown', () => {
      this.scene.start('Configuracao')
    })
  }

  update() {
  }
}