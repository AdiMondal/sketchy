import { MENU_ITEMS } from "@/src/constants";
import { useEffect, useRef } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { menuItemClick, actionItemClick } from '@/src/slice/menuSlice'


const Board = () => {
    const dispatch = useDispatch()
    const canvasRef = useRef(null)
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
       }

       canvas.addEventListener('mousedown', handleMouseDown)
       canvas.addEventListener('mousemove', handleMouseMove)
       canvas.addEventListener('mouseup', handleMouseUp)
      
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


