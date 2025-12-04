import { Button } from "antd"
import type { Play } from "../utils/ApiDtos"

const PlayLink: React.FC<{
  play: Play
}> = ({ play }) => {


  return (<Button href={"/plays/" + play.play_id.toString()} variant="filled" shape="round" color="pink" size="middle">
    {play.name}
  </Button>)
}

export default PlayLink