export interface TopCoffeeBrandItem {
  brand: string;
  popularity: number;
}

export interface PopularSnackBrandItem {
  name: string;
  share: number;
}

export interface WeeklyMoodItem {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export interface WeeklyWorkoutItem {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
}

export interface CoffeeDataPoint {
  cups: number;
  bugs: number;
  productivity: number;
}

export interface CoffeeTeam {
  team: string;
  series: CoffeeDataPoint[];
}

export interface SnackImpactDataPoint {
  snacks: number;
  meetingsMissed: number;
  morale: number;
}

export interface SnackImpactDepartment {
  name: string;
  metrics: SnackImpactDataPoint[];
}
