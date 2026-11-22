export interface Transform3D {
  position: [number, number, number]; // [x, y, z] in world coordinate space
  rotation: [number, number, number]; // [pitch, yaw, roll] in radians
  scale: [number, number, number];    // Normalized 1.0 unit scale factor
}

export interface MaterialConfig {
  id: string;
  type: 'standard' | 'physical' | 'toon' | 'unlit';
  color: string;             // Hex format #RRGGBB
  roughness: number;         // 0.0 - 1.0
  metalness: number;         // 0.0 - 1.0
  emissive?: string;         // Luminescent bloom color
  wireframe?: boolean;
}

export interface SceneObject {
  id: string;
  name: string;
  type: 'mesh' | 'directional_light' | 'point_light' | 'camera' | 'group';
  geometry?: 'box' | 'sphere' | 'torus' | 'cylinder' | 'pyramid' | 'custom_gltf';
  transform: Transform3D;
  material?: MaterialConfig;
  children?: SceneObject[];
  castShadow: boolean;
  receiveShadow: boolean;
  visible: boolean;
}

export interface MirroraScene {
  version: '2.4.0';
  worldId: string;
  worldName: string;
  environment: {
    ambientColor: string;
    ambientIntensity: number;
    fogDensity: number;
    skyPreset: 'cyberpunk_dawn' | 'orbital_void' | 'monolith_gray';
    gridVisible: boolean;
    bloomIntensity: number;
  };
  rootObjects: SceneObject[];
}

export interface WorldProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  author: string;
  updatedAt: string;
  tris: number;
  items: number;
  isPublic: boolean;
  tags: string[];
  scene: MirroraScene;
}

export type ActiveScreen =
  | 'docs-and-specs'
  | 'studio-editor'
  | 'explore-worlds'
  | 'my-projects'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact';

export type SidePanelType =
  | 'outliner'
  | 'viewport'
  | 'assets'
  | 'shaders'
  | 'physics'
  | 'terminal'
  | 'settings'
  | null;
