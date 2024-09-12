import Coordinates from "./coordinates";
import { StationData, StationDataRaw } from "./observationStation";

export class GridPointsRunner {
  private url: string;
  hasRunOnce: boolean = false;
  private stationData: StationData[] = [];

  constructor(url: string) {
    this.url = url;
  }

  async run(): Promise<StationData[] | any> {
    let data: StationData;
    try {
      const response = await fetch(this.url, {
        headers: {
          Accept: "application/geo+json",
        },
      });
      this.hasRunOnce = true;
      if (response.ok) {
        data = await response.json();
        this.stationData = this.parseStationsData(data);
        return this.stationData;
      } else {
        // Custom message for failed HTTP codes
        if (response.status === 404) throw new Error("404, Not found");
        if (response.status === 500) {
          // internal server error - retry once after 5 seconds and then fail.  TODO: standardize retry logic
          if (!this.hasRunOnce) {
            setTimeout(() => {
              this.run();
            }, 5000);
          }
        }
        throw new Error("500, internal server error");
        // For any other server error
        throw new Error(response.status + "");
      }
    } catch (error) {
      console.error("Fetch", error);
    }
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
