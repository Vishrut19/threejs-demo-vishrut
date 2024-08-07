import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleTransition from "./components/ParticleTransition";

function App() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 5000);
    const timer2 = setTimeout(() => setPhase(2), 10000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <ParticleTransition phase={phase} />
      </Canvas>
    </div>
  );
}

export default App;
