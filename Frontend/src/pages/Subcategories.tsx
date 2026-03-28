import { useEffect, useState } from 'react'
import api from '../api/client'
import { useCategories } from '../hooks/useQueryHelpers'
import { 
  Layers, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  FolderTree,
  ChevronRight,
  Info
} from 'lucide-react'

export default function Subcategories() {
  const { data: cats } = useCategories()

  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', categoryId: '' })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const res = await api.get('/subcategories')
      setList(res.data)
    } catch (err) {
      console.error("Load failed", err)
    } finally {
      setLoading(false)
    }
  }

  const create = async () => {
    if (!form.name || !form.categoryId) return;
    try {
      await api.post('/subcategories', {
        name: form.name,
        categoryId: Number(form.categoryId),
      })
      setForm({ name: '', categoryId: '' })
      alert("Subcategory Created");
      load()
    } catch (err) {
      alert("Failed to create subcategory")
    }
  }

  const startEdit = (s: any) => {
    setEditId(s.id)
    setForm({
      name: s.name,
      categoryId: String(s.categoryId),
    })
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const update = async () => {
    try {
      await api.put(`/subcategories/${editId}`, {
        name: form.name,
        categoryId: Number(form.categoryId),
      })
      setEditId(null)
      setForm({ name: '', categoryId: '' })
      alert("Subcategory Updated");
      load()
    } catch (err) {
      alert("Update failed")
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this subcategory?')) return
    try {
      await api.delete(`/subcategories/${id}`)
      load()
    } catch (err) {
      alert("Delete failed")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Mapping Sub-Classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12 bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-base font-extrabold text-black tracking-tight">Sub-Classification</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">精確的分類與商品管理</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 shadow-sm text-gray-400 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest self-start md:self-auto">
          <FolderTree size={14} />
          <span>{list.length} SUB-CLASSES</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 sticky top-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-2.5 bg-black text-white rounded-xl shadow-lg">
                {editId ? <Edit3 size={20} /> : <Plus size={20} />}
              </div>
              <h2 className="text-base font-bold text-black uppercase tracking-tight">
                {editId ? 'Edit Variant' : 'New Subcategory'}
              </h2>
            </div>

            <div className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Parent Category</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold appearance-none outline-none focus:bg-white focus:border-emerald-500 transition-all h-14"
                >
                  <option value="">Select Category</option>
                  {cats?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Sub-Class Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Fresh Catch"
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-gray-300 focus:bg-white focus:border-emerald-500 outline-none transition-all h-14"
                />
              </div>

              <button
                onClick={editId ? update : create}
                className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/5 hover:bg-emerald-600 transition-all duration-300 active:scale-95"
              >
                {editId ? 'Update Classification' : 'Add Subcategory'}
              </button>

              {editId && (
                <button
                  onClick={() => {
                    setEditId(null)
                    setForm({ name: '', categoryId: '' })
                  }}
                  className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3 relative">
              <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-relaxed">
                Subcategories help customers find products faster. Make sure to choose descriptive names.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((s) => {
              const cat = cats?.find((c: any) => c.id === s.categoryId)
              return (
                <div
                  key={s.id}
                  className="bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 group hover:translate-x-1 transition-all duration-300 hover:border-emerald-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <h3 className="text-base font-black text-black leading-tight mb-1 group-hover:text-emerald-600 transition-colors">
                        {s.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <Layers size={10} className="text-emerald-500" />
                        {cat?.name || 'Unassigned'}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(s)}
                        className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-black hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => remove(s.id)}
                        className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[9px] font-black text-gray-300 group-hover:text-gray-400 uppercase tracking-widest">ID: {String(s.id).padStart(3, '0')}</span>
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border-2 border-white shadow-sm flex items-center justify-center font-black text-[8px] text-emerald-600">
                      {s.name.charAt(0)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {list.length === 0 && !loading && (
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-gray-300">
               <Layers size={48} className="mb-4 opacity-10" />
               <p className="font-black uppercase tracking-widest text-[10px]">No subcategories grouped yet</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}