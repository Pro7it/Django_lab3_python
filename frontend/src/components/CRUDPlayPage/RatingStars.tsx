import * as React from 'react';
import { Rate } from 'antd';
import { usePlayState, useToken } from '../../utils/StateManager';
import { colors, Varialbles } from '../../config'
import { useEffect, useState } from 'react';

const CatIcon: React.FC = () => (
    <svg viewBox="0 0 512 512" width="24" height="24" stroke={"currentColor"} strokeWidth={30} fillOpacity={0}>
        <g fill='red'>
            <path d="M167.65 207.8a96.37 96.37 0 0 0 68.147-28.23 96.393 96.393 0 0 0 28.237-68.154V15l-64.267 48.2H135.5L71.233 15v96.4c0 53.24 43.155 96.4 96.4 96.4h.017zM264.033 111.4h32.134M71.233 111.4H39.1M239.484 175.667h56.683M95.775 175.667H39.1" >
            </path>
            <path d="m210.748 197.642 47.791 95.581a204.148 204.148 0 0 1 21.561 91.31V497H55.167V384.533a204.14 204.14 0 0 1 21.553-91.31l47.791-95.581" >
            </path>
            <path d="M119.433 384.533a48.202 48.202 0 0 1 14.115-34.082 48.191 48.191 0 0 1 68.162 0 48.214 48.214 0 0 1 14.123 34.082V497h-96.4V384.533zM280.1 497h32.133a32.14 32.14 0 0 0 32.133-32.133V304.184A48.174 48.174 0 0 1 392.55 256h.016M408.633 39.1S400.6 15 376.5 15c-17.738 0-32.133 14.398-32.133 32.133 0 40.167 64.267 64.267 64.267 64.267S472.9 87.3 472.9 47.133C472.9 29.398 458.496 15 440.767 15c-24.1 0-32.134 24.1-32.134 24.1z" >
            </path>
        </g>
    </svg>
);

const RatingStars: React.FC = () => {
    const data = usePlayState(s => s.data);
    const [rating, setRating] = useState<number>(data?.user_rating ?? 0);
    const playId = data?.play_id;

    useEffect(() => {
        setRating(data?.user_rating ?? 0);
    }, [data]);

    const handleChange = async (value: number) => {
        try {
            const resp = await fetch(`${Varialbles.backend}api/plays/${playId}/rate/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${useToken.getState().token}`,
                },
                body: JSON.stringify({ rating: value })
            });

            if (!resp.ok) {
                console.error("Failed to rate", await resp.text())
                return
            }
            const result = await resp.json();
            setRating(result.rating)
        } catch (err) {
            console.log(err)
        }
    };

    return <Rate value={rating} onChange={handleChange} style={{ color: colors.accent }} character={<CatIcon />} />;
};

export default RatingStars;
