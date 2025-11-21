import { Button, Space, Typography } from "antd";
import type React from "react";

const HomePage: React.FC = () => {


  return <Space direction="vertical" style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }}>
    <Typography.Title level={1}>
      Hello here 🥦
    </Typography.Title>
    <Button href="plays/" variant="filled" shape="round" color="pink" size="large" >
      plays
    </Button>
    <Button href="/login/" variant="filled" shape="round" color="pink" size="large" >
      login
    </Button>
  </Space>
}

export default HomePage 