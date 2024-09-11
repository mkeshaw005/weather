import Coordinates from "./coordinates";

export class PointsRequestRunner {
  private url: string;
  constructor(private coordinates: Coordinates) {
    this.url = this.constructPointsUrl(coordinates);
  }

  async run(): Promise<string> {
    const response = await fetch(this.url, {
      headers: {
        Accept: "application/geo+json",
      },
    });
    const data = await response.json();
    return this.parsePointsData(data);
  }

  /**
   * @param {Coordinates} coordinates Coordiantes object indicating where we'd like to query historic weather
   * @returns {string} The URL to fetch grid points data
   */
  constructPointsUrl(coordinates: Coordinates): string {
    if (!process.env.POINTS_URL) {
      throw new Error("POINTS_URL environment variable is not set");
    }
    return `${process.env.POINTS_URL}${coordinates.toString()}`;
  }
  /**
   * @param {any} data The JSON response from the API
   * @returns {string} The URL to fetch the observation stations data
   */
  parsePointsData(data: any): string {
    const observationStationsUrl = data.properties?.observationStations;
    if (!observationStationsUrl) {
      throw new Error("No observation stations found in the response");
    }
    return observationStationsUrl;
  }
}
