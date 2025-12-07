import { useEffect, useState } from "react";
import { chartsApi } from "../../api/charts.ts";
import type {
  TopCoffeeBrandItem,
  PopularSnackBrandItem,
  WeeklyMoodItem,
  WeeklyWorkoutItem,
  CoffeeTeam,
  SnackImpactDepartment,
} from "./types/chart.ts";
import BarDonutChart from "./components/BarDonutChart.tsx";
import StackedChart from "./components/StackedChart.tsx";
import MultiLineChart from "./components/MultiLineChart/MultiLineChart.tsx";
import Header from "../../components/Header.tsx";
import { transformToBarDonutData } from "./utils/transformToBarDonutData.ts";
import { transformToStackedData } from "./utils/transformToStackedData.ts";
import { transformToMultiLineData } from "./utils/transformToMultiLineData.ts";

function ChartsPage() {
  const [topCoffeeBrands, setTopCoffeeBrands] = useState<TopCoffeeBrandItem[]>([]);
  const [popularSnackBrands, setPopularSnackBrands] = useState<PopularSnackBrandItem[]>([]);
  const [weeklyMoodTrend, setWeeklyMoodTrend] = useState<WeeklyMoodItem[]>([]);
  const [weeklyWorkoutTrend, setWeeklyWorkoutTrend] = useState<WeeklyWorkoutItem[]>([]);
  const [coffeeConsumption, setCoffeeConsumption] = useState<CoffeeTeam[]>([]);
  const [snackImpact, setSnackImpact] = useState<SnackImpactDepartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [coffee, snack, mood, workout, coffeeData, snackData] = await Promise.all([
        chartsApi.getTopCoffeeBrands(),
        chartsApi.getPopularSnackBrands(),
        chartsApi.getWeeklyMoodTrend(),
        chartsApi.getWeeklyWorkoutTrend(),
        chartsApi.getCoffeeConsumption(),
        chartsApi.getSnackImpact(),
      ]);

      setTopCoffeeBrands(coffee);
      setPopularSnackBrands(snack);
      setWeeklyMoodTrend(mood);
      setWeeklyWorkoutTrend(workout);
      setCoffeeConsumption(coffeeData.teams);
      setSnackImpact(snackData.departments);
    };

    fetchData();
  }, []);

  const coffeeChartData = transformToBarDonutData(topCoffeeBrands, "brand", "popularity");
  const snackChartData = transformToBarDonutData(popularSnackBrands, "name", "share");
  const moodChartData = transformToStackedData(weeklyMoodTrend, "week", ["happy", "tired", "stressed"]);
  const workoutChartData = transformToStackedData(weeklyWorkoutTrend, "week", ["running", "cycling", "stretching"]);
  const coffeeMultiLine = transformToMultiLineData({
    data: coffeeConsumption,
    nameKey: "team",
    seriesKey: "series",
    xAxisKey: "cups",
    leftMetric: "bugs",
    rightMetric: "productivity",
  });
  const snackMultiLine = transformToMultiLineData({
    data: snackImpact,
    nameKey: "name",
    seriesKey: "metrics",
    xAxisKey: "snacks",
    leftMetric: "meetingsMissed",
    rightMetric: "morale",
  });

  return (
    <div className="h-full w-full space-y-12">
      <Header title="데이터 시각화" />
      <BarDonutChart title="커피 브랜드 인기도" data={coffeeChartData} />
      <BarDonutChart title="인기 스낵 브랜드" data={snackChartData} />
      <StackedChart
        title="주간 기분 트렌드 (%)"
        data={moodChartData}
        categoryKey="category"
        stackKeys={["happy", "tired", "stressed"]}
      />
      <StackedChart
        title="주간 운동 트렌드 (%)"
        data={workoutChartData}
        categoryKey="category"
        stackKeys={["running", "cycling", "stretching"]}
      />
      <MultiLineChart
        title="커피 소비와 생산성"
        data={coffeeMultiLine.data}
        series={coffeeMultiLine.series}
        xAxisKey="cups"
        xAxisLabel="커피 잔수"
        leftYAxisLabel="버그 수"
        rightYAxisLabel="생산성"
      />
      <MultiLineChart
        title="스낵 섭취 영향"
        data={snackMultiLine.data}
        series={snackMultiLine.series}
        xAxisKey="snacks"
        xAxisLabel="스낵 수"
        leftYAxisLabel="회의 불참"
        rightYAxisLabel="사기"
      />
    </div>
  );
}

export default ChartsPage;
