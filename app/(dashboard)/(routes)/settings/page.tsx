
// Import required components and utilities
import Heading from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";

import { Settings } from "lucide-react";

const  SettingPage = async() => {

    // Check if the user has an active Pro subscription
    const isPro = await checkSubscription()

    return (  
      <div>
        { /* Heading component with page details */ }
        <Heading 
          title="Settings"
          description="Manage account settings"
          icon={Settings}
          iconColor="text-gray-700"
          bgColor="bg-gray-700/10"
        />

        { /* Main content area with subscription status and action button */ }
        <div className="px-4 lg:px-8 space-y-4">
            <div className="text-muted-foreground text-sm">
                { /*  Display subscription status */ }
                {isPro ? "You are currently on a pro plan. " : "You are currently on a free plan."}
            </div>

             { /*  Subscription button component to manage or upgrade the subscription */ }
            <SubscriptionButton isPro={isPro}/>
        </div>
     </div>  
    );
}
 
export default SettingPage;