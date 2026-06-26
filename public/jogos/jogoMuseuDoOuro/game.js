// =============================================================================
// 1. VARIÁVEIS GLOBAIS E CONFIGURAÇÕES
// =============================================================================
let volumeGlobal = 1.0;

let gancho, linhaCorda, grupoObjetos;
let estadoGancho = 'BALANCANDO', anguloGancho = 0, balancandoParaDireita = true;

const velocidadeMaxima = 4.0;
const velocidadeTiroPadrao = 8;
let velocidadeBalanço = 1.0, objetoPuxado = null;

let moedasColetadas = 0;
const metaMoedas = 25;

let cenarioAtual = 1;
let faseNoCenario = 1;
let fragmentosAtuais = 0;
let reliquiasCompletas = 0;

let tempoRestante = 100;
let jogoAcabou = false;
let esperandoProximaFase = false;
let fragmentoRevelado = false;
let jogoVencido = false;

let estamina = 150;
const estaminaMaxima = 150;

let graficoTempoPizza;
let textoHUD, textoCentro, barraEstamina, labelBoost, textoRelogio;
let teclaEspaco;

let gameOverRetangulo = null, gameOverTexto = null;

let posicoesOcupadas = [];
let musicaFase; // Armazena a trilha sonora atual

// =============================================================================
// 2. SISTEMA DE MEMORY CARD (LOCALSTORAGE)
// =============================================================================
function salvarJogo() {
    let save = { cenario: cenarioAtual, fase: faseNoCenario, fragmentos: fragmentosAtuais, reliquias: reliquiasCompletas };
    localStorage.setItem('museuSave', JSON.stringify(save));
}

function carregarJogo() {
    let saveText = localStorage.getItem('museuSave');
    if (saveText) {
        let data = JSON.parse(saveText);
        cenarioAtual = data.cenario;
        faseNoCenario = data.fase;
        fragmentosAtuais = data.fragmentos;
        reliquiasCompletas = data.reliquias;
    }
}

function limparSave() {
    localStorage.removeItem('museuSave');
}

// =============================================================================
// FUNÇÃO GLOBAL: CRIAR BOTÃO ESTILIZADO DO MUSEU
// =============================================================================
function criarBotaoMuseu(scene, x, y, w, h, label, ativo, callback) {
    // Cores inspiradas na fachada do Museu: Parede creme, Pilares vermelhos, Porta de madeira
    let corParede = ativo ? 0xfdf1db : 0xcccccc;
    let corPilar = ativo ? 0xb12423 : 0x777777;
    let corTexto = ativo ? '#6e3c1d' : '#555555';

    scene.add.rectangle(x + 4, y + 4, w, h, 0x000000, 0.4).setOrigin(0.5);

    let bg = scene.add.rectangle(x, y, w, h, corParede).setOrigin(0.5);
    bg.setStrokeStyle(4, corPilar);

    let detalhe = scene.add.rectangle(x, y, w - 10, h - 10).setStrokeStyle(2, corPilar, 0.4).setOrigin(0.5);

    let txt = scene.add.text(x, y, label, {
        fontFamily: 'Arial', fontSize: Math.floor(h * 0.4) + 'px', fontStyle: 'bold', color: corTexto
    }).setOrigin(0.5);

    if (ativo) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => { bg.setFillStyle(0xffffff); txt.setScale(1.05); detalhe.setScale(1.02); });
        bg.on('pointerout', () => { bg.setFillStyle(corParede); txt.setScale(1.0); detalhe.setScale(1.0); });
        if (callback) {
            bg.on('pointerdown', () => { bg.setFillStyle(0xe8d5b5); scene.time.delayedCall(50, callback); });
        }
    }
    return bg;
}

// =============================================================================
// 3. TELA INICIAL (MENU PRINCIPAL)
// =============================================================================
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('fundo_capa', 'img/sprites/cenarios/capa.png');
        this.load.audio('musica_cenario_1', 'audio/primeira-musica.mp3');
        this.load.audio('musica_cenario_2', 'audio/segunda-musica.mp3');
        this.load.audio('musica_cenario_3', 'audio/terceira-musica.mp3');
    }

    create() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;

        carregarJogo();

        let savedVol = localStorage.getItem('museuVolume');
        volumeGlobal = savedVol !== null ? parseFloat(savedVol) : 1.0;

        let fundo = this.add.image(W / 2, H / 2, 'fundo_capa');
        fundo.setDisplaySize(W, H);

        // this.add.rectangle(0, 0, W, H, 0x000000, 0.4).setOrigin(0, 0);

        // Grade 2/2/1 no canto inferior esquerdo
        const colX1 = 210;     // centro da coluna esquerda (era 155)
        const colX2 = 360;     // centro da coluna direita (era 305)
        const colGap = colX2 - colX1;
        const linhaH = 48;      // distância entre linhas
        const linha3 = H - 150; // Y da última linha (OPÇÕES)
        const linha2 = linha3 - linhaH;
        const linha1 = linha2 - linhaH;

        this._criarBotaoSprite(colX1, linha1, 'NOVO JOGO', true, () => {
            limparSave();
            cenarioAtual = 1; faseNoCenario = 1; fragmentosAtuais = 0; reliquiasCompletas = 0;
            jogoAcabou = false; esperandoProximaFase = false; jogoVencido = false;
            this.scene.start('GameScene');
        });

        let saveText = localStorage.getItem('museuSave');
        let temSave = saveText !== null;
        let savePodesContinuar = temSave && (() => {
            try {
                let data = JSON.parse(saveText);
                return !data.reliquias || data.reliquias < 3; // Só pode continuar se NÃO completou as 3 relíquias
            } catch {
                return true;
            }
        })();

        this._criarBotaoSprite(colX2, linha1, 'CONTINUAR', savePodesContinuar, savePodesContinuar ? () => {
            jogoAcabou = false; esperandoProximaFase = false; jogoVencido = false;
            this.scene.start('GameScene');
        } : null);

        if (!savePodesContinuar && temSave) {
            this.add.text(colX2, linha1 + 24, 'Jogo Completo!', {
                fontFamily: 'Arial', fontSize: '11px', color: '#00ff00', align: 'center'
            }).setOrigin(0.5);
        } else if (!temSave) {
            this.add.text(colX2, linha1 + 24, 'Sem save', {
                fontFamily: 'Arial', fontSize: '11px', color: '#aaaaaa'
            }).setOrigin(0.5);
        }

        this._criarBotaoSprite(colX1, linha2, 'INVENTÁRIO', true, () => {
            this.scene.start('InventoryScene');
        });

        this._criarBotaoSprite(colX2, linha2, 'TUTORIAL', true, () => {
            this.scene.start('TutorialScene');
        });

        this._criarBotaoSprite(colX1 + colGap / 2, linha3, 'OPÇÕES', true, () => {
            this.scene.start('OptionsScene');
        });

        this.add.text(W / 2, H - 14, 'Projeto de Extensão — Análise e Desenvolvimento de Sistemas', {
            fontFamily: 'Arial', fontSize: '12px', color: '#dddddd'
        }).setOrigin(0.5);

        const tocaMusicaMenu = () => {
            if (!this.sys.isActive()) return;
            this.musicaMenu = this.sound.add('musica_cenario_1');
            this.musicaMenu.play({ loop: true, volume: volumeGlobal });
        };
        if (this.sound.locked) {
            this.sound.once('unlocked', tocaMusicaMenu);
        } else {
            tocaMusicaMenu();
        }
        this.events.once('shutdown', () => {
            this.sound.off('unlocked', tocaMusicaMenu);
            if (this.musicaMenu) { this.musicaMenu.stop(); this.musicaMenu.destroy(); this.musicaMenu = null; }
        });
    }

    _criarBotaoSprite(x, y, label, ativo, callback) {
        criarBotaoMuseu(this, x, y, 140, 42, label, ativo, callback);
    }
}

