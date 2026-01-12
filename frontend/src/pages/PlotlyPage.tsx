import { useNavigate } from "react-router-dom";
import { FloatingContainer } from "../components/FloatingContainer";
import { FloatingButton } from "../components/FloatingButton";
import { LeftCircleFilled } from "@ant-design/icons";
import { ChartDiv } from "../components/ChartDiv";
import MyRadarChart from "../components/charts/plotly/RadarChart";
import { MyScatterChart } from "../components/charts/plotly/ScatterChart";
import { MyBoxChart } from "../components/charts/plotly/BoxChart";
import { MyHistogramChart } from "../components/charts/plotly/HistogramChart";
import { MyCombinedChart } from "../components/charts/plotly/CombinedChart";
import { MyHeatmapChart } from "../components/charts/plotly/HeatmapChart";
import { Typography } from "antd";

const PlotlyPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <FloatingContainer>
        <FloatingButton
          Icon={LeftCircleFilled}
          onClick={() => navigate(-1)}
          inContainer
        />
      </FloatingContainer>
      <ChartDiv template="screen">
        <Typography.Title level={1}>Some cool statistic🥦</Typography.Title>
        <ChartDiv template="chart">
          <MyRadarChart />
        </ChartDiv>
        <ChartDiv template="chart">
          <MyScatterChart />
        </ChartDiv>
        <ChartDiv template="chart">
          <MyHistogramChart />
        </ChartDiv>
        <ChartDiv template="chart">
          <MyBoxChart />
        </ChartDiv>
        <ChartDiv template="chart">
          <MyCombinedChart />
        </ChartDiv>
        <ChartDiv template="chart">
          <MyHeatmapChart />
        </ChartDiv>
      </ChartDiv>
    </>
  );
};

export default PlotlyPage;
