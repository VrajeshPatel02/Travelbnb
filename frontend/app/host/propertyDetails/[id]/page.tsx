'use client'

import { useState } from "react"
import { Bed, Bath, Users, IndianRupee, MapPin, Globe2, Camera, Plus, X, Save, Edit, Trash2, Loader2 } from 'lucide-react'
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useParams } from "next/navigation"
import { useProperty } from "@/hooks/useProperty"

interface RoomDetails {
  name: string
  description: string
  location: string
  country: string
  bedrooms: number | string
  bathrooms: number | string
  guests: number | string
  price: number
  images: string[]
  amenities: {
    wifi: boolean
    kitchen: boolean
    parking: boolean
    airConditioning: boolean
    washer: boolean
    dryer: boolean
    tv: boolean
    pool: boolean
  }
}

export default function HostRoomDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [customInputs, setCustomInputs] = useState({
    bedrooms: false,
    bathrooms: false,
    guests: false,
  })
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const { id } = useParams();
  const { property } = useProperty(Number(id));
  const [roomDetails, setRoomDetails] = useState<RoomDetails>({
    name: "Luxury Beachfront Villa",
    description: "Beautiful villa with stunning ocean views, perfect for family vacations.",
    location: "Malibu Beach",
    country: "United States",
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    price: 25000,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    amenities: {
      wifi: true,
      kitchen: true,
      parking: true,
      airConditioning: true,
      washer: true,
      dryer: true,
      tv: true,
      pool: false,
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setRoomDetails(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }

  const removeImage = (index: number) => {
    setRoomDetails(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const toggleAmenity = (amenity: keyof typeof roomDetails.amenities) => {
    setRoomDetails(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Handle deletion logic here
  }

  const renderCapacityInput = (field: 'bedrooms' | 'bathrooms' | 'guests') => {
    const icons = {
      bedrooms: Bed,
      bathrooms: Bath,
      guests: Users,
    }
    const Icon = icons[field]
    const maxValues = {
      bedrooms: 6,
      bathrooms: 5,
      guests: 8,
    }

    return (
      <div className="space-y-4">
        <Label htmlFor={field} className="capitalize">{field}</Label>
        <RadioGroup
          defaultValue="preset"
          className="mb-4"
          onValueChange={(value) => setCustomInputs(prev => ({
            ...prev,
            [field]: value === 'custom'
          }))}
          disabled={!isEditing}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="preset" id={`${field}-preset`} />
            <Label htmlFor={`${field}-preset`}>Preset values</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id={`${field}-custom`} />
            <Label htmlFor={`${field}-custom`}>Custom value</Label>
          </div>
        </RadioGroup>

        {customInputs[field] ? (
          <div className="relative">
            <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={roomDetails[field]}
              onChange={(e) => setRoomDetails(prev => ({ ...prev, [field]: e.target.value }))}
              className="pl-9"
              disabled={!isEditing}
              placeholder={`Enter custom ${field}`}
            />
          </div>
        ) : (
          <div className="relative">
            <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Select
              value={roomDetails[field].toString()}
              onValueChange={(value) => setRoomDetails(prev => ({ ...prev, [field]: parseInt(value) }))}
              disabled={!isEditing}
            >
              <SelectTrigger className="pl-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxValues[field] }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? field.slice(0, -1) : field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Room Details</h1>
          <div className="flex gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    room listing and remove all associated data. Please type{" "}
                    <span className="font-semibold">delete</span> to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                  <Input
                    placeholder="Type 'delete' to confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDelete();
                      setDeleteConfirmation('');
                    }}
                    disabled={deleteConfirmation !== 'delete' || isLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Yes, delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            {/* Images Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Photos</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property?.imageUrls.map((image, index) => (
                    <div key={index} className="relative aspect-[4/3] group">
                      <Image
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={`Room image ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && roomDetails.images.length < 8 && (
                    <label className="relative aspect-[4/3] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm">Add Photo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Details Section */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Basic Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Listing Name</Label>
                    <Input
                      id="name"
                      value={property?.name}
                      onChange={(e) => setRoomDetails(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={property?.description}
                      onChange={(e) => setRoomDetails(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      className="h-32 transition-colors"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Section */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Location</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="location">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={property?.location}
                        onChange={(e) => setRoomDetails(prev => ({ ...prev, location: e.target.value }))}
                        className="pl-9 transition-colors"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <div className="relative">
                      <Globe2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="country"
                        value={property?.country}
                        onChange={(e) => setRoomDetails(prev => ({ ...prev, country: e.target.value }))}
                        className="pl-9 transition-colors"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Capacity Section */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Capacity</h2>
                <div className="space-y-6">
                  {renderCapacityInput('bedrooms')}
                  {renderCapacityInput('bathrooms')}
                  {renderCapacityInput('guests')}
                </div>
              </CardContent>
            </Card>

            {/* Price Section */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Pricing</h2>
                <div>
                  <Label htmlFor="price">Price per night</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      value={property?.price}
                      onChange={(e) => setRoomDetails(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                      className="pl-9 transition-colors"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities Section */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Amenities</h2>
                <div className="space-y-4">
                  {Object.entries(roomDetails.amenities).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={() => toggleAmenity(key as keyof typeof roomDetails.amenities)}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

