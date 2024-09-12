import { GridPointsRunner } from "../../src/gridPointsRequestRunner";
import Coordinates from "../../src/coordinates";
// import { StationData } from './observationStation';

// Mock the global fetch function
global.fetch = jest.fn();

describe("GridPointsRunner", () => {
  let runner: GridPointsRunner;
  const mockUrl = "https://api.example.com/gridpoints";

  beforeEach(() => {
    runner = new GridPointsRunner(mockUrl);
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    it("should create a GridPointsRunner instance with the provided URL", () => {
      expect(runner["url"]).toBe(mockUrl);
    });
  });

  describe("parseStationsData", () => {
    it("should correctly parse station data", () => {
      const mockData = {
        features: [
          {
            id: "STATION1",
            geometry: { coordinates: [-75, 40] },
          },
          {
            id: "STATION2",
            geometry: { coordinates: [-74, 41] },
          },
        ],
      };

      const result = runner.parseStationsData(mockData);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("STATION1");
      expect(result[0].coordinates).toEqual(new Coordinates(40, -75));
      expect(result[1].id).toBe("STATION2");
      expect(result[1].coordinates).toEqual(new Coordinates(41, -74));
    });

    it("should throw an error if no observation stations are found", () => {
      const mockData = { features: [] };

      expect(() => runner.parseStationsData(mockData)).toThrow(
        "No observation stations found in the response"
      );
    });
  });
});
