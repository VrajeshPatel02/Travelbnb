"use client"

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/authService";
import { Camera, X } from 'lucide-react';

const Properties: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    country: "",
    noGuests: "",
    no_bedrooms: "",
    no_bathrooms: "",
    price: "",
    description: "",
    images: [] as File[],
    facilities: [] as string[],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const facilities = [
    { id: "wifi", label: "Wi-Fi" },
    { id: "parking", label: "Parking" },
    { id: "pool", label: "Swimming Pool" },
    { id: "gym", label: "Gym" },
    { id: "ac", label: "Air Conditioning" },
    { id: "heating", label: "Heating" },
    { id: "kitchen", label: "Kitchen" },
    { id: "tv", label: "TV" },
    { id: "washer", label: "Washer" },
    { id: "dryer", label: "Dryer" },
    { id: "workspace", label: "Workspace" },
    { id: "bbq", label: "BBQ Grill" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFacilityChange = (facilityId: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(id => id !== facilityId)
        : [...prev.facilities, facilityId]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    const newImages = files.filter((file) => !formData.images.includes(file));

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });

    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      country: "",
      noGuests: "",
      no_bedrooms: "",
      no_bathrooms: "",
      price: "",
      description: "",
      images: [],
      facilities: [],
    });
    setImagePreviews([]);
    setStep(1);
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.location || !formData.country || 
        !formData.noGuests || !formData.no_bedrooms || !formData.no_bathrooms || 
        !formData.price || !formData.description || formData.images.length === 0) {
      toast({
        description: "Please fill in all required fields and add at least one image.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'facilities') {
          (value as string[]).forEach((facility: string) => {
            formDataToSend.append('facilities', facility);
          });
        } else if (key !== 'images') {
          formDataToSend.append(key, value.toString());
        }
      });

      formData.images.forEach((image) => {
        formDataToSend.append('file', image);
      });

      const response = await api.post("/property/addNewProperty", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast({
          description: "Property successfully saved!",
        });
        resetForm();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        variant: "destructive",
        description: "Failed to save property. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name: string, placeholder: string, type: string = "text") => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {placeholder}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={handleInputChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
      />
    </div>
  );

  if (step === 2) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Select Facilities</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={facility.id}
                checked={formData.facilities.includes(facility.id)}
                onChange={() => handleFacilityChange(facility.id)}
                className="w-5 h-5 text-rose-500 border-gray-300 rounded focus:ring-rose-500"
              />
              <label
                htmlFor={facility.id}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {facility.label}
              </label>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition duration-200"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Your Property</h1>
      
      {renderInput("name", "Property Name")}
      {renderInput("location", "Location")}
      {renderInput("country", "Country")}
      {renderInput("noGuests", "Number of Guests", "number")}
      {renderInput("no_bedrooms", "Number of Bedrooms", "number")}
      {renderInput("no_bathrooms", "Number of Bathrooms", "number")}
      {renderInput("price", "Price per Night", "number")}

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter a description of the property"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          rows={4}
          required
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Images
        </label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Camera className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input 
              id="dropzone-file" 
              type="file" 
              className="hidden" 
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="w-full bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition duration-200"
      >
        Next
      </button>
    </form>
  );
};

export default Properties;

