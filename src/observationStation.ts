import Coordinates from "./coordinates";

export class StationData {
  id: string;
  coordinates: Coordinates;
  constructor(id: string, coordinates: Coordinates) {
    this.id = id;
    this.coordinates = coordinates;
  }
}

export interface StationDataRaw {
  id: string;
  geometry: {
    coordinates: [number, number];
  };
}
