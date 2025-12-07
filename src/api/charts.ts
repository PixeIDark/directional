import { apiClient } from "./client.ts";
import type {
  TopCoffeeBrandItem,
  PopularSnackBrandItem,
  WeeklyMoodItem,
  WeeklyWorkoutItem,
  CoffeeTeam,
  SnackImpactDepartment,
} from "../pages/charts/types/chart.ts";

interface CoffeeConsumptionResponse {
  teams: CoffeeTeam[];
}

interface SnackImpactResponse {
  departments: SnackImpactDepartment[];
}

export const chartsApi = {
  getTopCoffeeBrands: async (): Promise<TopCoffeeBrandItem[]> => {
    const { data } = await apiClient.get<TopCoffeeBrandItem[]>("/mock/top-coffee-brands");
    return data;
  },

  getPopularSnackBrands: async (): Promise<PopularSnackBrandItem[]> => {
    const { data } = await apiClient.get<PopularSnackBrandItem[]>("/mock/popular-snack-brands");
    return data;
  },

  getWeeklyMoodTrend: async (): Promise<WeeklyMoodItem[]> => {
    const { data } = await apiClient.get<WeeklyMoodItem[]>("/mock/weekly-mood-trend");
    return data;
  },

  getWeeklyWorkoutTrend: async (): Promise<WeeklyWorkoutItem[]> => {
    const { data } = await apiClient.get<WeeklyWorkoutItem[]>("/mock/weekly-workout-trend");
    return data;
  },

  getCoffeeConsumption: async (): Promise<CoffeeConsumptionResponse> => {
    const { data } = await apiClient.get<CoffeeConsumptionResponse>("/mock/coffee-consumption");
    return data;
  },

  getSnackImpact: async (): Promise<SnackImpactResponse> => {
    const { data } = await apiClient.get<SnackImpactResponse>("/mock/snack-impact");
    return data;
  },
};
