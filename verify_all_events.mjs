import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verify() {
  console.log('--- VERIFICANDO TODOS LOS EVENTOS EN LA BD ---')
  const { data, error } = await supabase.from('events').select('id, title, user_id, slug, plan')
  
  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log(`Encontrados ${data.length} eventos:`)
  data.forEach(e => {
    console.log(`ID: ${e.id} | Título: ${e.title} | User: ${e.user_id} | Slug: ${e.slug} | Plan: ${e.plan}`)
  })
}

verify()
