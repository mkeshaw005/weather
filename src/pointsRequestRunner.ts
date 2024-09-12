import Coordinates from "./coordinates";

export class PointsRequestRunner {
  private url: string;
  hasRunOnce: boolean = false;

  constructor(private coordinates: Coordinates) {
    this.url = this.constructPointsUrl(coordinates);
  }

  async run(): Promise<string | any> {
    let data: [];
    try {
      const response = await fetch(this.url, {
        headers: {
          Accept: "application/geo+json",
        },
      });
      this.hasRunOnce = true;
      if (response.ok) {
        data = await response.json();
        return this.parsePointsData(data);
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

    const response = await fetch(this.url, {
      headers: {
        Accept: "application/geo+json",
      },
    });
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
