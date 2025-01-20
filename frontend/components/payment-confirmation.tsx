"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  Loader2,
  MapPin,
  RefreshCcw,
  Users,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"

type PaymentStatus = "processing" | "success" | "error"

export default function PaymentConfirmation() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("processing")

  // Simulate payment processing
  const processPayment = async () => {
    setPaymentStatus("processing")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Randomly succeed or fail for demo purposes
    setPaymentStatus(Math.random() > 0.5 ? "success" : "error")
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Confirming your booking</CardTitle>
          <CardDescription>Please wait while we process your payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Status Animation */}
          <div className="flex justify-center py-8">
            <AnimatePresence mode="wait">
              {paymentStatus === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  <p className="text-lg font-medium">Processing your payment...</p>
                </motion.div>
              )}
              {paymentStatus === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </motion.div>
                  <p className="text-lg font-medium text-green-500">Booking confirmed!</p>
                </motion.div>
              )}
              {paymentStatus === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <XCircle className="w-16 h-16 text-destructive" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-destructive">Payment failed</p>
                    <p className="text-sm text-muted-foreground">Please try again or use a different payment method</p>
                  </div>
                  <Button onClick={processPayment} variant="outline" className="mt-2">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retry Payment
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Booking Details</h3>

            <div className="flex gap-4">
              <div className="relative aspect-[4/3] w-32 rounded-lg overflow-hidden">
                <Image src="/placeholder.svg" alt="Property" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Luxury Beachfront Villa</h4>
                <p className="text-sm text-muted-foreground">Entire villa hosted by John</p>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>4 guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>2 bedrooms</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-sm text-muted-foreground">Malibu, California, United States</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Check-in</span>
                </div>
                <p className="text-sm text-muted-foreground">Feb 15, 2024, 3:00 PM</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Length of stay</span>
                </div>
                <p className="text-sm text-muted-foreground">3 nights</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Check-out</span>
                </div>
                <p className="text-sm text-muted-foreground">Feb 18, 2024, 11:00 AM</p>
              </div>
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Price Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">₹25,000 x 3 nights</span>
                  <span>₹75,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cleaning fee</span>
                  <span>₹5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>₹8,000</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total (INR)</span>
                  <span>₹88,000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {paymentStatus === "success" && (
            <div className="w-full space-y-4">
              <Button className="w-full" asChild>
                <Link href="/trips">
                  View Your Trips
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                A confirmation email has been sent to your email address
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

