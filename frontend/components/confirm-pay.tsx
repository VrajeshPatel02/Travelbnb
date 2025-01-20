"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, CreditCard, Info, Loader2, Lock, Users } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "./ui/Input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

import { useParams, useRouter } from "next/navigation"

interface FormData {
  cardNumber: string
  expiryDate: string
  cvv: string
  name: string
}

export default function ConfirmPay() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  })
  const router = useRouter();
  const { id } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Here you would typically redirect to a success/failure page
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
  }

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Confirm and Pay</h1>

        <div className="grid gap-8 md:grid-cols-[1fr_400px]">
          {/* Payment Form */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              cardNumber: formatCardNumber(e.target.value),
                            }))
                          }
                          maxLength={19}
                          className="pl-12"
                        />
                        <CreditCard className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <Label htmlFor="expiryDate">Expiry date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              expiryDate: formatExpiryDate(e.target.value),
                            }))
                          }
                          maxLength={5}
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cvv">CVV</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>The 3 digits on the back of your card</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              cvv: e.target.value.slice(0, 3),
                            }))
                          }
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="name">Name on card</Label>
                      <Input
                        id="name"
                        placeholder="J Smith"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country/Region</Label>
                      <Select>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure</p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        isLoading || !formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.name
                      }
                      onClick={() => router.push(`/property/${id}/confirm-pay/payment-confirmation`)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        `Confirm and pay ₹88,000`
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancellation policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Free cancellation before Feb 12. Cancel before check-in on Feb 15 for a partial refund.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Preview */}
                <div className="flex gap-4">
                  <div className="relative aspect-[4/3] w-32 rounded-lg overflow-hidden">
                    <Image src="/placeholder.svg" alt="Property" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium">Luxury Beachfront Villa</h3>
                    <p className="text-sm text-muted-foreground">Entire villa hosted by John</p>
                  </div>
                </div>

                <Separator />

                {/* Dates and Guests */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Feb 15-18</p>
                      <p className="text-sm text-muted-foreground">3 nights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">4 guests</p>
                      <p className="text-sm text-muted-foreground">2 rooms</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-medium">Price breakdown</h4>
                  <div className="space-y-2 text-sm">
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
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between font-medium">
                  <span>Total (INR)</span>
                  <span>₹88,000</span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, Airbnb's
                  Rebooking and Refund Policy, and that Airbnb can charge my payment method if I'm responsible for
                  damage.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

