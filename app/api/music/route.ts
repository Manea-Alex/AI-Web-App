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
    "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
    {
      input: {
        prompt_a: prompt
      }
    }
  );

  // Update API limit if the user is not a Pro subscriber
  if(!isPro)
  {
    await increaseApiLimit()

  }
    // Return the Replicate AI response
    return NextResponse.json(response);

 } catch (error) {
    console.log("[MUSIC_ERROR]", error)
    return new NextResponse("Internal error", {status: 500})
 }

}