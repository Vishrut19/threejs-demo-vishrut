import React, { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

function TransitionEffect({ previousParticles }) {
  const [time, setTime] = useState(0);
  const meshRef = useRef();
  const { viewport } = useThree(); // Get viewport information
  const count = 3000; // Number of particles

  // Create random digits (0 or 1) for each particle
  const digits = useMemo(
    () => new Array(count).fill(0).map(() => (Math.random() > 0.5 ? 1 : 0)),
    [count]
  );

  // Calculate a reasonable size based on the viewport dimensions
  const areaWidth = viewport.width;
  const areaHeight = viewport.height;

  // Create an array of positions and initialize Y positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = Math.random() * areaWidth - areaWidth / 2; // X within viewport width
      pos[i * 3 + 1] = Math.random() * areaHeight - areaHeight / 2; // Y within viewport height
      pos[i * 3 + 2] = 0; // Z at 0, all on the same plane
    }
    return pos;
  }, [count, areaWidth, areaHeight]);

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  useFrame((state, delta) => {
    // Slow down the time increment
    setTime((prevTime) => prevTime + delta * 0.1);

    const positions = particlesGeometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      // Sine wave motion
      positions[i] = Math.sin(time * 2 + i * 0.1) * 0.5 + positions[i];
    }
    particlesGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {digits.map((digit, index) => (
        <Text
          key={index}
          position={[
            positions[index * 3],
            positions[index * 3 + 1],
            positions[index * 3 + 2],
          ]}
          fontSize={0.2}
          color="lime"
        >
          {String(digit)}
        </Text>
      ))}
    </group>
  );
}

export default TransitionEffect;
