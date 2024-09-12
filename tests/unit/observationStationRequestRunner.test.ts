import { ObservationStationRequestRunner } from "../../src/observationStationRequestRunner";
import { DailyHistoricObservationsService } from "../../src/dailyHistoricObservationsService";

// Mock the global fetch function
global.fetch = jest.fn();

describe("ObservationStationRequestRunner", () => {
  let runner: ObservationStationRequestRunner;
  const mockStationUrl = "https://api.weather.gov/stations/STATION123";

  beforeEach(() => {
    runner = new ObservationStationRequestRunner(mockStationUrl);
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    it("should create an ObservationStationRequestRunner instance with the correct URL", () => {
      expect(runner.getUrl()).toBe(
        "https://api.weather.gov/stations/STATION123/observations"
      );
    });

    it("should throw an error if the station URL is invalid", () => {
      expect(() => new ObservationStationRequestRunner("")).toThrow(
        "Station URL is required"
      );
    });
  });

  describe("parseObservationStationData", () => {
    it("should throw an error if no data is found", () => {
      const mockData = { features: [] };

      expect(() => runner.parseObservationStationData(mockData)).toThrow(
        "No data found"
      );
    });
  });

  describe("constructStationUrl", () => {
    it("should correctly construct the station URL", () => {
      const result = runner["constructStationUrl"](
        "https://api.weather.gov/stations/STATION123"
      );
      expect(result).toBe(
        "https://api.weather.gov/stations/STATION123/observations"
      );
    });
  });
});
