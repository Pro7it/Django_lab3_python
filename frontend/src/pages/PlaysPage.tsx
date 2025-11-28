import type React from "react";
import { useEffect, useState } from "react";
import type { Play } from "../utils/ApiDtos";
import { getQuery } from "../utils/RestUtils";
import { Skeleton, Space, Typography } from "antd";
import { colors } from "../config";
import { FloatingButton } from "../components/FloatingButton";
import PlayLink from "../components/PlayLink";
import {
  LeftCircleFilled,
  PlusCircleFilled,
  RetweetOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { FloatingContainer } from "../components/FloatingContainer";
import { Container } from "../components/Containers";

const PlaysPage: React.FC = () => {
  const [data, setData] = useState<Play[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    getQuery(`api/plays/?limit=20&_=${Date.now()}`).then((e: any) => {
      if (e !== null) {
        setData(e.results);
        setNextPage(e.next);
        setLoading(false);
      }
    });
  }, []);

  const loadNext = () => {
    if (!nextPage) return;

    setLoading(true);

    const url = nextPage.replace(/^https?:\/\/[^/]+/, "");

    getQuery(url).then((e: any) => {
      if (!e) return;

      setData((prev) => [...prev, ...e.results]);
      setNextPage(e.next);
      setLoading(false);
    });
  };

  return (
    <>
      <FloatingContainer>
        <FloatingButton
          Icon={LeftCircleFilled}
          onClick={() => navigate(-1)}
          inContainer
        />
        <FloatingButton
          Icon={PlusCircleFilled}
          onClick={() => navigate("create")}
          inContainer
        />
      </FloatingContainer>

      <Container
        template="outer"
        containerSize="fullsize"
        props={{ style: { justifyContent: "start" } }}
      >
        <Typography.Title level={1}>All plays ever</Typography.Title>

        <Container
          template="inner"
          containerSize="compact"
          props={{
            direction: "horizontal",
            wrap: true,
            size: "small",
            style: {
              maxWidth: 720,
              marginBottom: 16,
              padding: 32,
              backgroundColor:
                data.length === 0 && !loading
                  ? "transparent"
                  : colors.secondary,
            },
          }}
        >
          {data.length > 0 &&
            data.map((play) => <PlayLink key={play.play_id} play={play} />)}

          {data.length === 0 && !loading && (
            <Typography.Title level={5} type="warning">
              No plays yet.. Create one
            </Typography.Title>
          )}

          {loading && (
            <Space direction="horizontal">
              <Skeleton.Button active shape="round" size="default" />
              <Skeleton.Button active shape="round" size="default" />
              <Skeleton.Button active shape="round" size="default" />
            </Space>
          )}
        </Container>
        {nextPage && !loading && (
          <FloatingButton
            Icon={RetweetOutlined}
            onClick={loadNext}
            inContainer
          />
        )}
      </Container>
    </>
  );
};

export default PlaysPage;
