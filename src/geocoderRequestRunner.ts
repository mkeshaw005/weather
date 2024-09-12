import { Address } from "./cliInterface";
import Coordinates from "./coordinates";

export class GeocoderRequestRunner {
  address: Address;
  hasRunOnce: boolean = false;
  constructor(address: Address) {
    this.address = address;
  }

  constructUrl() {
    return encodeURI(
      `https://geocoding.geo.census.gov/geocoder/locations/address?street=${this.address.street}&city=${this.address.city}&state=${this.address.state}&zip=${this.address.zipcode}&benchmark=4&format=json`
    );
  }
  async run(): Promise<Coordinates | any> {
    const url = this.constructUrl();
    let data: Coordinates;
    try {
      const response = await fetch(url);
      this.hasRunOnce = true;
      if (response.ok) {
        data = await response.json();
        return this.parseCoordinates(data);
      } else {
        // Custom message for failed HTTP codes
        if (response.status === 404) throw new Error("404, Not found");
        if (response.status === 500) {
          // internal server error - retry once after 5 seconds and then fail.  TODO: standardize retry logic
          if (!this.hasRunOnce) {
            setTimeout(() => {
              this.run();
            }, 5000);
          }
        }
        throw new Error("500, internal server error");
        // For any other server error
        throw new Error(response.status + "");
      }
    } catch (error) {
      console.error("Fetch", error);
    }
  }

  parseCoordinates(data: any): Coordinates {
    if (data.result.addressMatches.length === 0) {
      throw new Error("No matching address found");
    }
    const coordinates = data.result.addressMatches[0].coordinates;
    return new Coordinates(coordinates.y, coordinates.x);
  }
}
