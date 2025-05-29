import { useEffect, useState } from "react";

function UncheckedList() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            fetch("https://be-checkin.onrender.com/api/employee/unchecked")
                .then(res => res.json())
                .then(res => {
                    if (res.success) setList(res.data);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        };

        fetchData(); 

        const interval = setInterval(fetchData, 30000); 

        return () => clearInterval(interval); 
    }, []);
    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-2xl font-bold text-[#e61e24] mb-4">
                    📋 Danh sách nhân viên chưa check-in
                </h1>

                {loading ? (
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                ) : list.length === 0 ? (
                    <p className="text-green-600 text-lg font-semibold">🎉 Tất cả nhân viên đã check-in!</p>
                ) : (
                    <>
                        <p className="mb-4 text-gray-700">
                            <strong>{list.length}</strong> người chưa check-in
                        </p>
                        <div className="overflow-x-auto rounded border border-gray-300">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-800 font-medium">
                                    <tr>
                                        <th className="px-3 py-2 border">Mã NV</th>
                                        <th className="px-3 py-2 border">Họ tên</th>
                                        <th className="px-3 py-2 border">Phòng ban</th>
                                        <th className="px-3 py-2 border">Đội</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((e, index) => (
                                        <tr
                                            key={e.id}
                                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                        >
                                            <td className="px-3 py-2 border">{e.id}</td>
                                            <td className="px-3 py-2 border">{e.name}</td>
                                            <td className="px-3 py-2 border">{e.unit}</td>
                                            <td className="px-3 py-2 border">{e.team}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default UncheckedList;
