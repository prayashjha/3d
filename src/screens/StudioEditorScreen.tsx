import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { MirroraScene, SceneObject, SidePanelType, Transform3D } from '../types/schema';

interface StudioEditorScreenProps {
  scene: MirroraScene;
  onUpdateScene: (updated: MirroraScene) => void;
  activeSidePanel: SidePanelType;
  cameraMode: 'PERSP' | 'ORTHO';
  onOpenAIGen: () => void;
}

export const StudioEditorScreen: React.FC<StudioEditorScreenProps> = ({
  scene,
  onUpdateScene,
  activeSidePanel,
  cameraMode,
  onOpenAIGen,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string>('obj-monolith-central');
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [workspaceMode, setWorkspaceMode] = useState<'modeling' | 'architecture'>('modeling');
  const selectedIdRef = useRef('');
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [cameraInfo, setCameraInfo] = useState({ x: 8, y: 7, z: 12 });

  // References for Three.js instance
  const threeState = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    meshMap: Map<string, THREE.Object3D>;
    gridHelper: THREE.GridHelper;
    dirLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    reqId: number | null;
  } | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // Guard: if WebGL is unavailable, show a message instead of crashing the whole app
    try {
      const probe = document.createElement('canvas');
      if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) {
        throw new Error('WebGL not supported');
      }
    } catch (err) {
      console.error('[TOOLSX 3D] WebGL unavailable:', err);
      setWebglFailed(true);
      return;
    }
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(scene.environment.ambientColor || '#0a101d');
    threeScene.fog = new THREE.FogExp2(
      scene.environment.ambientColor || '#0a101d',
      scene.environment.fogDensity || 0.02
    );

    // 2. Camera
    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    if (cameraMode === 'ORTHO') {
      const aspect = width / height;
      const d = 10;
      camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 1000);
      camera.position.set(10, 10, 10);
      camera.lookAt(0, 2, 0);
    } else {
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(8, 7, 12);
      camera.lookAt(0, 2.5, 0);
    }

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear old canvases
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(
      scene.environment.ambientColor || '#223344',
      scene.environment.ambientIntensity || 0.6
    );
    threeScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#cdffde', 1.8);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    threeScene.add(dirLight);

    const secondaryLight = new THREE.PointLight('#00d2ff', 2.2, 20);
    secondaryLight.position.set(-4, 6, -2);
    threeScene.add(secondaryLight);

    // 5. Ground Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x00f5a0, 0x272a30);
    gridHelper.position.y = 0;
    threeScene.add(gridHelper);

    // 6. Object Map
    const meshMap = new Map<string, THREE.Object3D>();

    // Helper to build 3D mesh from SceneObject
    const createMesh = (obj: SceneObject): THREE.Object3D => {
      let geom: THREE.BufferGeometry;
      switch (obj.geometry) {
        case 'sphere':
          geom = new THREE.SphereGeometry(1, 32, 32);
          break;
        case 'torus':
          geom = new THREE.TorusGeometry(1, 0.25, 24, 64);
          break;
        case 'cylinder':
          geom = new THREE.CylinderGeometry(1, 1, 2, 32);
          break;
        case 'pyramid':
          geom = new THREE.ConeGeometry(1, 2, 4);
          break;
        case 'box':
        default:
          geom = new THREE.BoxGeometry(1, 1, 1);
          break;
      }

      const mat = new THREE.MeshStandardMaterial({
        color: obj.material?.color || '#1a222d',
        roughness: obj.material?.roughness ?? 0.3,
        metalness: obj.material?.metalness ?? 0.8,
        emissive: obj.material?.emissive ? new THREE.Color(obj.material.emissive) : new THREE.Color('#000000'),
        emissiveIntensity: obj.material?.emissive ? 0.6 : 0,
        wireframe: !!obj.material?.wireframe,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...obj.transform.position);
      mesh.rotation.set(...obj.transform.rotation);
      mesh.scale.set(...obj.transform.scale);
      mesh.castShadow = obj.castShadow;
      mesh.receiveShadow = obj.receiveShadow;
      mesh.visible = obj.visible;
      mesh.name = obj.id;
      return mesh;
    };

    // Populate objects
    scene.rootObjects.forEach((obj) => {
      if (obj.type === 'mesh') {
        const mesh = createMesh(obj);
        threeScene.add(mesh);
        meshMap.set(obj.id, mesh);
      }
    });

    threeState.current = {
      scene: threeScene,
      camera,
      renderer,
      meshMap,
      gridHelper,
      dirLight,
      ambientLight,
      reqId: null,
    };

    // Orbit mouse controls
    let isDragging = false;
    let downPos = { x: 0, y: 0 };
    let prevMousePos = { x: 0, y: 0 };
    let cameraAngle = { theta: 0.9, phi: 0.6, radius: 15 };

    const updateCameraPos = () => {
      if (!threeState.current) return;
      const x = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      const y = cameraAngle.radius * Math.cos(cameraAngle.phi);
      const z = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.position.set(x, Math.max(y, 1), z);
      camera.lookAt(0, 2.5, 0);
      setCameraInfo({ x: +x.toFixed(1), y: +y.toFixed(1), z: +z.toFixed(1) });
    };

    const handleMouseDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
      if (e.button === 0 || e.button === 2) {
        isDragging = true;
        setIsOrbiting(true);
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      cameraAngle.theta -= deltaX * 0.008;
      cameraAngle.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraAngle.phi - deltaY * 0.008));
      updateCameraPos();
    };

    const handleMouseUp = () => {
      isDragging = false;
      setIsOrbiting(false);
    };

    const handleWheel = (e: WheelEvent) => {
      cameraAngle.radius = Math.max(4, Math.min(40, cameraAngle.radius + e.deltaY * 0.015));
      updateCameraPos();
    };

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';
    dom.addEventListener('pointerdown', handleMouseDown);
    window.addEventListener('pointermove', handleMouseMove);
    window.addEventListener('pointerup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: true });

    // Click-to-select: raycast from the pointer into the scene (ignored if the user dragged to orbit)
    const raycaster = new THREE.Raycaster();
    const handleClick = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 4) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      const targets = Array.from(meshMap.values()).filter((m) => m.visible);
      const hit = raycaster.intersectObjects(targets, false)[0];
      if (!hit) {
        setSelectedObjectId('');
        return;
      }
      for (const [id, m] of meshMap.entries()) {
        if (m === hit.object) {
          setSelectedObjectId(id);
          break;
        }
      }
    };
    dom.addEventListener('click', handleClick);

    // Selection outline
    const selBox = new THREE.Box3();
    const selHelper = new THREE.Box3Helper(selBox, 0x00f5a0);
    selHelper.visible = false;
    threeScene.add(selHelper);

    // Animation Loop
    const animate = () => {

      const selMesh = meshMap.get(selectedIdRef.current);
      if (selMesh && selMesh.visible) {
        selBox.setFromObject(selMesh);
        selHelper.visible = true;
      } else {
        selHelper.visible = false;
      }

      renderer.render(threeScene, camera);
      threeState.current!.reqId = requestAnimationFrame(animate);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !threeState.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', handleMouseDown);
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('pointerup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);
      if (threeState.current?.reqId) {
        cancelAnimationFrame(threeState.current.reqId);
      }
      renderer.dispose();
    };
  }, [cameraMode]);

  // Sync scene object changes (transforms, materials) to Three.js
  useEffect(() => {
    if (!threeState.current) return;
    const { scene: threeScene, meshMap, gridHelper } = threeState.current;

    gridHelper.visible = scene.environment.gridVisible;

    // Check additions and updates
    scene.rootObjects.forEach((obj) => {
      if (obj.type !== 'mesh') return;
      let mesh = meshMap.get(obj.id);
      if (!mesh) {
        // Create new mesh if added
        let geom: THREE.BufferGeometry;
        switch (obj.geometry) {
          case 'sphere':
            geom = new THREE.SphereGeometry(1, 32, 32);
            break;
          case 'torus':
            geom = new THREE.TorusGeometry(1, 0.25, 24, 64);
            break;
          case 'cylinder':
            geom = new THREE.CylinderGeometry(1, 1, 2, 32);
            break;
          case 'pyramid':
            geom = new THREE.ConeGeometry(1, 2, 4);
            break;
          case 'box':
          default:
            geom = new THREE.BoxGeometry(1, 1, 1);
            break;
        }
        const mat = new THREE.MeshStandardMaterial({
          color: obj.material?.color || '#00f5a0',
          roughness: obj.material?.roughness ?? 0.3,
          metalness: obj.material?.metalness ?? 0.8,
          emissive: obj.material?.emissive ? new THREE.Color(obj.material.emissive) : new THREE.Color('#000000'),
          wireframe: !!obj.material?.wireframe,
        });
        mesh = new THREE.Mesh(geom, mat);
        threeScene.add(mesh);
        meshMap.set(obj.id, mesh);
      }

      mesh.position.set(...obj.transform.position);
      mesh.rotation.set(...obj.transform.rotation);
      mesh.scale.set(...obj.transform.scale);
      mesh.visible = obj.visible;

      if (mesh instanceof THREE.Mesh && mesh.material instanceof THREE.MeshStandardMaterial && obj.material) {
        mesh.material.color.set(obj.material.color);
        mesh.material.roughness = obj.material.roughness;
        mesh.material.metalness = obj.material.metalness;
        if (obj.material.emissive) {
          mesh.material.emissive.set(obj.material.emissive);
          mesh.material.emissiveIntensity = 0.8;
        } else {
          mesh.material.emissive.set('#000000');
        }
        mesh.material.wireframe = !!obj.material.wireframe;
      }
    });

    // Handle deletions
    meshMap.forEach((mesh, id) => {
      const exists = scene.rootObjects.some((o) => o.id === id);
      if (!exists) {
        threeScene.remove(mesh);
        if (mesh instanceof THREE.Mesh) {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        }
        meshMap.delete(id);
      }
    });
  }, [scene]);

  selectedIdRef.current = selectedObjectId;
  // Selected Object
  const selectedObject = scene.rootObjects.find((o) => o.id === selectedObjectId);

  // Object transform modification helper
  const updateSelectedTransform = (key: keyof Transform3D, index: number, value: number) => {
    if (!selectedObject) return;
    const current = [...selectedObject.transform[key]] as [number, number, number];
    current[index] = value;

    const updatedObjects = scene.rootObjects.map((obj) => {
      if (obj.id === selectedObjectId) {
        return {
          ...obj,
          transform: {
            ...obj.transform,
            [key]: current,
          },
        };
      }
      return obj;
    });

    onUpdateScene({
      ...scene,
      rootObjects: updatedObjects,
    });
  };

  // Material modification helper
  const updateSelectedMaterial = (key: string, value: any) => {
    if (!selectedObject || !selectedObject.material) return;
    const updatedObjects = scene.rootObjects.map((obj) => {
      if (obj.id === selectedObjectId) {
        return {
          ...obj,
          material: {
            ...obj.material!,
            [key]: value,
          },
        };
      }
      return obj;
    });

    onUpdateScene({
      ...scene,
      rootObjects: updatedObjects,
    });
  };

  // Add Object
  const addObject = (geometryType: 'box' | 'sphere' | 'torus' | 'cylinder' | 'pyramid') => {
    const newId = `obj-${geometryType}-${Date.now().toString().slice(-4)}`;
    const newObj: SceneObject = {
      id: newId,
      name: `${geometryType.charAt(0).toUpperCase() + geometryType.slice(1)} Node`,
      type: 'mesh',
      geometry: geometryType,
      transform: {
        position: [+(Math.random() * 4 - 2).toFixed(1), 1.5, +(Math.random() * 4 - 2).toFixed(1)],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      material: {
        id: `mat-${newId}`,
        type: 'standard',
        color: '#00d2ff',
        roughness: 0.2,
        metalness: 0.8,
        emissive: '#00f5a0',
        wireframe: false,
      },
      castShadow: true,
      receiveShadow: true,
      visible: true,
    };

    onUpdateScene({
      ...scene,
      rootObjects: [...scene.rootObjects, newObj],
    });
    setSelectedObjectId(newId);
  };

  // Architecture starter kits are built from editable Three.js primitives.
  const addArchitecturePreset = (preset: 'house' | 'room' | 'building') => {
    const prefix = `arch-${preset}-${Date.now()}`;
    const part = (name: string, position: [number, number, number], scale: [number, number, number], color: string): SceneObject => ({
      id: `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, name, type: 'mesh', geometry: 'box',
      transform: { position, rotation: [0, 0, 0], scale },
      material: { id: `mat-${prefix}-${name}`, type: 'standard', color, roughness: 0.78, metalness: 0.04 },
      castShadow: true, receiveShadow: true, visible: true,
    });
    const parts: SceneObject[] = [];
    if (preset === 'room') {
      parts.push(
        part('Room Floor', [0, .05, 0], [9, .1, 7], '#b9a58a'),
        part('Back Wall', [0, 2, -3.45], [9, 4, .15], '#e8e2d8'),
        part('Left Wall', [-4.45, 2, 0], [.15, 4, 7], '#d9d1c5'),
        part('Right Wall', [4.45, 2, 0], [.15, 4, 7], '#e8e2d8'),
        part('Ceiling Beam', [0, 4.05, 0], [9, .12, 7], '#f5f1e9')
      );
    } else {
      const w = preset === 'house' ? 8 : 12, d = preset === 'house' ? 7 : 10, h = preset === 'house' ? 3.2 : 6;
      parts.push(
        part('Foundation Slab', [0, .15, 0], [w + .5, .3, d + .5], '#777b80'),
        part('Front Wall', [0, h/2, d/2], [w, h, .22], '#e8e1d5'),
        part('Rear Wall', [0, h/2, -d/2], [w, h, .22], '#d6d0c7'),
        part('Left Wall', [-w/2, h/2, 0], [.22, h, d], '#ded8ce'),
        part('Right Wall', [w/2, h/2, 0], [.22, h, d], '#eee8de'),
        part('Flat Roof', [0, h + .18, 0], [w + .5, .36, d + .5], '#454c56'),
        part('Main Door', [0, 1.15, d/2 + .13], [1.25, 2.3, .12], '#70452f'),
        part('Front Window Left', [-2.35, 1.9, d/2 + .14], [1.5, 1.15, .1], '#78b9cf'),
        part('Front Window Right', [2.35, 1.9, d/2 + .14], [1.5, 1.15, .1], '#78b9cf')
      );
      if (preset === 'house') parts.push(
        part('Porch Canopy', [0, 2.8, d/2 + 1.1], [3.8, .18, 2.2], '#8a929b'),
        part('Porch Column Left', [-1.65, 1.4, d/2 + 1.85], [.18, 2.8, .18], '#f0ece4'),
        part('Porch Column Right', [1.65, 1.4, d/2 + 1.85], [.18, 2.8, .18], '#f0ece4')
      );
    }
    onUpdateScene({ ...scene, rootObjects: [...scene.rootObjects, ...parts] });
    setSelectedObjectId(parts[0].id);
  };

  const addArchitectureElement = (kind: 'wall' | 'window' | 'door' | 'column' | 'floor') => {
    const config = {
      wall: ['Wall Segment', [4, 3, .18], '#e5dfd4', 1.5],
      window: ['Window Panel', [1.5, 1.2, .1], '#78b9cf', 1.8],
      door: ['Door Panel', [1.1, 2.2, .12], '#70452f', 1.1],
      column: ['Structural Column', [.35, 3, .35], '#d8d3ca', 1.5],
      floor: ['Floor Slab', [6, .15, 6], '#a99b86', .05],
    }[kind] as [string, [number, number, number], string, number];
    const id = `arch-${kind}-${Date.now()}`;
    const obj: SceneObject = {
      id, name: config[0], type: 'mesh', geometry: 'box',
      transform: { position: [0, config[3], 0], rotation: [0, 0, 0], scale: config[1] },
      material: { id: `mat-${id}`, type: 'standard', color: config[2], roughness: .75, metalness: .05 },
      castShadow: true, receiveShadow: true, visible: true,
    };
    onUpdateScene({ ...scene, rootObjects: [...scene.rootObjects, obj] });
    setSelectedObjectId(id);
  };

  // Remove Object
  const removeObject = (id: string) => {
    const updated = scene.rootObjects.filter((o) => o.id !== id);
    onUpdateScene({
      ...scene,
      rootObjects: updated,
    });
    if (selectedObjectId === id) {
      setSelectedObjectId(updated[0]?.id || '');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem-2rem)] flex overflow-hidden bg-[#0b0e13]">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing focus:outline-none"
      />

      {webglFailed && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0b0e13] p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-[#e1e2ea] mb-2">3D viewport unavailable</h2>
            <p className="text-sm text-[#b9cbbd]">
              Your browser has WebGL disabled or unsupported. Enable hardware acceleration in your
              browser settings (Chrome: Settings → System) and reload the page.
            </p>
          </div>
        </div>
      )}

      {/* Workspace selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-lg border border-[#343b45] bg-[#111820]/95 p-1 shadow-xl backdrop-blur-md">
        <button onClick={() => setWorkspaceMode('modeling')} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${workspaceMode === 'modeling' ? 'bg-[#00f5a0] text-[#062317]' : 'text-[#b9cbbd] hover:bg-[#272a30]'}`}>3D Modeling</button>
        <button onClick={() => setWorkspaceMode('architecture')} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${workspaceMode === 'architecture' ? 'bg-[#00d2ff] text-[#041c24]' : 'text-[#b9cbbd] hover:bg-[#272a30]'}`}>Architecture</button>
      </div>

      {/* Top Viewport Floating Toolbar */}
      <div className="absolute top-16 sm:top-4 left-4 z-20 flex items-center gap-2 bg-[#191c21]/90 backdrop-blur-md p-1.5 rounded border border-[#272a30] shadow-xl">
        <button
          onClick={() => setTransformMode('translate')}
          title="Translate (W)"
          className={`px-2.5 py-1 rounded font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            transformMode === 'translate'
              ? 'bg-[#00f5a0] text-[#002111]'
              : 'text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">open_with</span>
          <span>W</span>
        </button>
        <button
          onClick={() => setTransformMode('rotate')}
          title="Rotate (E)"
          className={`px-2.5 py-1 rounded font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            transformMode === 'rotate'
              ? 'bg-[#00f5a0] text-[#002111]'
              : 'text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">cached</span>
          <span>E</span>
        </button>
        <button
          onClick={() => setTransformMode('scale')}
          title="Scale (R)"
          className={`px-2.5 py-1 rounded font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            transformMode === 'scale'
              ? 'bg-[#00f5a0] text-[#002111]'
              : 'text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">aspect_ratio</span>
          <span>R</span>
        </button>

        <div className="h-4 w-px bg-[#3b4a40]/50" />

        <button
          onClick={() =>
            onUpdateScene({
              ...scene,
              environment: {
                ...scene.environment,
                gridVisible: !scene.environment.gridVisible,
              },
            })
          }
          className={`px-2 py-1 rounded text-xs font-['JetBrains_Mono'] flex items-center gap-1 transition-colors ${
            scene.environment.gridVisible
              ? 'text-[#00f5a0] bg-[#1d2025]'
              : 'text-[#849588] hover:text-[#e1e2ea]'
          }`}
          title="Toggle Grid (G)"
        >
          <span className="material-symbols-outlined text-sm">grid_4x4</span>
          <span>Grid</span>
        </button>

        <button
          onClick={onOpenAIGen}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#00f5a0]/15 hover:bg-[#00f5a0]/30 text-[#00f5a0] font-['JetBrains_Mono'] text-xs border border-[#00f5a0]/40 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span>Generate 3D</span>
        </button>
      </div>

      {/* Floating HUD Coordinate info */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex flex-col gap-1 font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd] bg-[#0b0e13]/80 backdrop-blur-md px-3 py-2 rounded border border-[#272a30]">
        <div className="flex items-center justify-between gap-4">
          <span>CAMERA POS</span>
          <span className="text-[#00f5a0]">
            [{cameraInfo.x}, {cameraInfo.y}, {cameraInfo.z}]
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>ACTIVE OBJECT</span>
          <span className="text-[#00d2ff]">{selectedObject?.name || 'None'}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>ORBIT STATE</span>
          <span className={isOrbiting ? 'text-[#00f5a0]' : 'text-[#849588]'}>
            {isOrbiting ? 'ACTIVE' : 'IDLE (Drag to orbit)'}
          </span>
        </div>
      </div>

      {/* Architecture quick-start panel */}
      {workspaceMode === 'architecture' && (
        <div className="absolute left-4 top-28 sm:top-16 bottom-4 w-72 bg-[#191c21]/95 backdrop-blur-md rounded border border-[#00d2ff]/30 shadow-2xl flex flex-col z-20 overflow-y-auto">
          <div className="p-3 border-b border-[#272a30]">
            <div className="text-xs font-semibold tracking-wide text-[#e1e2ea]">ARCHITECTURE WORKSPACE</div>
            <p className="mt-1 text-[10px] text-[#849588]">Create a layout, then edit every component in the inspector.</p>
          </div>
          <div className="p-3 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-[#849588]">Starter layouts</div>
            <button onClick={() => addArchitecturePreset('house')} className="w-full mb-2 rounded border border-[#343b45] bg-[#202832] px-3 py-2 text-left text-xs text-[#e1e2ea] hover:border-[#00d2ff]"><b className="block text-[#00d2ff]">Modern House</b><span className="text-[10px] text-[#9ba8b5]">Home shell with porch, door and windows</span></button>
            <button onClick={() => addArchitecturePreset('room')} className="w-full mb-2 rounded border border-[#343b45] bg-[#202832] px-3 py-2 text-left text-xs text-[#e1e2ea] hover:border-[#00d2ff]"><b className="block text-[#00d2ff]">Interior Room</b><span className="text-[10px] text-[#9ba8b5]">Floor, walls and ceiling beam</span></button>
            <button onClick={() => addArchitecturePreset('building')} className="w-full rounded border border-[#343b45] bg-[#202832] px-3 py-2 text-left text-xs text-[#e1e2ea] hover:border-[#00d2ff]"><b className="block text-[#00d2ff]">Building Block</b><span className="text-[10px] text-[#9ba8b5]">Larger architectural shell</span></button>
            <div className="border-t border-[#272a30] pt-3">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-[#849588]">Add architectural elements</div>
              <div className="grid grid-cols-2 gap-2">
                {(['wall', 'window', 'door', 'column', 'floor'] as const).map((kind) => <button key={kind} onClick={() => addArchitectureElement(kind)} className="rounded border border-[#343b45] bg-[#111820] px-2 py-2 text-[11px] capitalize text-[#cbd5df] hover:border-[#00d2ff]">+ {kind}</button>)}
              </div>
            </div>
            <div className="border-t border-[#272a30] pt-3">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-[#849588]">Scene components ({scene.rootObjects.length})</div>
              <div className="max-h-40 space-y-1 overflow-y-auto">
                {scene.rootObjects.map((obj) => (
                  <button key={obj.id} onClick={() => setSelectedObjectId(obj.id)} className={`w-full truncate rounded px-2 py-1.5 text-left text-[10px] ${selectedObjectId === obj.id ? 'bg-[#00d2ff]/15 text-[#00d2ff]' : 'text-[#b9cbbd] hover:bg-[#272a30]'}`}>{obj.name}</button>
                ))}
              </div>
            </div>
            <div className="rounded border border-[#343b45] bg-[#111820] p-2 text-[10px] leading-relaxed text-[#9ba8b5]">Select a component above to edit its dimensions, position, rotation and material in the inspector. Switch to 3D Modeling for free-form objects.</div>
          </div>
        </div>
      )}

      {/* Outliner Sidebar (Left overlay or right dock) */}
      {workspaceMode === 'modeling' && <div className="absolute left-4 top-16 bottom-4 w-72 bg-[#191c21]/95 backdrop-blur-md rounded border border-[#272a30] shadow-2xl flex flex-col z-20 overflow-hidden">
        {/* Outliner Header */}
        <div className="p-3 border-b border-[#272a30] flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs font-semibold text-[#e1e2ea]">
            <span className="material-symbols-outlined text-[16px] text-[#00f5a0]">account_tree</span>
            <span>SCENE OUTLINER</span>
          </div>
          <span className="text-[10px] font-['JetBrains_Mono'] text-[#849588]">
            {scene.rootObjects.length} Nodes
          </span>
        </div>

        {/* Quick Add Prim Button Bar */}
        <div className="p-2 border-b border-[#272a30] bg-[#1d2025]/50 flex items-center gap-1 justify-between">
          <button
            onClick={() => addObject('box')}
            className="px-2 py-1 rounded bg-[#272a30] hover:bg-[#32353b] text-[#e1e2ea] text-[10px] font-['JetBrains_Mono'] transition-colors"
            title="Add Box"
          >
            + Box
          </button>
          <button
            onClick={() => addObject('sphere')}
            className="px-2 py-1 rounded bg-[#272a30] hover:bg-[#32353b] text-[#e1e2ea] text-[10px] font-['JetBrains_Mono'] transition-colors"
            title="Add Sphere"
          >
            + Sphere
          </button>
          <button
            onClick={() => addObject('torus')}
            className="px-2 py-1 rounded bg-[#272a30] hover:bg-[#32353b] text-[#e1e2ea] text-[10px] font-['JetBrains_Mono'] transition-colors"
            title="Add Torus"
          >
            + Torus
          </button>
          <button
            onClick={() => addObject('cylinder')}
            className="px-2 py-1 rounded bg-[#272a30] hover:bg-[#32353b] text-[#e1e2ea] text-[10px] font-['JetBrains_Mono'] transition-colors"
            title="Add Cylinder"
          >
            + Cyl
          </button>
        </div>

        {/* Tree Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {scene.rootObjects.map((obj) => {
            const isSelected = obj.id === selectedObjectId;
            return (
              <div
                key={obj.id}
                onClick={() => setSelectedObjectId(obj.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors text-xs font-['JetBrains_Mono'] ${
                  isSelected
                    ? 'bg-[#00f5a0]/15 text-[#00f5a0] border border-[#00f5a0]/40 font-medium'
                    : 'text-[#e1e2ea] hover:bg-[#272a30]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[14px] text-[#849588]">
                    {obj.type === 'directional_light'
                      ? 'light_mode'
                      : obj.geometry === 'torus'
                      ? 'donut_large'
                      : obj.geometry === 'sphere'
                      ? 'radio_button_unchecked'
                      : 'deployed_code'}
                  </span>
                  <span className="truncate">{obj.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = scene.rootObjects.map((o) =>
                        o.id === obj.id ? { ...o, visible: !o.visible } : o
                      );
                      onUpdateScene({ ...scene, rootObjects: updated });
                    }}
                    className="p-1 hover:text-[#00f5a0] transition-colors"
                    title="Toggle Visibility"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {obj.visible ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>

                  {scene.rootObjects.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeObject(obj.id);
                      }}
                      className="p-1 text-[#849588] hover:text-[#ffb4ab] transition-colors"
                      title="Delete Object"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>}

      {/* Inspector / Properties Panel (Right side) */}
      {selectedObject && (
        <div className="absolute right-4 top-16 bottom-4 w-80 bg-[#191c21]/95 backdrop-blur-md rounded border border-[#272a30] shadow-2xl flex flex-col z-20 overflow-hidden">
          <div className="p-3 border-b border-[#272a30] flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs font-semibold text-[#e1e2ea]">
              <span className="material-symbols-outlined text-[16px] text-[#00d2ff]">tune</span>
              <span>NODE INSPECTOR</span>
            </div>
            <span className="text-[10px] font-['JetBrains_Mono'] text-[#00f5a0]">
              {selectedObject.geometry || selectedObject.type}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-['JetBrains_Mono'] text-xs">
            {/* Object Title */}
            <div>
              <label className="text-[10px] uppercase text-[#849588] block mb-1">Node Identifier</label>
              <input
                type="text"
                value={selectedObject.name}
                onChange={(e) => {
                  const updated = scene.rootObjects.map((o) =>
                    o.id === selectedObjectId ? { ...o, name: e.target.value } : o
                  );
                  onUpdateScene({ ...scene, rootObjects: updated });
                }}
                className="w-full bg-[#111319] border border-[#272a30] px-2.5 py-1.5 rounded text-[#e1e2ea] text-xs focus:outline-none focus:border-[#00f5a0]"
              />
            </div>

            {/* Transform 3D Position */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase text-[#849588] block">Position (World Space)</span>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <div key={axis} className="flex items-center bg-[#111319] rounded border border-[#272a30] px-2 py-1">
                    <span className="text-[10px] text-[#00f5a0] mr-1.5 font-bold">{axis}</span>
                    <input
                      type="number"
                      step="0.2"
                      value={selectedObject.transform.position[i]}
                      onChange={(e) => updateSelectedTransform('position', i, parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-[#e1e2ea] text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Transform 3D Rotation */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase text-[#849588] block">Rotation (Euler Rad)</span>
              <div className="grid grid-cols-3 gap-2">
                {['P', 'Y', 'R'].map((axis, i) => (
                  <div key={axis} className="flex items-center bg-[#111319] rounded border border-[#272a30] px-2 py-1">
                    <span className="text-[10px] text-[#00d2ff] mr-1.5 font-bold">{axis}</span>
                    <input
                      type="number"
                      step="0.1"
                      value={+(selectedObject.transform.rotation[i]).toFixed(2)}
                      onChange={(e) => updateSelectedTransform('rotation', i, parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-[#e1e2ea] text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Transform 3D Scale */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase text-[#849588] block">Scale Vector</span>
              <div className="grid grid-cols-3 gap-2">
                {['SX', 'SY', 'SZ'].map((axis, i) => (
                  <div key={axis} className="flex items-center bg-[#111319] rounded border border-[#272a30] px-2 py-1">
                    <span className="text-[10px] text-[#50ffaf] mr-1.5 font-bold">{axis}</span>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedObject.transform.scale[i]}
                      onChange={(e) => updateSelectedTransform('scale', i, parseFloat(e.target.value) || 0.1)}
                      className="w-full bg-transparent text-[#e1e2ea] text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Material Config */}
            {selectedObject.material && (
              <div className="pt-3 border-t border-[#272a30] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#849588]">PBR Material Config</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#111319] text-[#00f5a0] border border-[#3b4a40]/30">
                    {selectedObject.material.type}
                  </span>
                </div>

                {/* Base Color */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#b9cbbd]">Diffuse Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedObject.material.color}
                      onChange={(e) => updateSelectedMaterial('color', e.target.value)}
                      className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-[11px] text-[#e1e2ea]">{selectedObject.material.color}</span>
                  </div>
                </div>

                {/* Emissive Color */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#b9cbbd]">Emissive Bloom</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedObject.material.emissive || '#000000'}
                      onChange={(e) => updateSelectedMaterial('emissive', e.target.value)}
                      className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-[11px] text-[#e1e2ea]">{selectedObject.material.emissive || '#000000'}</span>
                  </div>
                </div>

                {/* Roughness */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#b9cbbd] mb-1">
                    <span>Roughness</span>
                    <span>{selectedObject.material.roughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedObject.material.roughness}
                    onChange={(e) => updateSelectedMaterial('roughness', parseFloat(e.target.value))}
                    className="w-full accent-[#00f5a0] bg-[#111319] h-1.5 rounded"
                  />
                </div>

                {/* Metalness */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#b9cbbd] mb-1">
                    <span>Metalness</span>
                    <span>{selectedObject.material.metalness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedObject.material.metalness}
                    onChange={(e) => updateSelectedMaterial('metalness', parseFloat(e.target.value))}
                    className="w-full accent-[#00d2ff] bg-[#111319] h-1.5 rounded"
                  />
                </div>

                {/* Wireframe toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[#b9cbbd]">Wireframe Shader</span>
                  <button
                    onClick={() => updateSelectedMaterial('wireframe', !selectedObject.material?.wireframe)}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                      selectedObject.material.wireframe
                        ? 'bg-[#00f5a0] text-[#002111]'
                        : 'bg-[#111319] text-[#849588] border border-[#272a30]'
                    }`}
                  >
                    {selectedObject.material.wireframe ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
