// import React, { useRef, useEffect } from "react";
// import { useFrame } from "@react-three/fiber";
// import * as THREE from "three";

// function TransitionEffect() {
//   const particlesRef = useRef();
//   const startTimeRef = useRef(null);

//   const count = 500; // Number of particles
//   const transitionDuration = 2; // Transition duration in seconds

//   useEffect(() => {
//     const particles = particlesRef.current;
//     const positions = new Float32Array(count * 3);
//     const originalPositions = new Float32Array(count * 3);

//     // Initialize particles to random positions on a sphere
//     for (let i = 0; i < count; i++) {
//       const theta = THREE.MathUtils.randFloatSpread(360);
//       const phi = THREE.MathUtils.randFloatSpread(360);

//       const x = Math.cos(theta) * Math.sin(phi);
//       const y = Math.sin(theta) * Math.sin(phi);
//       const z = Math.cos(phi);

//       positions[i * 3] = x;
//       positions[i * 3 + 1] = y;
//       positions[i * 3 + 2] = z;

//       // Save original positions for transition calculations
//       originalPositions[i * 3] = x;
//       originalPositions[i * 3 + 1] = y;
//       originalPositions[i * 3 + 2] = z;
//     }

//     particles.geometry.setAttribute(
//       "position",
//       new THREE.BufferAttribute(positions, 3)
//     );

//     particles.geometry.setAttribute(
//       "originalPosition",
//       new THREE.BufferAttribute(originalPositions, 3)
//     );
//   }, []);

//   useFrame((state) => {
//     const particles = particlesRef.current;
//     const positions = particles.geometry.attributes.position.array;
//     const originalPositions =
//       particles.geometry.attributes.originalPosition.array;

//     if (startTimeRef.current === null) {
//       startTimeRef.current = state.clock.elapsedTime;
//     }

//     const elapsedTime = state.clock.elapsedTime - startTimeRef.current;
//     const transitionProgress = Math.min(elapsedTime / transitionDuration, 1);

//     for (let i = 0; i < positions.length; i += 3) {
//       // Transition from sphere to plane
//       positions[i] = THREE.MathUtils.lerp(
//         originalPositions[i],
//         (Math.random() - 0.5) * 4,
//         transitionProgress
//       );
//       positions[i + 1] = THREE.MathUtils.lerp(
//         originalPositions[i + 1],
//         Math.random() * 4 - 2,
//         transitionProgress
//       );
//       positions[i + 2] = THREE.MathUtils.lerp(
//         originalPositions[i + 2],
//         0,
//         transitionProgress
//       );

//       // Apply Matrix-like falling effect
//       if (transitionProgress === 1) {
//         positions[i + 1] -= 0.05; // Make it fall faster
//         if (positions[i + 1] < -2) positions[i + 1] = 2; // Loop back to the top
//       }
//     }

//     particles.geometry.attributes.position.needsUpdate = true;
//   });

//   return (
//     <points ref={particlesRef}>
//       <bufferGeometry attach="geometry" />
//       <pointsMaterial attach="material" size={0.1} color="white" />
//     </points>
//   );
// }

// export default TransitionEffect;

import React, { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

function TransitionEffect() {
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
