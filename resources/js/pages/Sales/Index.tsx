import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormEvent, useEffect, useState, useCallback } from 'react';
import { PlusCircle, Trash2, Search, X, Calendar, Package, ArrowUpRight, FileDown, CheckCircle2, AlertCircle, ShoppingBag, Banknote } from 'lucide-react';
import debounce from 'lodash/debounce';
import Pagination from '@/components/pagination';

export default function Index({ sales, products, filters }: any) {
    const { props } = usePage();
    const flash = (props as any).flash;

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        product_id: '',
        qty: '',
        unit_selling_price: '',
    });

    // --- Toast Logic ---
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: null }), 3000);
    };

    useEffect(() => {
        if (flash?.success) showToast(flash.success, 'success');
        if (flash?.error) showToast(flash.error, 'error');
    }, [flash]);

    const handleSearch = useCallback(
        debounce((v) => router.get('/sales', { search: v }, { preserveState: true, replace: true, preserveScroll: true }), 300), []
    );

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/sales', {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                showToast("အရောင်းမှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ", "success");
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('ဒီအရောင်းမှတ်တမ်းကို ဖျက်မှာ သေချာပါသလား? (ပစ္စည်းလက်ကျန် ပြန်တိုးလာပါမည်)')) {
            router.delete(`/sales/${id}`, {
                preserveScroll: true,
                onSuccess: () => showToast("ဖျက်သိမ်းခြင်း အောင်မြင်ပါသည်", "success")
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'အရောင်းစာရင်း', href: '/sales' }]}>
            <Head title="အရောင်းမှတ်တမ်းများ" />

            {/* --- Custom Toast Notification --- */}
            {toast.type && (
                <div className="fixed top-5 right-5 z-[120] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`flex items-center gap-3 px-6 py-3 text-white shadow-2xl rounded-xl border ${toast.type === 'success' ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'}`}>
                        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold text-sm">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="p-6 space-y-4">
                {/* Search & Actions Area */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-card p-4 rounded-xl border border-sidebar-border/70 gap-4 shadow-sm">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            className="w-full pl-10 h-10 border border-input rounded-lg bg-transparent focus:ring-1 focus:ring-primary outline-none text-sm font-medium"
                            placeholder="ပစ္စည်းအမည်ဖြင့် ရှာဖွေရန်..."
                            value={searchValue}
                            onChange={(e) => { setSearchValue(e.target.value); handleSearch(e.target.value); }}
                        />
                        {searchValue && (
                            <button onClick={() => { setSearchValue(''); handleSearch(''); }} className="absolute right-3 top-2.5">
                                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <a
                            href="/sales/export"
                            className="flex-1 md:flex-none h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-[13px] font-black text-white shadow-md hover:bg-green-700 transition-all active:scale-95"
                        >
                            <FileDown className="w-4 h-4" /> Excel ထုတ်မည်
                        </a>

                        <button onClick={() => { reset(); clearErrors(); setIsModalOpen(true); }}
                            className="flex-1 md:flex-none bg-primary text-white dark:text-gray-900 h-10 px-6 rounded-lg font-black text-[13px] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-tight">
                            <PlusCircle className="w-4 h-4" /> အရောင်းသစ်ထည့်မည်
                        </button>
                    </div>
                </div>

                {/* Table Area */}
                <div className="bg-card border border-sidebar-border/70 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b font-black text-muted-foreground uppercase text-[11px] tracking-widest">
                            <tr>
                                <th className="p-4"><div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> ရက်စွဲ</div></th>
                                <th className="p-4"><div className="flex items-center gap-2"><Package className="w-3 h-3" /> ကုန်ပစ္စည်း</div></th>
                                <th className="p-4 text-right">အရေအတွက်</th>
                                <th className="p-4 text-right">ရောင်းစျေး</th>
                                <th className="p-4 text-right text-indigo-600 dark:text-indigo-400">စုစုပေါင်း</th>
                                <th className="p-4 text-right">လုပ်ဆောင်ချက်</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/50">
                            {sales.data.length > 0 ? sales.data.map((sale: any) => (
                                <tr key={sale.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                                    <td className="p-4 text-muted-foreground text-xs">{new Date(sale.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-foreground">{sale.product.name}</td>
                                    <td className="p-4 text-right font-black">
                                        <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{sale.qty}</span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-xs opacity-70">{Number(sale.unit_selling_price).toLocaleString()}</td>
                                    <td className="p-4 text-right font-black text-indigo-600 dark:text-indigo-400 font-mono">
                                        {(sale.qty * sale.unit_selling_price).toLocaleString()} <span className="text-[10px] font-normal">MMK</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(sale.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="p-10 text-center text-muted-foreground italic">အရောင်းမှတ်တမ်း မရှိသေးပါ။</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={sales.links} />
            </div>

            {/* --- New Sale Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card dark:bg-neutral-900 w-full max-w-md rounded-2xl border border-sidebar-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
                            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                                <ShoppingBag className="text-primary" /> အရောင်းမှတ်တမ်းသစ်
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                                    <Package className="w-3 h-3" /> ပစ္စည်းရွေးချယ်ရန်
                                </label>
                                <select value={data.product_id} onChange={e => setData('product_id', e.target.value)}
                                    className={`w-full h-11 border  rounded-lg bg-transparent px-3 text-sm font-bold outline-none transition-all ${errors.product_id ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}>
                                    <option value="">-- ရွေးချယ်ပါ --</option>
                                    {products.map((p: any) => (
                                        <option className="dark:text-gray-950" key={p.id} value={p.id} disabled={p.stock <= 0}>
                                            {p.name} (လက်ကျန်: {p.stock})
                                        </option>
                                    ))}
                                </select>
                                {errors.product_id && <p className="text-red-500 text-[11px] font-bold">{errors.product_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                                        အရေအတွက်
                                    </label>
                                    <input type="number" value={data.qty} onChange={e => setData('qty', e.target.value)}
                                        className={`w-full h-11 border rounded-lg bg-transparent px-3 text-sm font-bold outline-none ${errors.qty ? 'border-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}
                                        placeholder="0" />
                                    {errors.qty && <p className="text-red-500 text-[11px] font-bold">{errors.qty}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                                        ရောင်းစျေး (တစ်ခု)
                                    </label>
                                    <input type="number" value={data.unit_selling_price} onChange={e => setData('unit_selling_price', e.target.value)}
                                        className={`w-full h-11 border rounded-lg bg-transparent px-3 text-sm font-bold outline-none ${errors.unit_selling_price ? 'border-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}
                                        placeholder="0" />
                                    {errors.unit_selling_price && <p className="text-red-500 text-[11px] font-bold">{errors.unit_selling_price}</p>}
                                </div>
                            </div>

                            {/* Live Total Preview - ဝယ်သူကြည့်ဖို့ အရမ်းအဆင်ပြေပါတယ် */}
                            {data.qty && data.unit_selling_price && (
                                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-center animate-in zoom-in-95">
                                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-black tracking-widest mb-1">စုစုပေါင်း ကျသင့်ငွေ</p>
                                    <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300 font-mono">
                                        {(Number(data.qty) * Number(data.unit_selling_price)).toLocaleString()} <span className="text-[11px] font-normal opacity-70">MMK</span>
                                    </p>
                                </div>
                            )}

                            <div className="pt-2 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-12 rounded-xl border border-input font-black text-[11px] uppercase tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    မလုပ်တော့ပါ
                                </button>
                                <button disabled={processing}
                                    className="flex-[2] h-12 bg-primary text-white dark:text-gray-900 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50">
                                    {processing ? 'သိမ်းဆည်းနေသည်...' : 'အရောင်းအတည်ပြုမည်'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}