import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Banknote, TrendingUp, ShoppingBag, PieChart, Calendar, Package, ArrowUpRight } from 'lucide-react';

export default function Index({ reports, summary }: any) {
    return (
        <AppLayout breadcrumbs={[{ title: 'အစီရင်ခံစာများ', href: '/reports' }]}>
            <Head title="အမြတ်အစွန်း အစီရင်ခံစာ" />

            <div className="p-6 space-y-6">
                {/* Summary Cards - အနှစ်ချုပ် ကတ်များ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card dark:bg-neutral-900 p-6 rounded-2xl border shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="p-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl">
                            <Banknote className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">စုစုပေါင်း ရောင်းရငွေ (Revenue)</p>
                            <h3 className="text-2xl font-black font-mono">{summary.total_revenue.toLocaleString()} <span className="text-xs font-normal opacity-70">MMK</span></h3>
                        </div>
                    </div>

                    <div className="bg-card dark:bg-neutral-900 p-6 rounded-2xl border shadow-sm flex items-center gap-5 border-l-4 border-l-green-500 transition-all hover:shadow-md">
                        <div className="p-4 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-2xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">စုစုပေါင်း အမြတ် (Net Profit)</p>
                            <h3 className="text-2xl font-black font-mono text-green-600 dark:text-green-400">
                                {summary.total_profit.toLocaleString()} <span className="text-xs font-normal opacity-70 text-foreground">MMK</span>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Detailed Table - အသေးစိတ် ဇယား */}
                <div className="bg-card dark:bg-neutral-900 border border-sidebar-border/70 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b bg-neutral-50/50 dark:bg-neutral-800/50 flex justify-between items-center">
                        <div className="font-black flex items-center gap-2 uppercase text-sm tracking-tight">
                            <PieChart className="w-5 h-5 text-primary" /> အရောင်းနှင့် အမြတ်အစွန်း အသေးစိတ်
                        </div>
                        <div className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
                            Live Updates
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800 text-[11px] font-black text-muted-foreground uppercase tracking-widest border-b">
                                <tr>
                                    <th className="p-4"><div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> ရက်စွဲ</div></th>
                                    <th className="p-4"><div className="flex items-center gap-2"><Package className="w-3 h-3" /> ကုန်ပစ္စည်း</div></th>
                                    <th className="p-4 text-right">ရောင်းစျေး</th>
                                    <th className="p-4 text-right text-muted-foreground/70">ဝယ်စျေး</th>
                                    <th className="p-4 text-right">အရေအတွက်</th>
                                    <th className="p-4 text-right text-green-600 dark:text-green-400">အမြတ်</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50">
                                {reports.length > 0 ? (
                                    reports.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-800/30 transition-colors group">
                                            <td className="p-4 text-muted-foreground text-xs">{item.date}</td>
                                            <td className="p-4 font-bold text-foreground">{item.product_name}</td>
                                            <td className="p-4 text-right font-mono font-bold">{item.selling_price.toLocaleString()}</td>
                                            <td className="p-4 text-right font-mono text-xs text-muted-foreground/60">{item.buying_price.toLocaleString()}</td>
                                            <td className="p-4 text-right font-black">
                                                <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[11px]">
                                                    {item.qty}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1 font-black text-green-600 dark:text-green-400 font-mono">
                                                    <ArrowUpRight className="w-3 h-3" />
                                                    {item.profit.toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-muted-foreground italic">
                                            အစီရင်ခံစာ ပြသရန် ဒေတာမရှိသေးပါ။
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-neutral-50/30 dark:bg-neutral-800/20 border-t text-[11px] text-center text-muted-foreground font-medium">
                        မှတ်ချက်။ ။ အထက်ပါ အချက်အလက်များသည် ဝယ်စျေးနှင့် ရောင်းစျေးအပေါ် အခြေခံ၍ တွက်ချက်ထားသော စုစုပေါင်း အမြတ်ငွေ ဖြစ်ပါသည်။
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}