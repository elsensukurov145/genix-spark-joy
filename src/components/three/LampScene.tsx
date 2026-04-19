import { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

type LampProps = { on: boolean; onToggle: () => void };

/* ------------------------------------------------------------------ */
/*  Dust particles inside the light cone                              */
/* ------------------------------------------------------------------ */
function DustMotes({ visible }: { visible: boolean }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      const r = Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      arr[i * 3 + 0] = Math.cos(theta) * r;
      arr[i * 3 + 1] = -Math.random() * 2.6 + 0.2;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 0.55 : 0, 0.05);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffd580"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0}
      />
    </Points>
  );
}

/* ------------------------------------------------------------------ */
/*  Volumetric-ish light cone underneath the lamp                     */
/* ------------------------------------------------------------------ */
function LightCone({ on }: { on: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, on ? 0.18 : 0, 0.08);
  });
  return (
    <mesh ref={ref} position={[0, -1.6, 0]} rotation={[0, 0, 0]}>
      <coneGeometry args={[1.4, 2.8, 48, 1, true]} />
      <meshBasicMaterial
        color="#ffd580"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Hanging pendant lamp with pendulum sway                           */
/* ------------------------------------------------------------------ */
function PendantLamp({
  on,
  onToggle,
  pullY,
  setPullY,
}: LampProps & { pullY: number; setPullY: (n: number) => void }) {
  const swing = useRef<THREE.Group>(null);
  const bulb = useRef<THREE.Mesh>(null);
  const cord = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const { gl } = useThree();

  // Pendulum sway
  useFrame((state) => {
    if (swing.current) {
      const t = state.clock.elapsedTime;
      const sway = Math.sin(t * 0.9) * 0.05 + Math.sin(t * 0.4) * 0.02;
      swing.current.rotation.z = sway;
    }
    if (bulb.current && on) {
      const m = bulb.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2.4 + Math.sin(state.clock.elapsedTime * 7) * 0.18;
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(true);
    dragStart.current = e.clientY;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    e.stopPropagation();
    const delta = (e.clientY - dragStart.current) / window.innerHeight;
    setPullY(Math.max(0, Math.min(0.45, delta * 1.6)));
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    e.stopPropagation();
    setDragging(false);
    if (pullY > 0.08) onToggle();
    setPullY(0);
  };

  return (
    <group>
      {/* Ceiling cord (from y=4 down to lamp top at y=0.7) */}
      <mesh ref={cord} position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 3.3, 8]} />
        <meshStandardMaterial color="#0e0e14" roughness={0.9} />
      </mesh>

      {/* Swinging pendant group, pivots at top */}
      <group ref={swing} position={[0, 0.7, 0]}>
        {/* tiny anchor cap */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.08, 24]} />
          <meshStandardMaterial color="#1a1a22" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* dome shade (open at bottom) */}
        <group
          onClick={(e) => {
            e.stopPropagation();
            // also toggle on direct click for accessibility
            if (!dragging) onToggle();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            gl.domElement.style.cursor = "none";
          }}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.03 : 1}
        >
          <mesh position={[0, -0.3, 0]} castShadow>
            <sphereGeometry args={[0.55, 48, 32, 0, Math.PI * 2, 0, Math.PI / 1.9]} />
            <meshStandardMaterial
              color={on ? "#2a1f12" : "#15151c"}
              metalness={0.7}
              roughness={0.35}
              side={THREE.DoubleSide}
              emissive={on ? "#ffb648" : "#000"}
              emissiveIntensity={on ? 0.18 : 0}
            />
          </mesh>

          {/* inner reflector (warm) */}
          <mesh position={[0, -0.32, 0]}>
            <sphereGeometry args={[0.52, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={on ? "#ffe2a8" : "#2a2a32"}
              side={THREE.BackSide}
              emissive={on ? "#ffd580" : "#000"}
              emissiveIntensity={on ? 0.6 : 0}
              roughness={0.6}
            />
          </mesh>

          {/* bulb */}
          <mesh ref={bulb} position={[0, -0.55, 0]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial
              color={on ? "#fff1c0" : "#1a1a20"}
              emissive={on ? "#ffd580" : "#000"}
              emissiveIntensity={on ? 2.6 : 0}
              toneMapped={false}
            />
          </mesh>

          {/* warm light from bulb */}
          {on && (
            <pointLight
              position={[0, -0.55, 0]}
              color="#ffd580"
              intensity={9}
              distance={16}
              decay={2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
          )}
        </group>

        {/* Pull cord — string + wooden bead, draggable */}
        <group position={[0.18, -0.85 - pullY, 0]}>
          <mesh position={[0, pullY / 2, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.55 + pullY, 6]} />
            <meshStandardMaterial color={on ? "#d4b27a" : "#444"} />
          </mesh>
          {/* Wooden bead handle */}
          <mesh
            position={[0, -0.32, 0]}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerOver={(e) => {
              e.stopPropagation();
              gl.domElement.style.cursor = "grab";
            }}
            onPointerOut={() => {
              gl.domElement.style.cursor = "none";
            }}
          >
            <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
            <meshStandardMaterial
              color={on ? "#c98a3a" : "#5a3a1f"}
              roughness={0.5}
              metalness={0.1}
              emissive={on ? "#ffb648" : "#000"}
              emissiveIntensity={on ? 0.3 : 0}
            />
          </mesh>
          {/* Hint glow ring around bead when off */}
          {!on && (
            <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08, 0.11, 32]} />
              <meshBasicMaterial
                color="#1D9E75"
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>

        {/* Dust + light cone follow the pendant sway */}
        <group position={[0, -0.55, 0]}>
          <DustMotes visible={on} />
          <LightCone on={on} />
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Floor with subtle reflection                                       */
/* ------------------------------------------------------------------ */
function FloorPlane({ on }: { on: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, on ? 0.08 : 0, 0.05);
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshStandardMaterial
        color="#06060a"
        roughness={0.85}
        metalness={0.15}
        emissive="#ffd580"
        emissiveIntensity={0}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
export const LampScene = ({ on, onToggle }: LampProps) => {
  const [pullY, setPullY] = useState(0);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.2, 4.2], fov: 38 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#06060a"]} />
      <fog attach="fog" args={["#06060a", 5, 14]} />

      {/* Moonlight ambient */}
      <ambientLight intensity={on ? 0.32 : 0.07} />
      <directionalLight position={[-3, 4, 2]} intensity={on ? 0.25 : 0.06} color="#9bb6ff" />
      {/* subtle red ambient on edges */}
      <pointLight position={[-4, 0, -2]} color="#5a1018" intensity={0.5} distance={9} />
      <pointLight position={[4, -1, -2]} color="#1D9E75" intensity={0.35} distance={9} />

      <Suspense fallback={null}>
        <PendantLamp on={on} onToggle={onToggle} pullY={pullY} setPullY={setPullY} />
        <FloorPlane on={on} />
        <ContactShadows
          position={[0, -2.39, 0]}
          opacity={0.55}
          scale={8}
          blur={2.6}
          far={3.5}
          color="#000000"
        />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
};

export default LampScene;
