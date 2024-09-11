import { PointsRequestRunner } from "../../src/pointsRequestRunner";
import Coordinates from "../../src/coordinates";

// Mock the global fetch function
global.fetch = jest.fn();

describe("PointsRequestRunner", () => {
  let runner: PointsRequestRunner;
  const mockCoordinates = new Coordinates(40, -75);

  beforeEach(() => {
    process.env.POINTS_URL = "https://api.weather.gov/points/";
    runner = new PointsRequestRunner(mockCoordinates);
    jest.resetAllMocks();
  });

  afterEach(() => {
    delete process.env.POINTS_URL;
  });

  describe("constructor", () => {
    it("should create a PointsRequestRunner instance with the correct URL", () => {
      expect(runner["url"]).toBe("https://api.weather.gov/points/40,-75");
    });

    it("should throw an error if POINTS_URL environment variable is not set", () => {
      delete process.env.POINTS_URL;
      expect(() => new PointsRequestRunner(mockCoordinates)).toThrow(
        "POINTS_URL environment variable is not set"
      );
    });
  });

  describe("run", () => {
    it("should throw an error if the fetch fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(runner.run()).rejects.toThrow("Network error");
    });

    it("should throw an error if no observation stations are found", async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue({
          properties: {},
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(runner.run()).rejects.toThrow(
        "No observation stations found in the response"
      );
    });
  });

  describe("constructPointsUrl", () => {
    it("should correctly construct the points URL", () => {
      const result = runner["constructPointsUrl"](mockCoordinates);
      expect(result).toBe("https://api.weather.gov/points/40,-75");
    });

    it("should throw an error if POINTS_URL environment variable is not set", () => {
      delete process.env.POINTS_URL;
      expect(() => runner["constructPointsUrl"](mockCoordinates)).toThrow(
        "POINTS_URL environment variable is not set"
      );
    });
  });

  describe("parsePointsData", () => {
    it("should correctly parse points data and return the observation stations URL", () => {
      const mockData = {
        properties: {
          observationStations:
            "https://api.weather.gov/gridpoints/PHI/75,90/stations",
        },
      };

      const result = runner["parsePointsData"](mockData);
      expect(result).toBe(
        "https://api.weather.gov/gridpoints/PHI/75,90/stations"
      );
    });

    it("should throw an error if no observation stations are found", () => {
      const mockData = {
        properties: {},
      };

      expect(() => runner["parsePointsData"](mockData)).toThrow(
        "No observation stations found in the response"
      );
    });
  });
});
