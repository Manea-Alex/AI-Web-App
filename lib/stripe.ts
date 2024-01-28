// Importing the Stripe module
import Stripe from "stripe"

// Creating a new Stripe instance
export const stripe = new Stripe(process.env.STRIPE_API_KEY || "", {
    // @ts-ignore
    apiVersion: "2022-11-15", 
    typescript: true
})