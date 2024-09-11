import Coordinates from "./coordinates";
import { StationData } from "./observationStation";

export class GridPointService {
  stationData: StationData[];

  constructor(stationData: StationData[]) {
    this.stationData = stationData;
  }

  getClosestStation(target: Coordinates): StationData {
    return this.findClosestStation(this.stationData, target);
  }

  findClosestStation(
    stationData: StationData[],
    target: Coordinates
  ): StationData {
    let closestStation: StationData | null = null;
    let minDistance = Infinity;
    stationData.forEach((station) => {
      const distance = station.coordinates.calculateDistance(target);
      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    });
    if (!closestStation) {
      throw new Error("No closest station found");
    }
    return closestStation;
  }
}
