import React, { useState } from "react";
import { Property } from "../types/property";
import { useToast } from "@/hooks/use-toast";
import Input from "../components/ui/Input";
import axios from "axios";
const Properties: React.FC = () => {
    const { toast } = useToast()
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    location: "",
    country: "",
    propertyName: "",
    numberOfGuests: "",
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    price: "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      location: "",
      country: "",
      propertyName: "",
      numberOfGuests: "",
      numberOfBedrooms: "",
      numberOfBathrooms: "",
      price: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast({
        description: "Please upload an image.",
      });
      return;
    }

    try {
      const newProperty: Property = {
        id: 0, // Replace with actual ID if needed after API call
        name: formData.propertyName,
        noGuests: parseInt(formData.numberOfGuests, 10),
        no_bedrooms: parseInt(formData.numberOfBedrooms, 10),
        no_bathrooms: parseInt(formData.numberOfBathrooms, 10),
        price: parseFloat(formData.price),
        country: parseInt(formData.country, 10),
        location: parseInt(formData.location, 10),
        image_url: imagePreview || "",
      };

      const formDataToSend = new FormData();
      formDataToSend.append("property", JSON.stringify(newProperty));
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post<Property>(API_URL + "/property/addNewProperty", {
        body: formDataToSend,
      });
      console.log(response.status);
      if (!response.status) {
        throw new Error("Failed to save property.");
      }

      toast({
        description: "Property successfully saved!",
      });
      resetForm();
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        variant: "destructive",
        description: "Failed to save property. Please try again.",
      });
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0] || null;
      if (file) {
        setFormData({
          ...formData,
          image: file,
        });
        setImagePreview(URL.createObjectURL(file));
      }
    };
    input.click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow"
    >
      <h1 className="text-2xl font-bold mb-6">Add Property</h1>
      <Input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        name="propertyName"
        placeholder="Property Name"
        value={formData.propertyName}
        onChange={handleInputChange}
      />
      <Input
        type="number"
        name="numberOfGuests"
        placeholder="Number of Guests"
        value={formData.numberOfGuests}
        onChange={handleInputChange}
      />
      <Input
        type="number"
        name="numberOfBedrooms"
        placeholder="Number of Bedrooms"
        value={formData.numberOfBedrooms}
        onChange={handleInputChange}
      />
      <Input
        type="number"
        name="numberOfBathrooms"
        placeholder="Number of Bathrooms"
        value={formData.numberOfBathrooms}
        onChange={handleInputChange}
      />
      <Input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleInputChange}
      />

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center"
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              setFormData({ ...formData, image: file });
              setImagePreview(URL.createObjectURL(file));
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="h-40 object-cover"
            />
          ) : (
            <p className="text-gray-500">
              Drag and drop an image here, or click to upload
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleImageUpload}
        className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 mb-4"
      >
        Upload Image
      </button>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default Properties;
