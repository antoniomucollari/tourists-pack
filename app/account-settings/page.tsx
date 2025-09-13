"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectImage from "@/components/SelectImage";
import {useAuth} from "@/context/AuthContext";
import {validationSchema} from "@/app/account-settings/validation";

interface UserCredentials {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    profileUrl: string;
}
const FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const validationRules = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    address: yup.string().required("Address is required"),
    profileUrl: yup
        .mixed<FileList>()
        .test("fileSize", "The file is too large (max 2MB)", (value) => {
            if (!value || value.length === 0) return true; // Optional
            return value[0].size <= FILE_SIZE;
        })
        .test("fileType", "Unsupported file format", (value) => {
            if (!value || value.length === 0) return true; // Optional
            return SUPPORTED_FORMATS.includes(value[0].type);
        })
        .nullable(),
});

export default function UserUpdateForm() {
    const { user,login } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<UserCredentials>({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    });

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

    async function onSubmit(data: UserCredentials) {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("address", data.address);

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            await fetch("/api/users/update", {
                method: "PUT",
                body: formData,

            });
            await login();
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    }
    console.log(user);
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow"
        >
            <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                    type="text"
                    {...register("name")}
                    className="w-full border p-2 rounded"
                />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                    type="email"
                    {...register("email")}
                    className="w-full border p-2 rounded"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <input
                    type="text"
                    {...register("phoneNumber")}
                    className="w-full border p-2 rounded"
                />
                {errors.phoneNumber && (
                    <p className="text-red-500">{errors.phoneNumber.message}</p>
                )}
            </div>

            <div>
                <label className="block mb-1 font-medium">Address</label>
                <input
                    type="text"
                    {...register("address")}
                    className="w-full border p-2 rounded"
                />
                {errors.address && (
                    <p className="text-red-500">{errors.address.message}</p>
                )}
            </div>

            {/* ✅ Image selection with your existing component */}
            <SelectImage
                imgUrl={user?.profileUrl}
                selectedImage={(file) => setSelectedFile(file)}/>

            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
        </form>
    );
}
