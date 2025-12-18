import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getQuery } from "../../../utils/RestUtils";

type DataItem = {
  date: string;
  [theaterName: string]: number | string;
};

type Metric = "income" | "tickets_sold";

type RawItem = {
  name: string;
  date: string;
  income: number;
  tickets_sold: number;
};


const colors = ["#8884d8", "#82ca9d", "#ffc658"];

export default function MyAreaChart() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [theaterNames, setTheaterNames] = useState<string[]>([]);
  const [metric, setMetric] = useState<Metric>("income");
  const [rawData, setRawData] = useState<RawItem[]>([]);


  useEffect(() => {
    getQuery<RawItem[]>(`api/theaters/stats/daily/`)
      .then((data = []) => {
        data = data ?? []
        setRawData(data);
        setTheaterNames(Array.from(new Set(data.map(d => d.name))));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!rawData.length) return;

    const dates = Array.from(
      new Set(rawData.map(d => d.date))
    ).sort();

    const chartData: DataItem[] = dates.map(date => {
      const obj: DataItem = { date };

      theaterNames.forEach(name => {
        const found = rawData.find(
          d => d.name === name && d.date === date
        );
        obj[name] = found ? found[metric] : 0;
      });

      return obj;
    });

    setData(chartData);
  }, [rawData, metric, theaterNames]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <label>
          Показувати:&nbsp;
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as Metric)}
          >
            <option value="income">Прибуток</option>
            <option value="tickets_sold">Кількість квитків</option>
          </select>
        </label>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          {theaterNames.map((name, idx) => (
            <Area
              key={name}
              type="monotone"
              dataKey={name}
              // stackId="1"
              stroke={colors[idx % colors.length]}
              fill={colors[idx % colors.length]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
