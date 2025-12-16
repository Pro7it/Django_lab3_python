import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { date: "2025-01", count: 16 },
  { date: "2025-02", count: 55 },
  { date: "2025-03", count: 21 },
  { date: "2025-04", count: 10 },
  { date: "2025-05", count: 1 },
  { date: "2025-06", count: 42 },
];

export default function MyLineChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={sampleData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
