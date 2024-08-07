import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import SphereParticles from "./components/SphereParticles";
import TransitionEffect from "./components/TransitionEffects";
import TorusParticles from "./components/TorusParticles";
import MatrixRain from "./components/TransitionEffects";

function App() {
  const [phase, setPhase] = useState(0);

  setTimeout(() => setPhase(1), 3000);
  setTimeout(() => setPhase(2), 8000);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        {phase === 0 && <SphereParticles visible sphereRadius={3.0} />}
        {phase === 1 && <MatrixRain />}
        {phase === 2 && <TorusParticles />}
      </Canvas>
    </div>
  );
}

export default App;
