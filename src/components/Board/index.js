import { useRef } from "react";

const Board = () => {
    const canvasRef = useRef(null)
    return(
          <canvas ref = {canvasRef} ></canvas>
    )
}

export default Board;
