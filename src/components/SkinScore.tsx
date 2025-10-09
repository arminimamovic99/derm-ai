"use client"
import { Info } from 'lucide-react';
import { SkinSubScores, SubScoreExplanations  } from '../type';
import { CircularProgress } from './CircularProgress';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface SkinScoreProps {
    score: number;
    subscores: SkinSubScores;
    scoreExplanation: string;
    subscoreExplanations: SubScoreExplanations;
    image?: string;
  }
export const SkinScore = ({score, subscores, scoreExplanation, subscoreExplanations, image}: SkinScoreProps) => {
    const getColorBasedOnValue = (value: number) => {
        if (value > 0 && value <= 50) {
            return '#F54927';
        }
        if (value > 50 &&  value <= 75) {
            return '#ECF000';
        }
        if (value > 75) {
            return '#4FA32F';
        }
    }

    const getColorClassBasedOnValue = (value: number) => {
        if (value > 0 && value <= 50) return 'stroke-[#F54927]';
        if (value > 50 && value <= 75) return 'stroke-[#EBE83F]';
        if (value > 75) return 'stroke-[#4FA32F]';
        return 'stroke-gray-300';
      };
    
    const circularProgressLabelClass = `text-3xl font-semibold text-[${getColorBasedOnValue(score)}]`;
    return (
        <div className="w-full">
            <h2 className='text-2xl mb-3 font-semibold'>Your skin health statistics</h2>
            <div className="border border-2 rounded-lg p-6 gap-3 bg-[#f8f7f4]">
                <Alert className="mb-4 bg-[#dbd8cd] mb-6">
                  <AlertTitle className="font-semibold text-lg"> 🛎️ Quick heads up </AlertTitle>
                  <AlertDescription className="text-lg mt-2">
                    Your skin scores are calculated by AI analysis of your photo and questionnaire, 
                    measuring key factors like hydration, acne, redness, texture, 
                    and wrinkles to give an overall skin health score from 0 to 100.
                  </AlertDescription>
                </Alert>
                <div className="flex flex-col flex-wrap gap-5 justify-center items-center md:flex-row px-2 md:px-10 md:justify-between">
                    {
                        image ?
                        <img src={image} className="w-[300px] h-[400px] object-cover rounded-xl shadow-lg" alt="" /> :
                        ''
                    }
                    <div className="self-start">
                        <div className="flex items-center gap-3">
                            <Popover>
                                <PopoverTrigger>
                                    <Info className="cursor-pointer"/>
                                </PopoverTrigger>
                                <PopoverContent>
                                    {scoreExplanation}
                                </PopoverContent>
                            </Popover>
                            <h3>Total score:</h3>
                        </div>
                        <div className="w-[55%] flex">
                            <CircularProgress
                                value={score}
                                size={350}
                                strokeWidth={40}
                                showLabel
                                labelClassName={circularProgressLabelClass}
                                progressClassName="stroke-[#9b8d74]"
                                className="stroke-gray-300 shadow-lg"
                            />
                        </div>
                    </div>
                    <div className="flex-col self-start">
                        <h3 className='text-md'>Individual category scores:</h3>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(subscores).map(([key, value], i) => (
                            <div key={key} className="flex items-center gap-2 text-lg p-3 rounded-2xl my-2 bg-[#dbd8cd] shadow-lg">
                                <Popover>
                                    <PopoverTrigger>
                                        <Info className="cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent> {Object.entries(subscoreExplanations).filter(([k, v]) => k === key).map(([key, value]) => value)} </PopoverContent>
                                </Popover>
                                <span className="capitalize">{key}: </span>
                                <span className="font-semibold" style={{ color: getColorBasedOnValue(value) }}>{value}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}