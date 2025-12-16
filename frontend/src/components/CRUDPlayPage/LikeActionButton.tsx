import { HeartFilled, HeartOutlined } from "@ant-design/icons"
import { colors, Varialbles } from "../../config"
import { FloatingButton } from "../FloatingButton"
import { usePlayState } from "../../utils/StateManager"
import { useState, useEffect } from 'react';
import { useToken } from "../../utils/StateManager";


const LikeActionButton = () => {
    const data = usePlayState(s => s.data)
    const [liked, setLiked] = useState<boolean>(data?.user_liked ?? false)
    const [loading, setLoading] = useState(false)

    const handleLike = async () => {
        if (loading) return

        try {
            setLoading(true)

            const resp = await fetch(Varialbles.backend + `api/plays/${data?.play_id}/like/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${useToken.getState().token}`,
                },
            })

            if (!resp.ok) {
                console.error("Failed to toggle like", await resp.text())
                return
            }

            const new_data = await resp.json()

            setLiked(new_data.liked)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if (data) setLiked(data?.user_liked)
    }, [data?.user_liked]) 

    return <FloatingButton
        style={{
            fontSize: 24,
            color: colors["primary-txt"] + "79",
        }}
        inContainer
        Icon={liked ? HeartFilled : HeartOutlined}
        onClick={handleLike}
        props={{
            className: loading ? "disabled" : "animated-icon-self-accent",
            style: { color: liked ? colors.accent : undefined }
        }}
    />
}

export default LikeActionButton