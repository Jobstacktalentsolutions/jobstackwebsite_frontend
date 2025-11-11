// components/JobCard.tsx
import { FC } from "react";
import Image from 'next/image'
import {  Clock } from "lucide-react";
import greenverifed from '@/app/assets/greenverified.svg'

interface JobCardProps {
    location: string;
    verified?: boolean;
    timePosted: string;
    title: string;
    description: string;
    workType: string;
    schedule: string;
    salary: string;
}

const JobCard: FC<JobCardProps> = ({
    location,
    verified = false,
    timePosted,
    title,
    description,
    workType,
    schedule,
    salary,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all cursor-pointer border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-md"></div>
                    <p className="text-gray-700 font-medium flex items-center">
                        {location}
                        {verified && (
                            <Image src={greenverifed } alt="green verified"/>
                        )}
                    </p>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {timePosted}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

            {/* Description */}
            <p className="text-gray-600 mb-4">{description}</p>

            {/* Job details */}
            <div className="flex items-center text-sm text-gray-500 space-x-3 flex-wrap">
                <span>{workType}</span>
                <span>•</span>
                <span>{schedule}</span>
                <span>•</span>
                <span className="font-medium text-gray-700">{salary}</span>
            </div>
        </div>
    );
};

export default JobCard;
