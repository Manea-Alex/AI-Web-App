// Import necessary modules
import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {

     // Retrieve the raw body and Stripe signature from the request
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    try{
        // Construct the event using Stripe library to validate the webhook
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!

        )
    } catch (error: any){
        // Return a 400 response for any webhook errors
        return new NextResponse(`Webhooks Error: ${error.message}`, {status: 400})
    }

    // Extract the session information from the event data
    const session = event.data.object as Stripe.Checkout.Session

     // Handle 'checkout.session.completed'
    if(event.type === "checkout.session.completed"){
         // Retrieve the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )
     // Check if user ID metadata is present
    if (!session?.metadata?.userId){
        return new NextResponse("User id is required", {status:400})
    }

    // Create a new subscription record in the database
    await prismadb.userSubscription.create({
        data: {
            userId: session?.metadata?.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
            )

        }
    })

    }
    // Handle 'invoice.payment_succeeded' event type
    if (event.type === "invoice.payment_succeeded"){
       const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        // Update the subscription in the database
        await prismadb.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }

        })
    }

    // Return a 200 response indicating successful handling of the webhook
    return new NextResponse(null, {status: 200})

}