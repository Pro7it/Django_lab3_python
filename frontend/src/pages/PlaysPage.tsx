import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { Play } from "../utils/ApiDtos";
import { getQuery } from "../utils/RestUtils";
import { Select, Skeleton, Space, Typography } from "antd";
import { colors } from "../config";
import { FloatingButton } from "../components/FloatingButton";
import PlayLink from "../components/PlayLink";
import {
  LeftCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { FloatingContainer } from "../components/FloatingContainer";
import { Container } from "../components/Containers";
import { type Genre } from "../utils/ApiDtos";
import { useInView } from "react-cool-inview";
const { Option } = Select;


const PlaysPage: React.FC = () => {
  const [data, setData] = useState<Play[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();
  const limit = 30;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { observe } = useInView({
    root: containerRef.current,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.1,
    onEnter: ({ }) => {
      console.log("Елемент став видимим!");
      if (nextPage) loadNext()
    },
  });

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
          renderItem="div"
          template="inner"
          containerSize="compact"
          props={{
            style: {
              display: "inline-flex",
              flexDirection: "column",
              // gap: 8,
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
            onChange={(value) => {
              setGenreFilter(value);

              const url =
                value && value.length > 0
                  ? `/api/plays/?genre_name=${value}&limit=${limit}&_=${Date.now()}`
                  : `/api/plays/?limit=${limit}&_=${Date.now()}`;

              fetchPlays(url);
            }}

            placeholder="обери жанр"
            popupMatchSelectWidth={false}
            menuItemSelectedIcon={false}
            showSearch={false}
            // suffixIcon={null}
            variant="borderless"
            style={{ width: "min-content", padding: 0 }}
            styles={{ popup: { root: { width: "fit-content" } } }}
            allowClear
          >
            {genres.map((g) => (
              <Option key={g.genre_id} value={g.name}>
                {g.name}
              </Option>
            ))}
          </Select>


          {/* <div style={{ maxWidth: 300, , position: "relative", overflowY: "auto" }} className="hide-scroll"> */}

          <div
            className="hide-scroll"
            ref={containerRef}
            id="scroll-container"
            style={{
              maxWidth: 700,
              maxHeight: 300,
              scrollbarWidth: "none",
              overflowY: "auto",
              width: "100%",
              paddingTop: "24px",
              paddingBottom: "24px",
              maskImage: data ? "linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)" : undefined,
              WebkitMaskImage: data ? "linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)" : undefined,
            }}
          >
            {data.map((play) => <PlayLink key={play.play_id} play={play} />)}

            {!!nextPage && (
              <Space
                style={{
                  paddingTop: 8,
                  paddingLeft: 8
                }}
                size={8}
                ref={observe}
                direction="horizontal">
                <Skeleton.Button active shape="round" size="default" />
                <Skeleton.Button style={{ width: 90 }} active shape="round" size="default" />
                <Skeleton.Button active shape="round" size="default" />
              </Space>
            )}
          </div>

          {/* </div>   */}

          {data.length === 0 && !loading && (
            <Typography.Title level={5} type="warning">
              No plays yet.. Create one
            </Typography.Title>
          )}


        </Container>


      </Container >
    </>
  );
};

export default PlaysPage;
