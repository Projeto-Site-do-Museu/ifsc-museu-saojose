# 📘 Documentação Completa: Three.js

## 🧠 O que é Three.js?

Three.js é uma biblioteca JavaScript que permite criar **gráficos 3D e 2D** em navegadores, usando a API WebGL de forma simplificada.

Você pode criar visualizações interativas, jogos, simulações e muito mais diretamente no navegador.

---

## ⚙️ Como funciona?

- **Cena (Scene)**: onde ficam os objetos
- **Câmera (Camera)**: define o ponto de vista
- **Renderizador (Renderer)**: desenha tudo na tela

---

## 🚀 Criando seu primeiro projeto

### Instalação via npm:

```bash
npm install three
```

### Ou via CDN:

```html
<script src="https://unpkg.com/three@latest/build/three.min.js"></script>
```

### Exemplo básico:

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

---

## 🧩 Recursos importantes

- **Texturas e materiais** (MeshStandardMaterial, etc)
- **Importação de modelos 3D**: `.glTF`, `.OBJ`, `.FBX`
- **Luzes**: PointLight, AmbientLight, etc.
- **Controles**: `OrbitControls`, `PointerLockControls`
- **Animações com keyframes**
- **Raycasting para interação**

---

## 🧠 Dicas

- Use `react-three-fiber` para integrar com React
- Use `three.js editor` para visualizar cenas

---

## 📚 Recursos adicionais

- [Documentação Oficial](https://threejs.org/docs/)
- [Exemplos](https://threejs.org/examples/)