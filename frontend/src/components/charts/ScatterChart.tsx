import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { likes: 15, rating: 3.5 },
  { likes: 40, rating: 4.1 },
  { likes: 80, rating: 4.3 },
  { likes: 120, rating: 4.8 },
  { likes: 300, rating: 4.9 },
];

export default function MyScatterChart() {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="likes" name="Likes" />
          <YAxis dataKey="rating" name="Rating" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
