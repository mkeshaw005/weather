// import {
//   constructGridPointsUrl,
//   constructPointsUrl,
//   constructStationUrl,
// } from "../../src/index";

import { WeatherApp } from "../../src/weatherApp";
import { Address, CliInterface } from "../../src/cliInterface";

// Mock the dependencies
jest.mock("../../src/weatherApp");
jest.mock("../../src/cliInterface");

// Mock console.log
console.log = jest.fn();

describe("Main application", () => {
  let mockCliInterface: jest.Mocked<CliInterface>;
  let mockWeatherApp: jest.Mocked<WeatherApp>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCliInterface = new CliInterface() as jest.Mocked<CliInterface>;
    const address: Address = {
      street: "123 Test St",
      city: "Test City",
      state: "Test State",
      zipcode: "12345",
    };
    mockWeatherApp = new WeatherApp(address) as jest.Mocked<WeatherApp>;

    (CliInterface as jest.Mock).mockImplementation(() => mockCliInterface);
    (WeatherApp as jest.Mock).mockImplementation(() => mockWeatherApp);
  });

  it("should get address from user, create WeatherApp, run it, and log output", async () => {
    const address1: Address = {
      street: "123 Test St",
      city: "Test City",
      state: "Test State",
      zipcode: "12345",
    };
    const historicTempOutput = "Mock historic temperature data";

    mockCliInterface.getAddressFromUser.mockResolvedValue(address1);
    mockWeatherApp.run.mockResolvedValue(historicTempOutput);

    // Import and run the main function
    const { main } = require("../../src/index");
    await main();

    expect(CliInterface).toHaveBeenCalled();
    expect(mockCliInterface.getAddressFromUser).toHaveBeenCalledTimes(1);
    expect(WeatherApp).toHaveBeenCalledWith(address1);
    expect(mockWeatherApp.run).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(historicTempOutput);
  });

  it("should handle errors gracefully", async () => {
    const errorMessage = "Test error";
    mockCliInterface.getAddressFromUser.mockRejectedValue(
      new Error(errorMessage)
    );

    // Import and run the main function
    const { main } = require("../../src/index");
    await main();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(errorMessage)
    );
  });
});
