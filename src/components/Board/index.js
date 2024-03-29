import { MENU_ITEMS } from "@/src/constants";
import { useEffect, useRef } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { actionItemClick } from '@/src/slice/menuSlice';
import { socket } from "@/src/socket";


const Board = () => {
    const dispatch = useDispatch()
    const canvasRef = useRef(null)
    const drawHistory = useRef([])
    const historyPointer = useRef(0)
    const shouldDraw = useRef(false)
    const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu)
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItem])

    useEffect(()=>{
        if(!canvasRef.current)return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')
       
        if(actionMenuItem === MENU_ITEMS.DOWNLOAD){
            const URL = canvas.toDataURL()
            const anchor = document.createElement('a')
            anchor.href = URL
            anchor.download = 'sketch.jpg'
            anchor.click()
            console.log(URL)
        }else if (actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO){
            if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO ) historyPointer.current -= 1
            if(historyPointer.current < drawHistory.current.length-1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1
            const imageData = drawHistory.current[historyPointer.current]
            context.putImageData(imageData, 0 ,0)
        }

        dispatch(actionItemClick(null))
        console.log("actionMenuItem", actionMenuItem)
    },[actionMenuItem])
    
    useEffect(()=>{
       if(!canvasRef.current)return
       const canvas = canvasRef.current;
       const context = canvas.getContext('2d')
       
       const changeConfig=() =>{
        context.strokeStyle =color
        context.lineWidth = size
       }
        
      changeConfig()
    },[color, size])

    useEffect(() => {
       if(!canvasRef.current)return
       const canvas = canvasRef.current;
       const context = canvas.getContext('2d')

       //when mounting
       canvas.width = window.innerWidth
       canvas.height = window.innerHeight

       const handleMouseDown = (e) =>{
          shouldDraw.current = true
          context.beginPath()
          context.moveTo(e.clientX, e.clientY)
       }
       const handleMouseMove = (e) =>{
         if(!shouldDraw.current)return
         context.lineTo(e.clientX, e.clientY)
         context.stroke()
       }
       const handleMouseUp = (e) =>{
        shouldDraw.current = false
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        drawHistory.current.push(imageData)
        historyPointer.current = drawHistory.current.length - 1  
       }

       canvas.addEventListener('mousedown', handleMouseDown)
       canvas.addEventListener('mousemove', handleMouseMove)
       canvas.addEventListener('mouseup', handleMouseUp)

       socket.on("connect", () => {
          console.log("client connected");
       });
      
       return() => {
          canvas.removeEventListener('mousedown', handleMouseDown)
          canvas.removeEventListener('mousemove', handleMouseMove)
          canvas.removeEventListener('mouseup', handleMouseUp)
        }
    } , [])   
    console.log(color,size)
    return(
          <canvas ref = {canvasRef} ></canvas>
    )
}

export default Board;



