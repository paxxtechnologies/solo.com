"use client";

import { useState } from "react";
import {
    Tag,
    Plus,
    Search,
    MoreVertical,
    Ticket,
    Percent,
    Truck,
    DollarSign,
    CheckCircle2,
    Clock,
    XCircle,
    Info,
} from "lucide-react";

type PromotionType = "percentage" | "fixed" | "shipping";
type PromotionStatus = "active" | "scheduled" | "expired";

interface Promotion {
    id: string;
    code: string;
    type: PromotionType;
    value: number | "Free";
    minPurchase: number | null;
    usageCount: number;
    usageLimit: number | null;
    status: PromotionStatus;
    ambassador?: string;
}

const initialPromotions: Promotion[] = [
    {
        id: "promo_1",
        code: "EVADO123",
        type: "shipping",
        value: "Free",
        minPurchase: null,
        usageCount: 45,
        usageLimit: null,
        status: "active",
        ambassador: "Evado (Brand Ambassador)",
    },
    {
        id: "promo_2",
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        minPurchase: 50000,
        usageCount: 128,
        usageLimit: 500,
        status: "active",
    },
    {
        id: "promo_3",
        code: "FLASHSALE",
        type: "fixed",
        value: 5000,
        minPurchase: 10000,
        usageCount: 50,
        usageLimit: 50,
        status: "expired",
    },
];

