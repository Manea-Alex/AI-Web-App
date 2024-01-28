"use client"

// Import necessary modules and components
import axios from "axios"
import { Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import toast from "react-hot-toast"


// Interface for props passed to the component
interface SubscriptionButtonProps {
    isPro: boolean
}

export const SubscriptionButton = ({
    isPro = false
}: SubscriptionButtonProps) =>{

    const [loading, setLoading] = useState(false)

    // Function to handle button click
    const onClick = async () => {

        
        try{
            setLoading(true)

            // Request to Stripe API route
            const response = await axios.get("/api/stripe")

            // Redirect to the URL received from the Stripe API response
            window.location.href = response.data.url

        // Handle error message
        } catch (error) {
            toast.error("Something went wrong")
            console.log("BILLING_ERROR", error)
        } finally{
            setLoading(false)
        }

    }

    // Return the button component with dynamic text and action based on the subscription status
    return (
        <Button disabled = {loading} variant={isPro ? "default" : "premium"} onClick={onClick}>
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
        </Button>

    )


}