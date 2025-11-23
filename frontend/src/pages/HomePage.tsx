import { Button, Typography } from "antd";
import type React from "react";
import { useMessage, useToken } from "../utils/StateManager";
import { Container } from "../components/Containers";
import { useEffect, useRef } from "react";
import { createScope, Scope } from "animejs";


const HomePage: React.FC = () => {
  const messageApi = useMessage(s => s.messageApi)
  const setToken = useToken(s => s.setToken)
  const token = useToken(s => s.token)
  const broccoliRef = useRef<SVGPathElement>(null)
  const broccoliRef2 = useRef<SVGPathElement>(null)
  const refScope = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope>(null)

  useEffect(() => {
    const broccoliIcon = broccoliRef.current
    const broccoliIcon2 = broccoliRef2.current
    if (!broccoliIcon || !broccoliIcon2) return;

    scope.current = createScope({ root: refScope }).add(() => {

    })

    return () => scope.current?.revert()
  }, [])

  return <Container template="outer" containerSize="fullsize" props={{ size: "small", style: { justifyContent: undefined }, ref: refScope }}>
    <Typography.Title level={1}>
      Hello here 🥦
    </Typography.Title>
    <Button href="plays/" variant="filled" shape="round" color="pink" size="large" >
      plays
    </Button>
    {token == "" ? <Button href="/login/" variant="filled" shape="round" color="pink" size="large" >
      login
    </Button> :
      <Button onClick={() => {
        setToken("")
        messageApi?.success("you are free!")
      }} variant="link" shape="round" color="red" size="middle" >
        logout
      </Button>}

  </Container>
}

export default HomePage 