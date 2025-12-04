import { useEffect } from "react";
import { EmptyPlay } from "../utils/ApiDtos";
import { postQuery } from "../utils/RestUtils";
import { useMessage, usePlayState } from "../utils/StateManager";
import CRUDPlayPage from "./CRUDPlayPage"
import { formPlayData } from "../utils/FormPlayData";


const PlayCreatePage = () => {
    const messageApi = useMessage((s) => s.messageApi);
    const data = usePlayState(s => s.data)
    const setValid = usePlayState(s => s.setValid)
    const setInitial = usePlayState(s => s.init)

    const reset = () => {
        setInitial(EmptyPlay)
        setValid("name", true)
        setValid("duration", true)
        setValid("author", true)
        setValid("description", true)
        setValid("genre", true)
    }


    useEffect(() => {
        reset()
    }, [])

    return <>
        <CRUDPlayPage
            saveBtn={{
                text: "Зберегти зміни",
                action: () => {
                    if (!data) return;
                    const formData = formPlayData(data)

                    postQuery(`api/plays/`, formData).then((r) =>
                        r
                            ?
                            (messageApi?.success("успішно створено!", 0.5), reset(), 0)
                            : (messageApi?.error("щось пішло не так(", 0.5), 0)
                    );
                },
            }}
            tooltip={false}
            actions={["undo"]}
            warnUnsaved={false}
        />
    </>
}

export default PlayCreatePage