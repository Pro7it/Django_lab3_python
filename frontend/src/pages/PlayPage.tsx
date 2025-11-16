import { useParams } from "react-router-dom";

function PlayPage() {
  const params = useParams<{ playid: string }>();
  return <h1>Waiting {params.playid}</h1>;
}

export default PlayPage;
