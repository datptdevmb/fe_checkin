import { useEffect } from "react";

export default function Toast({ message, type = "error", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // tự tắt sau 3s
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white text-sm
      ${type === "error" ? "bg-red-600" : "bg-green-600"}`}>
            {message}
        </div>
    );
}
