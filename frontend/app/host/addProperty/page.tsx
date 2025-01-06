"use client"

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/Input';
import api from "@/services/authService";

const Properties: React.FC = () => {
  const { toast } = useToast();
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
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    });
    setImagePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast({
        description: "Please upload at least one image.",
        variant: "destructive"
      });
      return;
    }

    // Basic validation
    if (!formData.name || !formData.location || !formData.country) {
      toast({
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`file`, image); 
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow"
    >
      <h1 className="text-2xl font-bold mb-6">Add Property</h1>
      <Input
        type="text"
        name="name"
        placeholder="Property Name"
        value={formData.name}
        onChange={handleInputChange}
        required
        className="mb-4"
      />
      <Input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleInputChange}
        required
        className="mb-4"
      />
      <Input
        type="text"
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleInputChange}
        required
        className="mb-4"
      />
      <Input
        type="number"
        name="noGuests"
        placeholder="Number of Guests"
        value={formData.noGuests}
        onChange={handleInputChange}
        required
        className="mb-4"
      />
      <Input
        type="number"
        name="no_bedrooms"
        placeholder="Number of Bedrooms"
        value={formData.no_bedrooms}
        onChange={handleInputChange}
        required
        className="mb-4"
      />
      <Input
        type="number"
        name="no_bathrooms"
        placeholder="Number of Bathrooms"
        value={formData.no_bathrooms}
        onChange={handleInputChange}
        required
        className="mb-4"
      />
      <Input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleInputChange}
        required
        className="mb-4"
      />

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Enter a description of the property"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
          rows={4}
          required
        ></textarea>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
          required
        />
        <div className="grid grid-cols-3 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default Properties;