// =============================================================================
// 4. SALA DE EXPOSIÇÃO (INVENTÁRIO)
// =============================================================================
class InventoryScene extends Phaser.Scene {
    constructor() { super({ key: 'InventoryScene' }); }

    preload() {
        const relics = ['mascara', 'santo', 'tigre'];
        relics.forEach(relic => {
            for (let i = 1; i <= 3; i++) {
                this.load.image(`frag_${relic}_${i}`, `img/sprites/fragmentos/${relic}${i}.png`);
            }
            this.load.image(`frag_${relic}_full`, `img/sprites/fragmentos/${relic}full.png`);
        });
    }

    create() {
        const W = this.cameras.main.width, H = this.cameras.main.height;

        this.add.rectangle(0, 0, W, H / 2, 0x1a0800).setOrigin(0, 0);
        this.add.rectangle(0, H / 2, W, H / 2, 0x3e2000).setOrigin(0, 0);

        let moldura = this.add.graphics();
        moldura.lineStyle(3, 0xd4af37, 0.5);
        moldura.strokeRect(28, 28, W - 56, H - 56);

        this.add.text(W / 2, 100, 'SALA DE EXPOSIÇÃO', {
            fontFamily: 'Arial', fontSize: '50px', fontStyle: 'bold', color: '#d4af37', stroke: '#5c3a00', strokeThickness: 6
        }).setOrigin(0.5);

        let reliquiasSalvas = 0, fragmentosSalvos = 0;
        let saveText = localStorage.getItem('museuSave');
        if (saveText) {
            let data = JSON.parse(saveText);
            reliquiasSalvas = data.reliquias || 0;
            fragmentosSalvos = data.fragmentos || 0;
        }

        const nomesReliquias = ["Máscara Ritual", "Imagem do Santo", "Tigre de Bronze"];
        const relicKeys = ['mascara', 'santo', 'tigre'];
        const espacamento = 250;
        const startX = W / 2 - espacamento;

        for (let i = 0; i < 3; i++) {
            let px = startX + (i * espacamento);
            let py = 330;

            let frame = this.add.graphics();
            frame.fillStyle(0x1a0d00, 0.85);
            frame.fillRoundedRect(px - 100, py - 120, 200, 250, 10);
            frame.lineStyle(3, 0xd4af37, 0.9);
            frame.strokeRoundedRect(px - 100, py - 120, 200, 250, 10);

            let fragsDestaReliquia = (reliquiasSalvas > i) ? 3 : ((reliquiasSalvas === i) ? fragmentosSalvos : 0);
            const rKey = relicKeys[i];

            if (fragsDestaReliquia === 3) {
                let fullImg = this.add.image(px, py - 10, `frag_${rKey}_full`);
                fullImg.setDisplaySize(170, 190);
                this.add.text(px, py + 110, nomesReliquias[i], {
                    fontFamily: 'Arial', fontSize: '18px', fontStyle: 'bold', color: '#00ff00', align: 'center'
                }).setOrigin(0.5);
            } else if (fragsDestaReliquia > 0) {
                for (let j = 1; j <= 3; j++) {
                    let pieceY = py - 70 + (j - 1) * 65;
                    let piece = this.add.image(px, pieceY, `frag_${rKey}_${j}`);
                    piece.setDisplaySize(165, 55);
                    if (j > fragsDestaReliquia) {
                        piece.setTint(0x111111);
                        piece.setAlpha(0.3);
                    }
                }
                this.add.text(px, py + 110, `Restaurando...\n(${fragsDestaReliquia}/3)`, {
                    fontFamily: 'Arial', fontSize: '16px', fontStyle: 'bold', color: '#ffd700', align: 'center'
                }).setOrigin(0.5);
            } else {
                this.add.text(px, py - 10, '?', {
                    fontFamily: 'Arial', fontSize: '60px', fontStyle: 'bold', color: '#443322'
                }).setOrigin(0.5);
                this.add.text(px, py + 110, 'Bloqueado', {
                    fontFamily: 'Arial', fontSize: '18px', fontStyle: 'bold', color: '#443322', align: 'center'
                }).setOrigin(0.5);
            }
        }

        this._criarBotaoVoltar(W / 2, 650, () => { this.scene.start('MenuScene'); });
    }

    _renderizarFragmento(x, y, temPeca) {
        let frag = this.add.sprite(x, y, 'spr_fragmento_inv');
        frag.setDisplaySize(60, 30);
        if (!temPeca) frag.setTint(0x222222);
    }

    _criarBotaoVoltar(x, y, callback) {
        criarBotaoMuseu(this, x, y, 280, 62, '← VOLTAR AO MENU', true, callback);
    }
}

// =============================================================================
// 5. TELA DE TUTORIAL
// =============================================================================
class TutorialScene extends Phaser.Scene {
    constructor() { super({ key: 'TutorialScene' }); }

    create() {
        const W = this.cameras.main.width, H = this.cameras.main.height;

        this.add.rectangle(0, 0, W, H / 2, 0x1a0800).setOrigin(0, 0);
        this.add.rectangle(0, H / 2, W, H / 2, 0x3e2000).setOrigin(0, 0);

        let moldura = this.add.graphics();
        moldura.lineStyle(3, 0xd4af37, 0.5);
        moldura.strokeRect(28, 28, W - 56, H - 56);

        this.add.text(W / 2, 100, 'COMO JOGAR', {
            fontFamily: 'Arial', fontSize: '50px', fontStyle: 'bold', color: '#d4af37', stroke: '#5c3a00', strokeThickness: 6
        }).setOrigin(0.5);

        let painel = this.add.graphics();
        painel.fillStyle(0x000000, 0.5);
        painel.fillRoundedRect(W / 2 - 350, 180, 700, 380, 16);
        painel.lineStyle(2, 0xd4af37, 0.8);
        painel.strokeRoundedRect(W / 2 - 350, 180, 700, 380, 16);

        let instrucoes = [
            "🎣 O gancho balança automaticamente de um lado para o outro.",
            "",
            "🖱️ Clique com o MOUSE ou aperte ESPAÇO para lançar a corda.",
            "",
            "⚙️ Pegou uma pedra muito pesada? SEGURE o clique/ESPAÇO",
            "para usar o BOOST de força. Mas cuidado: isso gasta Energia!",
            "",
            "💎 Junte moedas e diamantes para somar 25 Pontos e revelar",
            "o Fragmento de Relíquia perdido no cenário.",
            "",
            "⏳ Fique de olho no Relógio! Se o tempo acabar, é Game Over."
        ];

        this.add.text(W / 2, 370, instrucoes.join('\n'), {
            fontFamily: 'Arial', fontSize: '22px', color: '#ffffff', align: 'center', lineSpacing: 5
        }).setOrigin(0.5);

        this._criarBotaoVoltar(W / 2, 650, () => { this.scene.start('MenuScene'); });
    }

    _criarBotaoVoltar(x, y, callback) {
        criarBotaoMuseu(this, x, y, 280, 62, '← ENTENDIDO!', true, callback);
    }
}

