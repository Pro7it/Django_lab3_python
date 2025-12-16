import type React from "react";
import MyBarChart from "../components/charts/BarChart";
import { colors } from "../config";
import { Typography } from "antd";
import type { CSSProperties } from "react";
import MyLineChart from "../components/charts/LineChart";
import MyPieChart from "../components/charts/PieChart";
import MyAreaChart from "../components/charts/AreaChart";
import { FloatingContainer } from "../components/FloatingContainer";
import { FloatingButton } from "../components/FloatingButton";
import { LeftCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MyScatterChart from "../components/charts/ScatterChart";
import MyTreeMapChart from "../components/charts/TreeMapChart";

const RechartsPage: React.FC = () => {
  const chartWrapper: CSSProperties = {
    margin: 20,
    backgroundColor: colors.secondary,
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: 32,
    borderRadius: 32,
  };

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          paddingTop: 32,
        }}
      >
        <Typography.Title level={1}>Some cool statistic</Typography.Title>

        <div style={chartWrapper}>
          <Typography.Paragraph>Best theaters</Typography.Paragraph>
          <MyBarChart />
        </div>

        <div style={chartWrapper}>
          <Typography.Paragraph>Tikets by date</Typography.Paragraph>
          <MyLineChart />
        </div>

        <div style={chartWrapper}>
          <Typography.Paragraph>Top actors</Typography.Paragraph>
          <MyPieChart />
        </div>

        <div style={chartWrapper}>
          <Typography.Paragraph>
            Status for theaters in some time
          </Typography.Paragraph>
          <MyAreaChart />
        </div>
        <div style={chartWrapper}>
          <Typography.Paragraph>Best plays</Typography.Paragraph>
          <MyTreeMapChart />
        </div>
        <div style={chartWrapper}>
          <Typography.Paragraph>Rating vs favoriate</Typography.Paragraph>
          <MyScatterChart />
        </div>
      </div>
    </>
  );
};

export default RechartsPage;
