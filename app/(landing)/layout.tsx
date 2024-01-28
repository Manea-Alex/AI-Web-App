// LandingLayout component to wrap the landing page content
const LandingLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    
//Renders the children components inside the layout 
    return ( 
        <main className="h-full bg-[#111827] overflow-auto">
            <div className="mx-auto max-w-screen-xl h-full w-full">
                {children}
            </div>

        </main>
     );
}
 
export default LandingLayout;