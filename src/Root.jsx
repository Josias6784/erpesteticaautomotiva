import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './components/Auth'
import App from './App'

// Simple error boundary using state
function useErrorBoundary() {
  const [error, setError] = useState(null)
  useEffect(() => {
    const handler = (e) => setError(e.message || String(e))
    window.addEventListener('unhandledrejection', (e) => setError(e.reason?.message || String(e.reason)))
    window.addEventListener('error', handler)
    return () => { window.removeEventListener('error', handler); window.removeEventListener('unhandledrejection', handler) }
  }, [])
  return error
}

const S = {
  center: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f0f0f', fontFamily:'Sora,sans-serif' },
  card: { background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:16, padding:'28px 24px', maxWidth:460, width:'100%', margin:16 },
  title: { fontWeight:800, fontSize:20, color:'#f4f4f4', marginBottom:8 },
  msg: { fontSize:13, color:'#aaa', lineHeight:1.7, marginBottom:20 },
  code: { background:'#111', border:'1px solid #333', borderRadius:8, padding:'10px 14px', fontSize:11, color:'#f97316', fontFamily:'monospace', wordBreak:'break-all', marginBottom:16 },
  btn: { background:'#f97316', color:'#fff', border:'none', borderRadius:9, padding:'10px 18px', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Sora,sans-serif' },
}

export default function Root() {
  const [session, setSession] = useState(undefined)
  const [initError, setInitError] = useState(null)
  const globalError = useErrorBoundary()

  useEffect(() => {
    async function init() {
      try {
        // Verify env vars are set
        const url = import.meta.env.VITE_SUPABASE_URL
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY
        if (!url || !key || url === 'undefined' || key === 'undefined') {
          setInitError('env_missing')
          return
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(data.session ?? null)
      } catch (e) {
        console.error('Init error:', e)
        setInitError(e.message || String(e))
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Show env error
  if (initError === 'env_missing') {
    return (
      <div style={S.center}>
        <div style={S.card}>
          <div style={{fontSize:32, marginBottom:12}}>⚙️</div>
          <div style={S.title}>Variáveis de ambiente não configuradas</div>
          <div style={S.msg}>
            O sistema precisa das credenciais do Supabase. No Vercel, vá em:<br/>
            <strong style={{color:'#f4f4f4'}}>Settings → Environment Variables</strong> e adicione:
          </div>
          <div style={S.code}>VITE_SUPABASE_URL<br/>VITE_SUPABASE_ANON_KEY</div>
          <div style={S.msg} >Após adicionar, clique em <strong style={{color:'#f4f4f4'}}>Redeploy</strong> no Vercel.</div>
        </div>
      </div>
    )
  }

  // Show other init error
  if (initError) {
    return (
      <div style={S.center}>
        <div style={S.card}>
          <div style={{fontSize:32, marginBottom:12}}>❌</div>
          <div style={S.title}>Erro de conexão</div>
          <div style={S.msg}>Não foi possível conectar ao banco de dados.</div>
          <div style={S.code}>{initError}</div>
          <button style={S.btn} onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      </div>
    )
  }

  // Show global JS error
  if (globalError) {
    return (
      <div style={S.center}>
        <div style={S.card}>
          <div style={{fontSize:32, marginBottom:12}}>⚠️</div>
          <div style={S.title}>Algo deu errado</div>
          <div style={S.code}>{globalError}</div>
          <button style={S.btn} onClick={() => window.location.reload()}>Recarregar</button>
        </div>
      </div>
    )
  }

  // Loading
  if (session === undefined) {
    return (
      <div style={S.center}>
        <div style={{color:'#666', fontSize:14}}>🔄 Carregando...</div>
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return <Auth onLogin={setSession} />
  }

  // Logged in
  return <App session={session} onLogout={() => { supabase.auth.signOut(); setSession(null) }} />
}
