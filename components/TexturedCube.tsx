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
  const reverseFlagRef = useRef<number>(1);
  const viewportBoundsRef = useRef<{left: number, right: number}>({ left: 0, right: 0 });

  useEffect(() => {
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

      // Calculate viewport boundaries
      const calculateViewportBounds = () => {
        const vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians
        const height = 2 * Math.tan(vFOV / 2) * camera.position.z; // visible height
        const width = height * camera.aspect; // visible width
        
        viewportBoundsRef.current = {
          left: -width / 2 + 0.5, // Add half cube width offset (cube is 1 unit wide)
          right: width / 2 - 0.5  // Subtract half cube width offset
        };
      };
      
      calculateViewportBounds();

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      rendererRef.current = renderer;
      renderer.setSize(
        mountRef.current.clientWidth, 
        mountRef.current.clientHeight
      );
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);

      // Texture loading
      const textureLoader = new THREE.TextureLoader();
      
      // Create materials with different textures for each face
      const materials = [
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.right || '') }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.left || '') }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.top || '') }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.bottom || '') }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.front || '') }),
        new THREE.MeshBasicMaterial({ map: textureLoader.load(imagePaths.back || '') })
      ];

      // Cube creation
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const cube = new THREE.Mesh(geometry, materials);
      cubeRef.current = cube;
      scene.add(cube);

      // Handle window resize
      const handleResize = () => {
        if (mountRef.current && camera && renderer) {
          camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
          calculateViewportBounds();
        }
      };

      window.addEventListener('resize', handleResize);

      // Animation loop
      const animate = () => {
        if (cube && renderer && scene && camera) {
          requestAnimationFrame(animate);
          
          // Handle rotations
          cube.rotation.x += rotation_x;
          cube.rotation.y += rotation_y;

          // Handle oscillation
          cube.position.x += (0.005 * reverseFlagRef.current);

          // Check boundaries and reverse direction
          const { left, right } = viewportBoundsRef.current;
          if (cube.position.x >= right) {
            reverseFlagRef.current = -1;
            cube.position.x = right; // Prevent overshooting
          } else if (cube.position.x <= left) {
            reverseFlagRef.current = 1;
            cube.position.x = left; // Prevent overshooting
          }
          
          renderer.render(scene, camera);
        }
      };
      animate();

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
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
  }, [imagePaths]);

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