// =============================================================================
// 6. CLASSE UTILITÁRIA: SLIDER DE VOLUME E OPÇÕES
// =============================================================================
class SliderVolume {
    constructor(scene, cx, sy, sw, muteY, onVolumeChange) {
        this._scene = scene;
        this._SX = cx - sw / 2;
        this._SY = sy;
        this._SW = sw;
        this._cx = cx;
        this._muteY = muteY;
        this._onVolumeChange = onVolumeChange || null;
        this._arrastando = false;
        this._volAntesMute = null;

        let trilha = scene.add.graphics();
        trilha.fillStyle(0x2a1800, 1);
        trilha.fillRoundedRect(this._SX, sy - 8, sw, 16, 8);
        trilha.lineStyle(1, 0x7a5c00, 1);
        trilha.strokeRoundedRect(this._SX, sy - 8, sw, 16, 8);

        this.sliderFill = scene.add.graphics();
        this.handle = scene.add.circle(this._SX + volumeGlobal * sw, sy, 20, 0xd4af37);
        this.handle.setStrokeStyle(3, 0x5c3a00);

        this.textoVol = scene.add.text(cx, sy + 60, `${Math.round(volumeGlobal * 100)}%`, {
            fontFamily: 'Arial', fontSize: '34px', fontStyle: 'bold', color: '#d4af37'
        }).setOrigin(0.5);

        this._atualizarSlider();

        let zonaSlider = scene.add.zone(cx, sy, sw + 60, 70).setInteractive({ useHandCursor: true });
        zonaSlider.on('pointerdown', (ptr) => { this._arrastando = true; this._moverSlider(ptr.x); });
        scene.input.on('pointermove', (ptr) => { if (this._arrastando) this._moverSlider(ptr.x); });
        scene.input.on('pointerup', () => {
            if (this._arrastando) {
                this._arrastando = false;
                localStorage.setItem('museuVolume', volumeGlobal);
            }
        });

        this._muteBg = scene.add.graphics();
        this._muteTxt = scene.add.text(cx, muteY, '🔇  MUDO', {
            fontFamily: 'Arial', fontSize: '24px', fontStyle: 'bold',
            color: volumeGlobal === 0 ? '#d4af37' : '#664422'
        }).setOrigin(0.5);
        this._desenharMute(volumeGlobal === 0);

        let zonaMute = scene.add.zone(cx, muteY, 200, 50).setInteractive({ useHandCursor: true });
        zonaMute.on('pointerdown', () => {
            if (volumeGlobal > 0) {
                this._volAntesMute = volumeGlobal;
                this._moverSlider(this._SX);
            } else {
                this._moverSlider(this._SX + (this._volAntesMute || 1.0) * this._SW);
            }
            localStorage.setItem('museuVolume', volumeGlobal);
        });
    }

    _moverSlider(mouseX) {
        let novoX = Phaser.Math.Clamp(mouseX, this._SX, this._SX + this._SW);
        volumeGlobal = (novoX - this._SX) / this._SW;
        this.handle.x = novoX;
        this.textoVol.setText(`${Math.round(volumeGlobal * 100)}%`);
        this._atualizarSlider();
        this._desenharMute(volumeGlobal === 0);
        this._muteTxt.setColor(volumeGlobal === 0 ? '#d4af37' : '#664422');
        this._scene.sound.volume = volumeGlobal;
        if (this._onVolumeChange) this._onVolumeChange(volumeGlobal);
    }

    _atualizarSlider() {
        this.sliderFill.clear();
        if (volumeGlobal > 0) {
            this.sliderFill.fillStyle(0xd4af37, 1);
            this.sliderFill.fillRoundedRect(this._SX, this._SY - 8, volumeGlobal * this._SW, 16, { tl: 8, bl: 8, tr: 0, br: 0 });
        }
    }

    _desenharMute(ativo) {
        this._muteBg.clear();
        this._muteBg.lineStyle(2, ativo ? 0xd4af37 : 0x443322, 1);
        this._muteBg.strokeRoundedRect(this._cx - 90, this._muteY - 22, 180, 45, 8);
    }
}

class OptionsScene extends Phaser.Scene {
    constructor() { super({ key: 'OptionsScene' }); }

    create() {
        const W = this.cameras.main.width, H = this.cameras.main.height;

        this.add.rectangle(0, 0, W, H / 2, 0x1a0800).setOrigin(0, 0);
        this.add.rectangle(0, H / 2, W, H / 2, 0x3e2000).setOrigin(0, 0);

        let moldura = this.add.graphics();
        moldura.lineStyle(3, 0xd4af37, 0.5);
        moldura.strokeRect(28, 28, W - 56, H - 56);

        this.add.text(W / 2, 120, 'OPÇÕES', {
            fontFamily: 'Arial', fontSize: '58px', fontStyle: 'bold', color: '#d4af37', stroke: '#5c3a00', strokeThickness: 7
        }).setOrigin(0.5);

        this.add.text(W / 2, 245, 'VOLUME', {
            fontFamily: 'Arial', fontSize: '28px', fontStyle: 'bold', color: '#bf8b6e'
        }).setOrigin(0.5);

        this.add.text(W / 2 - 240, 330, '🔇', { fontSize: '28px' }).setOrigin(0.5);
        this.add.text(W / 2 + 240, 330, '🔊', { fontSize: '28px' }).setOrigin(0.5);

        new SliderVolume(this, W / 2, 330, 400, 480);

        this._criarBotaoVoltar(W / 2, 620, () => { this.scene.start('MenuScene'); });
    }

    _criarBotaoVoltar(x, y, callback) {
        criarBotaoMuseu(this, x, y, 280, 62, '← VOLTAR AO MENU', true, callback);
    }
}

// =============================================================================
// 7. PAUSA
// =============================================================================
class PauseScene extends Phaser.Scene {
    constructor() { super({ key: 'PauseScene' }); }

    init(data) {
        this.parentScene = data.parentScene || 'GameScene';
    }

    create() {
        const W = this.cameras.main.width, H = this.cameras.main.height;

        this.add.rectangle(0, 0, W, H, 0x000000, 0.65).setOrigin(0, 0);

        let painel = this.add.graphics();
        painel.fillStyle(0x120f09, 0.95);
        painel.fillRoundedRect(W / 2 - 350, 128, 700, 512, 18);
        painel.lineStyle(3, 0xd4af37, 1);
        painel.strokeRoundedRect(W / 2 - 350, 128, 700, 512, 18);

        this.add.text(W / 2, 190, 'PAUSADO', {
            fontFamily: 'Arial', fontSize: '58px', fontStyle: 'bold', color: '#d4af37', stroke: '#5c3a00', strokeThickness: 6
        }).setOrigin(0.5);

        new SliderVolume(this, W / 2, 340, 400, 470, (vol) => {
            this.scene.get(this.parentScene).sound.volume = vol;
        });

        this._criarBotaoSprite(W / 2, 540, 'CONTINUAR', true, () => { this._retomarJogo(); });
        this._criarBotaoSprite(W / 2, 620, 'MENU INICIAL', true, () => {
            if (musicaFase) musicaFase.stop(); // Mata o som ao sair pro menu
            this.scene.stop(this.parentScene);
            this.scene.stop();
            this.scene.start('MenuScene');
        });

        this.input.keyboard.on('keydown-ESC', () => { this._retomarJogo(); });
        this.input.keyboard.on('keydown-SPACE', () => { this._retomarJogo(); });
    }

    _criarBotaoSprite(x, y, label, ativo, callback) {
        criarBotaoMuseu(this, x, y, 320, 68, label, ativo, callback);
    }

    _retomarJogo() {
        this.scene.stop();
        this.scene.resume(this.parentScene);
    }
}

// =============================================================================
// 8. O JOGO PRINCIPAL E A LÓGICA CORE
// =============================================================================
class GameScene extends Phaser.Scene {
    constructor() { super({ key: 'GameScene' }); }

