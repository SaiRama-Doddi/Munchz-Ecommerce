import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import { listAddressesApi, addAddressApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import type { CartItem, Address } from "../types/checkout";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { state } = useLocation();

  const { items, totalAmount } = state as {
    items: CartItem[];
    totalAmount: number;
  };

  /* ================= ADDRESSES ================= */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
  });

  /* ================= LOAD ADDRESSES ================= */
  useEffect(() => {
    listAddressesApi().then((res) => {
      setAddresses(res.data);
      const def = res.data.find((a: Address) => a.isDefault);
      if (def) setSelectedAddress(def);
    });
  }, []);

  /* ================= ADD ADDRESS ================= */
  const saveNewAddress = async () => {
    await addAddressApi({
      ...newAddress,
      country: "India",
      isDefault: true,
    });

    const res = await listAddressesApi();
    setAddresses(res.data);
    setSelectedAddress(res.data.find((a: Address) => a.isDefault));
    setShowNewAddress(false);
  };
/* ================= PLACE ORDER ================= */
const placeOrder = async () => {
  if (!selectedAddress) {
    alert("Please select a shipping address");
    return;
  }

  const payload = {
    shippingAddress: JSON.stringify(selectedAddress),
    billingAddress: JSON.stringify(selectedAddress),
    items: items.map((item) => {
      const v = item.variants[item.selectedVariantIndex];
      return {
        productId: item.productId,
        variantId: v.id,
        quantity: item.qty,
      };
    }),
  };

  console.log("ORDER PAYLOAD", payload);

  try {
    const res = await orderApi.post("/api/orders", payload); // JWT goes in header
    navigate("/", { state: res.data });
  } catch (err: any) {
  console.error("ORDER ERROR", err.response?.data || err.message);
  alert(err.response?.data?.message || "Order failed");
}

};


  return (
    <div className="min-h-screen bg-[#f6fff4] py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-6">

        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* ITEMS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Order Items</h3>

            {items.map((item, idx) => {
              const v = item.variants[item.selectedVariantIndex];
              return (
                <div key={idx} className="flex gap-4 mb-4">
                  <img
                    src={item.imageUrl}
                    className="w-20 h-20 object-contain rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {v.weightLabel} × {item.qty}
                    </p>
                    <p className="text-green-700 font-semibold">
                      ₹{v.offerPrice * item.qty}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADDRESSES */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Shipping Address</h3>

            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`border rounded-lg p-3 mb-2 cursor-pointer ${
                  selectedAddress?.id === addr.id
                    ? "border-green-600 bg-green-50"
                    : ""
                }`}
              >
                <p className="font-medium">{addr.label}</p>
                <p className="text-sm text-gray-600">
                  {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                {addr.mobile && (
                  <p className="text-xs text-gray-500">📞 {addr.mobile}</p>
                )}
              </div>
            ))}

            <button
              onClick={() => setShowNewAddress(!showNewAddress)}
              className="text-green-600 text-sm mt-2"
            >
              + Add New Address
            </button>

            {showNewAddress && (
              <div className="mt-4 grid gap-3">
                <input
                  placeholder="Label"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, label: e.target.value })
                  }
                />
                <input
                  placeholder="Address Line"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, addressLine1: e.target.value })
                  }
                />
                <input
                  placeholder="City"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <input
                  placeholder="State"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                <input
                  placeholder="Pincode"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                />
                <button
                  onClick={saveNewAddress}
                  className="bg-green-600 text-white py-2 rounded"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h3 className="font-semibold mb-4">Price Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
          <hr className="my-4" />
          <button
            onClick={placeOrder}
            className="w-full bg-green-700 text-white py-3 rounded-lg"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
