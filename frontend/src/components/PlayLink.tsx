import { Button } from "antd"
import type { Play } from "../utils/ApiDtos"
import React from "react";

const PlayLink = React.memo(({ play }: { play: Play }) => {
  return (
    <Button
      href={"/plays/" + play.play_id}
      variant="filled"
      shape="round"
      color="pink"
      size="middle"
    >
      {play.name}
    </Button>
  );
});

export default PlayLink