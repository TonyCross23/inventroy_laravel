import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FormEvent, useEffect, useState, useCallback } from 'react';
import { PlusCircle, PencilLine, Save, Trash2, Package, Search, X, CheckCircle2, AlertCircle } from 'lucide-react';
import debounce from 'lodash/debounce';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'ကုန်ပစ္စည်းများ', href: '/products' },
];

interface Product {
    id: number;
    name: string;
    stock: number;
    buying_price: string | number;
}

interface Props {
    products: {
        data: Product[];
    };
    filters: {
        search: string;
    };
}

export default function Index({ products, filters }: Props) {
    const { props } = usePage();
    const flash = (props as any).flash;

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        stock: '',
        buying_price: '',
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
        if (flash?.error) {
            showToast(flash.error, 'error');
        }
    }, [flash]);

    // --- Search Logic ---
    const handleSearch = useCallback(
        debounce((value: string) => {
            router.get('/products', { search: value }, {
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
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        clearErrors();
        setEditingId(product.id);
        setData({
            name: product.name,
            stock: String(product.stock),
            buying_price: String(product.buying_price),
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setEditingId(null);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
        };

        if (editingId) {
            put(`/products/${editingId}`, options);
        } else {
            post('/products', options);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('ဒီပစ္စည်းကို ဖျက်မှာ သေချာပါသလား?')) {
            router.delete(`/products/${id}`, {
                preserveScroll: true,
                onSuccess: () => showToast("ကုန်ပစ္စည်းကို ဖျက်သိမ်းလိုက်ပါပြီ", "success")
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ကုန်ပစ္စည်းများ" />

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

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-2">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="အမည်ဖြင့် ရှာဖွေရန်..."
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

                    <button
                        onClick={openAddModal}
                        className="w-full dark:text-gray-900 md:w-auto h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-primary/90 transition-all active:scale-95"
                    >
                        <PlusCircle className="w-4 h-4" /> ပစ္စည်းအသစ်ထည့်ရန်
                    </button>
                </div>

                {/* --- Table Section --- */}
                <div className="flex-1 rounded-xl border border-sidebar-border/70 bg-card overflow-hidden dark:bg-neutral-900 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b uppercase text-[11px] font-black text-muted-foreground tracking-widest">
                                <tr>
                                    <th className="p-4 flex items-center gap-2"><Package className="w-3 h-3" /> ကုန်ပစ္စည်းအမည်</th>
                                    <th className="p-4 text-right">လက်ကျန်</th>
                                    <th className="p-4 text-right">ဝယ်စျေး</th>
                                    <th className="p-4 text-right">လုပ်ဆောင်ချက်</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/50">
                                {products.data.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="p-4 font-bold text-foreground">{product.name}</td>
                                            <td className="p-4 text-right">
                                                <span className={`px-2 py-1 rounded-md text-[11px] font-black ${Number(product.stock) < 5 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                {Number(product.buying_price).toLocaleString()} <span className="text-[10px] opacity-70">MMK</span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 font-bold text-xs uppercase flex items-center gap-1 transition-colors"><PencilLine className="w-3 h-3" /> ပြင်ရန်</button>
                                                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase flex items-center gap-1 transition-colors"><Trash2 className="w-3 h-3" /> ဖျက်ရန်</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="p-10 text-center text-muted-foreground italic tracking-wide">ကုန်ပစ္စည်းစာရင်း ရှာမတွေ့ပါ။</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- Modal Box --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl border border-sidebar-border overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
                            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                                {editingId ? <PencilLine className="text-blue-500" /> : <PlusCircle className="text-primary" />}
                                {editingId ? 'ပစ္စည်းအချက်အလက်ပြင်ရန်' : 'ကုန်ပစ္စည်းအသစ်ထည့်ရန်'}
                            </h2>
                            <button onClick={closeModal} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">ကုန်ပစ္စည်းအမည်</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full h-11 rounded-lg border bg-transparent px-4 text-sm font-bold outline-none transition-all ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}
                                    placeholder="ပစ္စည်းအမျိုးအမည်ကိုထည့်ပါ"
                                    autoFocus
                                />
                                {errors.name && <p className="text-[11px] text-red-500 font-bold">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">လက်ကျန်အရေအတွက်</label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={e => setData('stock', e.target.value)}
                                        className={`w-full h-11 rounded-lg border bg-transparent px-4 text-sm font-bold outline-none transition-all ${errors.stock ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}
                                        placeholder="0"
                                    />
                                    {errors.stock && <p className="text-[11px] text-red-500 font-bold">{errors.stock}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">ဝယ်စျေး (တခုချင်းစျေးနှုန်း)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.buying_price}
                                        onChange={e => setData('buying_price', e.target.value)}
                                        className={`w-full h-11 rounded-lg border bg-transparent px-4 text-sm font-bold outline-none transition-all ${errors.buying_price ? 'border-red-500 ring-1 ring-red-500' : 'border-input focus:ring-1 focus:ring-primary'}`}
                                        placeholder="0.00"
                                    />
                                    {errors.buying_price && <p className="text-[11px] text-red-500 font-bold">{errors.buying_price}</p>}
                                </div>
                            </div>

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
                                    {processing ? 'သိမ်းဆည်းနေသည်...' : (editingId ? 'အချက်အလက်ပြင်မည်' : 'စာရင်းသွင်းမည်')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}