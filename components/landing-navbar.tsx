"use client"

// Importing necessary modules and components
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Custom font configuration for the navbar
const font =Montserrat({
    weight: "600",
    subsets: ["latin"]
})

// LandingNavbar component for the top navigation bar
export const LandingNavbar = () => {

    // Authentication check
    const { isSignedIn } = useAuth()

    return (

        <nav className="p-4 bg-transparent flex items-center
        justify-between">
             {/* Logo and application name */}
            <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-4">
                    <Image
                        fill
                        alt = "Logo"
                        src="/logo.png"
                    />
                </div>
                <h1 className={cn("text-2xl font-bold text-white",
                    font.className)}>
                    Genius
                </h1>
            
            </Link>
             {/* Get started button which will redirect you either to dashboard or sign-up depending if you're logged in or not*/}
            <div className="flex items-center gap-x-2">
                <Link href = {isSignedIn ? "/dashboard" : "/sign-up"} >
                    <Button variant="outline" className="rounded-full">
                        Get started
                    </Button>

                </Link>

            </div>

        </nav>
    )
}