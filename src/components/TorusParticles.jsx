import React, { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function TorusParticles({ previousParticles }) {
  const particlesRef = useRef();
  const startTimeRef = useRef(null);
  const transitionDuration = 5;
  const count = previousParticles
    ? previousParticles.geometry.attributes.position.count
    : 5000;

  const torus = useMemo(() => new THREE.TorusGeometry(1, 0.3, 16, 100), []);
  const torusPositions = useMemo(
    () => Array.from(torus.attributes.position.array),
    [torus]
  );

  useEffect(() => {
    const particles = particlesRef.current;
    const positions = previousParticles
      ? previousParticles.geometry.attributes.position.array.slice()
      : new Float32Array(count * 3);

    particles.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }, [count, previousParticles]);

  useFrame((state) => {
    const particles = particlesRef.current;
    const positions = particles.geometry.attributes.position.array;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const elapsedTime = state.clock.elapsedTime - startTimeRef.current;
    const transitionProgress = Math.min(elapsedTime / transitionDuration, 1);

    for (let i = 0; i < positions.length; i += 3) {
      const j = (i / 3) % (torusPositions.length / 3);

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

    particles.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial attach="material" size={0.05} color="white" />
    </points>
  );
}

export default TorusParticles;
