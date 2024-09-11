import Coordinates from "./coordinates";
import { StationData, StationDataRaw } from "./observationStation";

export class GridPointsRunner {
  private url: string;
  private stationData: StationData[] = [];

  constructor(url: string) {
    this.url = url;
  }

  async run(): Promise<StationData[]> {
    const response = await fetch(this.url, {
      headers: {
        Accept: "application/geo+json",
      },
    });
    const data = await response.json();
    this.stationData = this.parseStationsData(data);
    return this.stationData;
  }

  parseStationsData(data: any): StationData[] {
    const observationStations: [] = data.features;
    if (!observationStations || observationStations.length === 0) {
      throw new Error("No observation stations found in the response");
    }
    return observationStations.map((os: StationDataRaw) => {
      const station: StationData = {
        id: os.id,
        coordinates: new Coordinates(
          os.geometry.coordinates[1],
          os.geometry.coordinates[0]
        ),
      };
      return station;
    });
  }
}
