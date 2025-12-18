import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { baseLayout, baseProps } from "./BaseLayout";
import { useState, useEffect } from "react";
import { getQuery } from "../../../utils/RestUtils";

const Plot = createPlotlyComponent(Plotly);

export function MyBoxChart() {
  const [prices, setPrices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuery("api/tickets/stats/prices") 
      .then((res) => {
        setPrices(res as number[] ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  
  const data: Plotly.Data[] = [
    {
      type: "box",
      y: prices,
      boxpoints: "all",
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    ...baseLayout,
    title: { text: "Our tickets random" },
    yaxis: {
      title: { text: "Price" },
    },
  };

  return <Plot data={data} layout={layout} {...baseProps} />;
}
