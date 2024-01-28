"use client"

// Importing necessary hooks and components
import { useEffect, useState } from "react"
import { MAX_FREE_COUNTS } from "@/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { useProModal } from "@/hooks/use-pro-modal"

// Interface for the FreeCounter props
interface FreeCounterProps{

    apiLimitCount: number
    isPro: boolean
        
}

// FreeCounter component displays the user's API usage and upgrade button
export const FreeCounter = ({
    apiLimitCount = 0,
    isPro = false
}: FreeCounterProps) => {
    const proModal = useProModal()

    // State to manage component mounting and setting the state when the component is mounted with useEffect
    const [mounted, setMounted] = useState(false)

    useEffect(() =>{
        setMounted(true)
    }, [])

    // Return nothing if not mounted or user is Pro subscriber
    if(!mounted)
    {
        return null
    }

    if(isPro){
        return null
    }

    // Component content for free tier users
    return (
        <div className="px-3">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6">
                    {/* Displaying API usage and progress bar */}
                    <div className="text-center text-sm text-white mb-4 
                    space-y-2">
                        <p>
                            {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
                        </p>
                        <Progress
                            className="h-3"
                            value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />

                    </div>
                     {/* Button to trigger Pro subscription modal */}
                    <Button onClick={proModal.onOpen} variant="premium" className="w-full">
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}