import React, { useState } from "react";
import { useParams } from "react-router-dom";
import judges from "../data/judges";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const sections = [
    {
        id: "part1",
        title: "🧠 Phần thi 1: Hội thảo",
        criteria: [
            { id: "understanding", label: "Tính mới", max: 25 },
            { id: "logic", label: "Tính khả thi", max: 25 },
            { id: "expression", label: "Tính hiệu quả", max: 25 },
            { id: "expression1", label: "Phong cách trình bày", max: 25 },
        ]
    },
    {
        id: "part2",
        title: "🎯 Phần thi 2: Karaoke",
        criteria: [
            { id: "teamwork", label: "Tính phù hợp với nội dung, chủ đề", max: 35 },
            { id: "creativity", label: "Sự sáng tạo và độc đáo", max: 35 },
            { id: "completion", label: "Cảm xúc, biểu cảm và sự ấn tượng", max: 30 },
        ]
    }
];

const teams = [1, 2, 3, 4];

function JudgeScoringPage() {
    const { id } = useParams();
    const judge = judges.find(j => j.id === parseInt(id));
    const [activeTeam, setActiveTeam] = useState(1);
    const [scores, setScores] = useState({});
    const [submitted, setSubmitted] = useState({}); // Theo dõi các phần đã gửi

    const handleScoreChange = (sectionId, criterionId, value, max) => {
        if (!/^\d+$/.test(value)) return; // chỉ cho số nguyên dương
        const intValue = parseInt(value);
        if (intValue < 0 || intValue > max) return;

        setScores(prev => ({
            ...prev,
            [activeTeam]: {
                ...(prev[activeTeam] || {}),
                [sectionId]: {
                    ...(prev[activeTeam]?.[sectionId] || {}),
                    [criterionId]: intValue,
                }
            }
        }));
    };

    const handleSubmitSection = async (sectionId) => {
        const payload = scores[activeTeam]?.[sectionId];

        if (!payload || Object.keys(payload).length === 0) {
            alert("⚠️ Bạn chưa nhập điểm phần này.");
            return;
        }

        const isSent = submitted[activeTeam]?.[sectionId];
        if (isSent) {
            alert("⚠️ Bạn đã gửi điểm phần này rồi.");
            return;
        }

        try {
            const res = await axios.post(
                `https://be-checkin.onrender.com/api/score/${activeTeam}/${id}`,
                { [sectionId]: payload },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = res.data;

            if (result.success) {
                alert(`✅ Đã gửi điểm phần ${sectionId === "part1" ? "Hội thảo" : "Karaoke"} cho đội ${activeTeam}`);
                setSubmitted(prev => ({
                    ...prev,
                    [activeTeam]: {
                        ...(prev[activeTeam] || {}),
                        [sectionId]: true,
                    }
                }));
            } else {
                alert("❌ Gửi thất bại: " + result.message);
            }
        } catch (err) {
            console.error("❌ Lỗi khi gửi điểm:", err);

            if (err.response) {
                // Server trả lỗi có phản hồi JSON
                alert("❌ Gửi thất bại: " + (err.response.data?.message || "Lỗi không xác định từ server."));
            } else if (err.request) {
                alert("❌ Không nhận được phản hồi từ server.");
            } else {
                alert("❌ Lỗi xảy ra: " + err.message);
            }
        }
    };

    const teamScores = scores[activeTeam] || {};
    const submittedParts = submitted[activeTeam] || {};

    const total = sections.reduce((sum, section) => {
        const sectionScores = teamScores[section.id] || {};
        return sum + Object.values(sectionScores).reduce((a, b) => a + b, 0);
    }, 0);

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#f0f4ff] to-[#fefefe] py-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
                <div className="flex items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-800">Giám khảo: {judge.name}</h2>
                        <p className="text-gray-500 text-sm">{judge.title}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                    {teams.map((teamId) => (
                        <button
                            key={teamId}
                            onClick={() => setActiveTeam(teamId)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold shadow transition-all duration-200 border 
                            ${activeTeam === teamId
                                    ? "bg-[#e61e24] text-white border-[#e61e24]"
                                    : "bg-white text-gray-800 hover:bg-blue-50 border-gray-300"
                                }`}
                        >
                            Đội {teamId}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTeam}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className="bg-blue-50 border-l-4 border-red-400 rounded-xl p-6 shadow-inner"
                            >
                                <h3 className="text-xl font-bold text-blue-700 mb-4">{section.title}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {section.criteria.map((c) => (
                                        <div key={c.id} className="flex flex-col">
                                            <label className="mb-1 text-gray-700 font-medium">
                                                {c.label} <span className="text-sm text-gray-500">(tối đa {c.max})</span>
                                            </label>

                                            <input
                                                type="number"
                                                pattern="\d*"
                                                min="0"
                                                max={c.max}
                                                disabled={submittedParts[section.id]}
                                                value={
                                                    teamScores[section.id]?.[c.id] !== undefined
                                                        ? teamScores[section.id][c.id]
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    handleScoreChange(section.id, c.id, e.target.value, c.max)
                                                }
                                                className="border border-gray-300 rounded-lg px-4 py-2 text-right font-semibold text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleSubmitSection(section.id)}
                                    disabled={submittedParts[section.id]}
                                    className={`mt-6 font-semibold px-4 py-2 rounded-full transition 
                                        ${submittedParts[section.id]
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-[#e61e24] text-white hover:bg-red-700"
                                        }`}
                                >
                                    {submittedParts[section.id]
                                        ? "Đã chấm ✅"
                                        : `Gửi điểm ${section.id === "part1" ? "Hội thảo" : "Karaoke"}`}
                                </button>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-10 text-right">
                    <p className="text-2xl font-bold text-blue-700">
                        🧮 Tổng điểm đã nhập: <span className="text-[#e61e24]">{total.toFixed(0)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default JudgeScoringPage;
