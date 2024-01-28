import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs";

import Replicate from "replicate"

// Functions that check the subscription and if the free tier has been consumed
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Configuration for Replicate AI with environment variable
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})

export async function POST(
    req: Request
) {
 try{
     // Authenticate and retrieve the user ID
    const {userId} = auth()

    // Parse the request body
    const body = await req.json()
    const { prompt } = body

    // Check for user authentication
    if( !userId)
    {
        return new NextResponse("Unauthorized", {status: 401})
    }

    // Validate if the prompt is provided
    if(!prompt){
          return new NextResponse("Prompt is required", {status: 400})
    }

    // Check for free trial or subscription status
    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro)
      {
        return new NextResponse( "Free trial has expired", {status: 403})
      }

   // Using the Replicate AI audio generation API to get a response   
   const response = await replicate.run(
    "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    {
      input: {
        prompt: prompt
      }
    }
  );

  // Update API limit if the user is not a Pro subscriber
  if(!isPro){

    await increaseApiLimit()
  }
   // Return the Replicate AI response
   return NextResponse.json(response);

 } catch (error) {
    console.log("[VIDEO_ERROR]", error)
    return new NextResponse("Internal error", {status: 500})
 }

}