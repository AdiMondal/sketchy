import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from '@/src/slice/menuSlice'

export const store = configureStore({
    reducer: {
        menu: MenuReducer
    }
})
