
import Layout from '../components/Layout'
import { useCategories, useProducts } from '../hooks/useQueryHelpers'


export default function Dashboard(){
  const { data: cats } = useCategories()
  const { data: products } = useProducts()

  return (
  
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <div className='grid grid-cols-4 gap-4'>
        <Card title='Categories' value={cats?.length ?? 0} />
        <Card title='Products' value={products?.length ?? 0} />
        <Card title='Total Stock (KG)' value={'—'} />
        <Card title='Low Stock' value={'—'} />
      </div>
      <section className='mt-6 bg-white p-4 rounded shadow'>
        <h2 className='font-semibold mb-2'>Recent Products</h2>
        <div className='grid grid-cols-3 gap-3'>
          {products?.slice(0,6).map((p:any)=>(
            <div key={p.id} className='p-3 border rounded'>
              <img src={p.imageUrl} className='h-28 w-full object-cover rounded mb-2' alt={p.name} />
              <div className='font-medium'>{p.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
 
  )
}

function Card({title, value}:{title:string, value:any}){
  return <div className='bg-white p-4 rounded shadow'>
    <div className='text-sm text-gray-500'>{title}</div>
    <div className='text-2xl font-semibold'>{value}</div>
  </div>
}