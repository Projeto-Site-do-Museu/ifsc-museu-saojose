import MenuPausa from './MenuPausa.js'
import SoundManager from './SoundManager.js'

export default class Jogo extends Phaser.Scene {
    constructor() {
        super('Jogo')
    }

    preload() {
        this.load.tilemapTiledJSON('mapa', 'public/assets/mapa/mapa.json')

        // Carregando os sprites dos personagens
        this.load.spritesheet('player', 'public/assets/personagens/player.png', { frameWidth: 48, frameHeight: 50 })
        this.load.spritesheet('enemy1', 'public/assets/personagens/enemy1.png', { frameWidth: 48, frameHeight: 50 })
        this.load.spritesheet('enemy2', 'public/assets/personagens/enemy2.png', { frameWidth: 48, frameHeight: 50 })
        this.load.spritesheet('enemy3', 'public/assets/personagens/enemy3.png', { frameWidth: 48, frameHeight: 50 })
        this.load.spritesheet('npc', 'public/assets/personagens/npc.png', { frameWidth: 48, frameHeight: 50 })

        // Carregando os sprites do mapa
        this.load.image('casinhaDeEstoque', 'public/assets/mapa/casinhaDeEstoque.png')
        this.load.spritesheet('engenho', 'public/assets/mapa/engenho.png', { frameWidth: 362, frameHeight: 96 })
        this.load.image('iconeConversa', 'public/assets/botoes/iconeConversa.png')
        this.load.image('inventario', 'public/assets/telas/menu/inventario.png')
        this.load.image('pegarItem', 'public/assets/botoes/pegarItem.png')
        this.load.image('check', 'public/assets/telas/menu/check.png')
        this.load.image('abrirInventario', 'public/assets/botoes/abrirInventario.png')
        this.load.spritesheet('GardenTerrain', 'public/assets/mapa/GardenTerrain.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('GardenWalls', 'public/assets/mapa/GardenWalls.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('mansao', 'public/assets/mapa/mansao.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('Graveyard', 'public/assets/mapa/Graveyard.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('escadaPrincipal', 'public/assets/mapa/escadaPrincipal.png', { frameWidth: 175, frameHeight: 125 })
        this.load.spritesheet('objetos', 'public/assets/mapa/objetos.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('objetosinv', 'public/assets/mapa/objetosinv.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('mesasCadeiras', 'public/assets/mapa/mesasCadeiras.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('colunaV', 'public/assets/mapa/colunaV.png', { frameWidth: 6, frameHeight: 32 })
        this.load.spritesheet('colunaH', 'public/assets/mapa/colunaH.png', { frameWidth: 32, frameHeight: 6 })
        this.load.spritesheet('bloco', 'public/assets/mapa/bloco.png', { frameWidth: 16, frameHeight: 8 })
        this.load.spritesheet('portas', 'public/assets/mapa/portas.png', { frameWidth: 96, frameHeight: 70 })
        this.load.spritesheet('vazio128x128', 'public/assets/mapa/vazio_128x128.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('enfeites', 'public/assets/mapa/enfeites.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('enfeitesPequenos', 'public/assets/mapa/enfeitesPequenos.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('maquinaFilmagem', 'public/assets/mapa/maquinaFilmagem.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('tapeteEDecoracoes', 'public/assets/mapa/tapeteEDecoracoes.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('cadeiraDentista', 'public/assets/mapa/cadeiraDentista.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('armas', 'public/assets/mapa/armas.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('carruagem', 'public/assets/mapa/carruagem.png', { frameWidth: 190, frameHeight: 80 })
        this.load.spritesheet('banheiro', 'public/assets/mapa/banheiro.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('canoa', 'public/assets/mapa/canoa.png', { frameWidth: 128, frameHeight: 64 })
        this.load.spritesheet('acessoriosIndigenas', 'public/assets/mapa/acessoriosIndigenas.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('cozinha', 'public/assets/mapa/cozinha.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('pedestalCatolico', 'public/assets/mapa/pedestalCatolico.png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('quadros', 'public/assets/mapa/quadros.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('roupaPadre', 'public/assets/mapa/roupaPadre.png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('roupasFestivas', 'public/assets/mapa/roupasFestivas.png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('roupasFestivasInv', 'public/assets/mapa/roupasFestivasInv.png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('arvoresGrandes', 'public/assets/mapa/arvoresGrandes.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('caixasMobilias', 'public/assets/mapa/caixasMobilias.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('cozinhaModificada', 'public/assets/mapa/cozinhaModificada.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('jardimFundos', 'public/assets/mapa/jardimFundos.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('pilares', 'public/assets/mapa/pilares.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('cranioDeOnca', 'public/assets/itens/cranioDeOnca.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('espadaDomPedro', 'public/assets/itens/espadaDomPedro.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('maquinaDeEscrever', 'public/assets/itens/maquinaDeEscrever.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('mascaraTribal', 'public/assets/itens/mascaraTribal.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('relicarioDourado', 'public/assets/itens/relicarioDourado.png', { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('mochila', 'public/assets/botoes/Botao_mochila.png', { frameWidth: 128, frameHeight: 128 }) // #carrega mochila


        // ..:: Carregando os sons do jogo ::..
        const sonsParaCarregar = [
            { key: 'passo', path: 'public/assets/sons/passo.mp3' },
            { key: 'correr', path: 'public/assets/sons/passo.mp3' },
            { key: 'musica', path: 'public/assets/sons/musica.mp3' },
        ]

        sonsParaCarregar.forEach(({ key, path }) => {
            this.load.audio(key, path)
        })

        this.load.on('loaderror', (file) => {
            console.warn(`Arquivo não encontrado, ignorando: ${file.key}`)
        })

    }

    create() {
        const mapa = this.make.tilemap({ key: 'mapa' })

        // ..:: Mapeamento de teclas do teclado para as interações ::..
        this.cursors = this.input.keyboard.createCursorKeys()

        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT) //botão shift

        this.wasd = this.input.keyboard.addKeys({    //movimentação no WASD
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })
        this.teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        this.teclaI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

        this.inventarioPlayer = [];
        this.inventarioNpc = [];

        this.dadosItens = {

            cranioDeOnca: {
                id: 'cranioDeOnca',
                nome: 'Crânio de Onça',
                sprite: 'cranioDeOnca',
                descricao: 'Crânio utilizado em rituais e tradições de povos indígenas.'
            },

            espadaDomPedro: {
                id: 'espadaDomPedro',
                nome: 'Espada de Dom Pedro',
                sprite: 'espadaDomPedro',
                descricao: 'Espada associada ao período do Império do Brasil.'
            },

            maquinaDeEscrever: {
                id: 'maquinaDeEscrever',
                nome: 'Máquina de Escrever',
                sprite: 'maquinaDeEscrever',
                descricao: 'Equipamento utilizado para produção de documentos antes dos computadores.'
            },

            mascaraTribal: {
                id: 'mascaraTribal',
                nome: 'Máscara Tribal',
                sprite: 'mascaraTribal',
                descricao: 'Máscara utilizada em cerimônias e manifestações culturais.'
            },

            relicarioDourado: {
                id: 'relicarioDourado',
                nome: 'Relicário Dourado',
                sprite: 'relicarioDourado',
                descricao: 'Objeto decorativo utilizado para guardar relíquias religiosas.'
            }

        };

        // ..:: Criação de constantes para os tileset dos elementos do mapa ::..
        const tilesetChao = mapa.addTilesetImage('mansao', 'mansao')
        const tilesetObjetos = mapa.addTilesetImage('objetos', 'objetos')
        const tilesetObjetosInv = mapa.addTilesetImage('objetosinv', 'objetosinv')
        const tilesetGraveyard = mapa.addTilesetImage('Graveyard', 'Graveyard')
        const tilesetGardenWalls = mapa.addTilesetImage('GardenWalls', 'GardenWalls')
        const tilesetGardenTerrain = mapa.addTilesetImage('GardenTerrain', 'GardenTerrain')
        const tilesetColunaV = mapa.addTilesetImage('colunaV', 'colunaV')
        const tilesetColunaH = mapa.addTilesetImage('colunaH', 'colunaH')
        const tilesetBloco = mapa.addTilesetImage('bloco', 'bloco')
        const tilesetPortas = mapa.addTilesetImage('portas', 'portas')
        const tilesetEscada = mapa.addTilesetImage('escadaPrincipal', 'escadaPrincipal')
        const tilesetMesasCadeiras = mapa.addTilesetImage('mesasCadeiras', 'mesasCadeiras')
        const tilesetEnfeites = mapa.addTilesetImage('enfeites', 'enfeites')
        const tilesetEnfeitesPequenos = mapa.addTilesetImage('enfeitesPequenos', 'enfeitesPequenos')
        const tilesetMaquinaFilmagem = mapa.addTilesetImage('maquinaFilmagem', 'maquinaFilmagem')
        const tilesetTapeteEDecoracoes = mapa.addTilesetImage('tapeteEDecoracoes', 'tapeteEDecoracoes')
        const tilesetCadeiraDentista = mapa.addTilesetImage('cadeiraDentista', 'cadeiraDentista')
        const tilesetArmas = mapa.addTilesetImage('armas', 'armas')
        const tilesetBanheiro = mapa.addTilesetImage('banheiro', 'banheiro')
        const tilesetCarruagem = mapa.addTilesetImage('carruagem', 'carruagem')
        const tilesetCanoa = mapa.addTilesetImage('canoa', 'canoa')
        const tilesetAcessoriosIndigenas = mapa.addTilesetImage('acessoriosIndigenas', 'acessoriosIndigenas')
        const tilesetCozinha = mapa.addTilesetImage('cozinha', 'cozinha')
        const tilesetPedestal = mapa.addTilesetImage('pedestalCatolico', 'pedestalCatolico')
        const tilesetQuadros = mapa.addTilesetImage('quadros', 'quadros')
        const tilesetRoupaPadre = mapa.addTilesetImage('roupaPadre', 'roupaPadre')
        const tilesetRoupasFestivas = mapa.addTilesetImage('roupasFestivas', 'roupasFestivas')
        const tilesetRoupasFestivasInv = mapa.addTilesetImage('roupasFestivasInv', 'roupasFestivasInv')
        const tilesetArvoresGrandes = mapa.addTilesetImage('arvoresGrandes', 'arvoresGrandes')
        const tilesetCaixasMobilias = mapa.addTilesetImage('caixasMobilias', 'caixasMobilias')
        const tilesetCasinhaDeEstoque = mapa.addTilesetImage('casinhaDeEstoque', 'casinhaDeEstoque')
        const tilesetCozinhaModificada = mapa.addTilesetImage('cozinhaModificada', 'cozinhaModificada')
        const tilesetEngenho = mapa.addTilesetImage('engenho', 'engenho')
        const tilesetJardimFundos = mapa.addTilesetImage('jardimFundos', 'jardimFundos')
        const tilesetPilares = mapa.addTilesetImage('pilares', 'pilares')

        // ..:: Verificação de carregamento dos sprites ::..
        if (
            !tilesetChao ||
            !tilesetObjetos ||
            !tilesetObjetosInv ||
            !tilesetGraveyard ||
            !tilesetGardenWalls ||
            !tilesetGardenTerrain ||
            !tilesetMesasCadeiras ||
            !tilesetEscada ||
            !tilesetColunaV ||
            !tilesetColunaH ||
            !tilesetBloco ||
            !tilesetPortas ||
            !tilesetEnfeites ||
            !tilesetEnfeitesPequenos ||
            !tilesetMaquinaFilmagem ||
            !tilesetTapeteEDecoracoes ||
            !tilesetCadeiraDentista ||
            !tilesetArmas ||
            !tilesetBanheiro ||
            !tilesetCanoa ||
            !tilesetAcessoriosIndigenas ||
            !tilesetCozinha ||
            !tilesetPedestal ||
            !tilesetQuadros ||
            !tilesetRoupaPadre ||
            !tilesetRoupasFestivas ||
            !tilesetRoupasFestivasInv ||
            !tilesetArvoresGrandes ||
            !tilesetCaixasMobilias ||
            !tilesetCasinhaDeEstoque ||
            !tilesetCozinhaModificada ||
            !tilesetEngenho ||
            !tilesetJardimFundos ||
            !tilesetPilares
        ) {
            console.error('Erro ao carregar algum tileset')
        }

        // ..:: criação das layers e das colisões ::..
        const tilesets = [tilesetChao, tilesetObjetos, tilesetObjetosInv, tilesetGardenTerrain, tilesetGardenWalls, tilesetGraveyard, tilesetColunaV, tilesetColunaH, tilesetBloco, tilesetPortas, tilesetEscada, tilesetMesasCadeiras, tilesetEnfeites, tilesetEnfeitesPequenos, tilesetMaquinaFilmagem, tilesetTapeteEDecoracoes, tilesetCadeiraDentista, tilesetArmas, tilesetBanheiro, tilesetCarruagem, tilesetCanoa, tilesetAcessoriosIndigenas, tilesetCozinha, tilesetPedestal, tilesetQuadros, tilesetRoupaPadre, tilesetRoupasFestivas, tilesetRoupasFestivasInv, tilesetArvoresGrandes, tilesetCaixasMobilias, tilesetCasinhaDeEstoque, tilesetCozinhaModificada, tilesetEngenho, tilesetJardimFundos, tilesetPilares]

        mapa.createLayer('chao', tilesets, 0, 0)
        mapa.createLayer('parede', tilesets, 0, 0)
        this.layerColisao = mapa.createLayer('colisao', tilesets, 0, 0)

        const layers = ['1', '2', '3']

        const tilesetsMap = mapa.tilesets

        const FLIP_X = 0x80000000
        const FLIP_Y = 0x40000000

        this.colunasColisao = this.physics.add.staticGroup()

        layers.forEach(nome => {
            const layer = mapa.getObjectLayer(nome)

            if (!layer) {
                console.warn('Layer não encontrada:', nome)
                return
            }

            layer.objects.forEach(obj => {
                if (!obj.gid) return

                // detectar flip
                const flipX = (obj.gid & FLIP_X) !== 0
                const flipY = (obj.gid & FLIP_Y) !== 0

                // limpar gid (remover flags)
                const gid = obj.gid & ~(FLIP_X | FLIP_Y)

                // encontrar tileset automaticamente
                const tileset = tilesetsMap.find(ts =>
                    gid >= ts.firstgid && gid < ts.firstgid + ts.total
                )

                if (!tileset) {
                    console.warn('Tileset não encontrado pro gid:', gid)
                    return
                }

                const frame = gid - tileset.firstgid

                const sprite = this.add.image(
                    obj.x,
                    obj.y,
                    tileset.name,
                    frame
                ).setOrigin(0, 1)

                // aplicar flip
                sprite.setFlip(flipX, flipY)

                // depth por layer
                switch (nome) {
                    case '1':
                        sprite.setDepth(1)
                        break

                    case '2':
                        sprite.setDepth(2)
                        break

                    case '3':
                        sprite.setDepth(3)
                        break
                }

                // ..:: COLISÃO DAS COLUNAS ::..
                if (tileset.name === 'colunaV') {

                    sprite.setVisible(false)

                    const largura = 6
                    const altura = 32

                    const cx = obj.x + largura / 2
                    const cy = obj.y - altura / 2

                    const colisor = this.add.rectangle(cx, cy, largura, altura)

                    // deixe true para testar
                    // colisor.visible = false
                    colisor.setAlpha(0.5)

                    this.physics.add.existing(colisor, true)

                    this.colunasColisao.add(colisor)
                }
                if (tileset.name === 'colunaH') {

                    sprite.setVisible(false)

                    const largura = 32
                    const altura = 6

                    const cx = obj.x + largura / 2
                    const cy = obj.y - altura / 2

                    const colisor = this.add.rectangle(cx, cy, largura, altura)

                    // deixe true para testar
                    // colisor.visible = false
                    colisor.setAlpha(0.5)

                    this.physics.add.existing(colisor, true)

                    this.colunasColisao.add(colisor)
                }
                if (tileset.name === 'bloco') {

                    sprite.setVisible(false)

                    const largura = 16
                    const altura = 8

                    const cx = obj.x + largura / 2
                    const cy = obj.y - altura / 2

                    const colisor = this.add.rectangle(cx, cy, largura, altura)

                    // deixe true para testar
                    // colisor.visible = false
                    colisor.setAlpha(0.5)

                    this.physics.add.existing(colisor, true)

                    this.colunasColisao.add(colisor)
                }
            })
        })

        this.layerColisao.setCollisionByExclusion([-1])

        // ..:: Configuração do player ::..
        this.player = this.physics.add.sprite(784.5, 3246.1, 'player')
        window.player = this.player //Comando para ver a localização do player no jogo, usando o comando console.log(player.x, player.y)
        this.direcao = 'esquerda'
        this.physics.add.collider(this.player, this.layerColisao)
        this.physics.add.collider(this.player, this.colunasColisao)
        this.player.setDepth(2)
        const teto = mapa.createLayer('teto', tilesets, 0, 0)
        teto.setDepth(3)

        // Câmera
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels)
        this.cameras.main.setZoom(2)

        const animacoes = [
            {
                nome: 'cima',
                idle: [66, 67],
                andar: [1, 8],
                correr: [75, 81],
                pegarItem: [36, 41],
                cair: [60, 65],
                levantar: [65, 60]
            },
            {
                nome: 'esquerda',
                idle: [68, 69],
                andar: [10, 17],
                correr: [82, 88],
                pegarItem: [42, 47],
                cair: [60, 65],
                levantar: [65, 60]
            },
            {
                nome: 'baixo',
                idle: [70, 71],
                andar: [19, 26],
                correr: [91, 97],
                pegarItem: [48, 53],
                cair: [60, 65],
                levantar: [65, 60]
            },
            {
                nome: 'direita',
                idle: [72, 73],
                andar: [28, 35],
                correr: [98, 105],
                pegarItem: [54, 59],
                cair: [60, 65],
                levantar: [65, 60]
            }
        ]



        animacoes.forEach(anim => {

            // IDLE (parado)
            this.anims.create({
                key: 'idle-' + anim.nome,
                frames: this.anims.generateFrameNumbers('player', {
                    start: anim.idle[0],
                    end: anim.idle[1]
                }),
                frameRate: 2,
                repeat: -1
            })

            // ANDAR 
            this.anims.create({
                key: 'andar-' + anim.nome,
                frames: this.anims.generateFrameNumbers('player', {
                    start: anim.andar[0],
                    end: anim.andar[1]
                }),
                frameRate: 8,
                repeat: -1
            })

            // CORRER
            this.anims.create({
                key: 'correr-' + anim.nome,
                frames: this.anims.generateFrameNumbers('player', {
                    start: anim.correr[0],
                    end: anim.correr[1]
                }),
                frameRate: 12,
                repeat: -1
            })

            // PEGAR ITEM
            this.anims.create({
                key: 'pegarItem-' + anim.nome,
                frames: this.anims.generateFrameNumbers('player', {
                    start: anim.pegarItem[0],
                    end: anim.pegarItem[1]
                }),
                frameRate: 8
            })

        })

        // Animação de cair (igual para todas as direções)
        this.anims.create({
            key: 'cair',
            frames: this.anims.generateFrameNumbers('player', {
                start: 60, end: 65
            }),
            frameRate: 8,
            repeat: 0
        })

        // Animação de levantar
        this.anims.create({
            key: 'levantar',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [65, 64, 63, 62, 61, 60]
            }),
            frameRate: 8,
            repeat: 0
        })

        // Player recebendo dano
        this.tomandoDano = false;
        this.spawnX = 784.5;
        this.spawnY = 3246.1;

        // ..:: Configuração NPC ::..

        this.npc = this.physics.add.sprite(675, 3244.5, 'npc')

        this.physics.add.collider(this.npc, this.player)

        this.npc.setPushable(false)
        this.npc.setImmovable(true)

        // Levantando
        this.anims.create({
            key: 'npc-levantando',
            frames: this.anims.generateFrameNumbers('npc', {
                start: 0,
                end: 5
            }),
            frameRate: 3,
            repeat: 0
        })

        // Virando para direita (idle)
        this.anims.create({
            key: 'npc-virandoDireita',
            frames: this.anims.generateFrameNumbers('npc', {
                start: 6,
                end: 8
            }),
            frameRate: 2,
            repeat: -1
        })

        // Agradecendo
        this.anims.create({
            key: 'npc-agradecendo',
            frames: this.anims.generateFrameNumbers('npc', {
                start: 9,
                end: 12
            }),
            frameRate: 2,
            repeat: 0
        })

        this.npc.play('npc-levantando')
        this.npc.on('animationcomplete-npc-levantando', () => {
            this.npc.play('npc-virandoDireita')
        })

        // Balão de fala do NPC
        this.iconeConversa = this.add.image(
            this.npc.x,
            this.npc.y - 40,
            'iconeConversa'
        )

        this.iconeConversa.setScale(0.5)
        this.iconeConversa.setVisible(false)

        this.physics.add.overlap(
            this.player,
            this.npc,
            () => {
                this.iconeConversa.setVisible(true)
            },
            null,
            this
        )

        // Interação com o NPC
        this.npc.on('animationcomplete-npc-agradecendo', () => {
            this.npc.play('npc-virandoDireita')
        })

        // ..:: Configurações dos Inimigos ::..

        const tiposEnemy = ['enemy1', 'enemy2', 'enemy3']

        const animacoesEnemy = [
            {
                nome: 'cima',
                idle: [0, 1],
                andar: [8, 16],
                correr: [44, 51],
                atacar: [76, 81]
            },
            {
                nome: 'esquerda',
                idle: [2, 3],
                andar: [17, 25],
                correr: [52, 59],
                atacar: [82, 87]
            },
            {
                nome: 'baixo',
                idle: [4, 5],
                andar: [26, 34],
                correr: [60, 67],
                atacar: [88, 93]
            },
            {
                nome: 'direita',
                idle: [6, 7],
                andar: [35, 43],
                correr: [68, 75],
                atacar: [94, 99]
            }
        ]

        // Criação das animações
        tiposEnemy.forEach(tipo => {

            animacoesEnemy.forEach(anim => {

                this.anims.create({
                    key: `${tipo}-idle-${anim.nome}`,
                    frames: this.anims.generateFrameNumbers(tipo, {
                        start: anim.idle[0],
                        end: anim.idle[1]
                    }),
                    frameRate: 2,
                    repeat: -1
                })

                this.anims.create({
                    key: `${tipo}-andar-${anim.nome}`,
                    frames: this.anims.generateFrameNumbers(tipo, {
                        start: anim.andar[0],
                        end: anim.andar[1]
                    }),
                    frameRate: 8,
                    repeat: -1
                })

                this.anims.create({
                    key: `${tipo}-correr-${anim.nome}`,
                    frames: this.anims.generateFrameNumbers(tipo, {
                        start: anim.correr[0],
                        end: anim.correr[1]
                    }),
                    frameRate: 12,
                    repeat: -1
                })
                this.anims.create({
                    key: `${tipo}-atacar-${anim.nome}`,
                    frames: this.anims.generateFrameNumbers(tipo, {
                        start: anim.atacar[0],
                        end: anim.atacar[1]
                    }),
                    frameRate: 12,
                    repeat: -1
                })

            })

        })

        const configInimigos = [

            // =========================
            // FASE 1
            // =========================

            { tipo: 'enemy1', pontos: [{ x: 618.2, y: 2755.8 }, { x: 988.2, y: 2755.8 }] },
            { tipo: 'enemy1', pontos: [{ x: 563.2, y: 2755.8 }, { x: 205.5, y: 2755.8 }] },

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 383, y: 2657 },
                    { x: 203, y: 2657 },
                    { x: 203, y: 2484.5 },
                    { x: 383, y: 2484.5 }
                ]
            },

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 834.1, y: 2662 },
                    { x: 529.1, y: 2662 },
                    { x: 529.1, y: 2559.1 },
                    { x: 834.1, y: 2559.1 }
                ]
            },

            { tipo: 'enemy1', pontos: [{ x: 944.1, y: 2502 }, { x: 944.1, y: 2769.5 }] },

            // =========================
            // FASE 2
            // =========================

            { tipo: 'enemy1', pontos: [{ x: 1907.5, y: 3399 }, { x: 1907.5, y: 3173.1 }] },

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 2072, y: 3160.6 },
                    { x: 2072, y: 2845.6 },
                    { x: 2120, y: 2845.6 },
                    { x: 2120, y: 3160.6 }
                ]
            },

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 2072, y: 2758.2 },
                    { x: 2075.1, y: 2560 },
                    { x: 2120, y: 2560 },
                    { x: 2120, y: 2758.2 }
                ]
            },

            { tipo: 'enemy1', pontos: [{ x: 2356, y: 2655.6 }, { x: 2201, y: 2655.6 }] },

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 1966.1, y: 2530.8 },
                    { x: 1966.1, y: 2653.3 },
                    { x: 1851.1, y: 2653.3 }
                ]
            },

            { tipo: 'enemy3', pontos: [{ x: 1970.6, y: 3258.2 }, { x: 2280.6, y: 3258.2 }] },

            {
                tipo: 'enemy3',
                parado: true,
                direcaoParado: 'esquerda',
                pontos: [{ x: 1887.5, y: 2940.7 }]
            },

            // =========================
            // FASE 3
            // =========================

            { tipo: 'enemy1', pontos: [{ x: 1240.5, y: 2022.5 }, { x: 1578, y: 2022.5 }] },

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 286.1, y: 2119.4 },
                    { x: 286.1, y: 2001.9 },
                    { x: 400, y: 2001.9 },
                    { x: 400, y: 2119.4 }
                ]
            },

            {
                tipo: 'enemy2', pontos: [
                    { x: 851.26, y: 2091.64 },  // extremo esquerdo
                    { x: 1107.6, y: 2183 },    // ponta do V (centro/baixo)
                    { x: 1307, y: 2095.8 },  // extremo direito
                    { x: 1107.6, y: 2183 },    // ponta do V de volta
                    { x: 851.26, y: 2091.64 }   // extremo esquerdo de volta
                ]
            },

            { tipo: 'enemy3', pontos: [{ x: 678.8, y: 2085.2 }, { x: 461.3, y: 2085.2 }] },

            {
                tipo: 'enemy3',
                parado: true,
                direcaoParado: 'cima',
                pontos: [{ x: 963.6, y: 2045.5 }]
            },

            // =========================
            // FASE 4
            // =========================

            { tipo: 'enemy1', pontos: [{ x: 512.8, y: 1525.8 }, { x: 512.8, y: 1246.63 }] },

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 420, y: 880 },
                    { x: 797.5, y: 880 },
                    { x: 797.5, y: 1077.5 },
                    { x: 420, y: 1077.5 }
                ]
            },

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 926.4, y: 1602.5 },
                    { x: 926.4, y: 1517.5 },
                    { x: 1095, y: 1517.5 },
                    { x: 1095, y: 1602.5 },
                    { x: 1095, y: 1517.5 },
                    { x: 926.4, y: 1517.5 },
                    { x: 926.4, y: 1602.5 }
                ]
            },

            { tipo: 'enemy2', pontos: [{ x: 200.3, y: 1153.7 }, { x: 579.4, y: 1153.7 }] },

            { tipo: 'enemy2', pontos: [{ x: 599.4, y: 1153.7 }, { x: 1067.8, y: 1153.7 }] },

            {
                tipo: 'enemy2',
                pontos: [
                    { x: 868.82, y: 847.90 },
                    { x: 868.82, y: 642.90 },
                    { x: 1091.32, y: 642.90 },
                    { x: 1091.32, y: 847.90 }
                ]
            },

            {
                tipo: 'enemy2',
                pontos: [
                    { x: 870.7, y: 425.8 },
                    { x: 1096, y: 425.8 },
                    { x: 1096, y: 573.1 },
                    { x: 870.7, y: 573.1 }
                ]
            },

            {
                tipo: 'enemy3',
                parado: true,
                direcaoParado: 'cima',
                pontos: [{ x: 300.6, y: 1003.4 }]
            },

            {
                tipo: 'enemy3',
                pontos: [
                    { x: 701.65, y: 654.22 },
                    { x: 219.15, y: 654.22 },
                    { x: 219.15, y: 449.22 },
                    { x: 701.65, y: 449.22 }
                ]
            },

            {
                tipo: 'enemy3',
                pontos: [
                    { x: 643.8, y: 1270 },
                    { x: 791.3, y: 1270 },
                    { x: 791.3, y: 1570 },
                    { x: 643.8, y: 1570 }
                ]
            },

            // =========================
            // FASE 5
            // =========================

            {
                tipo: 'enemy1',
                pontos: [
                    { x: 2284.8, y: 1352.2 },
                    { x: 2284.8, y: 1457.3 },
                    { x: 2189.8, y: 1457.3 }
                ]
            },
            { tipo: 'enemy1', pontos: [{ x: 2511.9, y: 922.5 }, { x: 2351.9, y: 922.5 }] },
            { tipo: 'enemy1', pontos: [{ x: 2755, y: 922.5 }, { x: 2601, y: 922.5 }] },

            { tipo: 'enemy2', pontos: [{ x: 2259.1, y: 576.9 }, { x: 2259.1, y: 788 }] },
            { tipo: 'enemy2', pontos: [{ x: 2194.3, y: 858 }, { x: 2194.3, y: 1238 }] },
            { tipo: 'enemy2', pontos: [{ x: 2427.5, y: 1020 }, { x: 2760, y: 1020 }] },
            {
                tipo: 'enemy2',
                pontos: [
                    { x: 2390, y: 1173.25 },
                    { x: 2755, y: 1173.25 },
                    { x: 2755, y: 1268.25 },
                    { x: 2390, y: 1268.25 }
                ]
            },

            { tipo: 'enemy3', pontos: [{ x: 2385, y: 1447.4 }, { x: 2752.5, y: 1447.4 }] },
            { tipo: 'enemy3', pontos: [{ x: 2368.5, y: 607.5 }, { x: 2745.3, y: 607.5 }] },
            { tipo: 'enemy3', pontos: [{ x: 2619.16, y: 1114.4 }, { x: 2751.6, y: 1114.45 }] },
            {
                tipo: 'enemy3',
                parado: true,
                direcaoParado: 'direita',
                pontos: [{ x: 2465.58, y: 1342.98 }]
            },
            {
                tipo: 'enemy3',
                parado: true,
                direcaoParado: 'esquerda',
                pontos: [{ x: 2725, y: 778.8 }]
            },

        ]

        this.inimigos = []

        // Multiplicador de velocidade baseado na dificuldade escolhida no menu
        const multiplicadoresDificuldade = {
            pacifica: 0,   // inimigos não serão criados
            facil: 0.6,
            normal: 1,
            dificil: 1.4
        }
        const dificuldadeAtual = window.dificuldade || 'normal'
        const multiplicadorVelocidade = multiplicadoresDificuldade[dificuldadeAtual] ?? 1

        configInimigos.forEach(config => {

            // Modo pacífico: não cria nenhum inimigo
            if (dificuldadeAtual === 'pacifica') return

            const inimigo = this.physics.add.sprite(
                config.pontos[0].x,
                config.pontos[0].y,
                config.tipo
            )

            inimigo.tipo = config.tipo

            switch (config.tipo) {

                case 'enemy1':
                    inimigo.velocidade = 150 * multiplicadorVelocidade
                    inimigo.modoMovimento = 'andar'
                    break

                case 'enemy2':
                    inimigo.velocidade = 200 * multiplicadorVelocidade
                    inimigo.modoMovimento = 'correr'
                    break

                case 'enemy3':
                    inimigo.velocidade = 100 * multiplicadorVelocidade
                    inimigo.modoMovimento = 'andar'
                    inimigo.setScale(1.5)
                    break
            }

            inimigo.pontos = config.pontos
            inimigo.pontoAtual = 1

            inimigo.parado = config.parado || false
            inimigo.paradoOriginal = config.parado || false

            if (inimigo.parado) {

                inimigo.direcao = config.direcaoParado

                inimigo.play(
                    `${config.tipo}-idle-${config.direcaoParado}`
                )

            } else {

                inimigo.direcao = 'baixo'

                inimigo.play(
                    `${config.tipo}-${inimigo.modoMovimento}-baixo`
                )

            }

            inimigo.setDepth(2)
            inimigo.setPushable(false)
            inimigo.setImmovable(true)

            // Apenas colisão com o player
            this.physics.add.overlap(inimigo, this.player, () => {
                this.receberDano(inimigo)
            }, null, this)

            this.inimigos.push(inimigo)
        })

        // ..:: Configuração dos itens ::..

        // gerando os sprites dos itens no mapa   
        this.cranioDeOnca = this.physics.add.sprite(1018.9, 2012.4, 'cranioDeOnca') // this.player.x=1040.9, this.player.y=2012.4
        this.cranioDeOnca.name = 'cranioDeOnca';
        this.cranioDeOnca.itemId = 'cranioDeOnca';
        this.espadaDomPedro = this.physics.add.sprite(945.3, 496.2, 'espadaDomPedro') // this.player.x=945.3, this.player.y=496.2
        this.espadaDomPedro.name = 'espadaDomPedro';
        this.espadaDomPedro.itemId = 'espadaDomPedro';
        this.maquinaDeEscrever = this.physics.add.sprite(244.2, 2536.5, 'maquinaDeEscrever') // this.player.x=244.2, this.player.y=2530.6
        this.maquinaDeEscrever.name = 'maquinaDeEscrever';
        this.maquinaDeEscrever.itemId = 'maquinaDeEscrever';
        this.mascaraTribal = this.physics.add.sprite(1835.5, 2530.6, 'mascaraTribal') // this.player.x=1835.5, this.player.y=2530.6
        this.mascaraTribal.name = 'mascaraTribal';
        this.mascaraTribal.itemId = 'mascaraTribal';
        this.relicarioDourado = this.physics.add.sprite(2700.3, 1464.8, 'relicarioDourado') // this.player.x=2700.3, this.player.y=1464.8
        this.relicarioDourado.name = 'relicarioDourado';
        this.relicarioDourado.itemId = 'relicarioDourado';  // Spawn this.player.x=784.5, this.player.y=3246.1

        // Posições originais do item
        this.posicoesOriginaisItens = {
            cranioDeOnca: { x: 1018.9, y: 2012.4 },
            espadaDomPedro: { x: 945.3, y: 496.2 },
            maquinaDeEscrever: { x: 244.2, y: 2536.5 },
            mascaraTribal: { x: 1835.5, y: 2530.6 },
            relicarioDourado: { x: 2700.3, y: 1464.8 }
        }

        // Mapa de id do item para o sprite correspondente
        this.spritesItens = {
            cranioDeOnca: this.cranioDeOnca,
            espadaDomPedro: this.espadaDomPedro,
            maquinaDeEscrever: this.maquinaDeEscrever,
            mascaraTribal: this.mascaraTribal,
            relicarioDourado: this.relicarioDourado
        }

        this.coletandoItem = false;

        // Fazendo a colisão dos itens com o player
        this.physics.add.overlap(
            this.player,
            this.cranioDeOnca,
            () => this.coletarItem(this.cranioDeOnca),
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.espadaDomPedro,
            () => this.coletarItem(this.espadaDomPedro),
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.maquinaDeEscrever,
            () => this.coletarItem(this.maquinaDeEscrever),
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.mascaraTribal,
            () => this.coletarItem(this.mascaraTribal),
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.relicarioDourado,
            () => this.coletarItem(this.relicarioDourado),
            null,
            this
        );

        this.iconeMao = this.add.image(0, 0, 'pegarItem')
        this.iconeMao.setVisible(false)
        this.iconeMao.setDepth(5)
        this.iconeMao.setScale(0.5)

        this.itemProximo = null


        // Deixando os itens imóveis
        this.npc.setPushable(false)
        this.npc.setImmovable(true)

        this.cranioDeOnca.setPushable(false)
        this.cranioDeOnca.setImmovable(true)

        this.espadaDomPedro.setPushable(false)
        this.espadaDomPedro.setImmovable(true)

        this.maquinaDeEscrever.setPushable(false)
        this.maquinaDeEscrever.setImmovable(true)

        this.mascaraTribal.setPushable(false)
        this.mascaraTribal.setImmovable(true)

        this.relicarioDourado.setPushable(false)
        this.relicarioDourado.setImmovable(true)

        // animação cranio
        this.anims.create({
            key: 'cranio-brilhando',
            frames: this.anims.generateFrameNumbers('cranioDeOnca', {
                start: 1,
                end: 14
            }),
            frameRate: 4,
            repeat: -1
        })

        // animação espada
        this.anims.create({
            key: 'espada-brilhando',
            frames: this.anims.generateFrameNumbers('espadaDomPedro', {
                start: 1,
                end: 3
            }),
            frameRate: 4,
            repeat: -1
        })

        // animação maquina de escrever
        this.anims.create({
            key: 'maquina-brilhando',
            frames: this.anims.generateFrameNumbers('maquinaDeEscrever', {
                start: 2,
                end: 15
            }),
            frameRate: 4,
            repeat: -1
        })

        // animação mascara
        this.anims.create({
            key: 'mascara-brilhando',
            frames: this.anims.generateFrameNumbers('mascaraTribal', {
                start: 1,
                end: 13
            }),
            frameRate: 4,
            repeat: -1
        })

        // animação relicário
        this.anims.create({
            key: 'relicario-brilhando',
            frames: this.anims.generateFrameNumbers('relicarioDourado', {
                start: 1,
                end: 15
            }),
            frameRate: 4,
            repeat: -1
        })

        // Corrigindo escala dos itens e iniciando animação
        this.cranioDeOnca.setScale(0.5)
        this.cranioDeOnca.play('cranio-brilhando')

        this.espadaDomPedro.setScale(0.8)
        this.espadaDomPedro.play('espada-brilhando')
        this.espadaDomPedro.setDepth(4)

        this.maquinaDeEscrever.setScale(0.5)
        this.maquinaDeEscrever.play('maquina-brilhando')

        this.mascaraTribal.setScale(0.5)
        this.mascaraTribal.play('mascara-brilhando')

        this.relicarioDourado.setScale(0.8)
        this.relicarioDourado.play('relicario-brilhando')


        // Sons
        this.soundManager = new SoundManager(this)
        this.soundManager.create()

        // ..:: PORTAS ::..

        const configPortas = [
            // ..:: cenário Lobby ::..
            { x: 319.5, y: 3071.1, destX: 319.5, destY: 2818.6 }, //porta 1
            { x: 592, y: 3071.1, destX: 592, destY: 2818.6 }, // porta 2
            { x: 862.83, y: 3071.1, destX: 862.83, destY: 2818.6 }, // porta 3
            { x: 1040.5, y: 3166.9, destX: 1822.5, destY: 3196.9 }, // porta 4
            { x: 1040.5, y: 3328.77, destX: 1825, destY: 3360.8 }, // porta 5

            // ..:: cenário fase 1 ::..
            { x: 319.5, y: 2864.6, destX: 319.5, destY: 3128.6 }, // porta 1
            { x: 592, y: 2864.6, destX: 592, destY: 3128.6 }, // porta 2
            { x: 864.5, y: 2864.6, destX: 864.5, destY: 3128.6 }, // porta 3
            { x: 319.5, y: 2426.9, destX: 319.5, destY: 2181.9 }, // porta 4
            { x: 592, y: 2426.9, destX: 592, destY: 2181.9 }, // porta 5
            { x: 864.5, y: 2426.9, destX: 864.5, destY: 2181.9 }, // porta 6

            // ..:: cenário fase 2 ::..
            { x: 1773.5, y: 3200, destX: 990, destY: 3166.9 }, // porta 1
            { x: 1773.5, y: 3360.8, destX: 995, destY: 3328.77 }, // porta 2
            { x: 2096.6, y: 2438.5, destX: 1330, destY: 2180.8 }, // porta 3

            // ..:: cenário fase 3 ::..
            { x: 319.16, y: 2225, destX: 319.16, destY: 2480 }, // porta 1
            { x: 593, y: 2225, destX: 593, destY: 2480 }, // porta 2
            { x: 863.5, y: 2225, destX: 863.5, destY: 2480 }, // porta 3
            { x: 1328.6, y: 2225, destX: 2097.6, destY: 2485 }, // porta 4
            { x: 513.60, y: 1940, destX: 512.8, destY: 1598.3 }, // porta 5

            // ..:: cenário fase 4 ::..
            { x: 512.8, y: 1655.8, destX: 511.6, destY: 1995.2 }, // porta 1
            { x: 1010.3, y: 1651.6, destX: 2450.3, destY: 527.5 }, // porta 2

            // ..:: cenário fase 5 ::..
            { x: 2449.4, y: 473, destX: 1012.5, destY: 1602.5 }, // porta 1

        ]

        this.portas = configPortas.map(({ x, y, destX, destY }) => {
            const sprite = this.physics.add.sprite(x, y, 'vazio128x128')

            this.physics.add.overlap(this.player, sprite, () => {
                this.cameras.main.fadeOut(200)
                this.player.x = destX
                this.player.y = destY
                this.cameras.main.once('camerafadeoutcomplete', (camera) => {
                    camera.fadeIn(200)
                })
            })

            return sprite
        });


        // #animacao mochila
        this.anims.create({
            key: 'abrir_mochila',
            frames: this.anims.generateFrameNumbers('mochila', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'fechar_mochila',
            frames: this.anims.generateFrameNumbers('mochila', { start: 3, end: 0 }),
            frameRate: 10,
            repeat: 0
        });

        let margemX = 330;
        let margemY = this.cameras.main.height - 190;

        this.mochila = this.add.sprite(margemX, margemY, 'mochila', 0);
        this.mochila.setDepth(5);
        this.mochila.setScale(0.5);
        this.mochila.setScrollFactor(0);
        this.mochila.setOrigin(0, 1);
        this.mochila.setInteractive({ useHandCursor: true });

        this.mochila.on('pointerover', () => {
            this.mochila.play('abrir_mochila');
        });
        this.mochila.on('pointerout', () => {
            this.mochila.stop();
            this.mochila.play('fechar_mochila');
        });

        // Ícone de dica acima da mochila
        this.iconeAbrirInventario = this.add.image(
            margemX + 32,        // centralizado sobre a mochila
            margemY - 78,        // acima da mochila
            'abrirInventario'
        )
        this.iconeAbrirInventario.setScrollFactor(0)
        this.iconeAbrirInventario.setDepth(6)
        this.iconeAbrirInventario.setScale(1)

        // fundo do inventário
        this.painelInventario = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'inventario'
        );

        this.iconesInventario = [];

        this.inventarioAberto = false;

        this.painelInventario.setScrollFactor(0);
        this.painelInventario.setDepth(100);
        this.painelInventario.setVisible(false);
        this.painelInventario.setScale(0.4);

        this.mochila.on('pointerdown', () => {

            if (!this.inventarioAberto) {
                this.abrirInventario();
            } else {
                this.fecharInventario();
            }

        });

        window.jogo = this;

        // ==============================================================
        // ..:: INTRODUÇÃO — inicia a sequência de cutscene + tutorial ::..\
        // ==============================================================
        this.iniciarIntroducao()
    }

    // ================================================================
    // ..:: INTRODUÇÃO ::..\
    //
    // Fluxo:
    //   1. emIntro = true  →  player e inimigos travados
    //   2. player caminha automaticamente até o NPC
    //   3. ao chegar, diálogo de falas do NPC aparece
    //   4. última fala fecha e abre a tela de tutorial
    //   5. jogador pressiona qualquer tecla / clica  →  emIntro = false
    // ================================================================

    iniciarIntroducao () {

        // Flag principal: enquanto true, update() bloqueia movimento
        // do player e ignora ESC/inventário.
        this.emIntro = true

        // Sub-flag: true enquanto o player está caminhando automaticamente
        // até o NPC. Durante esse tempo o update() NÃO zera a velocidade.
        this.introMovendo = false

        // ..:: Falas do NPC durante a introdução ::..\
        // Cada string é uma "página" do diálogo — o jogador avança
        // pressionando E ou clicando na caixa.
        this.falasIntro = [
            'Que bom que você está aqui! O museu foi invadido!',
            'Ladrões estão roubando os nossos artefatos históricos!',
            'Preciso chamar a polícia, mas eles podem fugir antes que ela chegue...',
            'Você pode me ajudar? Há 5 artefatos roubados espalhados pelo museu.',
            'Recupere todos e traga de volta para mim antes que os bandidos escapem!',
        ]
        this.falaIntroAtual = 0

        // Referências da caixa de diálogo (criadas mais abaixo em
        // mostrarDialogoIntro). Guardamos aqui para poder destruir depois.
        this.elementosDialogoIntro = []

        // Aguarda a câmera/fade terminar e então inicia o movimento
        // automático do player em direção ao NPC.
        this.cameras.main.fadeIn(600)
        this.cameras.main.once('camerafadeincomplete', () => {
            this.moverPlayerAteNpc()
        })
    }

    moverPlayerAteNpc () {

        // Posição-alvo: logo à direita do NPC (mesma lógica da
        // checagem de diálogo: jogadorADireitaDoNpc).
        const alvoX = this.npc.x + 35
        const alvoY = this.npc.y

        // O player anda para a esquerda em direção ao NPC
        this.direcao = 'esquerda'
        this.player.anims.play('andar-esquerda', true)
        this.player.setVelocityX(-80)
        this.player.setVelocityY(0)
        this.introMovendo = true

        // ..:: Listener no update para detectar chegada ::..\
        // Usamos um evento temporário que roda a cada frame até
        // o player chegar perto o suficiente do alvo.
        this.introMoverListener = () => {

            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                alvoX, alvoY
            )

            if (dist < 20) {
                // Chegou — para o player e inicia o diálogo
                this.introMovendo = false
                this.player.setVelocity(0, 0)
                this.player.anims.play('idle-esquerda', true)

                // Remove este listener temporário
                this.events.off('update', this.introMoverListener)
                this.introMoverListener = null

                // Pequena pausa dramática antes de o NPC falar
                this.time.delayedCall(200, () => {
                    this.mostrarDialogoIntro()
                })
            }
        }

        this.events.on('update', this.introMoverListener)
    }

    mostrarDialogoIntro () {

        const { width, height } = this.scale

        // ..:: Limpa diálogo anterior se existir ::..\
        this.elementosDialogoIntro.forEach(el => el.destroy())
        this.elementosDialogoIntro = []

        const falaAtual = this.falasIntro[this.falaIntroAtual]
        const ultimaFala = this.falaIntroAtual === this.falasIntro.length - 1

        // ..:: Fundo semitransparente da caixa ::..\
        const caixaLarg = 500
        const caixaAltu = 45

        const caixaX = 330 + 330
        const caixaY = height - 190 - 20

        const fundo = this.add.rectangle(caixaX, caixaY, caixaLarg, caixaAltu, 0x1a0e05, 0.88)
        fundo.setScrollFactor(0)
        fundo.setDepth(200)
        fundo.setStrokeStyle(2, 0xc8a96e)

        // ..:: Etiqueta "NPC" no canto superior esquerdo da caixa ::..\
        const nomeNpc = this.add.text(
            caixaX - caixaLarg / 2 + 10,
            caixaY - caixaAltu / 2 + 5,
            'Guardião do Museu',
            {
                fontFamily: 'Georgia, serif',
                fontSize: '12px',
                color: '#e9c97e',
                fontStyle: 'bold'
            }
        )
        nomeNpc.setScrollFactor(0)
        nomeNpc.setDepth(201)

        // ..:: Texto da fala ::..\
        const texto = this.add.text(
            caixaX - caixaLarg / 2 + 10,
            caixaY + 8,
            falaAtual,
            {
                fontFamily: 'Georgia, serif',
                fontSize: '13px',
                color: '#f5e6c8',
                wordWrap: { width: caixaLarg - 25 }
            }
        )
        texto.setScrollFactor(0)
        texto.setDepth(201)
        texto.setOrigin(0, 0.5)

        // ..:: Indicador de "continuar" no canto inferior direito ::..\
        const labelContinuar = ultimaFala ? 'Iniciar  ▶' : 'E / Clique  ▶'
        const indicador = this.add.text(
            caixaX + caixaLarg / 2 - 10,
            caixaY + caixaAltu / 2 - 8,
            labelContinuar,
            {
                fontFamily: 'Georgia, serif',
                fontSize: '9px',
                color: '#c8a96e',
                fontStyle: 'italic'
            }
        )
        indicador.setScrollFactor(0)
        indicador.setDepth(201)
        indicador.setOrigin(1, 1)

        // Guarda todos os elementos para destruir depois
        this.elementosDialogoIntro.push(fundo, nomeNpc, texto, indicador)

        // ..:: Tornar a caixa clicável para avançar ::..\
        fundo.setInteractive()
        fundo.once('pointerdown', () => this.avancarDialogoIntro())

        // ..:: Flag para o update() saber que pode aceitar tecla E ::..\
        this.aguardandoAvancoDialogoIntro = true
    }

    avancarDialogoIntro () {

        // Garante que só avança uma vez por "pressione E"
        if (!this.aguardandoAvancoDialogoIntro) return
        this.aguardandoAvancoDialogoIntro = false

        this.falaIntroAtual++

        if (this.falaIntroAtual < this.falasIntro.length) {
            // Ainda há falas — mostra a próxima
            this.mostrarDialogoIntro()
        } else {
            // Diálogo terminou — destrói a caixa e abre o tutorial
            this.elementosDialogoIntro.forEach(el => el.destroy())
            this.elementosDialogoIntro = []
            this.mostrarTutorial()
        }
    }

    mostrarTutorial () {

        const { width, height } = this.scale

        // ..:: Fundo escuro cobrindo a tela inteira ::..\
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.78)
        overlay.setScrollFactor(0)
        overlay.setDepth(300)

        // ..:: Painel central do tutorial ::..\
        const painelLarg = 600
        const painelAltu = 400
        const painelX = width / 2
        const painelY = height / 2 - 20

        const painel = this.add.rectangle(painelX, painelY, painelLarg, painelAltu, 0x1a0e05, 0.95)
        painel.setScrollFactor(0)
        painel.setDepth(301)
        painel.setStrokeStyle(2, 0xc8a96e)

        // ..:: Título ::..\
        const titulo = this.add.text(painelX, painelY - painelAltu / 2 + 28, 'CONTROLES', {
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            color: '#e9c97e',
            fontStyle: 'bold'
        })
        titulo.setScrollFactor(0)
        titulo.setDepth(302)
        titulo.setOrigin(0.5)

        // Linha separadora abaixo do título
        const separador = this.add.rectangle(painelX, painelY - painelAltu / 2 + 48, painelLarg - 40, 1, 0xc8a96e, 0.5)
        separador.setScrollFactor(0)
        separador.setDepth(302)

        // ..:: Função auxiliar para desenhar uma linha de controle ::..\
        //  tecla   — texto da tecla (ex: 'W A S D')
        //  descricao — o que ela faz
        //  y       — posição vertical
        const corTecla = '#e9d3a3'
        const corBorda = 0x5c3a1e
        const corDesc = '#d4b896'

        const desenharControle = (tecla, descricao, y) => {
            // Caixa da tecla
            const boxTecla = this.add.rectangle(painelX - 130, y, 150, 34, 0x3a1e0a)
            boxTecla.setScrollFactor(0)
            boxTecla.setDepth(302)
            boxTecla.setStrokeStyle(2, corBorda)

            const txtTecla = this.add.text(painelX - 130, y, tecla, {
                fontFamily: 'Georgia, serif',
                fontSize: '14px',
                color: corTecla,
                fontStyle: 'bold'
            })
            txtTecla.setScrollFactor(0)
            txtTecla.setDepth(303)
            txtTecla.setOrigin(0.5)

            // Texto de descrição
            const txtDesc = this.add.text(painelX - 50, y, descricao, {
                fontFamily: 'Georgia, serif',
                fontSize: '15px',
                color: corDesc
            })
            txtDesc.setScrollFactor(0)
            txtDesc.setDepth(303)
            txtDesc.setOrigin(0, 0.5)

            return [boxTecla, txtTecla, txtDesc]
        }

        const linhaInicio = painelY - painelAltu / 2 + 80
        const espacamento = 52

        const controles = [
            ['W A S D  /  ↑ ← ↓ →', 'Mover o personagem', linhaInicio],
            ['SHIFT', 'Segurar para correr', linhaInicio + espacamento],
            ['E', 'Interagir / Pegar item', linhaInicio + espacamento * 2],
            ['I', 'Abrir / Fechar mochila', linhaInicio + espacamento * 3],
            ['ESC', 'Pausar o jogo', linhaInicio + espacamento * 4],
        ]

        const elementosTutorial = [overlay, painel, titulo, separador]

        controles.forEach(([tecla, desc, y]) => {
            desenharControle(tecla, desc, y).forEach(el => elementosTutorial.push(el))
        })

        // ..:: Texto "pressione qualquer tecla para iniciar" ::..\
        const txtIniciar = this.add.text(painelX, painelY + painelAltu / 2 - 28, '— Pressione qualquer tecla ou clique para iniciar —', {
            fontFamily: 'Georgia, serif',
            fontSize: '13px',
            color: '#c8a96e',
            fontStyle: 'italic'
        })
        txtIniciar.setScrollFactor(0)
        txtIniciar.setDepth(302)
        txtIniciar.setOrigin(0.5)
        elementosTutorial.push(txtIniciar)

        elementosTutorial.forEach(el => {
            el.setScale(0.7)
        })

        // Efeito de piscar no texto de iniciar
        this.tweens.add({
            targets: txtIniciar,
            alpha: 0.2,
            duration: 700,
            yoyo: true,
            repeat: -1
        })

        // ..:: Fechar tutorial ao clicar em qualquer lugar ou qualquer tecla ::..\
        const fecharTutorial = () => {
            elementosTutorial.forEach(el => el.destroy())
            this.emIntro = false
            // Remove o listener de clique para não disparar duas vezes
            this.input.off('pointerdown', fecharTutorial)
        }

        // Aguarda um frame antes de registrar os listeners (evita
        // fechar imediatamente com o mesmo clique que avançou o diálogo)
        this.time.delayedCall(200, () => {
            this.input.once('pointerdown', fecharTutorial)
            // Qualquer tecla encerra o tutorial
            this.input.keyboard.once('keydown', fecharTutorial)
        })
    }

    // ================================================================
    // Fim do bloco de introdução
    // ================================================================

    update () {

        // debug colisão
        //this.layerColisao.renderDebug(this.add.graphics(), {
        //tileColor: null,
        //collidingTileColor: new Phaser.Display.Color(255, 0, 0, 100)
        //})


        // debug posição do personagem
        // console.log(this.player.x, this.player.y)

        // ==============================================================
        // ..:: BLOQUEIO DURANTE A INTRODUÇÃO ::..\
        // Enquanto emIntro for true, o player fica travado e nenhuma
        // ação de jogo é processada (inventário, ESC, etc).
        // O listener de movimento automático (introMoverListener) ainda
        // roda via events.on('update'), mas é separado daqui.
        // A tecla E avança o diálogo se estiver aguardando.
        // ==============================================================
        if (this.emIntro) {
            // Só trava o player se ele não estiver em movimento automático.
            // Durante introMovendo = true a velocidade é controlada por
            // moverPlayerAteNpc() e não deve ser zerada aqui.
            if (!this.introMovendo) {
                this.player.setVelocity(0, 0)
            }

            // Tecla E avança o diálogo da introdução
            if (
                this.aguardandoAvancoDialogoIntro &&
                Phaser.Input.Keyboard.JustDown(this.teclaE)
            ) {
                this.avancarDialogoIntro()
            }

            return
        }
        // ==============================================================

        if (Phaser.Input.Keyboard.JustDown(this.teclaI)) {
            if (!this.inventarioAberto) {
                this.mochila.play('abrir_mochila')
                this.abrirInventario()
            } else {
                this.mochila.play('fechar_mochila')
                this.fecharInventario()
            }
        }
        if (!this.soundManager) return
        if (Phaser.Input.Keyboard.JustDown(this.teclaEsc)) {
            this.soundManager.tocarMusica()
            this.scene.pause()
            this.scene.launch('MenuPausa')
        } else {
            this.soundManager.pararMusica()
        }

        // ..:: Movimentação dos inimigos — roda sempre, independente do estado do player ::..
        this.inimigos.forEach(inimigo => {

            if (inimigo.parado) return

            const alvo = inimigo.pontos[inimigo.pontoAtual]

            const distanciaInimigo = Phaser.Math.Distance.Between(
                inimigo.x,
                inimigo.y,
                alvo.x,
                alvo.y
            )

            if (distanciaInimigo < 12) {

                inimigo.pontoAtual++

                if (inimigo.pontoAtual >= inimigo.pontos.length) {
                    inimigo.pontoAtual = 0
                }

            }

            const alvoAtual = inimigo.pontos[inimigo.pontoAtual]

            this.physics.moveTo(
                inimigo,
                alvoAtual.x,
                alvoAtual.y,
                inimigo.velocidade
            )

            const ivx = inimigo.body.velocity.x
            const ivy = inimigo.body.velocity.y

            let direcaoInimigo

            if (Math.abs(ivx) > Math.abs(ivy)) {
                direcaoInimigo = ivx > 0 ? 'direita' : 'esquerda'
            } else {
                direcaoInimigo = ivy > 0 ? 'baixo' : 'cima'
            }

            const animacaoAtual =
                `${inimigo.tipo}-${inimigo.modoMovimento}-${direcaoInimigo}`

            if (
                !inimigo.anims.currentAnim ||
                inimigo.anims.currentAnim.key !== animacaoAtual
            ) {
                inimigo.play(animacaoAtual)
            }

        })

        if (this.coletandoItem) {
            this.player.setVelocity(0, 0);
            return;
        }
        if (this.inventarioAberto) {
            this.player.setVelocity(0, 0);
            return;
        }
        if (this.tomandoDano) {
            this.player.setVelocity(0, 0);
            return;
        }



        const correndo = this.shift.isDown

        const velocidade = correndo ? 250 : 150

        let vx = 0
        let vy = 0

        const esquerda = this.cursors.left.isDown || this.wasd.left.isDown
        const direita = this.cursors.right.isDown || this.wasd.right.isDown
        const cima = this.cursors.up.isDown || this.wasd.up.isDown
        const baixo = this.cursors.down.isDown || this.wasd.down.isDown

        if (esquerda) vx = -1
        else if (direita) vx = 1

        if (cima) vy = -1
        else if (baixo) vy = 1

        // Atualiza a direção da animação. Em diagonal, o eixo vertical
        // tem prioridade visual (não existem frames de diagonal na
        // spritesheet), então o personagem "olha" para cima/baixo
        // mas se move nos dois eixos ao mesmo tempo.
        if (vy < 0) this.direcao = 'cima'
        else if (vy > 0) this.direcao = 'baixo'
        else if (vx < 0) this.direcao = 'esquerda'
        else if (vx > 0) this.direcao = 'direita'

        // Normaliza a velocidade para que andar na diagonal não seja
        // mais rápido do que andar reto (vetor (1,1) tem módulo > 1).
        if (vx !== 0 && vy !== 0) {
            const fator = Math.SQRT1_2 // 1/raiz(2)
            vx *= fator
            vy *= fator
        }

        vx *= velocidade
        vy *= velocidade

        this.player.setVelocity(vx, vy)


        if (vx !== 0 || vy !== 0) {
            const prefixo = correndo ? 'correr' : 'andar'
            this.player.anims.play(prefixo + '-' + this.direcao, true)
            this.soundManager.tocarPasso(correndo)
        } else {
            this.player.anims.play('idle-' + this.direcao, true)
            this.soundManager.pararPassos()
        }

        // Balão de conversa do NPC:
        this.iconeConversa.setPosition(
            this.npc.x,
            this.npc.y - 40
        )

        const distancia = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.npc.x,
            this.npc.y
        )

        const pertoDoNpc = distancia < 50
        const jogadorADireitaDoNpc = this.player.x > this.npc.x

        this.iconeConversa.setVisible(
            pertoDoNpc &&
            jogadorADireitaDoNpc
        )

        const podeConversar = this.iconeConversa.visible;

        if (
            podeConversar &&
            Phaser.Input.Keyboard.JustDown(this.teclaE) &&
            this.npc.anims.currentAnim.key !== 'npc-agradecendo'
        ) {

            if (this.inventarioPlayer.length === 0) {

                // conversa normal
                console.log("NPC: Vá buscar os artefatos!");

            } else {

                // entrega dos itens
                this.entregarItens();

            }
        }

        // ..:: Configuração para aparecer a mão indicando que o player pode pegar o item ::..
        const itensColetaveis = [
            this.cranioDeOnca,
            this.espadaDomPedro,
            this.maquinaDeEscrever,
            this.mascaraTribal,
            this.relicarioDourado
        ].filter(item => item.active)

        this.itemProximo = null

        itensColetaveis.forEach(item => {
            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                item.x, item.y
            )
            if (dist < 40) {
                this.itemProximo = item
            }
        })

        if (this.itemProximo) {
            this.iconeMao.setVisible(true)
            this.iconeMao.setPosition(this.itemProximo.x, this.itemProximo.y - 40)
        } else {
            this.iconeMao.setVisible(false)
        }
    }
    coletarItem(item) {

        if (
            !this.coletandoItem &&
            !this.tomandoDano &&
            Phaser.Input.Keyboard.JustDown(this.teclaE)
        ) {

            this.coletandoItem = true;

            this.player.anims.play(
                'pegarItem-' + this.direcao
            );

            // Guarda a referência do callback para poder cancelá-lo
            // caso a animação seja interrompida por receberDano().
            this.callbackColeta = () => {

                const dadosItem = this.dadosItens[item.itemId];

                this.inventarioPlayer.push(dadosItem);

                console.log(this.inventarioPlayer);

                item.disableBody(true, true);

                this.coletandoItem = false;
                this.callbackColeta = null;

            };

            this.player.once(
                'animationcomplete-pegarItem-' + this.direcao,
                this.callbackColeta
            );
        }
    }

    receberDano(inimigo) {
        if (this.tomandoDano) return;

        // Se o jogador for atingido no meio da animação de coletar item,
        // a animação 'pegarItem-...' é interrompida abaixo e o evento
        // 'animationcomplete-pegarItem-...' nunca dispara. Sem isto,
        // 'coletandoItem' ficaria travado em true para sempre, prendendo
        // o personagem (ver checagem em update()).
        if (this.coletandoItem) {
            if (this.callbackColeta) {
                this.player.off(
                    'animationcomplete-pegarItem-' + this.direcao,
                    this.callbackColeta
                );
                this.callbackColeta = null;
            }
            this.coletandoItem = false;
        }

        this.tomandoDano = true;
        this.player.setVelocity(0, 0);

        const dx = this.player.x - inimigo.x;
        const dy = this.player.y - inimigo.y;
        let direcaoAtaque;

        if (Math.abs(dx) > Math.abs(dy)) {
            direcaoAtaque = dx > 0 ? 'direita' : 'esquerda';
        } else {
            direcaoAtaque = dy > 0 ? 'baixo' : 'cima';
        }

        inimigo.parado = true;
        inimigo.setVelocity(0, 0);
        inimigo.play(`${inimigo.tipo}-atacar-${direcaoAtaque}`);



        // ..:: Roubo dos itens — devolve ao mapa os itens sem check ::..
        if (this.inventarioPlayer.length > 0) {
            this.inventarioPlayer.forEach(item => {
                const sprite = this.spritesItens[item.id]
                const pos = this.posicoesOriginaisItens[item.id]

                if (sprite && pos) {
                    sprite.enableBody(true, pos.x, pos.y, true, true)
                }
            })

            this.inventarioPlayer = []
        }

        this.time.delayedCall(400, () => {
            this.player.anims.play('cair');
            this.cameras.main.fadeOut(800);

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.player.x = this.spawnX;
                this.player.y = this.spawnY;

                this.cameras.main.fadeIn(800);
                this.player.anims.play('levantar');

                this.player.once('animationcomplete-levantar', () => {
                    inimigo.parado = inimigo.paradoOriginal;
                    if (inimigo.paradoOriginal) {
                        inimigo.play(`${inimigo.tipo}-idle-${inimigo.direcao}`)
                    }

                    this.tomandoDano = false;
                });
            });
        });
    }

    entregarItens() {
        if (this.inventarioPlayer.length === 0) {
            return;
        }

        // Move itens para o inventário do NPC, mantendo registro
        this.inventarioNpc.push(...this.inventarioPlayer);
        this.inventarioPlayer = [];

        console.log("Itens entregues!");
        console.table(this.inventarioNpc);

        this.npc.play('npc-agradecendo');

        if (this.inventarioNpc.length >= 5) {
            this.time.delayedCall(1000, () => {
                this.scene.start('Vitoria');
            });
        }
    }

    abrirInventario() {

        this.inventarioAberto = true;

        this.physics.pause();

        this.painelInventario.setVisible(true);

        this.desenharItensInventario();

    }

    fecharInventario() {

        this.inventarioAberto = false;

        this.physics.resume();

        this.painelInventario.setVisible(false);

        this.iconesInventario.forEach(icone => {
            icone.destroy();
        });

        this.iconesInventario = [];

    }

    desenharItensInventario() {
        const centroX = this.painelInventario.x;
        const centroY = this.painelInventario.y;

        const posicoesItens = {
            cranioDeOnca: { x: centroX - 70, y: centroY - 40 },
            maquinaDeEscrever: { x: centroX + 70, y: centroY - 40 },
            mascaraTribal: { x: centroX - 70, y: centroY + 40 },
            relicarioDourado: { x: centroX + 70, y: centroY + 40 },
            espadaDomPedro: { x: centroX, y: centroY + 90 }
        };

        // IDs dos itens já entregues ao NPC
        const idsEntregues = this.inventarioNpc.map(i => i.id);

        // Junta itens na mochila + itens já entregues (sem duplicar)
        const todosOsItens = [...this.inventarioPlayer];
        this.inventarioNpc.forEach(item => {
            if (!todosOsItens.find(i => i.id === item.id)) {
                todosOsItens.push(item);
            }
        });

        todosOsItens.forEach(item => {
            const pos = posicoesItens[item.id];
            if (!pos) return;

            // Ícone do item
            const icone = this.add.image(pos.x, pos.y, item.sprite);
            icone.setScale(1);
            icone.setScrollFactor(0);
            icone.setDepth(101);
            this.iconesInventario.push(icone);

            // Se o item foi entregue, adiciona o check ao lado direito
            if (idsEntregues.includes(item.id)) {
                const check = this.add.image(pos.x + 24, pos.y - 24, 'check');
                check.setScale(0.4);
                check.setScrollFactor(0);
                check.setDepth(102);
                this.iconesInventario.push(check);
            }
        });
    }
}