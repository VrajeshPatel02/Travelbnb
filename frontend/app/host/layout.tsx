import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { Bell } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="min-h-screen bg-white">
    <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
                        <a href="/" className="flex items-center">
                            <img src="/travelbnb-logo.svg" alt="TravelBnB Logo" className="h-8 w-auto" />
                        </a>
                    </div>
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Button variant="ghost">Today</Button>
              <Button variant="ghost">Calendar</Button>
              <Button variant="ghost" className="border-b-2 border-black rounded-none">Listings</Button>
              <Button variant="ghost">Messages</Button>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5" />
              <UserAvatar />
            </div>
          </div>
        </div>
      </nav>
      {children}
      </div>
    </>
  );
}
