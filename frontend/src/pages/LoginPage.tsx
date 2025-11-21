import type React from "react";
import { useState } from "react";
import { postQuery } from "../utils/RestUtils";
import { type UserLogin } from '../utils/DtoUtils';
import { Button, Input, message, Space, Typography } from "antd";
import BackButton from "./components/BackButton";
import CardContainer from "./components/Containers";
import { changeField, checkAllFilled } from "../utils/HookFoldUtils";
import { useNavigate } from "react-router-dom";


const EmptyUserLogin: UserLogin = {
    email: "",
    password: ""
}

export const setAccessToken = (token: string) => {
    localStorage.setItem("access_token", token);
}


export const getAccessToken = () => {
    const token = localStorage.getItem("access_token");

    return token;
}



const LoginPage: React.FC = () => {
    const [data, setData] = useState<UserLogin>(EmptyUserLogin)
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate()

    const loginMe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (checkAllFilled(data, EmptyUserLogin)) {
            postQuery(`login/`, data).then(r => {
                const success = (r: { access: string }) => {
                    setAccessToken(r.access)
                    messageApi.success("succesfully saved!", 1).then(() => navigate("/"))
                }

                r ? success(r as { access: string }) : messageApi.error("error ocurred", 0.5)
            })
        }

    }

    return <>
        {contextHolder}
        <BackButton />
        <CardContainer outerSize="fullsize" innerSize="compact"  >
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
                            onChange={v => changeField(v.currentTarget.value, "email", setData)}
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
                            onChange={v => changeField(v.currentTarget.value, "password", setData)}
                            variant="borderless"
                            style={{
                                padding: 0,
                            }}
                        />
                    </Space>
                    {checkAllFilled(data, EmptyUserLogin) && <Space style={{ width: "100%", justifyContent: "center", marginTop: 32 }}>
                        <Button htmlType="submit" color="pink" variant="solid" shape="round">
                            Увійти
                        </Button>
                    </Space>}
                </Space>

            </form> : null}
        </CardContainer>
    </>
}

export default LoginPage