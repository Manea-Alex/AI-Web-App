import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs";

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

    // Parse the request body
    const body = await req.json()
    const { messages } = body

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

    // Validate if messages are provided
    if(!messages){
          return new NextResponse("Messages are required", {status: 400})
    }

    // Check for free trial or subscription status
    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro)
      {
        return new NextResponse( "Free trial has expired", {status: 403})
      }

     // Using OpenAI's chat completion API
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });

     // Update API limit if the user is not a Pro subscriber
    if(!isPro)
    {
      await increaseApiLimit()
    }

     // Return the OpenAI response
    return NextResponse.json(response.data.choices[0].message);

 } catch (error) {
    console.log("[CONVERSATION_ERROR]", error)
    return new NextResponse("Internal error", {status: 500})
 }

}