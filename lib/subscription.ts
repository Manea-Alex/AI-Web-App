import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";

// Define a constant for a day in milliseconds
const DAY_IN_MS = 86_400_000

export const checkSubscription = async()  =>{

     // Retrieve the current user's ID
    const {userId} = auth()

    if(!userId){
        return false
    }

    // Retrieve the user's subscription details from the database
    const userSubscription = await prismadb.userSubscription.findUnique({
        where: {
            userId: userId
        },

        // Select specific fields related to the subscription
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true
        }
    })

      // Return false if no subscription is found for the user
    if(!userSubscription){
        return false
    }

    // Check if the subscription is valid and not expired
    const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid
}