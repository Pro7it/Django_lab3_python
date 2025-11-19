import { Button, Typography } from "antd";
import type React from "react";

const HomePage: React.FC = () => {


  return <div style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }}>
    <Typography.Title level={1}>
      Hello here 🥦
    </Typography.Title>
    <Button href="plays/" variant="filled" shape="round" color="pink"  >
      plays
    </Button>
  </div>
}

export default HomePage 