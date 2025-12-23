
import { useCart } from '../state/CartContext';

export default function AdminNavbar() {
  const { items } = useCart();

  const count = items.length;

  return (
    <header className="bg-white p-4 flex justify-between items-center border-b">
      <div className="text-lg font-semibold">Stock Admin</div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Items in Cart: <span className="font-medium">{count}</span>
        </div>
      </div>
    </header>
  );
}