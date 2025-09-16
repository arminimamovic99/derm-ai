import { Button } from "./ui/button";

export default function LandingPage() {
    return (
        <div className="p-8 w-full h-[100vh] mx-auto space-y-10">
            <div className="flex-col sm:flex sm:!flex-row sm:!gap-6 p-10 justify-center gap-10 mt-24 items-center">
                <div className="flex-col w-[50%] gap-6">
                    <h1 className="text-6xl font-semibold">
                        AI powered skincare. <br />
                        Tailor-made for you.
                    </h1>
                    <h3 className="mt-6 text-xl">Unlock a personalized skincare plan from a single photo and a few questions.</h3>
                    <Button className="mt-6 bg-[#BEB7A4] text-[#FFFFFC] text-xl shadow-md">
                        <a href="auth/login">Get started</a>
                    </Button>
                </div>

                <img src="/landing2.jpg" className="rounded-l-4xl rounded-r-md w-96 h-96 object-cover" alt="" />
            </div>
        </div>
    )
}