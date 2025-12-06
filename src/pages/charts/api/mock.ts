import { apiClient } from "../../../api/client.ts";
import type {
  CoffeeTeam,
  PopularSnackBrandItem,
  SnackImpactDepartment,
  TopCoffeeBrandItem,
  WeeklyMoodItem,
  WeeklyWorkoutItem,
} from "../../../api/generated/fEHiringRESTAPI.schemas.ts";

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
