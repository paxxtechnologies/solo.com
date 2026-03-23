"use client";

import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/context/toast-context";

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    name: "John Doe",
    phone: "+234 801 234 5678",
    address: "15 Admiralty Way, Lekki Phase 1",
    city: "Lekki",
    state: "Lagos",
    postalCode: "101233",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    name: "John Doe",
    phone: "+234 802 345 6789",
    address: "Plot 5, Allen Avenue",
    city: "Ikeja",
    state: "Lagos",
    postalCode: "100001",
    isDefault: false,
  },
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function AddressesPage() {
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    label: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
    postalCode: "",
    isDefault: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId
            ? { ...addr, ...formData }
            : formData.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
      );
      showToast("Address updated successfully", "success");
      setEditingId(null);
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        label: formData.label || "Address",
        name: formData.name || "",
        phone: formData.phone || "",
        address: formData.address || "",
        city: formData.city || "",
        state: formData.state || "Lagos",
        postalCode: formData.postalCode || "",
        isDefault: formData.isDefault || false,
      };

      if (newAddress.isDefault) {
        setAddresses((prev) =>
          prev.map((addr) => ({ ...addr, isDefault: false }))
        );
      }

      setAddresses((prev) => [...prev, newAddress]);
      showToast("Address added successfully", "success");
      setIsAddingNew(false);
    }

    setFormData({
      label: "",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "Lagos",
      postalCode: "",
      isDefault: false,
    });
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    showToast("Address deleted", "info");
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    showToast("Default address updated", "success");
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      label: "",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "Lagos",
      postalCode: "",
      isDefault: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            My Addresses
          </h1>
          <p className="text-muted">Manage your delivery addresses</p>
        </div>
        {!isAddingNew && !editingId && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-xl border border-border p-6"
        >
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Address Label
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                placeholder="e.g., Home, Office"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+234 800 000 0000"
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted">Set as default address</span>
          </label>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Check className="w-4 h-4" />
              {editingId ? "Update" : "Save"} Address
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-surface-alt transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-surface rounded-xl border p-5 ${
                address.isDefault ? "border-primary" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {address.label}
                  </span>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-semibold rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-muted hover:text-foreground hover:bg-surface-alt rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-foreground">{address.name}</p>
                <p className="text-sm text-muted">{address.phone}</p>
                <p className="text-sm text-muted">
                  {address.address}, {address.city}, {address.state}{" "}
                  {address.postalCode}
                </p>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <MapPin className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
            No addresses saved
          </h2>
          <p className="text-muted mb-6">
            Add a delivery address to make checkout faster
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Address
          </button>
        </div>
      )}
    </div>
  );
}
