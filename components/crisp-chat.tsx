"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
    useEffect(() =>{
        Crisp.configure("3e1f180f-0085-47d9-bd9e-ee971771e862")
    }, [])

    return null
}