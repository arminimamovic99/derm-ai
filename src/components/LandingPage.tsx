import Link from "next/link";
import { Button } from "./ui/button";

export default function LandingPage() {
    return (
        <div className="p-8 w-full h-[100%] mx-auto space-y-10 relative bg-[#2a2420]">

        <div className="absolute -top-28 -left-28 w-[500px] h-[500px] rounded-full bg-[#62554a] opacity-30 blur-2xl z-1 animate-float1 pointer-events-none"></div>
        <div className="absolute top-100 left-90 w-[500px] h-[500px] skew-10 rounded-2xl bg-[#62554a] opacity-30 blur-2xl animate-float2  z-1 pointer-events-none"></div>
        <div className="absolute top-30 right-40 w-[500px] h-[500px] rounded-xl skew-20 bg-[#62554a] opacity-20 blur-2xl animate-float1 z-1 pointer-events-none"></div>
        <div className="absolute bottom-0 right-70 w-[400px] h-[400px] rounded-full bg-[#62554a] opacity-20 blur-2xl animate-float2 z-1 pointer-events-none"></div>

            <div className="flex-col sm:flex sm:!flex-row sm:!gap-4 py-10 px-24 justify-center gap-10 mt-16 items-center text-white relative z-10">
                <div className="flex-col w-[50%] gap-6">
                    <h1 className="text-6xl font-semibold">
                        AI powered skincare. <br />
                        Tailor-made for you.
                    </h1>
                    <h3 className="mt-6 text-xl">Understand your skin like a dermatologist — instantly, visually, and personally.</h3>
                    <Button className="mt-6 font-semibold bg-[#BEB7A4] text-xl rounded-xl p-5 shadow-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                        <Link href="/auth/login">Get started</Link>
                    </Button>
                </div>

                <img src="/skincare.jpg" className="rounded-l-4xl rounded-r-md w-[33rem] h-[33rem] object-cover shadow-lg" alt="" />
            </div>
        </div>
    )
}