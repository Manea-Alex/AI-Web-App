"use client"

//Shadcn components
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useProModal } from "@/hooks/use-pro-modal"

// Lucide React icons
import { 
  MessageSquare,
  Music, 
  ImageIcon,
  VideoIcon,
  Code,
  Check,
  Zap} from "lucide-react"
import { cn } from "@/lib/utils"

// Used for making HTTP requests to external APIs
import axios from "axios"
import { useState } from "react"

// used for user feedback like success or error messages.
import toast from "react-hot-toast"

//tools to display in the modal
const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",

  },
   {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  
  },
   {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",

  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
 
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    
  },
  
]

export const ProModal = () => {

    const proModal = useProModal()

    const [loading, setLoading] = useState(false)

    // Function to handle the subscription process
    const onSubscribe = async() =>{
      try{
          setLoading(true)
          const response = axios.get("/api/stripe") // Request subscription URL
          window.location.href = (await response).data.url // Redirect to payment page

      } catch (error)
      {
        toast.error("Something went wrong")
      }finally{
        setLoading(false)
      }

    }
    // Render the modal with its content
    return(
       <Dialog open={proModal.isOpen}  onOpenChange={proModal.onClose}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center
                    flex-col gap-y-4 pb-2">
                       { /* Modal title and upgrade badge */ } 
                        <div className="flex items-center gap-x-2 font-bold py-1">
                        Upgrade to Genius
                        <Badge variant="premium" className="uppercase text-sm py-1">
                            pro
                        </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                        { /* List of tools available in Pro subscription*/ } 
                        {tools.map((tool) =>(
                            <Card  
                              key={tool.label}
                              className="p-3 border-black/5 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-x-4">

                                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                        <tool.icon className={cn("w-6 h-6", tool.color)} />

                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                </div>
                                <Check className="text-primary w-5 h-5" />
                            </Card>
                        ))}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button 
                        disabled={loading}
                        onClick={onSubscribe}
                        size="lg"
                        variant="premium"
                        className="w-full"
                        >
                        Upgrade
                        <Zap className = "w-4 h-4 ml-2 fill-white" />
                    </Button>
                </DialogFooter>
            </DialogContent>
       </Dialog>
    )
}