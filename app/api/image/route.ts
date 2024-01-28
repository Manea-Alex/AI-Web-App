import  OpenAI  from "openai";

// import { Request } from "openai/_shims/auto/types";
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs";

// Configuration for OpenAI API with environment variable
import { Configuration, OpenAIApi } from "openai";

// Functions that check the subscription and if the free tier has been consumed
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Configuration for OpenAI API with environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initializing OpenAI API with the configuration
const openai = new OpenAIApi(configuration);

export async function POST(
    req: Request
) {
 try{
   // Authenticate and retrieve the user ID
    const {userId} = auth()
    const body = await req.json()

   // Destructuring prompt, amount, and resolution from the request body
    const { prompt, amount = 1, resolution = "512x512" } = body

    // Check for user authentication
    if( !userId)
    {
        return new NextResponse("Unauthorized", {status: 401})
    }

     // Check if OpenAI API key is configured
    if(!configuration.apiKey)
    {
        return new NextResponse("Open API key not configured", {status: 500})

    }

     // Validate if the prompt, amount and resolution are provided
    if(!prompt){
          return new NextResponse("Prompt is required", {status: 400})
    }

    if(!amount){
          return new NextResponse("Amount is required", {status: 400})
    }
    if(!resolution){
          return new NextResponse("Resolution is required", {status: 400})
    }

    // Check for free trial or subscription status
    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro)
      {
        return new NextResponse( "Free trial has expired", {status: 403})
      }


    // Using OpenAI's image generation API
    const response = await openai.createImage({
     prompt,
     n: parseInt(amount, 10),
     size: resolution
    });

     // Update API limit if the user is not a Pro subscriber
    if(!isPro)
    {
      await increaseApiLimit()

    }

    // Return the OpenAI response
    return NextResponse.json(response.data.data);

 } catch (error) {
    console.log("[IMAGE_ERROR]", error)
    return new NextResponse("Internal error", {status: 500})
 }

}