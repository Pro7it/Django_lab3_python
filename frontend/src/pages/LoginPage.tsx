import type React from "react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { postQuery } from "../utils/RestUtils";
import { type UserLogin } from '../utils/ApiDtos';
import { Button, Input, message, Space, Typography } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { Container, ContainerStyles } from "../components/Containers";
import { useNavigate } from "react-router-dom";
import { useToken } from "../utils/StateManager";
import { LeftCircleFilled } from "@ant-design/icons";
import Icon from "../components/Icon";
import { arrow1_1, arrow1_2 } from "../utils/IconPaths";
import { colors } from "../config";
import { createDraggable, createScope, Scope, spring } from "animejs";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { changeField, checkAllFilled } from "../utils/HookFolders";
import { validateEmail, validatePassword } from "../utils/LoginValidators";

gsap.registerPlugin(Flip)


const EmptyUserLogin: UserLogin = {
    email: "",
    password: ""
}

export const SmoothButton = (containerRef: React.RefObject<HTMLDivElement | null>, buttonRef: React.RefObject<HTMLDivElement | null>, checkFn: () => boolean) => {
    if (!containerRef.current || !buttonRef.current) return;

    const state = Flip.getState(containerRef.current.querySelectorAll("*"));


    Flip.from(state, { duration: .2, ease: "power1.inOut", nested: true, fade: true });
    gsap.killTweensOf(buttonRef.current)
    if (checkFn()) {
        let tl = gsap.timeline();
        tl.to(buttonRef.current, { display: "flex", duration: 0.3 });
        tl.to(buttonRef.current, { opacity: 1, duration: 0.1 })
    } else {
        let tl = gsap.timeline();
        tl.to(buttonRef.current, { opacity: 0, duration: 0.2 })
        tl.to(buttonRef.current, { display: "none", duration: 0.3 });
    }
}


const LoginPage: React.FC = () => {
    const [data, setData] = useState<UserLogin>(EmptyUserLogin)
    const [loading, setloading] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();
    const setToken = useToken(s => s.setToken)
    const scope = useRef<Scope>(null)
    const refScope = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null);
    const [helpMsg, setHelpMsg] = useState<string>("Спробуй ввести пошту та пороль)")
    const successMsg = "Непогано, спробуй увійти"

    useEffect(() => {
        const email = validateEmail(data.email)
        const password = validatePassword(data.password)
        setHelpMsg(email ?? password ?? successMsg)

    }, [data])

    const navigate = useNavigate()

    const loginMe = (e: React.FormEvent<HTMLFormElement>) => {
        setloading(true)
        e.preventDefault()
        if (checkAllFilled(data, EmptyUserLogin) && !loading) {
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);

            postQuery(`login/`, formData).then(r => {
                const success = (r: { access: string }) => {
                    setToken(r.access)

                    messageApi.success("Succes!", 1).then(() => navigate("/"));
                }

                r ? success(r as { access: string }) : messageApi.error("Error ocurred", 0.5).then(() => setloading(false))
            })
        }

    }

    useEffect(() => {
        scope.current = createScope({ root: refScope }).add(() => {
            createDraggable('.arrow-message', {
                container: [0.9, 0, 0, 0],
                releaseEase: spring({ bounce: .1 }),
                containerFriction: 0.8
            });

        })

        return () => scope.current?.revert()
    }, [])


    return <div style={ContainerStyles.containerSize.fullsize}>
        {contextHolder}
        <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate("/")} />

        <Container renderItem="div" props={{ style: { overflow: "hidden" }, ref: refScope }} containerSize="fullsize" template="outer" >
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
                        <Container template="inner" containerSize="compact" props={{ style: { position: "absolute", backgroundColor: colors.arrow, left: -30, bottom: 50, padding: 16, minWidth: 130, rotate: "0deg" } }}>
                            <Typography style={{ color: colors.primary }} children={helpMsg} />
                        </Container>
                    </div>
                </div>
                {data ? <form onSubmit={loginMe} >
                    <Typography.Title style={{ width: "100%" }}>
                        Вхід
                    </Typography.Title>
                    <Space direction="vertical" size={0}  >
                        <Space direction="vertical" size="small" ref={containerRef}     >
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
                            {helpMsg == successMsg && <Space className="fade-apear" style={{ width: "100%", justifyContent: "center" }}>
                                <Button loading={loading} disabled={loading} style={{
                                    marginTop: 16,
                                }} htmlType="submit" color="pink" variant="solid" shape="round">
                                    Увійти
                                </Button>
                            </Space>}
                        </Space>
                    </Space>

                </form> : null}
            </Container>
        </Container>
    </div>
}

export default LoginPage