
import { useNavigate } from "react-router-dom";
import judges from "../data/judges";

function BossPage() {

    const navigate = useNavigate();
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Danh sách giám khảo</h2>
            <div className="grid grid-cols-2 gap-4">
                {judges.map(j => (
                    <div
                        key={j.id}
                        onClick={() => navigate(`/judge/${j.id}`)}
                        className="bg-white p-4 rounded-xl shadow hover:bg-blue-50 cursor-pointer"
                    >
                        <img src={j.avatar} alt={j.name} className="w-20 h-20 rounded-full mb-2" />
                        <h3 className="font-semibold">{j.name}</h3>
                        <p className="text-sm text-gray-500">{j.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default BossPage;
