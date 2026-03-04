import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

/* ── CSS ─────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0f0f0f;color:#f4f4f4;font-family:'Sora',sans-serif;}
  input{background:#1a1a1a;color:#f4f4f4;border:1px solid #333;border-radius:10px;padding:12px 14px;font-size:14px;font-family:'Sora',sans-serif;outline:none;transition:.15s;width:100%;}
  input:focus{border-color:#f97316;}
  button{cursor:pointer;font-family:'Sora',sans-serif;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
`

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('loading') // loading | setup | login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Detect if any user exists — if not, show setup screen
  useEffect(() => {
    async function checkSetup() {
      // Try to list users via admin — not possible with anon key.
      // Instead we check a "setup_done" flag in the "config" table.
      const { data } = await supabase
        .from('erp_config')
        .select('value')
        .eq('key', 'setup_done')
        .maybeSingle()
      setMode(data ? 'login' : 'setup')
    }
    checkSetup()
  }, [])

  const handleSetup = async () => {
    setError('')
    if (!email || !password) return setError('Preencha todos os campos.')
    if (password.length < 6) return setError('Senha mínima: 6 caracteres.')
    if (password !== confirm) return setError('Senhas não coincidem.')
    setLoading(true)
    try {
      const { error: signUpErr } = await supabase.auth.signUp({ email, password })
      if (signUpErr) throw signUpErr
      // Mark setup as done
      await supabase.from('erp_config').insert({ key: 'setup_done', value: 'true' })
      // Now sign in immediately
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
      if (loginErr) throw loginErr
      onLogin(data.session)
    } catch (e) {
      setError(e.message || 'Erro ao criar conta.')
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    setError('')
    if (!email || !password) return setError('Preencha todos os campos.')
    setLoading(true)
    try {
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
      if (loginErr) throw loginErr
      onLogin(data.session)
    } catch (e) {
      setError('Email ou senha incorretos.')
    }
    setLoading(false)
  }

  if (mode === 'loading') {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f0f0f'}}>
        <style>{css}</style>
        <div style={{color:'#666',fontSize:14}}>Carregando...</div>
      </div>
    )
  }

  const isSetup = mode === 'setup'

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f0f0f',padding:16}}>
      <style>{css}</style>
      <div style={{width:'100%',maxWidth:400,animation:'fadeUp .3s ease'}}>
        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:18,background:'rgba(249,115,22,.15)',border:'1px solid rgba(249,115,22,.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',fontSize:28}}>🚗</div>
          <div style={{fontWeight:800,fontSize:24,letterSpacing:-.5}}>EstéticaAuto ERP</div>
          <div style={{fontSize:13,color:'#666',marginTop:4}}>
            {isSetup ? 'Primeiro acesso — configure sua conta' : 'Entre na sua conta'}
          </div>
        </div>

        {/* Card */}
        <div style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:16,padding:'28px 24px'}}>
          {isSetup && (
            <div style={{background:'rgba(249,115,22,.08)',border:'1px solid rgba(249,115,22,.2)',borderRadius:10,padding:'10px 14px',marginBottom:20,fontSize:12,color:'#f97316',lineHeight:1.6}}>
              ✨ <strong>Primeiro acesso detectado.</strong> Crie o usuário administrador do sistema.
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'#666',textTransform:'uppercase',letterSpacing:.5,display:'block',marginBottom:5}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" onKeyDown={e=>e.key==='Enter'&&(isSetup?handleSetup():handleLogin())}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'#666',textTransform:'uppercase',letterSpacing:.5,display:'block',marginBottom:5}}>Senha</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&(isSetup?handleSetup():handleLogin())}/>
            </div>
            {isSetup && (
              <div>
                <label style={{fontSize:11,fontWeight:600,color:'#666',textTransform:'uppercase',letterSpacing:.5,display:'block',marginBottom:5}}>Confirmar Senha</label>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleSetup()}/>
              </div>
            )}
          </div>

          {error && (
            <div style={{marginTop:12,padding:'8px 12px',background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:8,fontSize:12,color:'#ef4444'}}>
              {error}
            </div>
          )}

          <button
            onClick={isSetup ? handleSetup : handleLogin}
            disabled={loading}
            style={{width:'100%',marginTop:18,padding:'13px',borderRadius:10,border:'none',background:loading?'#333':'#f97316',color:'#fff',fontWeight:700,fontSize:14,transition:'.15s',opacity:loading?.7:1}}
          >
            {loading ? 'Aguarde...' : isSetup ? 'Criar conta e entrar' : 'Entrar'}
          </button>
        </div>

        <div style={{textAlign:'center',marginTop:16,fontSize:11,color:'#444'}}>
          Sistema ERP de Estética Automotiva
        </div>
      </div>
    </div>
  )
}
