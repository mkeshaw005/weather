export class DailyHistoricObservationsService {
  days: ObservationsByDay;
  historicTemperatureExtremes: HistoricTemperatureExtremes;
  constructor(dailyValues: any) {
    this.days = this.parseDailyValues(dailyValues);
    this.historicTemperatureExtremes = this.findHistoricTemperatureExtremes();
  }

  parseDailyValues(dailyValues: any): ObservationsByDay {
    let days: { [id: string]: [Observation] | Observation[] } = {};
    dailyValues.forEach((element: any) => {
      let date = new Date(element.properties.timestamp);
      var dateKey = this.buildDateKey(date);
      const t = element.properties?.temperature?.value;
      if (t) {
        if (!days[dateKey]) {
          days[dateKey] = [];
        }

        days[dateKey].push({
          timestamp: element.properties.timestamp,
          temperature: element.properties.temperature.value,
        });
      } else {
        console.warn(
          `No temperature value found for timestamp: ${element.properties.timestamp}`
        );
      }
    });
    return days;
  }

  findHistoricTemperatureExtremes(): HistoricTemperatureExtremes {
    let historicTemperatureExtremes: HistoricTemperatureExtremes = {};
    for (const [key, value] of Object.entries(this.days)) {
      historicTemperatureExtremes[key] =
        this.findDailyTemperatureExtremes(value);
    }
    return historicTemperatureExtremes;
  }

  findDailyTemperatureExtremes(
    dailyValues: [Observation] | Observation[]
  ): DailyTemperatureExtremes {
    let minTemp: number = Infinity;
    let maxTemp: number = -Infinity;
    let tempExtremes: DailyTemperatureExtremes = { min: null, max: null };
    dailyValues.forEach((element) => {
      if (element.temperature < minTemp) {
        minTemp = element.temperature;
        tempExtremes.min = element;
      }
      if (element.temperature > maxTemp) {
        maxTemp = element.temperature;
        tempExtremes.max = element;
      }
    });
    return tempExtremes;
  }

  buildDateKey(d: Date): string {
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  }
}

export interface Observation {
  timestamp: string;
  temperature: number;
}

export interface ObservationsByDay {
  [id: string]: [Observation] | Observation[];
}

export interface DailyTemperatureExtremes {
  min: Observation | null;
  max: Observation | null;
}

export interface HistoricTemperatureExtremes {
  [id: string]: DailyTemperatureExtremes;
}
