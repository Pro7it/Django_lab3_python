import type React from "react";
import { useEffect, useRef, useState } from "react";
import { postQuery } from "../utils/RestUtils";
import { type UserLogin } from '../utils/ApiDtos';
import { Button, Input, message, Space, Typography } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { Container, ContainerStyles } from "../components/Containers";
import { changeField, checkAllFilled } from "../utils/HookFolders";
import { useNavigate } from "react-router-dom";
import { useToken } from "../utils/StateManager";
import { LeftCircleFilled } from "@ant-design/icons";
import Icon from "../components/Icon";
import { arrow1_1, arrow1_2 } from "../utils/IconPaths";
import { colors } from "../config";
import { createDraggable, createScope, Scope, spring } from "animejs";


const EmptyUserLogin: UserLogin = {
    email: "",
    password: ""
}


const LoginPage: React.FC = () => {
    const [data, setData] = useState<UserLogin>(EmptyUserLogin)
    const [loading, setloading] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();
    const setToken = useToken(s => s.setToken)
    const navigate = useNavigate()
    const scope = useRef<Scope>(null)
    const refScope = useRef<HTMLDivElement>(null)

    const loginMe = (e: React.FormEvent<HTMLFormElement>) => {
        setloading(true)
        e.preventDefault()
        if (checkAllFilled(data, EmptyUserLogin) && !loading) {
            postQuery(`login/`, data).then(r => {
                const success = (r: { access: string }) => {
                    setToken(r.access)
                    messageApi.success("succesfully saved!", 1).then(() => navigate(-1))
                }

                r ? success(r as { access: string }) : messageApi.error("error ocurred", 0.5).then(() => setloading(false))
            })
        }

    }

    useEffect(() => {
        scope.current = createScope({ root: refScope }).add(() => {
            createDraggable('.arrow-message', {
                container: [0.9, 0, 0, 0],
                releaseEase: spring({ bounce: .1 })
            });

        })

        return () => scope.current?.revert()
    }, [])

    return <div ref={refScope} id="outer-scope" style={ContainerStyles.containerSize.fullsize}>
        {contextHolder}
        <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate("/")} />

        <Container containerSize="fullsize" template="outer" >
            <Container containerSize="compact" template="inner" props={{ style: { paddingTop: 0, position: "relative" } }} >
                <div className="arrow-message" style={{ position: "absolute", right: "-30px", top: "210px" }}>
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", right: 0, bottom: "0px", rotate: "20deg" }}>
                            <Icon
                                path={<g>
                                    <path
                                        d={arrow1_1}
                                        strokeWidth={5}
                                        stroke="currentColor"
                                        className="arrow1" />
                                    <path
                                        d={arrow1_2}
                                        strokeWidth={5}
                                        stroke="currentColor"
                                        className="arrow2" />
                                </g>}
                                style={{
                                    width: 80,
                                    color: colors.arrow,
                                }}
                                props={{
                                    fill: "none",
                                    viewBox: "0 0 100 100"
                                }}
                            />
                        </div>
                        <Container template="inner" containerSize="compact" props={{ style: { position: "absolute", backgroundColor: colors.arrow, left: -30, bottom: 50, padding: 16, minWidth: 120, rotate: "10deg" } }}>
                            <Typography style={{color: colors.primary}}>
                                Спробуй ввести пошту та пороль) ✨ 🔑
                            </Typography>
                        </Container>
                    </div>
                </div>
                {data ? <form onSubmit={loginMe} >
                    <Typography.Title style={{ width: "100%" }}>
                        Вхід
                    </Typography.Title>
                    <Space direction="vertical" size={0} >
                        <Space direction="vertical" size="small" >
                            <Input
                                type="text"
                                name="username"
                                autoComplete="email"
                                placeholder="Пошта"
                                value={data.email}
                                onInput={v => changeField(v.currentTarget.value, "email", setData)}
                                variant="borderless"
                                style={{
                                    padding: 0,
                                }}
                            />
                            <Input.Password
                                visibilityToggle={false}
                                name="password"
                                autoComplete="current-password"
                                placeholder="Пароль"
                                type="password"
                                value={data.password}
                                onInput={v => changeField(v.currentTarget.value, "password", setData)}
                                variant="borderless"
                                style={{
                                    padding: 0,
                                }}
                            />
                        </Space>
                        {checkAllFilled(data, EmptyUserLogin) && <Space style={{ width: "100%", justifyContent: "center", marginTop: 32 }}>
                            <Button loading={loading} disabled={loading} htmlType="submit" color="pink" variant="solid" shape="round">
                                Увійти
                            </Button>
                        </Space>}
                    </Space>

                </form> : null}
            </Container>
        </Container>
    </div>
}

export default LoginPage