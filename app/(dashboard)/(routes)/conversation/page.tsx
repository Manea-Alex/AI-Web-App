"use client"

// Used for making HTTP requests to external APIs
import axios from "axios";

// zod: A schema validation library to validate  data structures
import * as z from "zod";

import { MessageSquare } from "lucide-react";

// Custom UI components: Heading for page titles, UserAvatar and BotAvatar for user and bot representations in chats,
// Empty for empty state messages, and Loading for indicating loading states.
import Heading from "@/components/heading"
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";

// Schema for form validation using zod
import { formSchema } from "./constants";

import { useRouter } from "next/navigation"

// Using zod to create our schema and validation
import { zodResolver } from "@hookform/resolvers/zod";

//Shadcn components and packages
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form"

import { useState } from "react";

// interface from the OpenAI package used to define the structure of chat messages
import  {ChatCompletionRequestMessage}  from "openai"
import { cn } from "@/lib/utils";

// custom hook for managing the modal related to the pro features of the app.
import { useProModal } from "@/hooks/use-pro-modal";

// used for user feedback like success or error messages.
import toast from "react-hot-toast";


const ConversationPage = () => {

    // Hook for modal and routing
    const proModal = useProModal()
    const router = useRouter()

     // State for managing messages in the conversation
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])

    // Setup form with react-hook-form and zod for validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

     // Flag for submission state
    const isLoading = form.formState.isSubmitting

    // Handling form submission
    const onSubmit = async ( values:z.infer<typeof formSchema>) =>{
        try{
           const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };

           const newMessages = [...messages, userMessage]

           const response = await axios.post("/api/conversation", {
            messages: newMessages
          })

          setMessages((current) => [...current, userMessage, response.data])

          form.reset()

        } catch (error: any){
           if(error?.response?.status === 403){
                proModal.onOpen()
           } else {
             toast.error("Something went wrong")
           }
        } finally{
            router.refresh()
        }   
    }
    // Rendering the conversation page
    return ( 
        <div>
           <Heading
            title = "Conversation"
            description = "Our most advanced conversation model."
            icon = { MessageSquare}
            iconColor = "text-violet-500"
            bgColor = "bg-violet-500/10 "
             />
            <div className="px-4 lg:px-8">

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            
                            <FormField 
                                 name = "prompt"
                                 render={({field}) =>(
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                          <Input
                                            className="border-0 outline-none
                                            focus-visible:ring-0
                                            focus-visible:ring-transparent"
                                            disabled ={isLoading}
                                            placeholder="How do I calculate the radius of a circle"
                                            {...field}
                                            />
                                      </FormControl>
                                    </FormItem>
                                 )}/>
                                 <Button className = "col-span-12 lg:col-span-2 w-full"
                                    disabled={isLoading}>
                                    Generate
                                    </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                     {/* Display a loading indicator when a request is in progress */}
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center
                            justify-center bg-muted">
                                <Loading/>
                        </div>
                    )}

                     {/* Display a message if no conversation has started yet */}
                    {messages.length === 0 && !isLoading && (
                        <Empty label=" No conversation started"/>
                    )}

                     {/* Render the conversation messages */}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message)=>(
                            <div key = {message.content}
                             className={cn(
                                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                             )}
                            >
                                 {/* Display user or bot avatar depending on the message role */}
                                {message.role === "user" ? <UserAvatar/> : 
                                <BotAvatar /> }

                                <p className="text-sm">

                                     {message.content}
                                </p>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default ConversationPage;