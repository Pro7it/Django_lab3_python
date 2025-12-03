import React from "react";
import EditableField from "../EditableField";

interface DescriptionFieldProps {
    value: string;
    onChange: (value: string) => void;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({ value, onChange }) => {
    return (
        <EditableField
            textarea={{
                placeholder: "хмм.. А про що це?",
                value,
                onChange: (e) => onChange(e.currentTarget.value),
            }}
        />
    );
};

export default DescriptionField;
