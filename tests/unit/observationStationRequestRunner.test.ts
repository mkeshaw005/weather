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

  describe("run", () => {
    it("should fetch data and return a DailyHistoricObservationsService instance", async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue({
          features: [
            {
              properties: {
                timestamp: "2023-05-01T00:00:00Z",
                temperature: { value: 20 },
              },
            },
            {
              properties: {
                timestamp: "2023-05-01T12:00:00Z",
                temperature: { value: 25 },
              },
            },
          ],
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await runner.run();

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.weather.gov/stations/STATION123/observations",
        {
          headers: {
            Accept: "application/geo+json",
          },
        }
      );
      expect(result).toBeInstanceOf(Array);
    });

    it("should throw an error if the fetch fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(runner.run()).rejects.toThrow("Network error");
    });

    it("should throw an error if no data is found", async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue({ features: [] }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(runner.run()).rejects.toThrow("No data found");
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
