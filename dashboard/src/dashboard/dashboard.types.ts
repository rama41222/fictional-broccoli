enum SearchType {
    SpeficTime = "specificTime",
    TimeRange = "timeRange",
}

enum Frequency {
    Hourly = "hourly",
    Daily = "daily",
}

interface ApiRequestData {
  id: string;
  from?: Date;
  to?: Date;
  at?: Date;
  frequency: Frequency;
}

export {
    SearchType,
    Frequency
};

export type { ApiRequestData };
