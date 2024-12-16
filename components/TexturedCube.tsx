import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface TexturedCubeProps {
  imagePaths?: {
    right?: string;
    left?: string;
    top?: string;
    bottom?: string;
    front?: string;
    back?: string;
  };
  width?: string;
  height?: string;
  rotation_x?: GLfloat;
  rotation_y?: GLfloat;
}

const TexturedCube: React.FC<TexturedCubeProps> = ({ 
  imagePaths = {
    right: '/path/to/default/right.jpg',
    left: '/path/to/default/left.jpg',
    top: '/path/to/default/top.jpg',
    bottom: '/path/to/default/bottom.jpg',
    front: '/path/to/default/front.jpg',
    back: '/path/to/default/back.jpg'
  }, 
  width = '100%', 
  height = '100%', 
  rotation_x = 0.01,
  rotation_y = 0.01 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    // Ensure we're only running this on the client
    if (typeof window !== 'undefined' && mountRef.current) {
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75, 
        mountRef.current.clientWidth / mountRef.current.clientHeight, 
        0.1, 
        1000
      );
      cameraRef.current = camera;
      camera.position.z = 5;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true // Important for transparency
      });
      rendererRef.current = renderer;
      renderer.setSize(
        mountRef.current.clientWidth, 
        mountRef.current.clientHeight
      );
      renderer.setClearColor(0x000000, 0); // Transparent background
      mountRef.current.appendChild(renderer.domElement);

      // Texture loading
      const textureLoader = new THREE.TextureLoader();
      
      // Create materials with different textures for each face
      const materials = [
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.right || '') }),   // Right
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.left || '') }),    // Left
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.top || '') }),     // Top
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.bottom || '') }),  // Bottom
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.front || '') }),   // Front
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.back || '') })     // Back
      ];

      // Cube creation (reduced size)
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const cube = new THREE.Mesh(geometry, materials);
      cubeRef.current = cube;
      scene.add(cube);

      // Animation loop
      const animate = () => {
        if (cube && renderer && scene && camera) {
          requestAnimationFrame(animate);
          
          cube.rotation.x += rotation_x;
          cube.rotation.y += rotation_y;
          
          renderer.render(scene, camera);
        }
      };
      animate();

      // Cleanup function
      return () => {
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        materials.forEach(material => {
          material.map?.dispose();
          material.dispose();
        });
      };
    }
  }, [imagePaths]); // Added imagePaths to dependency array

  return <div 
    ref={mountRef} 
    style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width, 
      height, 
      zIndex: -1, 
      pointerEvents: 'none' 
    }} 
  />;
};

export default TexturedCube;