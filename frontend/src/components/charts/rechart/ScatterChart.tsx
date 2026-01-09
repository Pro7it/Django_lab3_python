import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";
import { getQuery } from "../../../utils/RestUtils";

type DataItem = {
  likes_amount: number;
  rating: number;
};

export default function MyScatterChart() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuery(`api/plays/stats/for/likes_amount`).then((data) => {
      setData((data as DataItem[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="likes_amount">
            <Label
              value="Кількість лайків"
              position="insideBottom"
              offset={-5}
            />
          </XAxis>
          <YAxis dataKey="rating">
            <Label
              value="Рейтинг"
              angle={-90}
              position="insideLeft"
              offset={10}
            />
          </YAxis>
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
