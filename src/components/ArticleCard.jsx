import { Link } from 'react-router';
import {
    FaRobot,
    FaWifi,
    FaLock,
    FaCloud,
    FaCode,
    FaBolt,
    FaGlobe,
    FaShieldAlt,
    FaCubes,
    FaQuestion
} from 'react-icons/fa';

// Kategorie → Icon + Farbe
const categoryData = {
    'Robotics': { icon: <FaRobot />, color: 'text-pink-500' },
    'Telecommunications': { icon: <FaWifi />, color: 'text-blue-500' },
    'Cybersecurity': { icon: <FaShieldAlt />, color: 'text-red-500' },
    'Cloud Computing': { icon: <FaCloud />, color: 'text-cyan-500' },
    'AI & Machine Learning': { icon: <FaCode />, color: 'text-purple-500' },
    'Big Data': { icon: <FaCubes />, color: 'text-yellow-500' },
    'Energy': { icon: <FaBolt />, color: 'text-orange-400' },
    'IoT': { icon: <FaGlobe />, color: 'text-emerald-500' },
};

export default function ArticleCard({ article }) {
    const data = categoryData[article.category] || {
        icon: <FaQuestion />,
        color: 'text-base-content'
    };

    return (
        <div className="card bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition duration-200">
            <div className="card-body space-y-3">

                {/* Titel mit farbigem Icon + Tooltip */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-primary leading-snug">
                        {article.title}
                    </h2>

                    <div className="tooltip tooltip-left" data-tip={article.category}>
                        <div className={`badge badge-ghost p-2 text-xl ${data.color}`}>
                            {data.icon}
                        </div>
                    </div>
                </div>

                <p className="text-base text-base-content leading-relaxed">
                    {article.content.slice(0, 130)}...
                </p>

                <div className="card-actions justify-end mt-4">
                    <Link
                        to={`/article/${article.id}`}
                        className="btn btn-sm btn-outline text-sm"
                    >
                        Weiterlesen
                    </Link>
                </div>
            </div>
        </div>
    );
}
