# TOOLSX 3D

Browser-based 3D modeling & simple architecture studio (Vite + React + three.js). Target: https://3d.toolsx.in

## Run
```
npm install
npm run dev      # http://localhost:3000
npm run build    # output in dist/
```

## What works
- Orbit (mouse/touch drag), zoom (wheel), click an object to select it (green outline)
- Add shapes, edit position/rotation/scale and material, delete, undo/redo (Ctrl+Z / Ctrl+Y)
- Autosave in the browser (localStorage)
- Real export: .glb, .gltf, .obj, .stl (Export button) + scene JSON
- Real FPS and triangle count in the status bar

## Known limitations (be honest with users)
- "Quick Shapes" is an offline template generator, NOT an AI model
- Login is local to this browser only (no server, no cloud sync)
- No import yet, no move/rotate gizmo in the viewport (use the numeric inputs), no multi-select
- Autosave uses localStorage (small projects only)
