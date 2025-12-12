import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const rawData = [
  { name: "Оперний", date: "2023", money: 400 },
  { name: "Оперний", date: "2024", money: 420 },
  { name: "Оперний", date: "2025", money: 920 },
  { name: "Костюшки", date: "2023", money: 100 },
  { name: "Костюшки", date: "2024", money: 300 },
  { name: "Костюшки", date: "2025", money: 230 },
  { name: "Зеньковецької", date: "2023", money: 760 },
  { name: "Зеньковецької", date: "2024", money: 1090 },
  { name: "Зеньковецької", date: "2025", money: 420 },
];

const years = Array.from(new Set(rawData.map((d) => d.date))).sort();
const theaterNames = Array.from(new Set(rawData.map((d) => d.name)));

const data = years.map((year) => {
  const obj: Record<string, number | string> = { year };
  theaterNames.forEach((name) => {
    const found = rawData.find((d) => d.name === name && d.date === year);
    obj[name] = found ? found.money : 0;
  });
  return obj;
});

const colors = ["#8884d8", "#82ca9d", "#ffc658"];

export default function MyAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
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
  );
}
