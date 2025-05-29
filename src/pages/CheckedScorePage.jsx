import React, { useEffect, useState } from "react";

function CheckedScorePage() {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://be-checkin.onrender.com/api/scores")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setScores(data.data);
                }
            })
            .catch(err => console.error("Lỗi khi tải điểm:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">📊 Bảng điểm đã chấm</h2>

            {loading ? (
                <p className="text-center">⏳ Đang tải dữ liệu...</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-[900px] w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 text-xs sm:text-sm font-semibold text-gray-600">
                            <tr>
                                <th className="border px-3 py-2">Đội</th>
                                <th className="border px-3 py-2">Giám khảo</th>
                                <th className="border px-3 py-2">Tính mới</th>
                                <th className="border px-3 py-2">Tính khả thi</th>
                                <th className="border px-3 py-2">Tính hiệu quả</th>
                                <th className="border px-3 py-2">Phong cách</th>
                                <th className="border px-3 py-2">Phù hợp</th>
                                <th className="border px-3 py-2">Sáng tạo</th>
                                <th className="border px-3 py-2">Biểu cảm</th>
                                <th className="border px-3 py-2 text-red-600">Tổng</th>
                                <th className="border px-3 py-2">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2 text-center">{row["Đội"]}</td>
                                    <td className="border px-3 py-2">{row["Giám khảo"]}</td>
                                    <td className="border px-3 py-2 text-center">{row["📚 Tính mới"]}</td>
                                    <td className="border px-3 py-2 text-center">{row["📚 Tính khả thi"]}</td>
                                    <td className="border px-3 py-2 text-center">{row["📚 Tính hiệu quả"]}</td>
                                    <td className="border px-3 py-2 text-center">{row["📚 Phong cách trình bày"]}</td>
                                    <td className="border px-3 py-2 text-center">{row["🎯 Phù hợp chủ đề"]}</td>
                                    <td className="border px-3 py-2 text-center">{row["🎯 Sáng tạo"]}</td>
                                    <td className="border px-3 py-2 text-center">{row["🎯 Biểu cảm"]}</td>
                                    <td className="border px-3 py-2 font-bold text-center text-red-600">{row["Tổng điểm"]}</td>
                                    <td className="border px-3 py-2 whitespace-nowrap">{row["Thời gian"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CheckedScorePage;
