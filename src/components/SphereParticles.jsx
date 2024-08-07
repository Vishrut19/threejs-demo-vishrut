// SphereParticles.jsx
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SphereParticles({ visible, sphereRadius = 3.0 }) {
  // Set default sphere radius to 3.0
  const particlesRef = useRef();

  useEffect(() => {
    const particles = particlesRef.current;

    if (!particles) return;

    const count = 5000; // Number of particles
    const positions = new Float32Array(count * 3);

    // Create a new sphere geometry to get vertices
    const sphere = new THREE.SphereGeometry(1, 32, 32);

    for (let i = 0; i < count; i++) {
      const vertex = new THREE.Vector3();
      const theta = THREE.MathUtils.randFloatSpread(360); // Random angle
      const phi = THREE.MathUtils.randFloatSpread(360); // Random angle

      // Convert spherical coordinates to Cartesian
      vertex.x = Math.cos(theta) * Math.sin(phi);
      vertex.y = Math.sin(theta) * Math.sin(phi);
      vertex.z = Math.cos(phi);

      // Scale vertex by sphere radius and add some randomness
      vertex.multiplyScalar(sphereRadius + Math.random() * 0.1);

      // Set positions
      positions[i * 3] = vertex.x;
      positions[i * 3 + 1] = vertex.y;
      positions[i * 3 + 2] = vertex.z;
    }

    particles.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }, [sphereRadius]);

  useFrame(() => {
    // Update frame logic if needed
  });

  return (
    <points ref={particlesRef} visible={visible}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial attach="material" size={0.01} color="white" />
    </points>
  );
}

export default SphereParticles;
