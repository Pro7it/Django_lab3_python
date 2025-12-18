import { useState, useEffect } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getQuery } from "../../../utils/RestUtils";

type DataItem = {
  name: string;
  play_amount: number;
};

export default function MyPieChart() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuery(`api/actors/stats/by/play/`).then((data = []) => {
      setData((data as DataItem[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={data}
          dataKey="plays_amount"
          nameKey="name"
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
