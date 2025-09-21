"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// Assuming these components and context are correctly pathed in your project
import SelectImage from "@/components/SelectImage";
import { useAuth } from "@/context/AuthContext";

// Define the shape of the form data
interface UserCredentials {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileUrl: string; // This will be a URL string from the user object
}

// Define the validation schema for the form fields
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  // Note: The file itself is handled separately and not part of the yup schema here
  // as it's uploaded via FormData.
});

export default function UserUpdateForm() {
  const { user, login } = useAuth(); // Assuming login function refreshes user data
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UserCredentials>({
    resolver: yupResolver(validationSchema),
    mode: "onChange", // Validate on change for instant feedback
  });

  // Populate the form with user data when it becomes available
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        profileUrl: user.profileUrl,
      });
    }
  }, [user, reset]);

  // Handle form submission
  async function onSubmit(data: UserCredentials) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("address", data.address);

      // Only append the image if a new one was selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      // Replace with your actual API endpoint and logic
      await fetch("/api/users/update", {
        method: "PUT",
        body: formData,
      });

      // Refresh user data in the context after successful submission
      await login();
    } catch (err) {
      console.error("Failed to update profile:", err);
      // You can add a toast notification here for the error
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-lg space-y-6 rounded-xl bg-white p-8 shadow-lg"
    >
      <div className="space-y-4">
        {/* Profile Image Selection */}
        <SelectImage
          imgUrl={user?.profileUrl}
          selectedImage={(file) => setSelectedFile(file)}
        />

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number Input */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            {...register("phoneNumber")}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Address Input */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register("address")}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full rounded-lg bg-[#e60000] px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#c00000] disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
