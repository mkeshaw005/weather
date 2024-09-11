import {
  DailyHistoricObservationsService,
  Observation,
} from "../../src/dailyHistoricObservationsService";

describe("DailyHistoricObservationsService", () => {
  let sampleData: any[];

  beforeEach(() => {
    sampleData = [
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
      {
        properties: {
          timestamp: "2023-05-02T00:00:00Z",
          temperature: { value: 18 },
        },
      },
      {
        properties: {
          timestamp: "2023-05-02T12:00:00Z",
          temperature: { value: 22 },
        },
      },
      {
        properties: {
          timestamp: "2023-05-03T00:00:00Z",
          temperature: { value: 15 },
        },
      },
      {
        properties: {
          timestamp: "2023-05-03T12:00:00Z",
          temperature: { value: 28 },
        },
      },
    ];
  });

  describe("constructor", () => {
    it("should correctly parse daily values and find historic temperature extremes", () => {
      const service = new DailyHistoricObservationsService(sampleData);
      expect(Object.keys(service.days)).toHaveLength(3);
      expect(service.days["2023-5-1"]).toHaveLength(2);
      expect(service.days["2023-5-2"]).toHaveLength(2);
      expect(service.days["2023-5-3"]).toHaveLength(2);
      expect(
        service.historicTemperatureExtremes["2023-5-1"].min?.temperature
      ).toBe(20);
      expect(
        service.historicTemperatureExtremes["2023-5-1"].max?.temperature
      ).toBe(25);
      expect(
        service.historicTemperatureExtremes["2023-5-3"].min?.temperature
      ).toBe(15);
      expect(
        service.historicTemperatureExtremes["2023-5-3"].max?.temperature
      ).toBe(28);
    });
  });

  describe("parseDailyValues", () => {
    it("should correctly parse daily values", () => {
      const service = new DailyHistoricObservationsService([]);
      const result = service.parseDailyValues(sampleData);
      expect(Object.keys(result)).toHaveLength(3);
      expect(result["2023-5-1"]).toHaveLength(2);
      expect(result["2023-5-2"]).toHaveLength(2);
      expect(result["2023-5-3"]).toHaveLength(2);
    });

    it("should handle missing temperature values", () => {
      const dataWithMissingTemp = [
        ...sampleData,
        { properties: { timestamp: "2023-05-04T00:00:00Z" } },
      ];
      const service = new DailyHistoricObservationsService([]);
      const result = service.parseDailyValues(dataWithMissingTemp);
      expect(Object.keys(result)).toHaveLength(3);
      expect(result["2023-5-4"]).toBeUndefined();
    });
  });

  describe("findHistoricTemperatureExtremes", () => {
    it("should correctly find historic temperature extremes", () => {
      const service = new DailyHistoricObservationsService(sampleData);
      const result = service.findHistoricTemperatureExtremes();
      expect(result["2023-5-1"].min?.temperature).toBe(20);
      expect(result["2023-5-1"].max?.temperature).toBe(25);
      expect(result["2023-5-3"].min?.temperature).toBe(15);
      expect(result["2023-5-3"].max?.temperature).toBe(28);
    });
  });

  describe("findDailyTemperatureExtremes", () => {
    it("should correctly find daily temperature extremes", () => {
      const service = new DailyHistoricObservationsService([]);
      const dailyValues: Observation[] = [
        { timestamp: "2023-05-01T00:00:00Z", temperature: 20 },
        { timestamp: "2023-05-01T12:00:00Z", temperature: 25 },
        { timestamp: "2023-05-01T18:00:00Z", temperature: 22 },
      ];
      const result = service.findDailyTemperatureExtremes(dailyValues);
      expect(result.min?.temperature).toBe(20);
      expect(result.max?.temperature).toBe(25);
    });

    it("should handle a single observation", () => {
      const service = new DailyHistoricObservationsService([]);
      const dailyValues: Observation[] = [
        { timestamp: "2023-05-01T00:00:00Z", temperature: 20 },
      ];
      const result = service.findDailyTemperatureExtremes(dailyValues);
      expect(result.min?.temperature).toBe(20);
      expect(result.max?.temperature).toBe(20);
    });
  });

  describe("buildDateKey", () => {
    it("should correctly build date key", () => {
      const service = new DailyHistoricObservationsService([]);
      const date = new Date("2023-05-01T00:00:00Z");
      expect(service.buildDateKey(date)).toBe("2023-5-1");
    });

    it("should handle single-digit months and days", () => {
      const service = new DailyHistoricObservationsService([]);
      const date = new Date("2023-01-01T00:00:00Z");
      expect(service.buildDateKey(date)).toBe("2023-1-1");
    });
  });
});
