import Plotly from "plotly.js-dist-min";
import { useState, useEffect } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import { getQuery } from "../../../utils/RestUtils";
import { baseLayout, baseProps } from "./BaseLayout";

const Plot = createPlotlyComponent(Plotly);

type RatingsResponse = {
  rating: number[];
  ratings_count: number[];
};

export default function MyRadarChart() {
  const [plotData, setPlotData] = useState<Plotly.Data[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getQuery<RatingsResponse>(`api/plays/stats/for/rating/alternative/?return_type=list`)
      .then((res) => {
        if (!res) return;

        const plot: Plotly.Data = {
          type: "scatterpolar",
          r: res.ratings_count,
          theta: res.rating.map(r => `${r}⭐`),
          fill: "toself",
        };

        setPlotData([plot]);
      })
      .finally(() => setLoading(false));
  }, []);


  const layout: Partial<Plotly.Layout> = {
    ...baseLayout,
    title: { text: "How good we are?" },
    polar: {
      radialaxis: { visible: true },
    },
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Plot data={plotData} layout={{ ...layout, autosize: true }} {...baseProps} />
  );
}
