import { Tooltip, Typography } from "antd";
import type { PropsWithChildren } from "react";
import { colors } from "../../config";
import { useInFirst } from "../../utils/StateManager";


const HelperMessage: React.FC<PropsWithChildren<{ active?: boolean }>> = ({ children, active }) => {
    const inFirst = useInFirst((s) => s.inFirst);
    const setChecked = useInFirst((s) => s.setChecked);


    const Content = <Typography style={{ color: colors.primary, cursor: "pointer" }} onClick={() => setChecked()}>ти можеш редагувати поля! спробуй!!!🤩 (натисни на мене, щоб я не відображався😢)</Typography>

    if (!active) return children

    return <Tooltip title={!inFirst && Content}>
        <div>{children}</div>
    </Tooltip>

}

export default HelperMessage