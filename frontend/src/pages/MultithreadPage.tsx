import type React from "react";
import { Container, ContainerStyles } from "../components/Containers";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuery } from "../utils/RestUtils";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Button, InputNumber, message, Space, Spin, Switch, Typography } from "antd";
import { colors } from "../config";
import { CloseOutlined, LeftCircleFilled, LoadingOutlined, SmileOutlined } from "@ant-design/icons";
import { FloatingButton } from "../components/FloatingButton";

const MultithreadPage: React.FC = () => {
    const navigate = useNavigate()
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [threads, setThreads] = useState<number>(20)
    const [ultimate, setUltimate] = useState<boolean>(true)
    const [iterations, setIterations] = useState<number>(1000)
    const [logData, setLogData] = useState<any[]>([])
    const controllerRef = useRef<AbortController | null>(null);
    const [logged, setLogged] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();

    const handleTest = () => {
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true)
        getQuery(`api/theaters/multithread-test/?threads=${threads}&i=${iterations}&ultimate=${Number(ultimate)}`, undefined, {
            signal: controller.signal
        })
            .then(e => {
                if (e) {
                    const response = e as {
                        iterations: number
                        plays: number
                        pc_threads: number
                        requested_threads: number
                        total_time: number,
                        details: {
                            threads: number,
                            time: number
                        }[]
                    }

                    setChartData(response.details)
                    setLogData(response.details.map(({ threads, time }) => ({ threads, "time": Math.log(time) })))

                } else{
                    messageApi.error("error occured, try again")
                }
            })
            .finally(()=>setLoading(false))
    }

    const cancelRequest = () => {
        controllerRef.current?.abort();
        setLoading(false)
    };

    const CustomizeRenderEmpty = () => (
        <div style={{ textAlign: 'center', minWidth: 500, aspectRatio: 1.618, display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
            <SmileOutlined style={{ fontSize: 20, color: colors["primary-txt"] }} />
            <Typography children="press start testing" />
        </div>
    );

    const LoadingComponent = () => (
        <div style={{ textAlign: 'center', minWidth: 500, aspectRatio: 1.618, display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
            <Spin style={{ color: colors.accent }} indicator={<LoadingOutlined spin />} size="large" />
            <Typography children="please wait a minute" />
        </div>
    )


    return (
        <div style={ContainerStyles.containerSize.fullsize}>
            {contextHolder}
            <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate("/")} />

            <Container renderItem="div" props={{ style: { overflow: "hidden" } }} containerSize="fullsize" template="outer" >
                <Container containerSize="compact" template="inner" props={{ style: { position: "relative", minWidth: 500 } }} >
                    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>

                        <Space style={{ justifyContent: "space-around", alignContent: "space-around", width: "100%" }}>
                            <Badge.Ribbon style={{ scale: 0.7, right: -16, top: -12 }} color={colors.accent} text="threads">
                                <InputNumber
                                    controls={false}
                                    placeholder="threads"
                                    style={{ background: "#fff0f6", borderTopRightRadius: 0 }}
                                    variant="borderless" color="pink" max={50} min={1} value={threads} onChange={v => setThreads(v ?? 1)} />
                            </Badge.Ribbon>
                            <Badge.Ribbon style={{ scale: 0.7, right: -18, top: -12 }} color={colors.accent} text="iterations">
                                <InputNumber
                                    controls={false}
                                    placeholder="iterations"
                                    style={{ background: "#fff0f6", borderTopRightRadius: 0 }}
                                    variant="borderless" color="pink" max={5000} min={10} value={iterations} onChange={v => setIterations(v ?? 1)} />
                            </Badge.Ribbon>
                            <Space size={"small"}>
                                <Typography children={ultimate ? "from 1 to n" : "only on n"} />
                                <Switch checked={ultimate} onChange={v => setUltimate(v)} />
                            </Space>
                        </Space>
                        <Space style={{ justifyContent: "space-around", alignContent: "space-around", width: "100%" }}>
                            <Space size={"small"}>
                                <Typography children="cope outliers (log)" />
                                <Switch value={logged} onChange={v => {
                                    setLogged(v)
                                }} />
                            </Space>
                            {loading && <Button
                                icon={<CloseOutlined style={{ paddingTop: 2 }} />}
                                style={{ alignItems: "center", display: "flex" }}
                                onClick={cancelRequest}
                                variant="filled"
                                shape="round"
                                color="pink"
                                size="large"
                                children="cancel"
                            />}
                        </Space>


                        {loading && <LoadingComponent />}
                        {chartData.length == 0 && !loading && <CustomizeRenderEmpty />}
                        {chartData.length > 0 && !loading && <AreaChart

                            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', minWidth: 500, aspectRatio: 1.618 }}
                            responsive
                            data={logged ? logData : chartData}
                            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="threads" />
                            <YAxis dataKey={"time"} width="auto" />
                            <Tooltip contentStyle={{ borderRadius: 24, border: "none" }} labelFormatter={l => "threads: " + l} itemStyle={{ color: colors["primary-txt"] }} labelStyle={{ color: colors.accent }} />
                            <Area
                                baseValue="dataMin"
                                type="monotone"
                                dataKey="time"
                                stroke={colors.accent + "aa"}
                                fill={colors.accent + "77"}
                            />
                        </AreaChart>}

                        <Space style={{ width: "100%", justifyContent: "center" }}>
                            <Button
                                loading={loading}
                                onClick={() => {
                                    !loading && handleTest()
                                }}
                                variant="filled"
                                shape="round"
                                color="pink"
                                size="large"
                                children="start testing"
                            />

                        </Space>
                    </Space>

                </Container>
            </Container>
        </div>
    );
};

export default MultithreadPage
