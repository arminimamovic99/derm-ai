'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "./ui/card";
import { RecommendedAmazonProduct } from "@/type";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface ProductsSectionProps {
    products: RecommendedAmazonProduct[]
}
export const ProductsSection = ({products}: ProductsSectionProps) => {

    const goToProduct = (url: string) => {
        window.open(url, '_blank');
    }

    return (
        <div className="self-start">
            <div className="flex gap-2 items-center">
                <h2 className='text-2xl mb-3 font-semibold'>Recommended products</h2>
            </div>
            <Alert className="mb-3  bg-[#dbd8cd]">
                <AlertTitle>
                    <div className="flex items-center gap-2">
                        <Info/>
                        AI-powered skincare shopping list 💫
                    </div>
                </AlertTitle>
                <AlertDescription>
                        We picked these just for you, using your photo and quiz results.
                        They target your skin’s top priorities — hydration, smoothness, and clarity.
                </AlertDescription>
            </Alert>

            <div className="w-full max-w-full overflow-hidden">
                <Carousel>
                    <CarouselContent className="rounded-xl">
                        {
                            products.map((p, i) => (
                                <CarouselItem key={i} className="rounded-xl shadow-lg">
                                    <Card className="rounded-xl shadow-lg hover:opacity-70 border-none cursor-pointer" onClick={() => goToProduct(p.url)}>
                                        <CardHeader className="!p-0 mb-0 border-none">
                                            <img src={p.image} alt="" className="w-full h-[350px] object-cover rounded-lg border-none" />
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-center p-10 border bg-[#eeede6]">
                                            <div className="flex gap-3 flex-col items-center justify-center">
                                                <p className="max-w-[300px] truncate"> {p.name} </p>
                                                <p className="text-xl font-semibold"> {p.price} </p>
                                            </div>

                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                    <div className="flex justify-center gap-3 mt-3">
                        <CarouselPrevious className="relative static translate-y-0" />
                        <CarouselNext className="relative static translate-y-0" />
                    </div>
                </Carousel>
            </div>

            {/* <div className="border rounded-xl bg-[#eeede6] p-6 flex flex-col gap-2 h-full">
                {
                    products.map((product) => (
                        <span className="font-semibold"> {product} </span>
                    ))
                }
            </div> */}
        </div>
    )
}