import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Check } from "lucide-react";

const steps = [
    { label: "Mã NV", icon: <Lock size={18} /> },
    { label: "Thông tin", icon: <User size={18} /> },
    { label: "Hoàn tất", icon: <Check size={18} /> },
];

function Checking() {
    const [step, setStep] = useState(0);
    const [toastMsg, setToastMsg] = useState(null);
    const [employeeCode, setEmployeeCode] = useState("");
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [loading, setLoading] = useState(false); // ✅ loading state

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const goNext = async () => {
        const code = employeeCode.trim();
        if (step === 0) {
            if (!code) return showToast("⚠️ Vui lòng nhập mã nhân viên.");
            setLoading(true);
            try {
                const res = await fetch(`https://be-checkin.onrender.com/api/employees/${code}`);
                const result = await res.json();
                if (result.success) {
                    setEmployeeInfo(result.data);
                    setStep(1);
                } else {
                    showToast(`❌ Không tìm thấy mã "${code}".`);
                }
            } catch (err) {
                console.error(err);
                showToast("🚫 Không kết nối được đến server.");
            } finally {
                setLoading(false);
            }
        } else if (step === 1) {
            setLoading(true);
            try {
                const res = await fetch(`https://be-checkin.onrender.com/api/checkin/${code}`);
                const result = await res.json();
                if (result.success) {
                    showToast("✅ Check-in thành công!");
                    setStep(2);
                } else {
                    showToast("⚠️ Đã check-in trước đó hoặc có lỗi.");
                }
            } catch (err) {
                console.error(err);
                showToast("🚫 Gửi dữ liệu check-in thất bại.");
            } finally {
                setLoading(false);
            }
        } else {
            setStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const goBack = () => setStep((s) => Math.max(s - 1, 0));

    const renderForm = () => {
        switch (step) {
            case 0:
                return (
                    <InputField
                        label="Mã số nhân viên"
                        placeholder="Nhập mã như 000001"
                        value={employeeCode}
                        onChange={(e) => setEmployeeCode(e.target.value)}
                    />
                );
            case 1:
                return employeeInfo ? (
                    <>
                        <ReadonlyField label="Tên nhân viên" value={employeeInfo.name} />
                        <ReadonlyField label="Số điện thoại" value={employeeInfo.phone} />
                        <ReadonlyField label="Phòng ban" value={employeeInfo.unit} />
                        <ReadonlyField label="Đội" value={employeeInfo.team} />
                    </>
                ) : (
                    <div className="text-red-600">Không tìm thấy thông tin.</div>
                );
            case 2:
                return (
                    <div className="text-center text-green-600 text-lg">
                        ✅ Đã hoàn tất đăng ký!
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg relative">
                <h2 className="text-xl font-bold text-center text-[#e61e24]">CHECK-IN SỰ KIỆN</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Điền thông tin theo từng bước</p>

                <div className="flex justify-between items-center mb-4">
                    {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${i === step ? 'bg-[#e61e24]' : 'bg-gray-300'}`}>
                                {s.icon}
                            </div>
                            <span className="text-xs mt-1">{s.label}</span>
                        </div>
                    ))}
                </div>

                <div className="w-full bg-gray-200 h-2 rounded mb-4">
                    <div
                        className="h-full bg-[#e61e24] rounded transition-all duration-300"
                        style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    ></div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-4"
                    >
                        {renderForm()}
                    </motion.div>
                </AnimatePresence>

                {toastMsg && (
                    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg text-sm animate-fade-in-down">
                        {toastMsg}
                    </div>
                )}

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={goBack}
                        disabled={step === 0 || loading}
                        className="text-gray-500 disabled:opacity-30"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={goNext}
                        disabled={loading}
                        className="bg-[#e61e24] text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-60"
                    >
                        {loading ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            step === steps.length - 1 ? "Xong" : "Tiếp tục"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

const InputField = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
            {...props}
            className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#e61e24] focus:outline-none"
        />
    </div>
);

const ReadonlyField = ({ label, value }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="w-full border px-3 py-2 rounded text-sm bg-gray-100">{value}</div>
    </div>
);

export default Checking;
