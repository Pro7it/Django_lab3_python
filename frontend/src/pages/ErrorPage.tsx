import { Button, Space, Typography } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { useState } from "react";
import error_img from "../../assets/zahar.jpg"
import { colors } from "../config";
import { HomeFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const [isOpened, setOpened] = useState<boolean>(false)
  const navigate = useNavigate()


  return <Space direction="vertical" wrap style={{ width: "100dvw", height: "100dvh", justifyContent: "center", alignContent: "center", alignItems: "center", columnGap: 0 }}>
    <FloatingButton Icon={HomeFilled} onClick={() => navigate("/")} />
    {!isOpened && <>
      <Typography.Title level={1}>It is an error page</Typography.Title>
      <Typography.Title level={1}>You'll regret coming here😈</Typography.Title>
      <Button onClick={() => setOpened(true)} variant="filled" shape="round" color="pink" size="large">open</Button>
    </>}
    {isOpened && <div style={{ width: "100dvw", height: "100dvh", position: "relative", overflow: "hidden" }}>
      <img src={error_img} style={{
        objectFit: "cover",
        width: "100%",
        height: "100%"
      }} />
      <Space style={{ width: "25%", justifyContent: "center", alignItems: "center", position: "absolute", zIndex: 1, bottom: 16, left: 0 }}>
        <Typography.Title style={{
          width: "fit-content",
          borderRadius: 32, padding: "0px 16px", backgroundColor: colors.secondary + "90",
          color: colors.accent,
          fontWeight: 900
        }} level={1}>Mu-ha-ha-ha-ha😈😈😈</Typography.Title>
      </Space>
    </div>}
  </Space>
}

export default ErrorPage;
