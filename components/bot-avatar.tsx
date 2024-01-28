
// BotAvatar component for displaying a default avatar for the bot
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"

export const BotAvatar = () => {
    return (
        <Avatar className="h-8 w-8">

            {/* Static image used for the bot avatar */}
            <AvatarImage className="p-1" src = "/logo.png" />
        </Avatar>
    )
}