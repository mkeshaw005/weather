import { GridPointService } from "../../src/gridPointService";
import Coordinates from "../../src/coordinates";
import { StationData } from "../../src/observationStation";

describe("GridPointService", () => {
  let stationData: StationData[];

  beforeEach(() => {
    // Set up some sample station data
    stationData = [
      { id: "STATION1", coordinates: new Coordinates(40, -75) },
      { id: "STATION2", coordinates: new Coordinates(41, -74) },
      { id: "STATION3", coordinates: new Coordinates(39, -76) },
    ];
  });

  describe("constructor", () => {
    it("should create a GridPointService instance with station data", () => {
      const service = new GridPointService(stationData);
      expect(service.stationData).toEqual(stationData);
    });
  });

  describe("getClosestStation", () => {
    it("should return the closest station to the given coordinates", () => {
      const service = new GridPointService(stationData);
      const target = new Coordinates(40.5, -74.5);
      const closestStation = service.getClosestStation(target);
      expect(closestStation).toEqual(stationData[1]); // STATION2 should be closest
    });

    it("should handle the case when the target is exactly at a station", () => {
      const service = new GridPointService(stationData);
      const target = new Coordinates(40, -75);
      const closestStation = service.getClosestStation(target);
      expect(closestStation).toEqual(stationData[0]); // STATION1 should be closest (exact match)
    });
  });

  describe("findClosestStation", () => {
    it("should return the closest station from the given array", () => {
      const service = new GridPointService([]);
      const target = new Coordinates(40.5, -74.5);
      const closestStation = service.findClosestStation(stationData, target);
      expect(closestStation).toEqual(stationData[1]); // STATION2 should be closest
    });

    it("should throw an error if the station data array is empty", () => {
      const service = new GridPointService([]);
      const target = new Coordinates(40, -75);
      expect(() => service.findClosestStation([], target)).toThrow(
        "No closest station found"
      );
    });

    it("should handle multiple stations at the same distance", () => {
      const equalDistanceStations = [
        { id: "STATION1", coordinates: new Coordinates(40, -75) },
        { id: "STATION2", coordinates: new Coordinates(40, -75) }, // Same coordinates as STATION1
      ];
      const service = new GridPointService([]);
      const target = new Coordinates(41, -74);
      const closestStation = service.findClosestStation(
        equalDistanceStations,
        target
      );
      expect(closestStation).toEqual(equalDistanceStations[0]); // Should return the first one in the array
    });
  });
});
