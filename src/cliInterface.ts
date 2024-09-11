var readlineSync = require("readline-sync");

export class CliInterface {
  async getAddressFromUser(): Promise<Address> {
    var street = readlineSync.question("Street address: ");
    var city = readlineSync.question("City: ");
    var state = readlineSync.question("State: ");
    var zipcode = readlineSync.question("Zipcode: ");
    return { street, city, state, zipcode };
  }
}
export interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
}
