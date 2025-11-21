import { LeftCircleFilled } from "@ant-design/icons"
import { colors } from "../../config"
import { useNavigate, type To } from "react-router-dom"

const BackButton: React.FC<{href?: To}> = ({href = -1 as To}) => {
    const navigate = useNavigate()

    return <div className="animated-icon"
        style={{
            zIndex: 2,
            position: "absolute",
            left: "16px",
            top: "16px",
            fontSize: "40px",
            color: colors["floating-btn"],
        }}
        onClick={() => (navigate(href))} >
        <LeftCircleFilled className="animated-icon-self" style={{ transition: "100ms" }} />
    </div>
}

export default BackButton