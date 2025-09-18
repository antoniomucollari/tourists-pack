"use client";

export default function FullScreenDotsLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="flex space-x-3">
        <span
            className="w-5 h-5 bg-red-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
        ></span>
                <span
                    className="w-5 h-5 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                    className="w-5 h-5 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                ></span>
            </div>
        </div>
    );
}
