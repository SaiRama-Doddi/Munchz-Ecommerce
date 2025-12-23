
import { NavLink } from 'react-router-dom'

const items = [
  {to:'/', label:'Dashboard'},
  {to:'/category', label:'Categories'},
  {to:'/sub-category', label:'Subcategories'},
  {to:'/products', label:'Admin Products'},
   {to:'/product', label:'User Products'},
  {to:'/cart', label:'Cart'},
  
  {to:'/orders', label:'Orders'},
{to:'/categories', label:'Categories'},
{to:'/feature',label:'Feature'}

]

export default function Sidebar(){
  return (
    <aside className='w-60 bg-white border-r min-h-screen p-4'>
      <div className='text-xl font-bold mb-6'>Admin</div>
      <nav className='flex flex-col gap-2'>
        {items.map(i=> <NavLink key={i.to} to={i.to} className={({isActive})=> isActive ? 'p-2 rounded bg-blue-50 font-medium' : 'p-2 rounded hover:bg-gray-100'}>{i.label}</NavLink>)}
      </nav>
    </aside>
  )
}