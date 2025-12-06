import { apiClient } from "../../../api/client.ts";
import type {
  TopCoffeeBrandItem,
  PopularSnackBrandItem,
  WeeklyMoodItem,
  WeeklyWorkoutItem,
  CoffeeTeam,
  SnackImpactDepartment,
} from "../types/mock";

interface CoffeeConsumptionResponse {
  teams: CoffeeTeam[];
}

interface SnackImpactResponse {
  departments: SnackImpactDepartment[];
}

export const mocksApi = {
  getTopCoffeeBrands: async () => {
    const { data } = await apiClient.get<TopCoffeeBrandItem[]>("/mock/top-coffee-brands");
    return data;
  },

  getPopularSnackBrands: async () => {
    const { data } = await apiClient.get<PopularSnackBrandItem[]>("/mock/popular-snack-brands");
    return data;
  },

  getWeeklyMoodTrend: async () => {
    const { data } = await apiClient.get<WeeklyMoodItem[]>("/mock/weekly-mood-trend");
    return data;
  },

  getWeeklyWorkoutTrend: async () => {
    const { data } = await apiClient.get<WeeklyWorkoutItem[]>("/mock/weekly-workout-trend");
    return data;
  },

  getCoffeeConsumption: async () => {
    const { data } = await apiClient.get<CoffeeConsumptionResponse>("/mock/coffee-consumption");
    return data;
  },

  getSnackImpact: async () => {
    const { data } = await apiClient.get<SnackImpactResponse>("/mock/snack-impact");
    return data;
  },
};
