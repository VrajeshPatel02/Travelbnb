"use client";
import React from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/app/components/ui/card';
import { PlusIcon } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { useRouter } from 'next/navigation';

type Props = {
  imageUrl?: string;
  title?: string;
  description?: string;
  price?: string;
  location?: string;
}

const HostPropertyCard = ({ 
  imageUrl = "/api/placeholder/600/400",
  title = "Add New Property",
  description = "Click to add a new property listing",
  price = "",
  location = ""
}: Props) => {
    const router = useRouter();
    const handleClick = () => {
        router.push('/host/addProperty');
    };

    return (
        <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                {!price && (
                    <Button 
                        onClick={handleClick}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12 p-0"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </Button>
                )}
            </div>
            
            <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                {location && (
                    <CardDescription className="text-sm text-gray-500">
                        {location}
                    </CardDescription>
                )}
            </CardHeader>
            
            <CardContent>
                <p className="text-sm text-gray-600">{description}</p>
            </CardContent>
            
            {price && (
                <CardFooter className="flex justify-between items-center">
                    <p className="text-lg font-semibold">{price}</p>
                    <Button onClick={handleClick} variant="outline" size="sm">
                        View Details
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

export default HostPropertyCard;