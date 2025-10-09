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
import LandingPage from "@/components/LandingPage";
import Link from "next/link";

import { User } from "@auth0/nextjs-auth0/types";

export default async function Home() {
 // const { setUser } = useUser();

  const session = await auth0.getSession();
  if (!session) { 
    return (
      <main className="bg-[#2a2420] h-[100vh]">
        <nav className="w-full px-36 py-4 flex items-center justify-between sticky top-0 bg-transparent z-50">
          <Link href="/" className="text-3xl font-bold text-[#eeede6]">
            Derm.AI
          </Link>

          <Button asChild className="mt-6 font-semibold bg-[#BEB7A4] text-lg rounded-xl p-5 shadow-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
            <Link href="/auth/login">Get started</Link>
          </Button>
        </nav>
        <LandingPage></LandingPage>
        {/* <div className="w-full h-[100vh] flex !flex-col gap-6 items-center justify-center">
        <h1 className="font-semibold text-black text-6xl"> AI Powered Skincare. </h1>
        <a href="/auth/login" className="rounded-lg bg-[#41EAD4] p-3 text-white font-semibold shadow-md">Login and get started</a>
        </div> */}
      </main>
    )
  }

 // setUser(session.user);
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
        <Button className="bg-[#BEB7A4] text-[#FFFFFC]">
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