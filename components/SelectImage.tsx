"use client";

import { useState, ChangeEvent } from "react";

interface SelectImgProps {
    selectedImage: (file: File) => void;
    imgUrl?: string; // existing profile image
}

export default function SelectImage({ selectedImage, imgUrl }: SelectImgProps) {
    const [imageBase64, setImageBase64] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>(imgUrl ?? "");

    function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.files) {
            const file = e.currentTarget.files[0];
            if (!file) return;

            toBase64(file)
                .then((value) => setImageBase64(value))
                .catch((err) => console.error(err));

            selectedImage(file); // pass file back to parent
            setImageUrl(""); // clear old imageUrl if new one is selected
        }
    }

    function toBase64(file: File) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
        });
    }

    return (
        <div className="form-group space-y-2">
            <label htmlFor="image" className="block font-medium">
                Select Image
            </label>
            <input
                id="image"
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={handleOnChange}
                className="block w-full text-sm"
            />

            {imageBase64 && (
                <div className="mt-2">
                    <img
                        src={imageBase64}
                        alt="selected image"
                        className="h-24 w-24 object-cover rounded-md border"
                    />
                </div>
            )}

            {!imageBase64 && imageUrl && (
                <div className="mt-2">
                    <img
                        src={imageUrl}
                        alt="existing image"
                        className="h-24 w-24 object-cover rounded-md border"
                    />
                </div>
            )}
        </div>
    );
}
