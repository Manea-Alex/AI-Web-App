// Empty component displays a placeholder when there are no items
import Image from "next/image";

// defining a orop for the message to be displayed
interface EmptyProps {
    label:string
}

export const Empty = ({
    label
}: EmptyProps) => {
    return ( 
        <div className="h-full p-20 flex flex-col items-center
                justify-center">

            {/* Placeholder image */}
            <div className="relative h-72 w-72">
                <Image
                    alt= "Empty"
                    fill
                    src = "/empty.png"
                 />
            </div>
            {/* Custom message displayed below the image */}
            <p className="text-muted-foreground text-sm text-center">
                {label}
            </p>
        </div>
     );
}
 
