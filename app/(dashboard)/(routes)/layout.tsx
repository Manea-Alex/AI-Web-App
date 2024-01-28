// Importing necessary components and utility functions
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// DashboardLayout component wraps around the main content of the dashboard pages
const DashboardLayout = async({
    children // React children prop to render nested components
} :{
    children: React.ReactNode
 }) => {

    // Fetching the current API limit count for the user and checking if he has a pro subscription
    const apiLimitCount = await getApiLimitCount()
    const isPro = await checkSubscription()

    // Rendering the layout with Sidebar, Navbar, and main content
    return ( 
        <div className="h-full relative">
             {/* Sidebar for navigation, passed with API limit and subscription status */}
            <div className="hidden h-full md:flex
            md:w-72 md:flex-col md:fixed md:inset-y-0
               bg-gray-900">
              <Sidebar apiLimitCount={apiLimitCount} isPro={isPro}/>
             </div>
              {/* Main content area with Navbar and children components */}
                <main className="md:pl-72">
                        <Navbar/>
                        {children}
                </main>

          
        </div>
     );
}
 
export default DashboardLayout;