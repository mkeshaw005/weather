import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { WeatherApp } from "./weatherApp";
import { CliInterface } from "./cliInterface";

dotenvExpand.expand(dotenv.config());

export async function main() {
  try {
    const cliInterface = new CliInterface();
    const address = await cliInterface.getAddressFromUser();
    let weatherApp: WeatherApp = new WeatherApp(address);
    let historicTempOutput = await weatherApp.run();

    console.log(historicTempOutput);
  } catch (error: any) {
    console.log(`An error occurred: ${error.message}`);
  }
}

if (require.main === module) {
  main();
}
