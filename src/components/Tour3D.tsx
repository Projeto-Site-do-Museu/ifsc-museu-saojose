"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Tour3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modalInfo, setModalInfo] = useState<string | null>(null);

  useEffect(() => {
    // Armazena o valor atual de mountRef.current em uma variável
    const mount = mountRef.current;
    if (!mount) return;

    // Criar a cena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);
    camera.rotation.order = "YXZ";

    // Criar o renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    mount.appendChild(renderer.domElement);

    // Carregar textura panorâmica
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/imgs/panorama-teste.jpg', () => {
        texture.colorSpace = THREE.SRGBColorSpace;
        animate();
    });

    // Criar esfera invertida para o panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Ícones de marcação
    const spriteMaterial = new THREE.SpriteMaterial({ map: textureLoader.load("/imgs/info-icon.png") });
    const markPoints = [
      { position: new THREE.Vector3(100, 50, -200), info: "Art Piece 1: Description goes here." },
      { position: new THREE.Vector3(-150, 20, 300), info: "Integrantes do grupo: Arthur, Gustavo, Caio, Danilo, Kaua" },
    ];

    const sprites: { sprite: THREE.Sprite; info: string }[] = [];
    markPoints.forEach((mark) => {
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(mark.position);
      sprite.scale.set(50, 50, 1);
      scene.add(sprite);
      sprites.push({ sprite, info: mark.info });
    });

    // Raycaster para interação
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Controle de clique e arraste
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let mouseDownPosition = { x: 0, y: 0 };
    const dragThreshold = 5;

    // Eventos do mouse
    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
      mouseDownPosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = (event: MouseEvent) => {
      const dx = event.clientX - mouseDownPosition.x;
      const dy = event.clientY - mouseDownPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      isDragging = false;

      if (distance < dragThreshold) {
        // Raycasting para detectar clique nos ícones
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(sprites.map((s) => s.sprite));

        if (intersects.length > 0) {
          const selected = sprites.find((s) => s.sprite === intersects[0].object);
          if (selected) {
            setModalInfo(selected.info);
          }
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        let yaw = camera.rotation.y;
        let pitch = camera.rotation.x;

        yaw -= deltaX * 0.005;
        pitch -= deltaY * 0.005;

        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        camera.rotation.set(pitch, yaw, 0);

        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
      }
    };

    // Responsividade
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    // Loop de animação
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="absolute inset-0" />

      {/* Modal */}
      {modalInfo && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="bg-card text-card-foreground p-6 rounded-lg text-lg">
            <p>{modalInfo}</p>
            <button className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded" onClick={() => setModalInfo(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tour3D;
