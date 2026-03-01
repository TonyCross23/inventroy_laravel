import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Cell
} from 'recharts';
import { ShoppingBag, TrendingUp, AlertTriangle, Package, Calendar } from 'lucide-react';

export default function Dashboard({ stats, salesChart, topProducts, filters }: any) {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Error မတက်အောင် ကာကွယ်ခြင်း
    const dashboardStats = stats || { total_revenue: 0, total_profit: 0, low_stock: 0, total_products: 0 };

    const handleFilter = (range: string) => {
        router.get('/dashboard', { range }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="p-6 space-y-6 bg-neutral-50/50 dark:bg-transparent min-h-screen">

                {/* Filter Buttons */}
                <div className="flex justify-end gap-2">
                    <div className="bg-white dark:bg-neutral-900 p-1 rounded-xl border flex gap-1 shadow-sm">
                        {[
                            { label: '၇ ရက်', value: '7days' },
                            { label: '၁ လ', value: '30days' },
                            { label: '၁ နှစ်', value: 'year' }
                        ].map((btn) => (
                            <button
                                key={btn.value}
                                onClick={() => handleFilter(btn.value)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filters?.range === btn.value
                                        ? 'bg-primary text-white shadow-md'
                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Today Revenue" value={dashboardStats.total_revenue} icon={<ShoppingBag />} color="text-blue-600" bg="bg-blue-100" />
                    <StatCard title="Today Profit" value={dashboardStats.total_profit} icon={<TrendingUp />} color="text-green-600" bg="bg-green-100" isProfit />
                    <StatCard title="Low Stock Items" value={dashboardStats.low_stock} icon={<AlertTriangle />} color="text-orange-600" bg="bg-orange-100" noMmk />
                    <StatCard title="Total Products" value={dashboardStats.total_products} icon={<Package />} color="text-purple-600" bg="bg-purple-100" noMmk />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Area Chart */}
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold mb-6 text-neutral-500 uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Sales History ({filters?.range})
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesChart || []}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold mb-6 text-neutral-500 uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <Package className="w-3 h-3" /> Top 5 Selling Products
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts || []} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="qty" radius={[0, 4, 4, 0]} barSize={15}>
                                        {(topProducts || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, color, bg, noMmk = false, isProfit = false }: any) {
    return (
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`p-3 ${bg} ${color} rounded-xl`}>{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{title}</p>
                <h4 className={`text-xl font-black ${isProfit ? 'text-green-600' : ''}`}>
                    {(value || 0).toLocaleString()} {!noMmk && <span className="text-[10px] font-normal">MMK</span>}
                </h4>
            </div>
        </div>
    );
}