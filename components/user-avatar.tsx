
// UserAvatar component displays the avatar of the logged user
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"

export const UserAvatar = () => {
    // Hook to access the user's information
    const { user } = useUser() 

    return (
        <Avatar className="h-8 w-8">
            {/* Display user's profile image */}
            <AvatarImage src={user?.profileImageUrl} />

            {/* The case if no image is available */}
            <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
            </AvatarFallback>
        </Avatar>

    )
}