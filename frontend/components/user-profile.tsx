"use client";
import { userService } from '@/services/userService';
import {
  BadgeCheck,
  Building2,
  Calendar,
  Edit,
  Globe2,
  Mail,
  MessageSquare,
  Shield,
  Star,
  User2
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState<{
    name: string;
    username: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userService.getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      {/* Profile Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative group">
              <Avatar className="w-32 h-32">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(userProfile.username)}`} 
                  alt="Profile picture" 
                />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit profile picture</span>
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                  <p className="text-muted-foreground">@{userProfile.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>245 Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Identity verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Superhost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Hi, I'm {userProfile.name}! I'm a passionate traveler and love hosting people from around the world. I've been
                  hosting on Airbnb for over 3 years and have met amazing people from different cultures.
                </p>
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-muted-foreground" />
                  <span>Speaks English, Spanish</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>Lives in New York, United States</span>
                </div>
              </CardContent>
            </Card>

            {/* Verification Section */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>Role: {userProfile.role}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((listing) => (
                <Card key={listing} className="overflow-hidden">
                  <div className="aspect-[4/3] relative">
                    <Image src="/placeholder.svg" alt="Listing thumbnail" fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Luxury Apartment {listing}</h3>
                        <p className="text-sm text-muted-foreground">New York, United States</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>4.9 (125 reviews)</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-8">
            <div className="grid gap-6">
              {[1, 2, 3, 4].map((review) => (
                <Card key={review}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?text=${review}`} />
                        <AvatarFallback>
                          <User2 className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">Guest {review}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>January 2024</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Amazing host! The place was exactly as described and {userProfile.name} was very helpful throughout our
                          stay. Would definitely recommend!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

