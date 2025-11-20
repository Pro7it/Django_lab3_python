//TODO
// import type React from "react";
// import { useEffect, useState } from "react";
// import { getQuery, postQuery } from "../utils/RestUtils";
// import { type Genre, type Play, type UserLogin } from '../utils/DtoUtils';
// import { Button, Input, message, Select, Space, Typography } from "antd";
// import BackButton from "./components/BackButton";
// import { colors } from "../config";
// import { ClockCircleOutlined } from "@ant-design/icons";


// const EmptyUserLogin: UserLogin = {
//     email: "",
//     password: ""
// }

// const LoginPage: React.FC = () => {
//     const [data, setData] = useState<UserLogin>()
//     const [messageApi, contextHolder] = message.useMessage();

    

//     const createPlay = () => {
//         if (data) {
//             const Data: Play = {
//                 ...data,
//                 genre: typeof data.genre === "number" ? data.genre : data.genre.genre_id
//             }
//             if (checkData()) {
//                 postQuery(`api/plays/`, Data).then(r => r ? (setData(EmptyPlay), messageApi.success("succesfully saved!", 0.5)) : messageApi.error("error ocurred", 0.5))
//             }
//         }
//     }

//     return <>
//         {contextHolder}
//         <BackButton />
//         <Space wrap style={{ width: "100%", height: "100%", justifyContent: "center", alignContent: "center" }}>
//             <Space direction="vertical" size={0} style={{
//                 alignItems: "left",
//                 width: "fit-content",
//                 padding: 32,
//                 paddingTop: 0,
//                 paddingBottom: 24,
//                 borderRadius: 32,
//                 backgroundColor: colors.secondary
//             }}>
//                 {data ? <>
//                     <Input.TextArea
//                         placeholder="Назви мене"
//                         autoSize={{
//                             minRows: 1
//                         }}
//                         value={data.name}
//                         onChange={v => changeField(v.currentTarget.value, "name")}
//                         variant="borderless"
//                         style={{
//                             fontSize: 42,
//                             marginBlockStart: "0.67em",
//                             marginBlockEnd: " 0.67em",
//                             marginBottom: "0.5em",
//                             color: colors["primary-txt"],
//                             fontWeight: 400,
//                             lineHeight: 1.1904761904761905,
//                             padding: 0
//                         }}
//                     />
//                     <Space direction="vertical" size="middle" style={{ width: "100%" }}>
//                         <Space size={0} direction="vertical">
//                             <Space id="author-duration" size="middle">
//                                 <Space style={{
//                                     alignItems: "start"
//                                 }}>
//                                     <Typography>
//                                         Автор:
//                                     </Typography>
//                                     <Input.TextArea
//                                         placeholder="Я автор"
//                                         autoSize={{
//                                             minRows: 1
//                                         }}
//                                         value={data?.author}
//                                         onChange={v => changeField(v.currentTarget.value, "author")}
//                                         variant="borderless"
//                                         style={{
//                                             width: 120,
//                                             padding: 0
//                                         }}
//                                     />
//                                 </Space>
//                                 <Space>
//                                     <ClockCircleOutlined style={{
//                                         fontSize: 20,
//                                         color: colors["primary-txt"],
//                                     }} />
//                                     <Space size={0} wrap style={{ alignContent: "start", width: "fit-content" }}>
//                                     </Space>
//                                     <Input
//                                         value={formatMinutes(data.duration)}
//                                         onChange={v => {
//                                             const time = parseTimeString(v.currentTarget.value)
//                                             if (time) {
//                                                 const inputEl = v.currentTarget
//                                                 const curpos = inputEl.selectionStart || 0
//                                                 changeField(time[0] * 60 + time[1], "duration")
//                                                 setTimeout(() => {
//                                                     inputEl.setSelectionRange(curpos, curpos)
//                                                 }, 0)
//                                             }
//                                         }}
//                                         variant="borderless"
//                                         style={{
//                                             width: 120,
//                                             padding: 0
//                                         }} />
//                                 </Space>
//                             </Space>
//                             <Space size={0}>
//                                 <Typography>
//                                     Жанр:
//                                 </Typography>
//                                 <Select className="select-edit"
//                                     placeholder="обрати"
//                                     suffixIcon={false}
//                                     popupMatchSelectWidth={false}
//                                     options={genres?.map(genre => ({ value: genre.genre_id, label: <Typography>{genre.name}</Typography> }))}
//                                     value={(typeof data.genre) == "number" ? (data.genre == 0 ? undefined : data.genre) : data.genre.genre_id}
//                                     onChange={v => {
//                                         if ((typeof data.genre) == "number") {
//                                             changeField(v, "genre")
//                                         } else if (genres) {
//                                             changeField(genres.filter(g => g.genre_id == v)[0], "genre")
//                                         }
//                                     }} variant="borderless"
//                                     style={{
//                                         width: "fit-content",
//                                         padding: 0
//                                     }}
//                                 />
//                             </Space>
//                         </Space>
//                         <Input.TextArea
//                             placeholder="description here"
//                             autoSize={{ minRows: 1 }}
//                             value={data.description}
//                             onChange={v => changeField(v.currentTarget.value, "description")}
//                             variant="borderless"
//                             style={{ padding: 0 }} />

//                     </Space>
//                     {checkData() ? <Space style={{ width: "100%", justifyContent: "center", marginTop: 32 }}>
//                         {data ? <Button color="pink" variant="solid" shape="round" onClick={createPlay}>
//                             Зберегти
//                         </Button> : null}
//                     </Space> : null}
//                 </> : null}
//             </Space>
//         </Space>
//     </>
// }

// export default LoginPage