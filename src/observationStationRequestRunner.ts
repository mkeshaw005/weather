import { DailyHistoricObservationsService } from "./dailyHistoricObservationsService";

export class ObservationStationRequestRunner {
  private url: string;
  hasRunOnce: boolean = false;

  constructor(stationUrl: string) {
    if (stationUrl.trim() === "") {
      throw new Error("Station URL is required");
    }
    this.url = this.constructStationUrl(stationUrl);
  }

  async run(): Promise<[] | any> {
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
        return this.parseObservationStationData(data);
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

  public getUrl(): string {
    return this.url;
  }

  /**
   * @returns {string} The URL to fetch historical data for the specified station
   */
  private constructStationUrl(stationUrl: string): string {
    return `${stationUrl}/observations`;
  }

  parseObservationStationData(data: any): any {
    const jsonData = data.features;
    if (!jsonData || jsonData.length == 0) {
      throw new Error("No data found");
    }
    return jsonData;
  }
}
