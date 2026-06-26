import Abertura from '../scenes/abertura.js'
import Jogo from '../scenes/jogo.js'
import Menu from '../scenes/menu.js'
import MenuPausa from '../scenes/MenuPausa.js'
import Configuracao from '../scenes/configuracoes.js'
import Controles from '../scenes/Controles.js'
import Extras from '../scenes/extras.js'
import Vitoria from '../scenes/vitoria.js'

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: 1280,
    height: 720,
    scene: [Abertura, Menu, Jogo, MenuPausa, Configuracao, Extras, Vitoria, Controles],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
}

new Phaser.Game(config)
