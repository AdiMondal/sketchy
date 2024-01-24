import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from '@/src/slice/menuSlice'
import ToolboxReducer from "@/src/slice/toolboxSlice";

export const store = configureStore({
    reducer: {
        menu: MenuReducer,
        toolbox: ToolboxReducer
    }
})


