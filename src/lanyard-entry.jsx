import React from "react";
import { createRoot } from "react-dom/client";
import Lanyard from "./lanyard/Lanyard.jsx";

const target = document.getElementById("lanyard-root");

if (target) {
  createRoot(target).render(
    <Lanyard
      position={[0, 0, 21]}
      gravity={[0, -40, 0]}
      frontImage="assets/img/profile/harisriyoni.png"
      backImage="assets/img/profile/harisriyoni.png"
      imageFit="cover"
      lanyardImage="assets/lanyard/lanyard.png"
      lanyardWidth={1.25}
    />
  );
}
