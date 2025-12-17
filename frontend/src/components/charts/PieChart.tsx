import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const sampleData = [
  { name: "Tun tun zahur", count: 150 },
  { name: "Tun tun andre", count: 148 },
  { name: "Tun tun olena", count: 152 },
  { name: "Tun tun vlad", count: 100 },
  { name: "Tun tun natali", count: 99 },
  { name: "Tun tun anton", count: 42 },
  { name: "Tun tun miha", count: 1 },
];

export default function MyPieChart() {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={sampleData}
          dataKey="count"
          nameKey="name"
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
