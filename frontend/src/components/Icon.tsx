import React from "react";

const Icon: React.FC<{style?: React.CSSProperties, path: React.ReactNode, className?: string, onClick?: (event: React.MouseEvent<SVGSVGElement>)=>any, s512?: boolean}> = ({className, onClick, path, style, s512}) =>{
    return <svg style={style} onClick={(e)=>onClick? onClick(e) : null} className={className} xmlns="http://www.w3.org/2000/svg"  id="Layer_1" data-name="Layer 1" viewBox={s512? "0 0 512 512": "0 0 24 24"} fill="currentColor" >
    {path}
  </svg>
  
}
export default Icon