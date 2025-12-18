import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { baseLayout, baseProps } from "./BaseLayout";
import { useState, useEffect } from "react";
import { getQuery } from "../../../utils/RestUtils";

const Plot = createPlotlyComponent(Plotly);

export function MyHistogramChart() {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuery("api/genres/stats/by/name") 
      .then((res) => {
        setGenres(res as string[] ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  const data: Plotly.Data[] = [
    {
      type: "histogram",
      x: genres,
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    ...baseLayout,
    title: { text: "So, how popular genre is?" },
    xaxis: { title: { text: "Genre" } },
    yaxis: { title: { text: "Occurrences" } },
  };

  return <Plot data={data} layout={layout} {...baseProps} />;
}
