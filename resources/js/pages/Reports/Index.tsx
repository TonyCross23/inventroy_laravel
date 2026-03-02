import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Banknote,
    TrendingUp,
    PieChart,
    Calendar,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    FileDown
} from 'lucide-react';

export default function Index({ reports, summary, filters }: any) {

    // Date Range Filter ပြောင်းလဲရန် function
    const handleFilter = (range: string) => {
        router.get('/reports', { range }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'အစီရင်ခံစာများ', href: '/reports' }]}>
            <Head title="အမြတ်အစွန်း အစီရင်ခံစာ" />

            <div className="p-6 space-y-6">

                {/* Header & Date Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                        Profit & Loss Report
                    </h2>

                    <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border shadow-sm">
                        {[
                            { label: 'ဒီနေ့', value: 'today' },
                            { label: '၇ ရက်', value: '7days' },
                            { label: '၁ လ', value: '30days' },
                            { label: '၁ နှစ်', value: 'year' }
                        ].map((btn) => (
                            <button
                                key={btn.value}
                                onClick={() => handleFilter(btn.value)}
                                className={`px-5 py-2 text-xs font-black rounded-xl transition-all active:scale-95 ${(filters?.range || 'today') === btn.value // default ကို today နဲ့ ညှိပါ
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-card dark:bg-neutral-900 p-6 rounded-2xl border shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="p-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl">
                            <Banknote className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">စုစုပေါင်း ရောင်းရငွေ ({filters?.range || '7days'})</p>
                            <h3 className="text-2xl font-black font-mono">
                                {summary.total_revenue.toLocaleString()}
                                <span className="text-xs font-normal opacity-70 ml-1">MMK</span>
                            </h3>
                        </div>
                    </div>

                    {/* Profit/Loss Card */}
                    <div className={`bg-card dark:bg-neutral-900 p-6 rounded-2xl border shadow-sm flex items-center gap-5 border-l-4 transition-all hover:shadow-md ${summary.total_profit >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
                        <div className={`p-4 rounded-2xl ${summary.total_profit >= 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {summary.total_profit >= 0 ? <TrendingUp className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">စုစုပေါင်း အမြတ်/အရှုံး</p>
                            <h3 className={`text-2xl font-black font-mono ${summary.total_profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {summary.total_profit.toLocaleString()}
                                <span className="text-xs font-normal opacity-70 text-foreground ml-1">MMK</span>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Detailed Table Area */}
                <div className="bg-card dark:bg-neutral-900 border border-sidebar-border/70 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b bg-neutral-50/50 dark:bg-neutral-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="font-black flex items-center gap-2 uppercase text-sm tracking-tight">
                            <PieChart className="w-5 h-5 text-primary" /> အရောင်းနှင့် အမြတ်အစွန်း အသေးစိတ်
                        </div>

                        {/* Dynamic Excel Export Link */}
                        <a
                            href={`/reports/export?range=${filters?.range || '7days'}`}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-[13px] font-black shadow-md transition-all active:scale-95 shadow-green-600/10"
                        >
                            <FileDown className="w-4 h-4" /> Excel ထုတ်ယူမည်
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800 text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b">
                                <tr>
                                    <th className="p-4"><div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> ရက်စွဲ</div></th>
                                    <th className="p-4"><div className="flex items-center gap-2"><Package className="w-3 h-3" /> ကုန်ပစ္စည်း</div></th>
                                    <th className="p-4 text-right">ရောင်းစျေး</th>
                                    <th className="p-4 text-right text-muted-foreground/60 font-medium">ဝယ်စျေး</th>
                                    <th className="p-4 text-right">အရေအတွက်</th>
                                    <th className="p-4 text-right">အမြတ်/အရှုံး</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50">
                                {reports.length > 0 ? (
                                    reports.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-800/30 transition-colors group">
                                            <td className="p-4 text-muted-foreground text-xs font-mono">{item.date}</td>
                                            <td className="p-4 font-bold text-foreground">{item.product_name}</td>
                                            <td className="p-4 text-right font-mono font-bold tracking-tight">
                                                {item.selling_price.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right font-mono text-xs text-muted-foreground/60 italic">
                                                {item.buying_price.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg text-[11px] font-black">
                                                    {item.qty}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className={`flex items-center justify-end gap-1.5 font-black font-mono text-[15px] ${item.profit >= 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {item.profit >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                                    {item.profit.toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-16 text-center text-muted-foreground italic">
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <Package className="w-8 h-8" />
                                                <span>ရွေးချယ်ထားသော ကာလအတွင်း အစီရင်ခံစာ ဒေတာမရှိသေးပါ။</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-neutral-50/30 dark:bg-neutral-800/20 border-t text-[11px] text-center text-muted-foreground font-bold tracking-tight">
                        မှတ်ချက်။ ။ အထက်ပါ အချက်အလက်များသည် လက်ရှိကုန်ပစ္စည်း၏ ဝယ်ရင်းစျေးနှင့် ရောင်းစျေးအပေါ် အခြေခံ၍ တွက်ချက်ထားခြင်း ဖြစ်ပါသည်။
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}