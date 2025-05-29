
import { useNavigate } from "react-router-dom";
import judges from "../data/judges";

function BossPage() {

    const navigate = useNavigate();
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Danh sách giám khảo</h2>
            <div className="mt-4 space-y-4">
                {judges.map(j => (
                    <div
                        key={j.id}
                        onClick={() => navigate(`/judge/${j.id}`)}
                        className="bg-white p-4 rounded-xl shadow hover:bg-red-100 cursor-pointer"
                    >
                        <h3 className="font-semibold">{j.name}</h3>
                        <p className="text-sm text-gray-500">{j.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default BossPage;
