import * as yup from "yup";

const FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phoneNumber: yup.string().required("Phone number is required").matches(/^[0-9]+$/, "Must be only digits"),
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

export type UserCredentials = yup.InferType<typeof validationSchema>;