import { useState, useEffect } from "react";
import { ResponsiveContainer, Treemap } from "recharts";
import { getQuery } from "../../../utils/RestUtils";

function CustomContent(props: any) {
  const { x, y, width, height, name, rating } = props;

  if (width < 80 || height < 40) return null;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#82ca9d" />
      <text
        x={x + width / 2}
        y={y + height / 2 - 5}
        textAnchor="middle"
        fill="#000"
        strokeOpacity={0}
        fontSize={12}
      >
        {name}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 12}
        textAnchor="middle"
        fill="#000"
        strokeOpacity={0}
        fontSize={12}
      >
        ⭐ {rating}
      </text>
    </g>
  );
}

type DataItem = {
  name: string;
  rating: number;
  size: number;
};

export default function MyTreeMapChart() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuery(`api/plays/stats/2/`).then((data) => {
      setData(
        (data ?? []).map((d: { rating: number }) => ({
          ...d,
          size: d.rating * 100,
        }))
      );
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ResponsiveContainer width="100%" height={500} aspect={4 / 3}>
      <Treemap
        width="100%"
        height="100%"
        data={data}
        dataKey="rating"
        stroke="#fff"
        fill="#82ca9d"
        content={<CustomContent />}
      />
    </ResponsiveContainer>
  );
}
