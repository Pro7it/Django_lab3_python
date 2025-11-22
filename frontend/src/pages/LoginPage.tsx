import type React from "react";
import { useState } from "react";
import { postQuery } from "../utils/RestUtils";
import { type UserLogin } from '../utils/ApiDtos';
import { Button, Input, message, Space, Typography } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { Container } from "../components/Containers";
import { changeField, checkAllFilled } from "../utils/HookFolders";
import { useNavigate } from "react-router-dom";
import { useToken } from "../utils/StateManager";
import { LeftCircleFilled } from "@ant-design/icons";


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

    return <>
        {contextHolder}
        <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate("/")} />
        <Container containerSize="fullsize" template="outer" >
            <Container containerSize="compact" template="inner" props={{ style: { paddingTop: 0 } }} >
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
    </>
}

export default LoginPage