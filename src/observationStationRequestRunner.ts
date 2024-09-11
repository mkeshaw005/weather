import { DailyHistoricObservationsService } from "./dailyHistoricObservationsService";

export class ObservationStationRequestRunner {
  private url: string;

  constructor(stationUrl: string) {
    if (stationUrl.trim() === "") {
      throw new Error("Station URL is required");
    }
    this.url = this.constructStationUrl(stationUrl);
  }

  async run(): Promise<[]> {
    const response = await fetch(this.url, {
      headers: {
        Accept: "application/geo+json",
      },
    });
    const data = await response.json();
    return this.parseObservationStationData(data);
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
