import { useEffect, useState } from 'react'
import api from '../api/client'
import { useCategories } from '../hooks/useQueryHelpers'

export default function Subcategories() {
  const { data: cats } = useCategories()

  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', categoryId: '' })
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const res = await api.get('/subcategories')
    setList(res.data)
  }

  const create = async () => {
    await api.post('/subcategories', {
      name: form.name,
      categoryId: Number(form.categoryId),
    })
    setForm({ name: '', categoryId: '' })
    load()
  }

  const startEdit = (s: any) => {
    setEditId(s.id)
    setForm({
      name: s.name,
      categoryId: String(s.categoryId),
    })
  }

  const update = async () => {
    await api.put(`/subcategories/${editId}`, {
      name: form.name,
      categoryId: Number(form.categoryId),
    })
    setEditId(null)
    setForm({ name: '', categoryId: '' })
    load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this subcategory?')) return
    await api.delete(`/subcategories/${id}`)
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-12 space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Subcategories
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Create and manage subcategories under categories
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200
                        shadow-2xl rounded-3xl p-10 space-y-8">

          <h2 className="text-2xl font-semibold text-gray-800">
            {editId ? 'Edit Subcategory' : 'Create Subcategory'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Subcategory name"
              className="w-full rounded-2xl border border-gray-300 px-5 py-3
                         focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         transition outline-none shadow-sm"
            />

            <select
              value={form.categoryId}
              onChange={e =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-3
                         focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         transition outline-none shadow-sm"
            >
              <option value="">Select category</option>
              {cats?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={editId ? update : create}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700
                         px-8 py-3 text-white font-semibold
                         shadow-lg hover:shadow-xl hover:scale-[1.02]
                         active:scale-95 transition"
            >
              {editId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>

        {/* List Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200
                        shadow-2xl rounded-3xl p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Existing Subcategories
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {list.map((s) => {
              const cat = cats?.find((c: any) => c.id === s.categoryId)

              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-gray-200 bg-white
                             p-6 shadow-sm hover:shadow-xl
                             transition-all duration-300 flex justify-between"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-900">
                      {s.name}
                    </p>

                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      Category: {cat?.name || 'Unknown'}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(s)}
                      className="px-4 py-1.5 rounded-lg bg-yellow-500 text-white text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => remove(s.id)}
                      className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}