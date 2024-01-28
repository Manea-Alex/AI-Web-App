
// Import required modules and utilities
import { auth, currentUser} from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"

// Create an absolute URL for the settings page
const settingsUrl = absoluteUrl("/settings")

export async function GET() {
    try{
         // Authenticate the user and get their details
        const {userId} = auth()
        const user = await currentUser()

        // If the user or user ID is not available, respond with an Unauthorized error
        if(!userId || !user){
            return new NextResponse("Unauthorized", {status: 401})
        }

        // Retrieve the user's subscription details from the database
        const userSubscrption = await prismadb.userSubscription.findUnique({
            where: {
                userId
            }
        })

        // If a Stripe customer ID exists, create a billing portal session
        if (userSubscrption && userSubscrption.stripeCustomerId)
        {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscrption.stripeCustomerId,
                return_url: settingsUrl
            })

             // Return the URL to redirect the user to the Stripe billing portal
            return new NextResponse(JSON.stringify({url: stripeSession.url }))
        }

        // If no subscription exists, create a new Stripe checkout session
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data:{
                        currency: "USD",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited AI Generations"
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"

                        }
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId
            }
        })

         // Return the URL to redirect the user to the Stripe checkout page
        return new NextResponse(JSON.stringify ({ url: stripeSession.url}))

    } catch(error)
    {
        console.log("[STRIPE_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500})
    }
}