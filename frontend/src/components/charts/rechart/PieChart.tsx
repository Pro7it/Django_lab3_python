import { useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getQuery } from "../../../utils/RestUtils";
import randomColor from "randomcolor";

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

  const colors = randomColor({
    count: data.length,
    luminosity: "light",
    hue: "red",
  });

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={data}
          dataKey="plays_amount"
          nameKey="name"
          label={({ name, value, x, y }) => (
            <text
              x={x}
              y={y}
              fill="#000"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {`${name}: ${value}`}
            </text>
          )}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