    preload() {
        this.load.image('spr_arqueologo_1', 'img/sprites/cenarios/arqueologo.chao.png');
        this.load.image('spr_arqueologo_2', 'img/sprites/cenarios/arqueologo.jangada-removebg-preview.png');
        this.load.image('spr_arqueologo_3', 'img/sprites/cenarios/arqueologo.jeep.png');
        this.load.image('spr_gancho', 'img/sprites/cenarios/garra_fechada.png');
        this.load.image('fundo_cenario_terra', 'img/sprites/cenarios/terra.jpeg');
        this.load.image('fundo_cenario_agua', 'img/sprites/cenarios/agua.jpeg');
        this.load.image('fundo_cenario_cascalho', 'img/sprites/cenarios/cascalho.jpeg');
        this.load.image('spr_moeda_prata', 'img/sprites/cenarios/moeda_1000.png');
        this.load.image('spr_moeda_bronze', 'img/sprites/cenarios/moeda_500.png');
        this.load.image('spr_pedra_grande', 'img/sprites/cenarios/pedra_grande.png');
        this.load.image('spr_pedra_pequena', 'img/sprites/cenarios/pedra_pequena.png');
        this.load.image('spr_concha_grande', 'img/sprites/cenarios/concha_grande.png');
        this.load.image('spr_concha_pequena', 'img/sprites/cenarios/concha_pequena.png');
        this.load.image('frag_mascara_1', 'img/sprites/fragmentos/mascara1.png');
        this.load.image('frag_mascara_2', 'img/sprites/fragmentos/mascara2.png');
        this.load.image('frag_mascara_3', 'img/sprites/fragmentos/mascara3.png');
        this.load.image('frag_mascara_full', 'img/sprites/fragmentos/mascarafull.png');
        this.load.image('frag_santo_1', 'img/sprites/fragmentos/santo1.png');
        this.load.image('frag_santo_2', 'img/sprites/fragmentos/santo2.png');
        this.load.image('frag_santo_3', 'img/sprites/fragmentos/santo3.png');
        this.load.image('frag_santo_full', 'img/sprites/fragmentos/santofull.png');
        this.load.image('frag_tigre_1', 'img/sprites/fragmentos/tigre1.png');
        this.load.image('frag_tigre_2', 'img/sprites/fragmentos/tigre2.png');
        this.load.image('frag_tigre_3', 'img/sprites/fragmentos/tigre3.png');
        this.load.image('frag_tigre_full', 'img/sprites/fragmentos/tigrefull.png');
        this.load.image('exib_mascara', 'img/sprites/fragmentos/mascara%20exibicao.png');
        this.load.image('exib_santo', 'img/sprites/fragmentos/santo%20exibicao.png');
        this.load.image('exib_tigre', 'img/sprites/fragmentos/tigre%20exibicao.png');
    }

    create() {
        this.sound.volume = volumeGlobal;
        create.call(this);
    }

    update() {
        update.call(this);
    }
}

GameScene.prototype._criarBotaoPausa = function (x, y) {
    this.botaoPausaBg = criarBotaoMuseu(this, x, y, 50, 50, 'II', true, () => { this._abrirMenuPausa(); });
};

GameScene.prototype._abrirMenuPausa = function () {
    if (this.scene.isPaused()) return;
    this.scene.launch('PauseScene', { parentScene: this.scene.key });
    this.scene.pause();
};

