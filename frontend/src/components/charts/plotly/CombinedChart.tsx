import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { baseLayout, baseProps } from "./BaseLayout";
import { useState, useEffect } from "react";
import { getQuery } from "../../../utils/RestUtils";

const Plot = createPlotlyComponent(Plotly);

type DataItem = {
  name: string[];
  rating: number[];
  ticked_sold_amount: number[];
};

export function MyCombinedChart() {
  const [data, setData] = useState<Plotly.Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuery<DataItem>("/api/plays/stats/for/ticked_sold_amount/?return_type=list")
      .then(res => {
        setData([
          {
            type: "bar",
            x: res?.name,
            y: res?.ticked_sold_amount,
            name: "Відвідувачі",
          },
          {
            type: "scatter",
            mode: "lines+markers",
            x: res?.name,
            y: res?.rating,
            name: "Середній рейтинг",
            yaxis: "y2",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;

  const layout: Partial<Plotly.Layout> = {
    ...baseLayout,
    title: { text: "More visitors - better rating, isn't it?" },
    yaxis: { title: { text: "Visitors" } },
    yaxis2: {
      title: { text: "Rating" },
      overlaying: "y",
      side: "right",
      range: [0, 5],
    },
  };

  return <Plot data={data} layout={layout} {...baseProps} />;
}
