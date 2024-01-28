// Utilities import for conditional classname 
import { cn } from "@/lib/utils";

// Importing LucideIcon type from lucide-react for icon props
import { LucideIcon } from "lucide-react";

// Defining the props interface for the Heading component
interface HeadingProps {
    title: string,
    description: string,
    icon: LucideIcon,
    iconColor?: string,
    bgColor?: string,
}

// The Heading component, which accepts props
const Heading = ({
    title,
    description,
    icon: Icon,
    iconColor,
    bgColor
}: HeadingProps) => {
    return (  
        // The main container for the heading.
         <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">

             {/* Container for the icon, applying conditional styling for background color  */}
            <div className={cn("p-2 w-fit rounded-md", bgColor)}>

             {/* Icon component with conditional styling for icon color  */}
                <Icon className={cn("w-10 h-10", iconColor)} />

            </div>
            {/* Container for the title and description text  */}
            <div>
                <h2 className="text-3xl fon-bold">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
         </div>
        
    );
}
 
export default Heading;