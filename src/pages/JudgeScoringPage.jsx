import React, { useState } from "react";
import { useParams } from "react-router-dom";
import judges from "../data/judges";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
    {
        id: "part1",
        title: "🧠 Phần thi 1: Kiến thức",
        criteria: [
            { id: "understanding", label: "📚 Hiểu đề", max: 10 },
            { id: "logic", label: "🔍 Lập luận logic", max: 10 },
            { id: "expression", label: "✍️ Diễn đạt", max: 10 },
        ]
    },
    {
        id: "part2",
        title: "🎯 Phần thi 2: Thực hành",
        criteria: [
            { id: "teamwork", label: "🤝 Làm việc nhóm", max: 10 },
            { id: "creativity", label: "🌟 Tính sáng tạo", max: 10 },
            { id: "completion", label: "✅ Hoàn thành nhiệm vụ", max: 10 },
        ]
    }
];

const teams = [1, 2, 3, 4];

function JudgeScoringPage() {
    const { id } = useParams();
    const judge = judges.find(j => j.id === parseInt(id));
    const [activeTeam, setActiveTeam] = useState(1);
    const [scores, setScores] = useState({});

    const handleScoreChange = (sectionId, criterionId, value) => {
        const floatValue = Math.min(parseFloat(value) || 0, 10);
        setScores(prev => ({
            ...prev,
            [activeTeam]: {
                ...(prev[activeTeam] || {}),
                [sectionId]: {
                    ...(prev[activeTeam]?.[sectionId] || {}),
                    [criterionId]: floatValue,
                }
            }
        }));
    };

    const teamScores = scores[activeTeam] || {};

    const total = sections.reduce((sum, section) => {
        const sectionScores = teamScores[section.id] || {};
        return sum + Object.values(sectionScores).reduce((a, b) => a + b, 0);
    }, 0);

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#f0f4ff] to-[#fefefe] py-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
                <div className="flex items-center gap-6 mb-8">
                    <img
                        src={judge.avatar}
                        alt={judge.name}
                        className="w-20 h-20 rounded-full border-4 border-blue-300 shadow"
                    />
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
                                className="bg-blue-50 border-l-4 border-blue-400 rounded-xl p-6 shadow-inner"
                            >
                                <h3 className="text-xl font-bold text-blue-700 mb-4">{section.title}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {section.criteria.map((c) => (
                                        <div key={c.id} className="flex flex-col">
                                            <label className="mb-1 text-gray-700 font-medium">{c.label}</label>
                                            <input
                                                type="number"
                                                step="0.25"
                                                min="0"
                                                max={c.max}
                                                value={
                                                    teamScores[section.id]?.[c.id] !== undefined
                                                        ? teamScores[section.id][c.id]
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    handleScoreChange(section.id, c.id, e.target.value)
                                                }
                                                className="border border-gray-300 rounded-lg px-4 py-2 text-right font-semibold text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-10 text-right">
                    <p className="text-2xl font-bold text-blue-700">
                        🧮 Tổng điểm: <span className="text-[#e61e24]">{total.toFixed(2)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default JudgeScoringPage;
