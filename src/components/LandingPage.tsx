import Link from "next/link";
import { Button } from "./ui/button";

export default function LandingPage() {
    return (
        <div className="p-8 w-full h-[100%] mx-auto space-y-10 relative bg-white">

        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-28 -left-28 w-[500px] h-[500px] rounded-full bg-[#beb7a4] opacity-30 blur-2xl  animate-float1 pointer-events-none"></div>
            <div className="absolute top-100 left-90 w-[500px] h-[500px] skew-10 rounded-2xl bg-[#beb7a4] opacity-30 blur-2xl animate-float2  pointer-events-none"></div>
            <div className="absolute top-30 right-40 w-[500px] h-[500px] rounded-xl skew-20 bg-[#beb7a4] opacity-20 blur-2xl animate-float1  pointer-events-none"></div>
            <div className="absolute bottom-0 right-70 w-[400px] h-[400px] rounded-full bg-[#beb7a4] opacity-20 blur-2xl animate-float2  pointer-events-none"></div>
        </div>

            <div className="flex flex-col sm:flex sm:!flex-row sm:!gap-4 py-10 px-24 gap-10 mt-16 mb-48 text-[#50473e] relative z-10">
                <div className="flex flex-col w-full gap-3 justify-center items-center self-center">
                    <h1 className="text-6xl font-semibold">
                        AI powered <span className="text-black"> skincare</span>. <br />
                        Tailor-made for <span className="text-black">you</span>.
                    </h1>
                    <h3 className="mt-2 text-xl">Understand your skin like a dermatologist — instantly, visually, and personally.</h3>
                    <div className="flex items-center gap-3 mt-2">
                        <Button className="font-semibold bg-black text-xl text-[#dbd8cd] rounded-xl p-5 shadow-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                            <Link href="/auth/login">Get started</Link>
                        </Button>
                        <Button className="font-semibold bg-white text-xl cursor-pointer p-5 text-black rounded-xl border border-black shadow-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-white">
                            <Link href="/">
                                Find a price
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-col sm:flex sm:!flex-row sm:!justify-between items-center mt-16 py-10 px-48">
                <div className="w-[40%]">
                    <h1 className="text-5xl">
                        Your skin health. Quantified. Tangible. Clear.
                    </h1>
                </div>
                <img src="/app_sc1.png" alt="" className="w-[40rem] object-cover shadow-xl rounded-lg" />
            </div>

            <div className="flex-col sm:flex sm:!flex-row sm:!justify-between items-center mt-36 py-10 px-48">
                <img src="/app_sc3.png" alt="" className="w-[40rem] object-cover shadow-xl rounded-lg" />

                <div className="w-[40%]">
                    <h1 className="text-5xl">
                        Clear, daily tasks, focused on your goals.
                    </h1>
                </div>
            </div>
        </div>
    )
}