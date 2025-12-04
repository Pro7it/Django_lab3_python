import type React from "react";
import { useEffect, useState } from "react";
import type { Play } from "../utils/ApiDtos";
import { getQuery } from "../utils/RestUtils";
import { Select, Skeleton, Space, Typography } from "antd";
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
import { type Genre } from "../utils/ApiDtos";
const { Option } = Select;

const PlaysPage: React.FC = () => {
  const [data, setData] = useState<Play[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();
  const limit = 10;

  const fetchPlays = (url?: string) => {
    setLoading(true);
    let apiUrl = url ?? `/api/plays/?limit=${limit}&_=${Date.now()}`;

    getQuery(apiUrl).then((e: any) => {
      if (!e) return;
      setData(e.results);
      setNextPage(e.next);
      setLoading(false);
    });
  };

  useEffect(() => {
    getQuery(`api/plays/?limit=${limit}&_=${Date.now()}`).then((e: any) => {
      if (e !== null) {
        setData(e.results);
        setNextPage(e.next);
        setLoading(false);
      }
    });
    getQuery(`api/genres`).then((e) => {
      if (e) setGenres(e as Genre[]);
      console.log(e);
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
          <Select
            value={genreFilter}
            placeholder="Select genre"
            style={{
              width: "auto",
              minWidth: 100,
            }}
            onChange={(value) => {
              setGenreFilter(value);

              const url =
                value && value.length > 0
                  ? `/api/plays/?genre_name=${value}&limit=${limit}&_=${Date.now()}`
                  : `/api/plays/?limit=${limit}&_=${Date.now()}`;

              fetchPlays(url);
            }}
            allowClear
          >
            {genres.map((g) => (
              <Option key={g.genre_id} value={g.name}>
                {g.name}
              </Option>
            ))}
          </Select>

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
