import plantumlEncoder from 'plantuml-encoder';

// Function to encode PlantUML to URL
export function encodeForPlantUML(umlCode) {
  return plantumlEncoder.encode(umlCode);
}
