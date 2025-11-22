import { PlusCircleFilled } from "@ant-design/icons"
import { colors } from "../config"
import { useNavigate } from "react-router-dom"

const CreateButton: React.FC = () => {
    const navigate = useNavigate()

    return <div
        onClick={() => navigate("create/")}
        className="animated-icon"
        style={{
            zIndex: 2,
            position: "absolute",
            right: "16px",
            top: "16px",
            fontSize: "40px",
            color: colors["floating-btn"],
        }}>
        <PlusCircleFilled className="animated-icon-self" style={{ transition: "100ms" }} />
    </div>
}

export default CreateButton