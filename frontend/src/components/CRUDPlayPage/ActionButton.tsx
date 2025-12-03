import { Button, Space } from "antd";
import React from "react";

interface ActionButtonProps {
    active: boolean;
    onClick: () => void;
    text: string
}

const ActionButton: React.FC<ActionButtonProps> = ({ active, onClick, text }) => {
    return active && <Space style={{ width: "100%", justifyContent: "center" }}>
        <Button
            className="fade-apear"
            color="pink"
            variant="solid"
            shape="round"
            onClick={onClick}>
            {text}
        </Button>
    </Space>
};

export default ActionButton;
