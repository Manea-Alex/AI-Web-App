"use client"

// Used for making HTTP requests to the API
import axios from "axios";

// zod: A schema validation library to validate  data structures
import * as z from "zod"
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form"

// Custom UI components: Heading for page titles, UserAvatar and BotAvatar for user and bot representations in chats,
// Empty for empty state messages, and Loading for indicating loading states.
import Heading from "@/components/heading";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";

// Schema for form validation using zod as well as the array of objects used in the user interface
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { useRouter } from "next/navigation"

// Using zod to create the schema and validation
import { zodResolver } from "@hookform/resolvers/zod";

//Shadcn components and packages;
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

import { useState } from "react";
import Image from "next/image";

// custom hook for managing the modal related to the pro features of the app
import { useProModal } from "@/hooks/use-pro-modal";

// used for user feedback like success or error messages
import toast from "react-hot-toast";

const ImagePage = () => {

    // Hook for modal and routing
    const proModal = useProModal()
    const router = useRouter()

    // State for managing the images in the conversation
    const [images, setImages] =useState<string[]>([])
  
    // Setup form with react-hook-form and zod for validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    })

    // Flag for submission state
    const isLoading = form.formState.isSubmitting

    // Handling form submission
    const onSubmit = async ( values:z.infer<typeof formSchema>) =>{
        try{

          // Clearing existing images before making a new request  
          setImages([])
        
          // Sending a POST request to the server with form values
          const response = await axios.post("/api/image", values)
          
          // Extracting image URLs from the response and updating state
          const urls = response.data.map((image: {url: string}) => image.url)

          setImages(urls)

           // Resetting the form to its default values after submission
          form.reset()

          // Handling specific error scenarios
        } catch (error: any){
              if(error?.response?.status === 403){
                proModal.onOpen()
           }else {
             toast.error("Something went wrong")
           }
            console.log(error)
        } 
        finally{
            router.refresh()
        }
        
    }

    // Rendering the image page
    return ( 
        <div>
           <Heading
            title = "Image Generation"
            description = "Turn your prompt into an image."
            icon = {ImageIcon}
            iconColor = "text-pink-700"
            bgColor = "bg-pink-700/10 "
             />
            <div className="px-4 lg:px-8">

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            <FormField 
                                 name = "prompt"
                                 render={({field}) =>(
                                    <FormItem className="col-span-12 lg:col-span-6">
                                        <FormControl className="m-0 p-0">
                                          <Input
                                            className="border-0 outline-none
                                            focus-visible:ring-0
                                            focus-visible:ring-transparent"
                                            disabled ={isLoading}
                                            placeholder="A picture of a horse in Swiss alps"
                                            {...field}
                                            />
                                      </FormControl>
                                    </FormItem>
                                 )}/>

                                 {/* SELECT AMOUNT FIELD */}
                                 <FormField
                                    name = "amount"
                                    control = {form.control}
                                    render = {({field}) => (
                                        <FormItem className=" col-span-12 lg:col-span-2">
                                            <Select 
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                value = {field.value}
                                                defaultValue={field.value} >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            defaultValue={field.value}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {amountOptions.map((option)=>(                                                
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}>
                                                            
                                                              {option.label} 
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>

                                            </Select>
                                        </FormItem>
                                    )}
                                 />

                                {/* SELECT RESOLUTION FIELD */}  
                                 <FormField
                                    name = "resolution"
                                    control = {form.control}
                                    render = {({field}) => (
                                        <FormItem className=" col-span-12 lg:col-span-2">
                                            <Select 
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                value = {field.value}
                                                defaultValue={field.value} >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            defaultValue={field.value}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {resolutionOptions.map((option)=>(  
                                                        <SelectItem                                               
                                                            key={option.value}
                                                            value={option.value}>
                                                            
                                                              {option.value} 
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>

                                            </Select>
                                        </FormItem>
                                    )}
                                 />
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
                        <div className="p-20">
                                <Loading/>

                        </div>
                    )}
                    {/* Display a message if no conversation has started yet */}
                    {images.length === 0 && !isLoading && (
                        <Empty label=" No images generated"/>
                    )}
                    {/* Render the  images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                       {images.map((src) =>(
                        <Card
                          key={src}
                          className="rounded-lg overflow-hidden">
                            <div className="relative aspect-square">
                                <Image 
                                    alt="Image"
                                    fill
                                    src={src} /> 
                            </div>
                            <CardFooter className="p-2">
                                <Button
                                  onClick = {() => 
                                  window.open(src)
                                }
                                  variant = "secondary"
                                  className="w-full">
                                    <Download className="h-4 w-4 mr-2 "/>
                                        Download
                                </Button>
                            </CardFooter>

                        </Card>
                       ))}
                    </div>
                    
                </div>
            </div>
        </div>
     );
}
 
export default ImagePage;