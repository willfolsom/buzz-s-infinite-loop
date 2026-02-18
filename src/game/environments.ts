export interface Environment {
  name: string;
  groundColor: string;
  fogColor: string;
  skyColor: string;
  obstacleColor: string;
  accentColor: string;
}

export const environments: Environment[] = [
  {
    name: "DEEP SPACE",
    groundColor: "#1a1a3e",
    fogColor: "#0a0a2e",
    skyColor: "#050520",
    obstacleColor: "#4444aa",
    accentColor: "#8888ff",
  },
  {
    name: "DESERT PLANET",
    groundColor: "#c4a035",
    fogColor: "#e8c84a",
    skyColor: "#d4a030",
    obstacleColor: "#8b6914",
    accentColor: "#ff9900",
  },
  {
    name: "TOXIC FOREST",
    groundColor: "#1a4a1a",
    fogColor: "#0d2d0d",
    skyColor: "#0a200a",
    obstacleColor: "#2d8b2d",
    accentColor: "#44ff44",
  },
  {
    name: "CYBER OCEAN",
    groundColor: "#0a3050",
    fogColor: "#051828",
    skyColor: "#030f1a",
    obstacleColor: "#1080b0",
    accentColor: "#00ddff",
  },
  {
    name: "VOLCANO WORLD",
    groundColor: "#3a1a0a",
    fogColor: "#2a0a00",
    skyColor: "#1a0500",
    obstacleColor: "#881100",
    accentColor: "#ff4400",
  },
];
