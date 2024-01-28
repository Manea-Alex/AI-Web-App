// Importing components for the landing page
import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navbar";

// assembling the landing page
const LandingPage = () => {
    return ( 
        <div className="h-full">
            <LandingNavbar />
            <LandingHero />      
        </div>
    );
}
 
export default LandingPage;