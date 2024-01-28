import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

import MobileSidebar from "./mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const Navbar = async () => {

    // Fetch API limit and subscription status
    const apiLimitCount = await getApiLimitCount()
    const isPro = await checkSubscription()

    // Render the Navbar with responsive design
    return ( <div className="flex items-center p-4">

              <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount}/>
                <div className="flex w-full justify-end">

                  <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
     );
}
 
export default Navbar