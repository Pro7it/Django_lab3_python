import type React from "react";
import { useEffect, useState } from "react";
import type { Play } from "../utils/DtoUtils";
import { getQuery } from "../utils/RestUtils";
import { Flex, Skeleton, Space, Typography } from "antd";
import JsonContainer from "./components/JsonContainer";


const PlaysPage: React.FC = () => {
  const [data, setData] = useState<Play[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getQuery("api/plays/").then(e => {
      if (e) {
        setData(e as Play[])
        setLoading(false)
      }
    })
  }, [])

  return <div style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }}>
    <Typography.Title level={2}>
      All plays ever
    </Typography.Title>
    <Flex>
    </Flex>
    {data.length > 0 || loading ? <JsonContainer>
      <Space direction="vertical" style={{ minWidth: '700px', width: '100%' }} size={16}>
        <Skeleton style={{
          marginTop: 32,
          marginLeft: 32
        }} title={false} loading={loading} active paragraph={{
          rows: 8,
          width: [90, 80, 100, 180, 130, 240, 160, 90]
        }} />
        {data.map(play => (<pre style={{
          display: "inline-block",
          maxWidth: "100%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }} key={play.play_id}>{JSON.stringify(play, null, 3)}</pre>))}
      </Space>
    </JsonContainer> : null
    }

  </div>
}


export default PlaysPage