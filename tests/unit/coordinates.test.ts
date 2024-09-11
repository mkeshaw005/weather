import Coordinates from "../../src/coordinates";

describe("Coordinates", () => {
  describe("constructor", () => {
    it("should create a Coordinates object with valid latitude and longitude", () => {
      const coords = new Coordinates(45, 90);
      expect(coords.getLat()).toBe(45);
      expect(coords.getLon()).toBe(90);
    });

    it("should throw an error for invalid latitude", () => {
      expect(() => new Coordinates(-91, 0)).toThrow("Invalid latitude value");
      expect(() => new Coordinates(91, 0)).toThrow("Invalid latitude value");
    });

    it("should throw an error for invalid longitude", () => {
      expect(() => new Coordinates(0, -181)).toThrow("Invalid longitude value");
      expect(() => new Coordinates(0, 181)).toThrow("Invalid longitude value");
    });

    it("should accept edge cases for latitude", () => {
      expect(() => new Coordinates(-90, 0)).not.toThrow();
      expect(() => new Coordinates(90, 0)).not.toThrow();
    });

    it("should accept edge cases for longitude", () => {
      expect(() => new Coordinates(0, -180)).not.toThrow();
      expect(() => new Coordinates(0, 180)).not.toThrow();
    });
  });

  describe("getLat", () => {
    it("should return the correct latitude", () => {
      const coords = new Coordinates(45, 90);
      expect(coords.getLat()).toBe(45);
    });
  });

  describe("getLon", () => {
    it("should return the correct longitude", () => {
      const coords = new Coordinates(45, 90);
      expect(coords.getLon()).toBe(90);
    });
  });

  describe("toString", () => {
    it("should return a string representation of the coordinates", () => {
      const coords = new Coordinates(45, 90);
      expect(coords.toString()).toBe("45,90");
    });

    it("should handle negative values correctly", () => {
      const coords = new Coordinates(-45, -90);
      expect(coords.toString()).toBe("-45,-90");
    });
  });

  describe("calculateDistance", () => {
    it("should calculate the correct distance between two points", () => {
      const coord1 = new Coordinates(0, 0);
      const coord2 = new Coordinates(0, 90);
      const expectedDistance = 10007.543398010286; // approximate distance in km
      expect(coord1.calculateDistance(coord2)).toBeCloseTo(expectedDistance, 2);
    });

    it("should return 0 for the same point", () => {
      const coord = new Coordinates(45, 90);
      expect(coord.calculateDistance(coord)).toBe(0);
    });

    xit("should calculate the correct distance for points in different hemispheres", () => {
      const coord1 = new Coordinates(45, 45);
      const coord2 = new Coordinates(-45, -45);
      const expectedDistance = 13273.79; // approximate distance in km
      expect(coord1.calculateDistance(coord2)).toBeCloseTo(expectedDistance, 2);
    });
  });
});
