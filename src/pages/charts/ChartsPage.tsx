import { useEffect, useState } from "react";
import { mocksApi } from "../../api/mock.ts";
import type {
  TopCoffeeBrandItem,
  PopularSnackBrandItem,
  WeeklyMoodItem,
  WeeklyWorkoutItem,
  CoffeeTeam,
  SnackImpactDepartment,
} from "../../types/mock.ts";
import BarDonutChart from "./components/BarDonutChart.tsx";
import StackedChart from "./components/StackedChart.tsx";
import { MultiLineChart } from "./components/MultiLineChart";
import Header from "../../components/Header.tsx";

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
        mocksApi.getTopCoffeeBrands(),
        mocksApi.getPopularSnackBrands(),
        mocksApi.getWeeklyMoodTrend(),
        mocksApi.getWeeklyWorkoutTrend(),
        mocksApi.getCoffeeConsumption(),
        mocksApi.getSnackImpact(),
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

  return (
    <div className="h-full w-full space-y-12">
      <Header title="데이터 시각화" />
      <BarDonutChart title="커피 브랜드 인기도" data={topCoffeeBrands} dataKey="popularity" nameKey="brand" />
      <BarDonutChart title="인기 스낵 브랜드" data={popularSnackBrands} dataKey="share" nameKey="name" />
      <StackedChart title="주간 기분 트렌드 (%)" data={weeklyMoodTrend} dataKeys={["happy", "tired", "stressed"]} />
      <StackedChart
        title="주간 운동 트렌드 (%)"
        data={weeklyWorkoutTrend}
        dataKeys={["running", "cycling", "stretching"]}
      />
      <MultiLineChart
        title="커피 소비와 생산성"
        data={coffeeConsumption}
        xAxisKey="cups"
        xAxisLabel="커피 잔수"
        leftYAxisLabel="버그 수"
        rightYAxisLabel="생산성"
        leftMetric="bugs"
        rightMetric="productivity"
        type="coffee"
      />
      <MultiLineChart
        title="스낵 섭취 영향"
        data={snackImpact}
        xAxisKey="snacks"
        xAxisLabel="스낵 수"
        leftYAxisLabel="회의 불참"
        rightYAxisLabel="사기"
        leftMetric="meetingsMissed"
        rightMetric="morale"
        type="snack"
      />
    </div>
  );
}

export default ChartsPage;
