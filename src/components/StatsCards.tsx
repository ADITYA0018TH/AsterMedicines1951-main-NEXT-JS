import { Activity, Globe, Layout, Monitor } from "lucide-react";

interface StatsCardsProps {
    stats: {
        total: number;
        today: number;
        topCountry: string;
        topPage: string;
    } | null;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
    if (!stats) return null;

    const cards = [
        {
            title: "Total Visits",
            value: stats.total,
            icon: Activity,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Visits (24h)",
            value: stats.today,
            icon: Monitor,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Top Country",
            value: stats.topCountry,
            icon: Globe,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Top Page",
            value: stats.topPage,
            icon: Layout,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="glass-card p-6 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 truncate max-w-full" title={String(card.value)}>
                            {card.value}
                        </h3>
                    </div>
                    <div className={`p-3 rounded-lg ${card.bg} shrink-0`}>
                        <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
