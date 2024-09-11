import { Address } from "./cliInterface";
import Coordinates from "./coordinates";

export class GeocoderRequestRunner {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }

  constructUrl() {
    return encodeURI(
      `https://geocoding.geo.census.gov/geocoder/locations/address?street=${this.address.street}&city=${this.address.city}&state=${this.address.state}&zip=${this.address.zipcode}&benchmark=4&format=json`
    );
  }
  async run(): Promise<Coordinates> {
    const url = this.constructUrl();
    const response = await fetch(url);
    const data = await response.json();
    return this.parseCoordinates(data);
  }

  parseCoordinates(data: any): Coordinates {
    if (data.result.addressMatches.length === 0) {
      throw new Error("No matching address found");
    }
    const coordinates = data.result.addressMatches[0].coordinates;
    return new Coordinates(coordinates.y, coordinates.x);
  }
}
