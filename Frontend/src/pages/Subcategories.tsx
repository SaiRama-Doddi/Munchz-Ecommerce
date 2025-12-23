import { useEffect, useState } from 'react'
import api from '../api/client'
import { useCategories } from '../hooks/useQueryHelpers'

export default function Subcategories() {
  const { data: cats } = useCategories()
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', categoryId: '' })

  useEffect(() => {
    api.get('/subcategories').then(r => setList(r.data)).catch(() => {})
  }, [])

  const create = async () => {
    await api.post('/subcategories', {
      name: form.name,
      categoryId: Number(form.categoryId),
    })
    setForm({ name: '', categoryId: '' })
    const res = await api.get('/subcategories')
    setList(res.data)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">
          Subcategories
        </h1>
      </div>

      {/* Create Card */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b">
          <h2 className="text-lg font-medium text-gray-800">
            Create Subcategory
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Subcategory name"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={form.categoryId}
            onChange={e =>
              setForm({ ...form, categoryId: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {cats?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={create}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition"
          >
            Create
          </button>
        </div>
      </div>

      {/* List Card */}
     {/*  <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b">
          <h2 className="text-lg font-medium text-gray-800">
            Existing Subcategories
          </h2>
        </div>

        <ul className="divide-y">
          {list.map(s => (
            <li
              key={s.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-gray-900">{s.name}</p>
                <p className="text-sm text-gray-500">
                  Category ID: {s.categoryId}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  )
}
