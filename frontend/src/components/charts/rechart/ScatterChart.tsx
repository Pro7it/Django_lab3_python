import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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
        getQuery(`api/plays/stats/`).then((data) => {
          setData((data as DataItem[]) ?? []);
          setLoading(false);
        });
      }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="likes_amount" name="Likes" />
          <YAxis dataKey="rating" name="Rating" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
