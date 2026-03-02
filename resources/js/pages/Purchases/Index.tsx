import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent, useEffect, useState, useCallback } from 'react';
import { PlusCircle, Trash2, ShoppingCart, FileDown, Search, X, Calendar, Package, Tag, Banknote, CheckCircle2, AlertCircle } from 'lucide-react';
import debounce from 'lodash/debounce';
import Pagination from '@/components/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'အဝယ်စာရင်း', href: '/purchases' },
];

interface Product {
    id: number;
    name: string;
}

interface Purchase {
    id: number;
    product_id: number;
    qty: number;
    unit_purchase_price: number;
    created_at: string;
    product: {
        name: string;
    };
}

interface Props {
    purchases: {
        data: Purchase[];
        links: any[];
    };
    products: Product[];
    filters: {
        search: string;
    };
}

export default function Index({ purchases, products, filters }: Props) {
    const { props } = usePage();
    const flash = (props as any).flash;

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        product_id: '',
        qty: '',
        total_amount: '',
    });

    // --- Toast Logic ---
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: null }), 3000);
    };

    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success, 'success');
        }
    }, [flash]);

    // --- Search Logic ---
    const handleSearch = useCallback(
        debounce((value: string) => {
            router.get('/purchases', { search: value }, {
                preserveState: true,
                replace: true,
                preserveScroll: true
            });
        }, 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        handleSearch(e.target.value);
    };

    const openAddModal = () => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/purchases', {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                showToast("အဝယ်မှတ်တမ်း အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ", "success");
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('ဒီအဝယ်မှတ်တမ်းကို ဖျက်မှာ သေချာပါသလား? (ပစ္စည်းလက်ကျန် ပြန်လျော့သွားပါမည်)')) {
            router.delete(`/purchases/${id}`, {
                preserveScroll: true,
                onSuccess: () => showToast("အဝယ်မှတ်တမ်းကို ဖျက်သိမ်းလိုက်ပါပြီ", "success")
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="အဝယ်စာရင်း" />

            {/* --- Custom Toast Notification --- */}
            {toast.type && (
                <div className="fixed top-5 right-5 z-[120] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`flex items-center gap-3 px-6 py-3 text-white shadow-2xl rounded-xl border ${toast.type === 'success' ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'}`}>
                        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-bold text-sm">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 p-4 overflow-y-auto">

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-2">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="ကုန်ပစ္စည်းအမည်ဖြင့် ရှာဖွေရန်..."
                            value={searchValue}
                            onChange={onSearchChange}
                            className="w-full pl-10 h-10 rounded-lg border border-input bg-card px-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                        {searchValue && (
                            <button onClick={() => { setSearchValue(''); handleSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <a
                            href="/purchases/export"
                            className="flex-1 md:flex-none h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-[13px] font-black text-white shadow-md hover:bg-green-700 transition-all active:scale-95"
                        >
                            <FileDown className="w-4 h-4" /> Excel ထုတ်မည်
                        </a>
                        <button
                            onClick={openAddModal}
                            className="flex-1 md:flex-none h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-[13px] font-black text-white dark:text-gray-900 shadow-md hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-tight"
                        >
                            <PlusCircle className="w-4 h-4" /> အဝယ်သစ်ထည့်မည်
                        </button>
                    </div>
                </div>

                <div className="flex-1 rounded-xl border border-sidebar-border/70 bg-card overflow-hidden dark:bg-neutral-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b uppercase text-[11px] font-black text-muted-foreground tracking-widest">
                                <tr>
                                    <th className="p-4"><div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> ရက်စွဲ</div></th>
                                    <th className="p-4"><div className="flex items-center gap-2"><Package className="w-3 h-3" /> ကုန်ပစ္စည်း</div></th>
                                    <th className="p-4 text-right">အရေအတွက်</th>
                                    <th className="p-4 text-right">တစ်ခုချင်းစျေး</th>
                                    <th className="p-4 text-right">စုစုပေါင်းကျသင့်ငွေ</th>
                                    <th className="p-4 text-right">လုပ်ဆောင်ချက်</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50">
                                {purchases.data.length > 0 ? (
                                    purchases.data.map((purchase) => (
                                        <tr key={purchase.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(purchase.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-bold text-foreground">{purchase.product.name}</td>
                                            <td className="p-4 text-right font-black">{purchase.qty}</td>
                                            <td className="p-4 text-right font-mono text-xs opacity-70">
                                                {Number(purchase.unit_purchase_price).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right font-mono font-black text-indigo-600 dark:text-indigo-400">
                                                {(purchase.qty * purchase.unit_purchase_price).toLocaleString()} <span className="text-[10px] font-normal">MMK</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(purchase.id)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-xs uppercase flex items-center justify-end gap-1 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" /> ဖျက်မည်
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={6} className="p-10 text-center text-muted-foreground italic">အဝယ်မှတ်တမ်းစာရင်း မရှိသေးပါ။</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={purchases.links} />
                </div>
            </div>

            {/* --- Modal Box --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl border border-sidebar-border overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
                            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                                <ShoppingCart className="text-primary" />
                                အဝယ်မှတ်တမ်းအသစ်
                            </h2>
                            <button onClick={closeModal} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase text-muted-foreground flex items-center gap-1 tracking-widest">
                                    <Tag className="w-3 h-3" /> ပစ္စည်းရွေးချယ်ရန်
                                </label>
                                <select
                                    value={data.product_id}
                                    onChange={e => setData('product_id', e.target.value)}
                                    className={`w-full h-11 rounded-lg border bg-transparent px-4 text-sm font-bold outline-none transition-all ${errors.product_id ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}
                                >
                                    <option value="">-- ပစ္စည်းရွေးပါ --</option>
                                    {products.map((p) => (
                                        <option className="dark:text-gray-950" key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                {errors.product_id && <p className="text-[11px] text-red-500 font-bold">{errors.product_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-muted-foreground flex items-center gap-1 tracking-widest">
                                        <Package className="w-3 h-3" /> အရေအတွက်
                                    </label>
                                    <input
                                        type="number"
                                        value={data.qty}
                                        onChange={e => setData('qty', e.target.value)}
                                        className={`w-full h-11 rounded-lg border bg-transparent px-4 text-sm font-bold outline-none transition-all ${errors.qty ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}
                                        placeholder="0"
                                    />
                                    {errors.qty && <p className="text-[11px] text-red-500 font-bold">{errors.qty}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-muted-foreground flex items-center gap-1 tracking-widest">
                                        <Banknote className="w-3 h-3" /> စုစုပေါင်းကုန်ကျငွေ
                                    </label>
                                    <input
                                        type="number"
                                        value={data.total_amount}
                                        onChange={e => setData('total_amount', e.target.value)}
                                        className={`w-full h-11 rounded-lg border bg-transparent px-4 text-sm font-bold outline-none transition-all ${errors.total_amount ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}
                                        placeholder="ကျပ် (MMK)"
                                    />
                                    {errors.total_amount && <p className="text-[11px] text-red-500 font-bold">{errors.total_amount}</p>}
                                </div>
                            </div>

                            {/* Auto Calculation Preview */}
                            {data.qty && data.total_amount && Number(data.qty) > 0 && (
                                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-center animate-in fade-in zoom-in-95 duration-300">
                                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-black tracking-widest mb-1">တစ်ခုချင်းကျသင့်စျေး (ခန့်မှန်းခြေ)</p>
                                    <p className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                                        {(Number(data.total_amount) / Number(data.qty)).toLocaleString()} <span className="text-[11px] font-normal opacity-70">MMK / unit</span>
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 h-11 rounded-lg border border-input font-black text-[11px] uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    မလုပ်တော့ပါ
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-[2] h-11 dark:text-gray-900 rounded-lg bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {processing ? 'သိမ်းဆည်းနေသည်...' : 'စာရင်းသွင်းမည်'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}