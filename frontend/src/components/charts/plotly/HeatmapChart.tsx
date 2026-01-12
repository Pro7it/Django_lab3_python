import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { baseLayout, baseProps } from "./BaseLayout";
import { useState, useEffect } from "react";
import { getQuery } from "../../../utils/RestUtils";

const Plot = createPlotlyComponent(Plotly);

const ageBuckets = [
  { label: "20–30", min: 20, max: 30 },
  { label: "30–40", min: 30, max: 40 },
  { label: "40-50", min: 40, max: 50 },
  { label: "50-60", min: 50, max: 60 },
  { label: "60-70", min: 60, max: 70 },
  { label: "70+", min: 70, max: Infinity },
];

function getAgeBucket(age: number): string | null {
  const bucket = ageBuckets.find(b => age >= b.min && age < b.max);
  return bucket ? bucket.label : null;
}

type BackendItem = {
  genre_name: string;
  avg_actors_age: number;
};

function transformToHeatmap(data: BackendItem[]) {
  const genres = Array.from(new Set(data.map(d => d.genre_name)));
  const buckets = ageBuckets.map(b => b.label);

  const z = buckets.map(() => genres.map(() => 0));

  data.forEach(item => {
    const genreIndex = genres.indexOf(item.genre_name);
    const bucketLabel = getAgeBucket(item.avg_actors_age);

    if (genreIndex === -1 || !bucketLabel) return;

    const bucketIndex = buckets.indexOf(bucketLabel);
    z[bucketIndex][genreIndex] += 1;
  });

  return {
    x: genres,
    y: buckets,
    z,
  };
}


export function MyHeatmapChart() {
  const [data, setData] = useState<Plotly.Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuery<BackendItem[]>("/api/plays/stats/for/avg_actors_age")
      .then(res => {
        const heatmap = transformToHeatmap(res ?? []);

        setData([
          {
            type: "heatmap",
            x: heatmap.x,
            y: heatmap.y,
            z: heatmap.z,
            colorscale: "Viridis",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;

  const layout: Partial<Plotly.Layout> = {
    ...baseLayout,
    title: { text: "Let's stereotype" },
  };

  return <Plot data={data} layout={layout} {...baseProps} />;
}
