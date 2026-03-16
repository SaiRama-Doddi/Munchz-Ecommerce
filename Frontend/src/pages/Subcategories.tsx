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

  return (
    <div className="space-y-10 pb-12 overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Subcategories</h1>
          <p className="text-slate-500 font-medium">Organize your inventory with precise sub-classification</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100/50">
          <FolderTree size={14} />
          <span>{list.length} Sub-Classes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div className="xl:col-span-1">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10 sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                {editId ? <Edit3 size={20} /> : <Plus size={20} />}
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {editId ? 'Edit Variant' : 'New Subcategory'}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Parent Category</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })}
                  className="input h-14"
                >
                  <option value="">Select Category</option>
                  {cats?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Sub-Class Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Fresh Catch"
                  className="input h-14"
                />
              </div>

              <button
                onClick={editId ? update : create}
                className="w-full bg-accent-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300 active:scale-95"
              >
                {editId ? 'Update Classification' : 'Add Subcategory'}
              </button>

              {editId && (
                <button
                  onClick={() => {
                    setEditId(null)
                    setForm({ name: '', categoryId: '' })
                  }}
                  className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <div className="mt-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex gap-3">
              <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
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
                  className="glass-card rounded-3xl p-6 group hover:translate-x-1 transition-all duration-300 border border-slate-100 hover:border-emerald-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">
                        {s.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                        <Layers size={10} className="text-emerald-500" />
                        {cat?.name || 'Unassigned'}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(s)}
                        className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => remove(s.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">ID: BK-{s.id}</span>
                    <div className="flex -space-x-2">
                       {/* Placeholder for future product count or similar */}
                       <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {list.length === 0 && !loading && (
            <div className="glass-card rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-slate-300">
               <Layers size={48} className="mb-4 opacity-10" />
               <p className="font-black uppercase tracking-widest text-xs">No subcategories grouped yet</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}