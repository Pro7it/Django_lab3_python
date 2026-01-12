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
  LineChart,
  Line,
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
          <XAxis
            type="number"
            dataKey="likes_amount"
            // domain={["dataMin", "dataMax"]}
          >
            <Label
              value="Кількість лайків"
              position="insideBottom"
              offset={-5}
            />
          </XAxis>
          <YAxis dataKey="rating" type="number" domain={[0, 5]}>
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
        {/* <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="likesRange" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avgRating" stroke="#8884d8" />
        </LineChart> */}
      </ResponsiveContainer>
    </div>
  );
}
