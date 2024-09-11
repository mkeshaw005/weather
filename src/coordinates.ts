export default class Coordinates {
  private lat: number;
  private lon: number;
  constructor(lat: number, lon: number) {
    if (lat < -90 || lat > 90) {
      throw new Error("Invalid latitude value");
    }
    if (lon < -180 || lon > 180) {
      throw new Error("Invalid longitude value");
    }
    this.lat = lat;
    this.lon = lon;
  }

  getLat(): number {
    return this.lat;
  }
  getLon(): number {
    return this.lon;
  }
  toString(): string {
    return `${this.lat},${this.lon}`;
  }

  calculateDistance(other: Coordinates): number {
    const lat1 = (this.lat * Math.PI) / 180;
    const lon1 = (this.lon * Math.PI) / 180;
    const lat2 = (other.getLat() * Math.PI) / 180;
    const lon2 = (other.getLon() * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }
}
