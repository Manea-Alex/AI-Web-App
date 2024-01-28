// Loading component used to indicate that an action is still going on
import Image from "next/image"

export const Loading = () => {
    return (
        <div className="h-full flex flex-col gap-y-4 items-center justify-center">

            {/* Spinning animation with the logo */}
           <div className="w-10 h-10 relative animate-spin">
                <Image 
                    alt="logo"
                    fill
                    src="/logo.png" />
           </div>
            {/* Text indicating that the system is processing */}
           <p className="text-sm text-muted-foreground">
                Genius is thinking
           </p>
        </div>
    )
}