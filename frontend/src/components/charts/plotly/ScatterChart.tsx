import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { baseLayout, baseProps } from "./BaseLayout";
import { useState, useEffect } from "react";
import { getQuery } from "../../../utils/RestUtils";

const Plot = createPlotlyComponent(Plotly);

type DataItem = {
  ticket_price: number[];
  total_sold: number[];
};

export function MyScatterChart() {
  const [data, setData] = useState<Plotly.Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuery<DataItem>("/api/tickets/stats/by/price/?return_type=list")
      .then(res => {
        setData([
          {
            x: res?.ticket_price,
            y: res?.total_sold,
            mode: "markers",
            type: "scatter",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;

  const layout: Partial<Plotly.Layout> = {
    ...baseLayout,
    title: { text: "Do we scare people with price?" },
    xaxis: { title: { text: "Price" } },
    yaxis: { title: { text: "Sold tickets" } },
  };

  return <Plot data={data} layout={layout} {...baseProps} />;
}