export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newPromo, setNewPromo] = useState({
        code: "",
        type: "percentage" as PromotionType,
        value: "",
        minPurchase: "",
        usageLimit: "",
        ambassador: "",
    });

    const handleCreatePromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPromo.code) return;

        const promo: Promotion = {
            id: `promo_${Math.random()}`,
            code: newPromo.code.toUpperCase(),
            type: newPromo.type,
            value: newPromo.type === "shipping" ? "Free" : Number(newPromo.value) || 0,
            minPurchase: newPromo.minPurchase ? Number(newPromo.minPurchase) : null,
            usageCount: 0,
            usageLimit: newPromo.usageLimit ? Number(newPromo.usageLimit) : null,
            status: "active",
            ambassador: newPromo.ambassador || undefined,
        };

        setPromotions([promo, ...promotions]);
        setIsCreating(false);
        setNewPromo({ code: "", type: "percentage", value: "", minPurchase: "", usageLimit: "", ambassador: "" });
    };

    const getStatusBadge = (status: PromotionStatus) => {
        switch (status) {
            case "active":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-solo-green bg-solo-green/10 border border-solo-green/20"><CheckCircle2 className="w-3 h-3" /> Active</span>;
            case "scheduled":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20"><Clock className="w-3 h-3" /> Scheduled</span>;
            case "expired":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-solo-muted bg-solo-soft-gray border border-solo-muted/20"><XCircle className="w-3 h-3" /> Expired</span>;
        }
    };

    const getTypeIcon = (type: PromotionType) => {
        switch (type) {
            case "percentage":
                return <Percent className="w-4 h-4 text-solo-navy" />;
            case "fixed":
                return <DollarSign className="w-4 h-4 text-solo-navy" />;
            case "shipping":
                return <Truck className="w-4 h-4 text-solo-navy" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-solo-navy tracking-tight">Promotions & Coupons</h1>
                    <p className="text-solo-muted mt-1 font-medium">Manage discount codes, minimum order requirements, and ambassador offers.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-6 py-3 bg-solo-green text-white font-bold rounded-xl hover:bg-solo-deep-green hover:shadow-lg hover:shadow-solo-green/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    {isCreating ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isCreating ? "Cancel" : "Create Promotion"}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Creation Panel */}
                {isCreating && (
                    <div className="xl:col-span-1 bg-white rounded-[24px] shadow-2xl shadow-solo-navy/[0.05] border border-solo-green/30 p-6 animate-in slide-in-from-left-8 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-solo-green/10 rounded-xl flex items-center justify-center">
                                <Ticket className="w-5 h-5 text-solo-green" />
                            </div>
                            <h2 className="text-lg font-bold text-solo-navy">New Promo Code</h2>
                        </div>

                        <form onSubmit={handleCreatePromo} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-solo-navy uppercase tracking-wider mb-2">Coupon Code</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-solo-muted" />
                                    <input
                                        type="text"
                                        required
                                        maxLength={15}
                                        placeholder="e.g. EVADO123"
                                        value={newPromo.code}
                                        onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-solo-muted/20 bg-solo-soft-gray/50 text-solo-navy font-bold uppercase focus:outline-none focus:ring-2 focus:ring-solo-green/30 transition-all uppercase placeholder:normal-case"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-solo-navy uppercase tracking-wider mb-2">Promotion Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: "percentage", label: "Percent %", icon: Percent },
                                        { id: "fixed", label: "Fixed ₦", icon: DollarSign },
                                        { id: "shipping", label: "Shipping", icon: Truck },
                                    ].map((type) => {
                                        const Icon = type.icon;
                                        const isSelected = newPromo.type === type.id;
                                        return (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setNewPromo({ ...newPromo, type: type.id as PromotionType, value: type.id === "shipping" ? "" : newPromo.value })}
                                                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all ${isSelected
                                                    ? "bg-solo-green/10 border-solo-green text-solo-green shadow-sm"
                                                    : "bg-white border-solo-muted/20 text-solo-muted hover:border-solo-navy/20"
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase">{type.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {newPromo.type !== "shipping" && (
                                <div>
                                    <label className="block text-xs font-bold text-solo-navy uppercase tracking-wider mb-2">
                                        {newPromo.type === "percentage" ? "Discount Percentage" : "Discount Amount (₦)"}
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={1}
                                        max={newPromo.type === "percentage" ? 100 : undefined}
                                        placeholder={newPromo.type === "percentage" ? "e.g. 15" : "e.g. 5000"}
                                        value={newPromo.value}
                                        onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-solo-muted/20 bg-solo-soft-gray/50 text-solo-navy font-bold focus:outline-none focus:ring-2 focus:ring-solo-green/30 transition-all"
                                    />
                                </div>
                            )}

                            <div className="p-3 bg-solo-soft-gray rounded-xl border border-solo-muted/10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-solo-navy" />
                                    <p className="text-[11px] font-bold text-solo-navy uppercase">Constraints & Rules</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-solo-muted uppercase tracking-wider mb-1">Min. Order Value (₦) <span className="font-medium text-[10px]">(Optional)</span></label>
                                    <input
                                        type="number"
                                        min={1}
                                        placeholder="e.g. 10000"
                                        value={newPromo.minPurchase}
                                        onChange={(e) => setNewPromo({ ...newPromo, minPurchase: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-solo-muted/20 bg-white text-solo-navy font-medium focus:outline-none focus:ring-2 focus:ring-solo-green/30 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-solo-muted uppercase tracking-wider mb-1">Usage Limit <span className="font-medium text-[10px]">(Optional)</span></label>
                                    <input
                                        type="number"
                                        min={1}
                                        placeholder="e.g. 50 customers"
                                        value={newPromo.usageLimit}
                                        onChange={(e) => setNewPromo({ ...newPromo, usageLimit: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-solo-muted/20 bg-white text-solo-navy font-medium focus:outline-none focus:ring-2 focus:ring-solo-green/30 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-solo-navy uppercase tracking-wider mb-2">Ambassador / Note (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Evado Campaign"
                                    value={newPromo.ambassador}
                                    onChange={(e) => setNewPromo({ ...newPromo, ambassador: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-solo-muted/20 bg-solo-soft-gray/50 text-solo-navy font-medium focus:outline-none focus:ring-2 focus:ring-solo-green/30 transition-all"
                                />
                            </div>

                            <div className="pt-4 border-t border-solo-muted/10">
                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-solo-navy text-white font-bold rounded-xl hover:bg-solo-deep-navy transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" /> Activate Promo Code
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Promotions List */}
                <div className={`bg-white rounded-[24px] shadow-xl shadow-solo-navy/[0.03] border border-solo-muted/10 flex flex-col overflow-hidden ${isCreating ? "xl:col-span-2" : "xl:col-span-3"}`}>
                    <div className="p-6 border-b border-solo-muted/10 bg-solo-soft-gray/30 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-solo-navy">Active & Past Promotions</h2>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-solo-muted" />
                            <input
                                type="text"
                                placeholder="Search codes..."
                                className="pl-9 pr-4 py-2 rounded-lg border border-solo-muted/20 bg-white text-sm font-medium focus:outline-none focus:border-solo-green/50 w-48 sm:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left font-bold text-solo-muted uppercase tracking-wider px-6 py-4 text-xs">Code</th>
                                    <th className="text-left font-bold text-solo-muted uppercase tracking-wider px-6 py-4 text-xs">Rule / Value</th>
                                    <th className="text-left font-bold text-solo-muted uppercase tracking-wider px-6 py-4 text-xs">Usage</th>
                                    <th className="text-left font-bold text-solo-muted uppercase tracking-wider px-6 py-4 text-xs">Status</th>
                                    <th className="text-right px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-solo-muted/5">
                                {promotions.map((promo) => (
                                    <tr key={promo.id} className="hover:bg-solo-soft-gray/50 transition-colors group">
                                        <td className="px-6 py-4 align-top">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="w-4 h-4 text-solo-green" />
                                                    <span className="font-extrabold text-solo-navy uppercase tracking-wider">{promo.code}</span>
                                                </div>
                                                {promo.ambassador && (
                                                    <span className="text-[10px] font-bold text-solo-muted uppercase mt-1.5 block">
                                                        👤 {promo.ambassador}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-solo-soft-gray flex items-center justify-center border border-solo-muted/10">
                                                        {getTypeIcon(promo.type)}
                                                    </div>
                                                    <span className="font-bold text-solo-navy">
                                                        {promo.type === "percentage" ? `${promo.value}% OFF` : promo.type === "fixed" ? `₦${promo.value.toLocaleString()} OFF` : "FREE SHIPPING"}
                                                    </span>
                                                </div>
                                                {promo.minPurchase && (
                                                    <span className="text-[10px] font-bold text-solo-muted tracking-wide mt-1 inline-flex items-center gap-1 bg-white border border-solo-muted/10 px-2 py-0.5 rounded">
                                                        MIN ORDER: ₦{promo.minPurchase.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex flex-col gap-0.5 max-w-[120px]">
                                                    <div className="flex items-center justify-between text-xs font-bold text-solo-navy">
                                                        <span>{promo.usageCount}</span>
                                                        <span className="text-solo-muted">{promo.usageLimit ? `/ ${promo.usageLimit}` : "∞"}</span>
                                                    </div>
                                                    {promo.usageLimit && (
                                                        <div className="w-full bg-solo-soft-gray rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="bg-solo-green h-full rounded-full"
                                                                style={{ width: `${Math.min((promo.usageCount / promo.usageLimit) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            {getStatusBadge(promo.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right align-top">
                                            <button className="p-2 rounded-lg text-solo-muted hover:bg-white hover:text-solo-navy hover:shadow-sm transition-all border border-transparent hover:border-solo-muted/20">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {promotions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-solo-muted font-medium">
                                            No active promotions. Click "Create Promotion" to generate a code.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

