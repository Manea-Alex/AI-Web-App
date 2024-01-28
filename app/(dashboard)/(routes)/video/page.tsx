"use client"

// Used for making HTTP requests to external APIs
import axios from "axios";
// zod: A schema validation library to validate  data structures
import * as z from "zod"
import { VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form"

// Custom UI components: Heading for page titles, UserAvatar and BotAvatar for user and bot representations in chats,
// Empty for empty state messages, and Loading for indicating loading states.
import Heading from "@/components/heading";
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
import { useState } from "react";

// custom hook for managing the modal related to the pro features of the app.
import { useProModal } from "@/hooks/use-pro-modal";

// used for user feedback like success or error messages.
import toast from "react-hot-toast";

const VideoPage = () => {
    // Hook for modal and routing
    const proModal = useProModal()
    const router = useRouter()

    // State for managing the videos in the conversation
    const [video, setVideo] = useState<string>()

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
          setVideo(undefined)

          const response = await axios.post("/api/video", values)

          setVideo(response.data[0])

          form.reset()


        } catch (error: any){
             if(error?.response?.status === 403){
                proModal.onOpen()
           }else {
             toast.error("Something went wrong")
           }
        } finally{
            router.refresh()
        }
        
    }

    // Rendering the video page
    return ( 
        <div>
           <Heading
            title = "Video Generation"
            description = "Turn your prompt into video"
            icon = { VideoIcon}
            iconColor = "text-orange-700"
            bgColor = "bg-orange-700/10 "
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
                                            placeholder="Clown fish swimming around a coral reef"
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
                    {!video && !isLoading && (
                        <Empty label=" No video generated"/>
                    )}
                       {/* Render the videos */}
                   {video && !isLoading && (
                        <video className="w-full aspect-video mt-8 rounded-lg border bg-black" controls>
                            <source src={video} />
                        </video>
                   )}
                </div>
            </div>
        </div>
     );
}
 
export default VideoPage;