import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button" 

import { auth0 } from "../../lib/auth0";

export default async function Home() {

  const session = await auth0.getSession();
  if (!session) { 
    return (
      <main>
        <div className="w-full h-[100vh] flex !flex-col gap-6 items-center justify-center">
        <h1 className="font-semibold text-black text-6xl"> AI Powered Skincare. </h1>
        <a href="/auth/login" className="rounded-lg bg-[#6a80c1] p-3 text-white font-semibold shadow-md">Login and get started</a>
        </div>
      </main>
    )

  }
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuContent>
              <NavigationMenuLink>
                <a href="/auth/logout">Log out</a>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    <main>
      <div className="w-full h-[100vh] flex !flex-col gap-6 items-center justify-center">
        <h1 className="font-semibold text-black text-3xl">Welcome, {session.user.name}!</h1>
        <Button className="bg-[#6a80c1]">
          <a href="/analysis">
            Start skin analysis
          </a>
          </Button>
      </div>
      {/* <a href="/auth/logout">Log out</a> */}
    </main>
    </div>
  );
}