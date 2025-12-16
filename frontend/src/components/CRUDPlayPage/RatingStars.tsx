import React, { useState, useEffect } from 'react';
import { Rate } from 'antd';
import { usePlayState, useToken } from '../../utils/StateManager';
import { colors, Varialbles } from '../../config'



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

    return <Rate value={rating} onChange={handleChange} style={{ color: colors.accent }}/>;
};

export default RatingStars;
