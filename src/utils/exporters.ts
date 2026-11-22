import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { MirroraScene, SceneObject } from '../types/schema';

/** Triangle counts of the primitives used by the studio (same segment counts as the viewport). */
const TRIS: Record<string, number> = { box: 12, sphere: 1984, torus: 3072, cylinder: 128, pyramid: 8 };

export function countTriangles(scene: MirroraScene): number {
  return scene.rootObjects.reduce(
    (sum, o) => (o.type === 'mesh' && o.visible ? sum + (TRIS[o.geometry ?? 'box'] ?? 12) : sum),
    0
  );
}

function makeGeometry(kind: SceneObject['geometry']): THREE.BufferGeometry {
  switch (kind) {
    case 'sphere': return new THREE.SphereGeometry(1, 32, 32);
    case 'torus': return new THREE.TorusGeometry(1, 0.25, 24, 64);
    case 'cylinder': return new THREE.CylinderGeometry(1, 1, 2, 32);
    case 'pyramid': return new THREE.ConeGeometry(1, 2, 4);
    default: return new THREE.BoxGeometry(1, 1, 1);
  }
}

/** Builds a plain three.js scene (meshes only) from the saved scene data, for exporting. */
export function buildExportScene(scene: MirroraScene): THREE.Scene {
  const root = new THREE.Scene();
  root.name = scene.worldName;
  scene.rootObjects.forEach((obj) => {
    if (obj.type !== 'mesh' || !obj.visible) return;
    const mat = new THREE.MeshStandardMaterial({
      color: obj.material?.color ?? '#cccccc',
      roughness: obj.material?.roughness ?? 0.5,
      metalness: obj.material?.metalness ?? 0.0,
      wireframe: false,
    });
    if (obj.material?.emissive) mat.emissive.set(obj.material.emissive);
    const mesh = new THREE.Mesh(makeGeometry(obj.geometry), mat);
    mesh.name = obj.name;
    mesh.position.set(...obj.transform.position);
    mesh.rotation.set(...obj.transform.rotation);
    mesh.scale.set(...obj.transform.scale);
    root.add(mesh);
  });
  root.updateMatrixWorld(true);
  return root;
}

function download(data: BlobPart, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const safeName = (s: string) => (s || 'scene').trim().replace(/[^a-z0-9_-]+/gi, '-').toLowerCase() || 'scene';

export type ExportFormat = 'glb' | 'gltf' | 'obj' | 'stl';

export async function exportScene(scene: MirroraScene, format: ExportFormat): Promise<void> {
  const three = buildExportScene(scene);
  if (three.children.length === 0) throw new Error('Scene has no visible meshes to export.');
  const base = safeName(scene.worldName);
  if (format === 'glb' || format === 'gltf') {
    const exporter = new GLTFExporter();
    const result = await exporter.parseAsync(three, { binary: format === 'glb' });
    if (format === 'glb') {
      download(result as ArrayBuffer, `${base}.glb`, 'model/gltf-binary');
    } else {
      download(JSON.stringify(result), `${base}.gltf`, 'model/gltf+json');
    }
  } else if (format === 'obj') {
    download(new OBJExporter().parse(three), `${base}.obj`, 'text/plain');
  } else {
    download(new STLExporter().parse(three, { binary: true }) as unknown as BlobPart, `${base}.stl`, 'model/stl');
  }
  three.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
}
