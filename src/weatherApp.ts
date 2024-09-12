import { Address } from "./cliInterface";
import Coordinates from "./coordinates";
import { DailyHistoricObservationsService } from "./dailyHistoricObservationsService";
import { GeocoderRequestRunner } from "./geocoderRequestRunner";
import { GridPointService } from "./gridPointService";
import { GridPointsRunner } from "./gridPointsRequestRunner";
import { StationData } from "./observationStation";
import { ObservationStationRequestRunner } from "./observationStationRequestRunner";
import { PointsRequestRunner } from "./pointsRequestRunner";

export class WeatherApp {
  queryTargetAddress: Address;
  queryTargetCoords: Coordinates | null;
  historicTempOutput: string;
  constructor(address: Address) {
    this.queryTargetAddress = address;
    this.queryTargetCoords = null;
    this.historicTempOutput = "";
  }

  async run(): Promise<string> {
    let geocoderRequestRunner = new GeocoderRequestRunner(
      this.queryTargetAddress
    );

    this.queryTargetCoords = await geocoderRequestRunner.run();
    if (this.queryTargetCoords == null) {
      return "Invalid address";
    }
    let pointsRequestRunner = new PointsRequestRunner(this.queryTargetCoords);
    let observationStationsUrl: string = await pointsRequestRunner.run();
    let gridPointsRunner = new GridPointsRunner(observationStationsUrl);
    let stationData: StationData[] = await gridPointsRunner.run();
    let gridPoints = new GridPointService(stationData);
    let closestStation: StationData = gridPoints.getClosestStation(
      this.queryTargetCoords
    );
    let observationStationRequestRunner: ObservationStationRequestRunner =
      new ObservationStationRequestRunner(closestStation.id);
    let dailyValues = await observationStationRequestRunner.run();
    let historicTemperatureValues = new DailyHistoricObservationsService(
      dailyValues
    );
    this.historicTempOutput = this.generateHistoricTemperatureOutput(
      historicTemperatureValues
    );
    return this.historicTempOutput;
  }

  generateHistoricTemperatureOutput(
    historicTemperatureValues: DailyHistoricObservationsService
  ): string {
    let historicTemperatureOutputStr = "Date\t\tMax Temp\t\tMin Temp\t\n";
    historicTemperatureOutputStr +=
      "----------------------------------------------------------------------\n";
    for (const [key, value] of Object.entries(
      historicTemperatureValues.historicTemperatureExtremes
    )) {
      const maxTS = new Date(value.max?.timestamp || "");
      const minTS = new Date(value.min?.timestamp || "");
      historicTemperatureOutputStr += `${key}\t${value.max?.temperature} \t${maxTS.toLocaleTimeString()}\t${value.min?.temperature}\t ${minTS.toLocaleTimeString()}\n`;
    }
    return historicTemperatureOutputStr;
  }
}
