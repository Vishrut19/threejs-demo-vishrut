import React, { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function TorusParticles() {
  const particlesRef = useRef();
  const startTimeRef = useRef(null);
  const transitionDuration = 5; // Transition duration in seconds
  const count = 5000; // Number of particles

  // Create torus geometry once and store it
  const torus = useMemo(() => new THREE.TorusGeometry(1, 0.3, 16, 100), []);
  const torusPositions = useMemo(
    () => Array.from(torus.attributes.position.array), // Convert to regular array
    [torus]
  );

  useEffect(() => {
    const particles = particlesRef.current;
    const positions = new Float32Array(count * 3);

    // Initialize particles to random positions on a plane
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = 0; // Flat plane
    }

    particles.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }, [count]);

  useFrame((state) => {
    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const elapsedTime = state.clock.elapsedTime - startTimeRef.current;
    const transitionProgress = Math.min(elapsedTime / transitionDuration, 1);

    for (let i = 0; i < positions.length; i += 3) {
      const j = (i / 3) % (torusPositions.length / 3); // Wrap around torus positions

      positions[i] = THREE.MathUtils.lerp(
        positions[i],
        torusPositions[j * 3],
        transitionProgress
      );
      positions[i + 1] = THREE.MathUtils.lerp(
        positions[i + 1],
        torusPositions[j * 3 + 1],
        transitionProgress
      );
      positions[i + 2] = THREE.MathUtils.lerp(
        positions[i + 2],
        torusPositions[j * 3 + 2],
        transitionProgress
      );
    }

    if (particles.geometry.attributes.position) {
      particles.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial attach="material" size={0.05} color="white" />
    </points>
  );
}

export default TorusParticles;
