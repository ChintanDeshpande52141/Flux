export type SpendingPulseEntry = {
  label: string;
  value: number;
};

export type SpendingPulseData = {
  entries: SpendingPulseEntry[];
  total: number;
};
