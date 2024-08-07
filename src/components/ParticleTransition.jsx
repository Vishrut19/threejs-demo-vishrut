import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const ParticleTransition = ({ phase }) => {
  const particlesRef = useRef();
  const [time, setTime] = useState(0);
  const count = 1000; // Total number of particles
  const columns = 50; // Number of columns in matrix phase

  // Create matrix characters with random initial properties
  const matrixChars = useMemo(() => {
    return Array.from({ length: columns }, () =>
      Array.from({ length: Math.ceil(count / columns) }, () => ({
        value: Math.random() > 0.5 ? "1" : "0",
        y: Math.random() * 8 - 4,
        speed: Math.random() * 0.2 + 0.1,
        opacity: Math.random(),
      }))
    );
  }, [count, columns]);

  // Calculate random sphere positions
  const spherePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      positions[i * 3] = Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = Math.cos(phi);
    }
    return positions;
  }, [count]);

  // Get torus positions using a torus geometry
  const torusPositions = useMemo(() => {
    const torus = new THREE.TorusGeometry(1, 0.3, 16, 100);
    return Array.from(torus.attributes.position.array);
  }, []);

  useFrame((state, delta) => {
    setTime((prevTime) => prevTime + delta);
    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array;

    // Update positions of particles based on phase
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let targetX, targetY, targetZ;

      if (phase === 0) {
        // Move particles to sphere positions
        targetX = spherePositions[i3];
        targetY = spherePositions[i3 + 1];
        targetZ = spherePositions[i3 + 2];
      } else if (phase === 1) {
        // Move particles to matrix-like effect
        const col = i % columns;
        const row = Math.floor(i / columns);
        targetX = (col / columns - 0.5) * 4;
        targetY = matrixChars[col][row].y;
        targetZ = 0;
      } else {
        // Move particles to torus positions
        const j = i % (torusPositions.length / 3);
        targetX = torusPositions[j * 3];
        targetY = torusPositions[j * 3 + 1];
        targetZ = torusPositions[j * 3 + 2];
      }

      // Animate the transition
      positions[i3] += (targetX - positions[i3]) * 0.1;
      positions[i3 + 1] += (targetY - positions[i3 + 1]) * 0.1;
      positions[i3 + 2] += (targetZ - positions[i3 + 2]) * 0.1;
    }

    // Animate matrix effect characters
    if (phase === 1) {
      matrixChars.forEach((column, colIndex) => {
        column.forEach((char, rowIndex) => {
          char.y -= char.speed * delta;
          char.opacity -= 0.01;
          if (char.y < -4 || char.opacity <= 0) {
            char.y = 4;
            char.value = Math.random() > 0.5 ? "1" : "0";
            char.opacity = 1;
          }
        });
      });
    }

    particles.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Render particle points */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={spherePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="lime" />
      </points>
      {phase === 1 &&
        matrixChars.flatMap((column, colIndex) =>
          column.map((char, rowIndex) => (
            <Text
              key={`${colIndex}-${rowIndex}`}
              position={[(colIndex / columns - 0.5) * 4, char.y, 0]}
              fontSize={0.1}
              color={new THREE.Color(0, 1, 0).multiplyScalar(char.opacity)}
            >
              {char.value}
            </Text>
          ))
        )}
    </group>
  );
};

export default ParticleTransition;
