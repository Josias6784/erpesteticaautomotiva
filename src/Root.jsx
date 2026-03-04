import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './components/Auth'
import App from './App'

export default function Root() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div style={{minHeight:'100vh',background:'#0f0f0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{color:'#666',fontFamily:'Sora,sans-serif',fontSize:14}}>Verificando sessão...</div>
      </div>
    )
  }

  if (!session) {
    return <Auth onLogin={setSession} />
  }

  return <App session={session} onLogout={() => { supabase.auth.signOut(); setSession(null); }} />
}