function create() {
    carregarJogo();

    if (!this.textures.exists('spr_diamante')) {
        const g = this.make.graphics({ add: false });
        g.fillStyle(0x00ccff, 1);
        g.fillTriangle(20, 0, 40, 20, 20, 40);
        g.fillTriangle(20, 0, 0, 20, 20, 40);
        g.fillStyle(0xffffff, 0.35);
        g.fillTriangle(8, 18, 20, 2, 20, 18);
        g.lineStyle(2, 0x0088cc, 1);
        g.strokePoints([{ x: 20, y: 0 }, { x: 40, y: 20 }, { x: 20, y: 40 }, { x: 0, y: 20 }], true);
        g.generateTexture('spr_diamante', 40, 40);
        g.destroy();
    }

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    textoHUD = this.add.text(10, 10, '', { font: '22px Arial', fill: '#fff', fontStyle: 'bold' });
    textoCentro = this.add.text(W / 2, H / 2, '', { font: '45px Arial', fill: '#00ff00', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);

    this.add.text(10, 60, '⚡ ENERGIA', { font: '13px Arial', fill: '#ffdd55', fontStyle: 'bold' });
    barraEstamina = this.add.graphics();

    labelBoost = this.add.text(250, 76, '⚡ FORÇA!', { font: '13px Arial', fill: '#ffff00', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setVisible(false);

    const cx = W - 104, cy = 108;

    let clockShadow = this.add.graphics();
    clockShadow.fillStyle(0x000000, 0.5); clockShadow.fillCircle(cx + 3, cy + 3, 57);
    let clockFace = this.add.graphics();
    clockFace.fillStyle(0x1c0f04, 1); clockFace.fillCircle(cx, cy, 54);
    clockFace.lineStyle(5, 0xd4af37, 1); clockFace.strokeCircle(cx, cy, 55);

    graficoTempoPizza = this.add.graphics({ x: cx, y: cy }).setDepth(1);

    this.add.text(cx, cy - 24, 'TEMPO', { font: '11px Arial', fill: '#bf8b6e', fontStyle: 'bold' }).setOrigin(0.5).setDepth(3);
    textoRelogio = this.add.text(cx, cy + 10, '100', { font: 'bold 26px Arial', fill: '#f0e0b0', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(3);

    grupoObjetos = this.physics.add.group();
    linhaCorda = this.add.graphics();

    gancho = this.physics.add.sprite(W / 2, 170, 'spr_gancho');
    gancho.setDisplaySize(64, 80); // mantém a proporção da garra (919x1152)
    gancho.setDepth(2);            // garra acima dos objetos soltos no cenário

    // Ajusta a hitbox da garra para pegar objetos apenas com a ponta (reduz tamanho para 40% da largura e 30% da altura)
    gancho.body.setSize(gancho.width * 0.4, gancho.height * 0.3);
    gancho.body.setOffset(gancho.width * 0.3, gancho.height * 0.65);

    const arqueologoSizes = { 1: [105, 115], 2: [210, 115], 3: [165, 115] };
    const [aw0, ah0] = arqueologoSizes[cenarioAtual] || [165, 115];
    this.arqueologoSpr = this.add.image(W / 2, 110, `spr_arqueologo_${cenarioAtual}`);
    this.arqueologoSpr.setDisplaySize(aw0, ah0);
    this.arqueologoSpr.setDepth(3);

    this.physics.add.overlap(gancho, grupoObjetos, pegarObjeto, null, this);
    this.input.on('pointerdown', (pointer) => acaoPrincipal.call(this, pointer), this);
    teclaEspaco = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.teclaM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    this._criarBotaoPausa(W - 40, 40);

    this.time.addEvent({ delay: 1000, callback: diminuirTempo, callbackScope: this, loop: true });

    montarFase.call(this);
}

function atualizarHUD() {
    const sitios = ['Ruínas da Terra', 'Leito do Rio', 'Sambaqui das Pedras'];
    const sitio = sitios[cenarioAtual - 1] || 'Sítio Desconhecido';
    textoHUD.setText(`Sítio: ${sitio} — Peça ${faseNoCenario}/3\nPts. de Pesquisa: ${moedasColetadas}/${metaMoedas} | Acervo: ${reliquiasCompletas}/3 relíquias`);
}

function acharPosicaoValida(raioNovoItem, larguraTela) {
    let maxTentativas = 100;
    for (let t = 0; t < maxTentativas; t++) {
        let x = Phaser.Math.Between(50, larguraTela - 50);
        let y = Phaser.Math.Between(250, 700);
        let sobreposto = false;

        for (let pos of posicoesOcupadas) {
            if (Phaser.Math.Distance.Between(x, y, pos.x, pos.y) < (raioNovoItem + pos.raio + 5)) {
                sobreposto = true;
                break;
            }
        }

        if (!sobreposto) {
            posicoesOcupadas.push({ x: x, y: y, raio: raioNovoItem });
            return { x: x, y: y };
        }
    }
    return { x: Phaser.Math.Between(100, larguraTela - 100), y: Phaser.Math.Between(300, 700) };
}

function montarFase() {
    // Limpar mensagem de game over se ainda existir
    if (gameOverRetangulo && gameOverRetangulo.active) { gameOverRetangulo.destroy(); }
    gameOverRetangulo = null;
    if (gameOverTexto && gameOverTexto.active) { gameOverTexto.destroy(); }
    gameOverTexto = null;
    this.gameOverDrawn = false;

    if (this.botaoPausaBg) this.botaoPausaBg.setInteractive({ useHandCursor: true });

    grupoObjetos.clear(true, true);
    posicoesOcupadas = [];
    moedasColetadas = 0;
    tempoRestante = 100;
    estamina = 150;
    fragmentoRevelado = false;
    jogoVencido = false;
    jogoAcabou = false;
    esperandoProximaFase = false;

    // Reseta o estado da garra para evitar bugs caso o jogador saia no meio de uma ação
    estadoGancho = 'BALANCANDO';
    anguloGancho = 0;
    balancandoParaDireita = true;
    objetoPuxado = null;

    if (musicaFase) musicaFase.stop();
    let chaveMusica = 'musica_cenario_1';
    if (cenarioAtual === 2) chaveMusica = 'musica_cenario_2';
    if (cenarioAtual === 3) chaveMusica = 'musica_cenario_3';

    musicaFase = this.sound.add(chaveMusica);
    musicaFase.play({ loop: true, volume: volumeGlobal });

    let degrauDificuldade = ((cenarioAtual - 1) * 3) + (faseNoCenario - 1);
    velocidadeBalanço = 1.0 + (degrauDificuldade * 0.15);
    if (velocidadeBalanço > velocidadeMaxima) velocidadeBalanço = velocidadeMaxima;

    // Fundo do cenário: imagem para os que já têm arte, cor sólida para os demais
    const Wbg = this.cameras.main.width, Hbg = this.cameras.main.height;
    const fundosCenario = { 1: 'fundo_cenario_terra', 2: 'fundo_cenario_agua', 3: 'fundo_cenario_cascalho' };
    const chaveFundo = fundosCenario[cenarioAtual];

    if (chaveFundo) {
        if (!this.fundoCenario) {
            this.fundoCenario = this.add.image(Wbg / 2, Hbg / 2, chaveFundo).setDepth(-10);
        } else {
            this.fundoCenario.setTexture(chaveFundo).setVisible(true);
        }
        this.fundoCenario.setDisplaySize(Wbg, Hbg);
    } else {
        // Cenário sem imagem ainda (ex.: 3) — usa cor sólida de fallback
        // Cenário sem imagem ainda — usa cor sólida de fallback
        if (this.fundoCenario) this.fundoCenario.setVisible(false);
        this.cameras.main.setBackgroundColor('#b71c1c');
    }

    if (this.arqueologoSpr) {
        const arqueologoSizes = { 1: [105, 115], 2: [210, 115], 3: [165, 115] };
        const [aw, ah] = arqueologoSizes[cenarioAtual] || [165, 115];
        this.arqueologoSpr.setTexture(`spr_arqueologo_${cenarioAtual}`);
        this.arqueologoSpr.setDisplaySize(aw, ah);
    }

    atualizarHUD();
    textoCentro.setText('');

    const W = this.cameras.main.width;
    const cfgCenario = [
        { m5: 2, m3: 6, m1: 8, pGrande: 2, pPequena: 4 },
        { m5: 3, m3: 7, m1: 9, pGrande: 3, pPequena: 5 },
        { m5: 4, m3: 8, m1: 10, pGrande: 5, pPequena: 6 },
    ];
    const cfg = cfgCenario[Phaser.Math.Clamp(cenarioAtual - 1, 0, 2)];

    // Diamante (valor 5) — 36x36
    for (let i = 0; i < cfg.m5; i++) {
        const d = 36, r = d / 2;
        let pos = acharPosicaoValida(r, W);
        let spr = this.physics.add.sprite(pos.x, pos.y, 'spr_diamante');
        spr.setDisplaySize(d, d);
        // Reduz a hitbox do item para 80% do tamanho visual e centraliza
        spr.body.setCircle(spr.width * 0.4, spr.width * 0.1, spr.height * 0.1);
        spr.tipo = 'moeda'; spr.peso = 0.5; spr.valor = 5;
        grupoObjetos.add(spr);
    }

    // Moeda 1000 / prata (valor 3) — ajustado para a nova imagem
    for (let i = 0; i < cfg.m3; i++) {
        const d = 64, r = d / 2; // Aumentamos o tamanho visual base (era 42, agora 64)
        let pos = acharPosicaoValida(r, W);
        let spr = this.physics.add.sprite(pos.x, pos.y, 'spr_moeda_prata');
        spr.setDisplaySize(d, d);

        // Hitbox ajustada: raio levemente menor (35%) e mais centralizado (15% de margem)
        spr.body.setCircle(spr.width * 0.35, spr.width * 0.15, spr.height * 0.15);
        spr.tipo = 'moeda'; spr.peso = 1.5; spr.valor = 3;
        grupoObjetos.add(spr);
    }

    // Moeda 500 / bronze (valor 1) — 52x52
    for (let i = 0; i < cfg.m1; i++) {
        const d = 52, r = d / 2;
        let pos = acharPosicaoValida(r, W);
        let spr = this.physics.add.sprite(pos.x, pos.y, 'spr_moeda_bronze');
        spr.setDisplaySize(d, d);
        spr.body.setCircle(spr.width * 0.4, spr.width * 0.1, spr.height * 0.1);
        spr.tipo = 'moeda'; spr.peso = 1.0; spr.valor = 1;
        grupoObjetos.add(spr);
    }

    let chaveSpriteGrande = cenarioAtual === 2 ? 'spr_concha_grande' : 'spr_pedra_grande';
    for (let i = 0; i < cfg.pGrande; i++) {
        const d = 170, r = d / 2;
        let pos = acharPosicaoValida(r, W);
        let spr = this.physics.add.sprite(pos.x, pos.y, chaveSpriteGrande);
        spr.setDisplaySize(d, d);
        spr.body.setCircle(spr.width * 0.4, spr.width * 0.1, spr.height * 0.1);
        spr.tipo = 'pedra_pesada'; spr.peso = 8.0; spr.valor = 0;
        grupoObjetos.add(spr);
    }

    let chaveSpritePequena = cenarioAtual === 2 ? 'spr_concha_pequena' : 'spr_pedra_pequena';
    for (let i = 0; i < cfg.pPequena; i++) {
        const d = 110, r = d / 2;
        let pos = acharPosicaoValida(r, W);
        let spr = this.physics.add.sprite(pos.x, pos.y, chaveSpritePequena);
        spr.setDisplaySize(d, d);
        spr.body.setCircle(spr.width * 0.4, spr.width * 0.1, spr.height * 0.1);
        spr.tipo = 'pedra_pesada'; spr.peso = 4.0; spr.valor = 0;
        grupoObjetos.add(spr);
    }
}

function spawnarFragmento() {
    textoCentro.setText('ARTEFATO DETECTADO!\nResgate o fragmento antes que o tempo acabe!');
    textoCentro.setColor('#00ffff');

    this.time.delayedCall(2500, () => {
        if (!esperandoProximaFase && !jogoAcabou) textoCentro.setText('');
    });

    let r = 20;
    let pos = acharPosicaoValida(r, this.cameras.main.width);

    const relicNameMap = ['mascara', 'santo', 'tigre'];
    const relicName = relicNameMap[cenarioAtual - 1] || 'mascara';
    const texKey = `frag_${relicName}_${faseNoCenario}`;

    let spr = this.physics.add.sprite(pos.x, pos.y, texKey);
    spr.setDisplaySize(70, 70);
    spr.body.setSize(54, 54, true);
    spr.tipo = 'fragmento';
    spr.peso = 2;
    spr.valor = 0;

    grupoObjetos.add(spr);
}

function diminuirTempo() {
    if (jogoAcabou || esperandoProximaFase) return;
    tempoRestante--;

    if (tempoRestante <= 0) {
        jogoAcabou = true;
        textoCentro.setText('FIM DA EXPEDIÇÃO!\nO tempo de escavação esgotou.');
        textoCentro.setColor('#ff0000');
        limparSave();
        mostrarControlesGameOver.call(this);
    }
}

function mostrarControlesGameOver() {
    if (this.gameOverDrawn) return;
    if (this.botaoPausaBg) this.botaoPausaBg.disableInteractive();
    const W = this.cameras.main.width;
    gameOverRetangulo = this.add.rectangle(W / 2, 530, 680, 90, 0x000000, 0.55).setOrigin(0.5);

    let mensagem = jogoVencido
        ? 'Pressione M para retornar ao Museu Histórico de São José.'
        : 'Pressione ESPAÇO ou clique para tentar novamente. M para o museu.';

    gameOverTexto = this.add.text(W / 2, 500, mensagem, {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5);
    this.gameOverDrawn = true;
}

function reiniciarFase() {
    if (!jogoAcabou) return;
    montarFase.call(this);
}

function acaoPrincipal(pointer) {
    if (this._revelaFechouNesseFrame) return;
    if (jogoAcabou) {
        reiniciarFase.call(this);
        return;
    }
    if (pointer && this.pauseZone) {
        let bounds = this.pauseZone.getBounds();
        if (pointer.x >= bounds.x && pointer.x <= bounds.right && pointer.y >= bounds.y && pointer.y <= bounds.bottom) {
            return;
        }
    }

    if (esperandoProximaFase) {
        esperandoProximaFase = false;
        montarFase.call(this);
    } else if (estadoGancho === 'BALANCANDO') {
        estadoGancho = 'DESCENDO';
    }
}

function update() {
    this._revelaFechouNesseFrame = false;
    if (this._revelaAtiva) {
        if (Phaser.Input.Keyboard.JustDown(teclaEspaco) || Phaser.Input.Keyboard.JustDown(this.teclaM)) {
            if (this._revelaFechar) this._revelaFechar();
        }
        return;
    }
    if (jogoAcabou) {
        if (Phaser.Input.Keyboard.JustDown(this.teclaEsc) || Phaser.Input.Keyboard.JustDown(this.teclaM)) {
            if (musicaFase) musicaFase.stop();
            this.scene.start('MenuScene');
            return;
        }
        if (Phaser.Input.Keyboard.JustDown(teclaEspaco) || this.input.activePointer.justDown) {
            if (jogoVencido) {
                if (musicaFase) musicaFase.stop();
                this.scene.start('MenuScene');
            } else {
                reiniciarFase.call(this);
            }
            return;
        }
        return;
    }
    if (esperandoProximaFase) return;

    if (Phaser.Input.Keyboard.JustDown(this.teclaEsc)) {
        this._abrirMenuPausa();
        return;
    }

    const W = this.cameras.main.width;
    const centroX = W / 2;

    linhaCorda.clear();
    linhaCorda.lineStyle(3, 0xaaaaaa, 1);
    linhaCorda.beginPath();
    linhaCorda.moveTo(centroX, 170);
    linhaCorda.lineTo(gancho.x, gancho.y);
    linhaCorda.strokePath();

    let radianos = Phaser.Math.DegToRad(anguloGancho);
    let apertouBotao = Phaser.Input.Keyboard.JustDown(teclaEspaco) || this.input.activePointer.justDown;
    let segurandoBotao = teclaEspaco.isDown || this.input.activePointer.isDown;
    let taDandoBoost = (estadoGancho === 'SUBINDO' && objetoPuxado && objetoPuxado.tipo === 'pedra_pesada' && segurandoBotao && estamina >= 1.5);


    if (!taDandoBoost && estamina < estaminaMaxima) {
        estamina += 0.15;
        if (estamina > estaminaMaxima) estamina = estaminaMaxima;
    }

    barraEstamina.clear();
    let propE = estamina / estaminaMaxima;
    let corB = propE > 0.50 ? 0x44cc44 : propE > 0.20 ? 0xffaa00 : 0xff3333;
    let alphaB = propE < 0.20 ? (Math.sin(this.time.now * 0.012) * 0.4 + 0.6) : 1;

    barraEstamina.fillStyle(0x111111, 0.9);
    barraEstamina.fillRoundedRect(10, 76, 230, 16, 6);
    barraEstamina.fillStyle(0x000000, 0.3);
    barraEstamina.fillRoundedRect(10, 78, 230, 14, 5);

    let fillW = Math.max(0, Math.round(230 * propE));
    if (fillW > 0) {
        barraEstamina.fillStyle(corB, alphaB);
        barraEstamina.fillRoundedRect(10, 76, fillW, 16, 6);
        barraEstamina.fillStyle(0xffffff, 0.18);
        barraEstamina.fillRoundedRect(12, 77, Math.max(0, fillW - 4), 5, 3);
    }

    barraEstamina.lineStyle(1, 0x666666, 0.9);
    barraEstamina.strokeRoundedRect(10, 76, 230, 16, 6);

    labelBoost.setVisible(
        estadoGancho === 'SUBINDO' && objetoPuxado !== null &&
        objetoPuxado.tipo === 'pedra_pesada' && estamina > 10
    );

    textoRelogio.setText(String(Math.max(0, tempoRestante)));
    if (tempoRestante <= 20) {
        textoRelogio.setColor(Math.floor(this.time.now / 400) % 2 === 0 ? '#ff4444' : '#ffaa00');
    } else {
        textoRelogio.setColor('#f0e0b0');
    }

    graficoTempoPizza.clear();
    let porcentagemTempoPerdido = (100 - tempoRestante) / 100;

    if (porcentagemTempoPerdido > 0) {
        graficoTempoPizza.fillStyle(0x000000, 0.80);
        graficoTempoPizza.beginPath();
        graficoTempoPizza.moveTo(0, 0);
        let anguloInicioPizza = -Math.PI / 2;
        let anguloFimPizza = anguloInicioPizza + (porcentagemTempoPerdido * 2 * Math.PI);
        graficoTempoPizza.arc(0, 0, 43, anguloInicioPizza, anguloFimPizza, false);
        graficoTempoPizza.closePath();
        graficoTempoPizza.fillPath();
    }

    if (estadoGancho === 'BALANCANDO') {
        if (apertouBotao) acaoPrincipal.call(this);

        if (balancandoParaDireita) {
            anguloGancho += velocidadeBalanço;
            if (anguloGancho >= 75) balancandoParaDireita = false;
        } else {
            anguloGancho -= velocidadeBalanço;
            if (anguloGancho <= -75) balancandoParaDireita = true;
        }

        let tamanhoDaCorda = 135;

        gancho.x = centroX + Math.sin(radianos) * tamanhoDaCorda;
        gancho.y = 170 + Math.cos(radianos) * tamanhoDaCorda;
        gancho.angle = -anguloGancho;
    }
    else if (estadoGancho === 'DESCENDO') {
        gancho.x += Math.sin(radianos) * velocidadeTiroPadrao;
        gancho.y += Math.cos(radianos) * velocidadeTiroPadrao;
        if (gancho.x < 0 || gancho.x > W || gancho.y > 768) estadoGancho = 'SUBINDO';
    }
    else if (estadoGancho === 'SUBINDO') {
        let velocidadeAtual = objetoPuxado ? velocidadeTiroPadrao / objetoPuxado.peso : velocidadeTiroPadrao * 1.5;

        if (taDandoBoost) {
            estamina -= 1.5;
            gancho.x -= Math.sin(radianos) * 3.5;
            gancho.y -= Math.cos(radianos) * 3.5;
        }

        if (objetoPuxado) {
            objetoPuxado.x = gancho.x;
            objetoPuxado.y = gancho.y;
        }

        gancho.x -= Math.sin(radianos) * velocidadeAtual;
        gancho.y -= Math.cos(radianos) * velocidadeAtual;

        if (gancho.y <= 220) {
            estadoGancho = 'BALANCANDO';
            anguloGancho = Phaser.Math.Between(-55, 55);
            balancandoParaDireita = anguloGancho < 0 ? true : Phaser.Math.Between(0, 1) === 0;

            if (objetoPuxado) {
                if (objetoPuxado.tipo === 'moeda') {
                    moedasColetadas += objetoPuxado.valor;
                    let corTexto = objetoPuxado.valor === 5 ? '#ffffff' : objetoPuxado.valor === 3 ? '#d4af37' : '#ffaa00';
                    mostrarTextoFlutuante(this, gancho.x, gancho.y, `+$${objetoPuxado.valor}`, corTexto);
                    this.cameras.main.flash(160, 255, 215, 0);

                    if (moedasColetadas >= metaMoedas && !fragmentoRevelado) {
                        fragmentoRevelado = true;
                        spawnarFragmento.call(this);
                    }
                }
                else if (objetoPuxado.tipo === 'fragmento') {
                    mostrarTextoFlutuante(this, gancho.x, gancho.y, 'ACHADO!', '#00ffff');
                    this.cameras.main.flash(300, 0, 200, 220);
                    pulsarIrradiante(this, gancho.x, gancho.y);
                    fragmentosAtuais++;
                    faseNoCenario++;

                    const cenarioCaptura = cenarioAtual;
                    const fragsCapturados = fragmentosAtuais;

                    if (fragmentosAtuais >= 3) {
                        reliquiasCompletas++;
                        cenarioAtual++;
                        fragmentosAtuais = 0;
                        faseNoCenario = 1;
                        salvarJogo();

                        if (reliquiasCompletas >= 3) {
                            mostrarCenarioCompleto(this, cenarioCaptura, () => {
                                mostrarVitoriaFinal(this, () => {
                                    if (musicaFase) musicaFase.stop();
                                    this.scene.start('MenuScene');
                                });
                            });
                        } else {
                            mostrarCenarioCompleto(this, cenarioCaptura, () => {
                                textoCentro.setText(`Fase ${cenarioAtual} desbloqueada!\nClique para iniciar a próxima escavação.`);
                                textoCentro.setColor('#00ff00');
                                esperandoProximaFase = true;
                            });
                        }
                    } else {
                        salvarJogo();
                        mostrarRevela(this, cenarioCaptura, fragsCapturados, () => {
                            textoCentro.setText(`Peça ${fragsCapturados}/3 recuperada!\nClique para continuar a escavação.`);
                            textoCentro.setColor('#00ff00');
                            esperandoProximaFase = true;
                        });
                    }
                }
                objetoPuxado.destroy();
                objetoPuxado = null;
                atualizarHUD();
            }
        }
    }
}

function mostrarTextoFlutuante(scene, x, y, texto, cor) {
    let t = scene.add.text(x, y, texto, {
        fontFamily: 'Arial', fontSize: '26px', fontStyle: 'bold',
        color: cor, stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(10);
    scene.tweens.add({ targets: t, y: y - 80, alpha: 0, duration: 900, ease: 'Power2', onComplete: () => t.destroy() });
}

function pulsarIrradiante(scene, x, y) {
    for (let i = 0; i < 3; i++) {
        scene.time.delayedCall(i * 110, () => {
            let ring = scene.add.graphics().setDepth(9);
            ring.lineStyle(3, 0x00ffff, 1);
            ring.strokeCircle(x, y, 10);
            scene.tweens.add({ targets: ring, scaleX: 5, scaleY: 5, alpha: 0, duration: 650, ease: 'Power2', onComplete: () => ring.destroy() });
        });
    }
}

// Mostra tela de progresso após coletar fragmento 1/3 ou 2/3
function mostrarRevela(scene, cenario, numFragmentos, aoFechar) {
    const W = scene.cameras.main.width;
    const H = scene.cameras.main.height;
    const relicKey = ['mascara', 'santo', 'tigre'][cenario - 1] || 'mascara';
    const subtitulos = ['', 'O quebra-cabeças começa a tomar forma...', 'Quase lá! Um fragmento ainda está escondido.'];

    scene._revelaAtiva = true;
    const obj = [];

    obj.push(scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75).setDepth(50));

    let panel = scene.add.graphics().setDepth(51);
    panel.fillStyle(0x120f09, 0.97);
    panel.fillRoundedRect(W / 2 - 280, 100, 560, 530, 16);
    panel.lineStyle(3, 0xd4af37, 1);
    panel.strokeRoundedRect(W / 2 - 280, 100, 560, 530, 16);
    obj.push(panel);

    obj.push(scene.add.text(W / 2, 148, `PEÇA ${numFragmentos}/3 RECUPERADA!`, {
        fontFamily: 'Arial', fontSize: '32px', fontStyle: 'bold',
        color: '#00ffff', stroke: '#000000', strokeThickness: 4, align: 'center'
    }).setOrigin(0.5).setDepth(52));

    obj.push(scene.add.text(W / 2, 192, subtitulos[numFragmentos] || '', {
        fontFamily: 'Arial', fontSize: '20px', color: '#d4af37', align: 'center'
    }).setOrigin(0.5).setDepth(52));

    for (let j = 1; j <= 3; j++) {
        const tk = `frag_${relicKey}_${j}`;
        const src = scene.textures.get(tk).getSourceImage();
        const scale = Math.min(200 / src.width, 110 / src.height);
        let piece = scene.add.image(W / 2, 285 + (j - 1) * 115, tk).setDepth(52);
        piece.setDisplaySize(Math.round(src.width * scale), Math.round(src.height * scale));
        if (j > numFragmentos) { piece.setTint(0x222222); piece.setAlpha(0.25); }
        obj.push(piece);
    }

    let cont = scene.add.text(W / 2, 592, 'Clique ou ESPAÇO para continuar a escavação', {
        fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(52);
    obj.push(cont);
    scene.tweens.add({ targets: cont, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });

    const fechar = () => {
        obj.forEach(o => { if (o && o.active) o.destroy(); });
        scene._revelaAtiva = false;
        scene._revelaFechouNesseFrame = true;
        scene._revelaFechar = null;
        scene.input.off('pointerdown', fechar);
        aoFechar();
    };
    scene._revelaFechar = fechar;
    scene.input.once('pointerdown', fechar);
}

// Mostra tela de objeto completo após coletar os 3 fragmentos de um cenário (imagem exibicao)
function mostrarCenarioCompleto(scene, cenario, aoFechar) {
    const W = scene.cameras.main.width;
    const H = scene.cameras.main.height;
    const exibKeys = ['exib_mascara', 'exib_santo', 'exib_tigre'];
    const nomes = ['Máscara Ritual', 'Imagem Sacra', 'Tigre de Bronze'];
    const msgs = [
        'Este artefato sagrado encontrou seu lar\nno Museu Histórico de São José!',
        'Esta relíquia volta a ocupar\nseu lugar de honra no acervo do museu!',
        'Esta peça única completa\na coleção arqueológica do museu!'
    ];
    const idx = (cenario - 1);

    scene._revelaAtiva = true;
    const obj = [];

    obj.push(scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.88).setDepth(50));

    let panel = scene.add.graphics().setDepth(51);
    panel.fillStyle(0x120f09, 0.97);
    panel.fillRoundedRect(W / 2 - 310, 50, 620, 660, 18);
    panel.lineStyle(4, 0xffd700, 1);
    panel.strokeRoundedRect(W / 2 - 310, 50, 620, 660, 18);
    obj.push(panel);

    obj.push(scene.add.text(W / 2, 100, 'OBJETO RESTAURADO!', {
        fontFamily: 'Arial', fontSize: '38px', fontStyle: 'bold',
        color: '#ffd700', stroke: '#5c3a00', strokeThickness: 5, align: 'center'
    }).setOrigin(0.5).setDepth(52));

    obj.push(scene.add.text(W / 2, 148, nomes[idx] || '', {
        fontFamily: 'Arial', fontSize: '24px', fontStyle: 'bold italic',
        color: '#ffffff', stroke: '#000000', strokeThickness: 3, align: 'center'
    }).setOrigin(0.5).setDepth(52));

    const exibKey = exibKeys[idx] || exibKeys[0];
    const exibSrc = scene.textures.get(exibKey).getSourceImage();
    const exibScale = Math.min(500 / exibSrc.width, 420 / exibSrc.height);
    let img = scene.add.image(W / 2, 390, exibKey).setDepth(52);
    img.setDisplaySize(Math.round(exibSrc.width * exibScale), Math.round(exibSrc.height * exibScale));
    obj.push(img);

    obj.push(scene.add.text(W / 2, 604, msgs[idx] || '', {
        fontFamily: 'Arial', fontSize: '20px', color: '#d4af37',
        align: 'center', lineSpacing: 4
    }).setOrigin(0.5).setDepth(52));

    let cont = scene.add.text(W / 2, 665, 'Clique ou ESPAÇO para continuar', {
        fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(52);
    obj.push(cont);
    scene.tweens.add({ targets: cont, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });

    const fechar = () => {
        obj.forEach(o => { if (o && o.active) o.destroy(); });
        scene._revelaAtiva = false;
        scene._revelaFechouNesseFrame = true;
        scene._revelaFechar = null;
        scene.input.off('pointerdown', fechar);
        aoFechar();
    };
    scene._revelaFechar = fechar;
    scene.input.once('pointerdown', fechar);
}

// Mostra tela de vitória com os 3 objetos completos (imagens full)
function mostrarVitoriaFinal(scene, aoFechar) {
    const W = scene.cameras.main.width;
    const H = scene.cameras.main.height;

    scene._revelaAtiva = true;
    const obj = [];

    obj.push(scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.92).setDepth(50));

    let panel = scene.add.graphics().setDepth(51);
    panel.fillStyle(0x120f09, 0.98);
    panel.fillRoundedRect(W / 2 - 490, 30, 980, 710, 20);
    panel.lineStyle(5, 0xffd700, 1);
    panel.strokeRoundedRect(W / 2 - 490, 30, 980, 710, 20);
    obj.push(panel);

    obj.push(scene.add.text(W / 2, 88, 'MISSÃO ARQUEOLÓGICA CUMPRIDA!', {
        fontFamily: 'Arial', fontSize: '38px', fontStyle: 'bold',
        color: '#ffd700', stroke: '#5c3a00', strokeThickness: 6, align: 'center'
    }).setOrigin(0.5).setDepth(52));

    const vitoriaExibKeys = ['exib_mascara', 'exib_santo', 'exib_tigre'];
    const nomes = ['Máscara Ritual', 'Imagem Sacra', 'Tigre de Bronze'];
    const startX = W / 2 - 310;

    for (let i = 0; i < 3; i++) {
        let ix = startX + i * 310;
        const src = scene.textures.get(vitoriaExibKeys[i]).getSourceImage();
        const scale = Math.min(280 / src.width, 350 / src.height);
        let img = scene.add.image(ix, 330, vitoriaExibKeys[i]).setDepth(52);
        img.setDisplaySize(Math.round(src.width * scale), Math.round(src.height * scale));
        obj.push(img);
        obj.push(scene.add.text(ix, 525, nomes[i], {
            fontFamily: 'Arial', fontSize: '18px', fontStyle: 'bold', color: '#d4af37', align: 'center'
        }).setOrigin(0.5).setDepth(52));
    }

    obj.push(scene.add.text(W / 2, 590, 'Três artefatos históricos foram resgatados e agora fazem\nparte permanente do acervo do Museu Histórico de São José.\nObrigado por preservar nossa história!', {
        fontFamily: 'Arial', fontSize: '19px', color: '#ffffff',
        align: 'center', lineSpacing: 4
    }).setOrigin(0.5).setDepth(52));

    let cont = scene.add.text(W / 2, 690, 'Clique, ESPAÇO ou M para retornar ao Museu Histórico de São José', {
        fontFamily: 'Arial', fontSize: '17px', color: '#ffffff', align: 'center'
    }).setOrigin(0.5).setDepth(52);
    obj.push(cont);
    scene.tweens.add({ targets: cont, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });

    const fechar = () => {
        obj.forEach(o => { if (o && o.active) o.destroy(); });
        scene._revelaAtiva = false;
        scene._revelaFechouNesseFrame = true;
        scene._revelaFechar = null;
        scene.input.off('pointerdown', fechar);
        aoFechar();
    };
    scene._revelaFechar = fechar;
    scene.input.once('pointerdown', fechar);
}

function pegarObjeto(ganchoObjeto, objetoAtingido) {
    if (estadoGancho === 'DESCENDO') {
        estadoGancho = 'SUBINDO';
        objetoPuxado = objetoAtingido;
        objetoPuxado.setDepth(3); // objeto agarrado sobrepõe a garra (depth 2), escondendo-a atrás
        if (objetoAtingido.tipo === 'pedra_pesada') {
            let scene = ganchoObjeto.scene;
            mostrarTextoFlutuante(scene, ganchoObjeto.x, ganchoObjeto.y, 'MUITO PESADA!', '#ff4444');
            scene.cameras.main.flash(200, 255, 30, 0);
            scene.cameras.main.shake(220, 0.005);
        }
    }
}

// =============================================================================
// 9. CONFIGURAÇÃO FINAL DO PHASER
// =============================================================================
let aspect = window.innerWidth / window.innerHeight;
let GAME_WIDTH = Phaser.Math.Clamp(Math.round(768 * aspect), 1024, 1366);

const config = {
    type: Phaser.AUTO,
    pixelArt: true, // Mantém os pixels 100% nítidos
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: 768
    },
    parent: 'game-container',
    backgroundColor: '#1a0800',
    physics: { default: 'arcade', arcade: { debug: false } },
    fps: { target: 60, forceSetTimeOut: true },
    scene: [MenuScene, InventoryScene, TutorialScene, OptionsScene, GameScene, PauseScene]
};

const game = new Phaser.Game(config);