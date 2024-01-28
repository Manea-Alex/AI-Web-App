"use client"

import { useEffect, useState } from "react"
import { ProModal } from "@/components/pro-modal"

//manageS modal rendering on the client side
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true)
    }, [])

    // Return null if not mounted to avoid server-side rendering
    if(!isMounted){
        return null
    }

     // Render the ProModal component
    return (

        <>
            <ProModal />
        </>
    )
}