import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ThreeBackgroundProps {
  mouseX: any; // MotionValue
  mouseY: any; // MotionValue
  dragX: any;  // MotionValue
}

// Procedural Reeded Glass Wave Mesh Component
function ReededGlassPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Create a plane geometry with high horizontal subdivision to trace smooth curves
  const geometry = useMemo(() => {
    const width = viewport.width * 1.5;
    const height = viewport.height * 1.5;
    const geo = new THREE.PlaneGeometry(width, height, 200, 2);
    
    // Deform vertices horizontally to create the beautiful architectural reeded/ribbed glass texture
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Sine wave deformation for vertical ribs
      const zOffset = Math.sin(x * 4.5) * 0.22;
      pos.setZ(i, zOffset);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [viewport]);

  return (
    <mesh ref={meshRef} position={[0, 0, 1.2]} geometry={geometry}>
      <meshStandardMaterial
        color="#151515"
        roughness={0.12}
        metalness={0.92}
        transparent={true}
        opacity={0.88}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating interactive ambient lights behind the reeded glass
function AmbientLightsSystem({ mouseX, mouseY, dragX }: ThreeBackgroundProps) {
  const lightRef1 = useRef<THREE.Group>(null);
  const lightRef2 = useRef<THREE.Group>(null);
  const lightRef3 = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Get current interactive mouse offsets from Framer Motion value (-1 to 1)
    const mx = mouseX.get() * 5;
    const my = mouseY.get() * 3;

    // Direct synchronization of Framer motion value with Three.js ref object as requested!
    if (lensRef.current) {
      // Map the drag range (-120px to 120px in pixels) onto Three.js coordinate space (-6 to 6 units)
      const mappedX = (dragX.get() / 120) * 6;
      lensRef.current.position.x = mappedX;
      
      // Gently rotate the lens for fluid energy
      lensRef.current.rotation.y = elapsed * 0.5;
      lensRef.current.rotation.x = elapsed * 0.2;
    }

    // Organic atmospheric float pathways for background glowing lights
    if (lightRef1.current) {
      lightRef1.current.position.x = THREE.MathUtils.lerp(
        lightRef1.current.position.x,
        Math.sin(elapsed * 0.35) * 4 + mx,
        0.05
      );
      lightRef1.current.position.y = THREE.MathUtils.lerp(
        lightRef1.current.position.y,
        Math.cos(elapsed * 0.4) * 2.5 + my,
        0.05
      );
    }

    if (lightRef2.current) {
      lightRef2.current.position.x = THREE.MathUtils.lerp(
        lightRef2.current.position.x,
        Math.cos(elapsed * 0.25) * 5 + mx * 0.7,
        0.05
      );
      lightRef2.current.position.y = THREE.MathUtils.lerp(
        lightRef2.current.position.y,
        Math.sin(elapsed * 0.3) * 3 + my * 0.7,
        0.05
      );
    }

    if (lightRef3.current) {
      lightRef3.current.position.x = THREE.MathUtils.lerp(
        lightRef3.current.position.x,
        Math.sin(elapsed * 0.5) * 3 - mx * 0.5,
        0.05
      );
      lightRef3.current.position.y = THREE.MathUtils.lerp(
        lightRef3.current.position.y,
        Math.cos(elapsed * 0.45) * 2 - my * 0.5,
        0.05
      );
    }
  });

  return (
    <>
      {/* Light 1: Primary Warm Amber Accent */}
      <group ref={lightRef1} position={[-3, 2, -2]}>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#FF7A1A" transparent opacity={0.6} />
        </mesh>
        <pointLight color="#FF7A1A" intensity={18} distance={15} decay={1.5} />
      </group>

      {/* Light 2: Deep Sunset Orange */}
      <group ref={lightRef2} position={[4, -1, -3]}>
        <mesh>
          <sphereGeometry args={[2.0, 32, 32]} />
          <meshBasicMaterial color="#FF4500" transparent opacity={0.4} />
        </mesh>
        <pointLight color="#FF4500" intensity={22} distance={20} decay={1.5} />
      </group>

      {/* Light 3: Bright White Highlighting Reflection */}
      <group ref={lightRef3} position={[0, -2, -1.5]}>
        <mesh>
          <sphereGeometry args={[1.0, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
        <pointLight color="#ffffff" intensity={10} distance={12} decay={1.8} />
      </group>

      {/* Synchronized Drag Target Mesh (Beautiful physical glowing torus/lens) */}
      <mesh ref={lensRef} position={[0, 0, -1]}>
        <torusGeometry args={[1.1, 0.18, 16, 100]} />
        <meshStandardMaterial 
          color="#FF7A1A" 
          emissive="#FF7A1A"
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0.9}
        />
        <pointLight color="#FF7A1A" intensity={15} distance={10} decay={2} />
      </mesh>
    </>
  );
}

export default function ThreeBackground({ mouseX, mouseY, dragX }: ThreeBackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflowing-hidden">
      {/* Canvas container with absolute stretch */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 10, 5]} intensity={0.8} />
        
        {/* Glowing lights mapping and Framer motion synchronization */}
        <AmbientLightsSystem mouseX={mouseX} mouseY={mouseY} dragX={dragX} />
        
        {/* Reeded ribbed glass sheet positioned in front */}
        <ReededGlassPlane />
      </Canvas>
    </div>
  );
}
