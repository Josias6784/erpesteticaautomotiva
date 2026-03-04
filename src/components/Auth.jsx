import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0f0f0f;color:#f4f4f4;font-family:'Sora',sans-serif;}
  input{background:#222;color:#f4f4f4;border:1px solid #333;border-radius:10px;padding:12px 14px;
    font-size:14px;font-family:'Sora',sans-serif;outline:none;transition:.15s;width:100%;}
  input:focus{border-color:#f97316;box-shadow:0 0 0 3px rgba(249,115,22,.12);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
`

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('loading') // loading | setup | login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function detectMode() {
      try {
        // Try to query erp_config to check if setup was done
        const { data, error } = await supabase
          .from('erp_config')
          .select('value')
          .eq('key', 'setup_done')
          .maybeSingle()

        if (error) {
          // Table doesn't exist yet = first setup
          console.warn('erp_config table not ready:', error.message)
          setMode('setup')
          return
        }
        setMode(data ? 'login' : 'setup')
      } catch (e) {
        console.warn('Mode detection error:', e)
        // Default to setup on any error
        setMode('setup')
      }
    }
    detectMode()
  }, [])

  const handleSetup = async () => {
    setError('')
    if (!email || !password) return setError('Preencha todos os campos.')
    if (password.length < 6) return setError('Senha mínima: 6 caracteres.')
    if (password !== confirm) return setError('As senhas não coincidem.')
    setLoading(true)
    try {
      // 1. Create user
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email, password })
      if (signUpErr) throw signUpErr

      // 2. Sign in immediately (in case email confirm is disabled)
      const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
      if (loginErr) throw loginErr

      // 3. Mark setup done (best-effort, may fail if SQL wasn't run)
      try {
        await supabase.from('erp_config').upsert({ key: 'setup_done', value: 'true' })
      } catch (e) {
        console.warn('Could not mark setup done (run supabase-setup.sql):', e)
      }

      onLogin(loginData.session)
    } catch (e) {
      console.error('Setup error:', e)
      if (e.message?.includes('already registered')) {
        setError('Este email já está cadastrado. Tente fazer login.')
        setMode('login')
      } else if (e.message?.includes('email')) {
        setError('Confirme seu email antes de entrar (verifique sua caixa de entrada).')
      } else {
        setError(e.message || 'Erro ao criar conta.')
      }
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    setError('')
    if (!email || !password) return setError('Preencha todos os campos.')
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      onLogin(data.session)
    } catch (e) {
      setError('Email ou senha incorretos.')
    }
    setLoading(false)
  }

  const handleKey = e => {
    if (e.key !== 'Enter') return
    if (mode === 'setup') handleSetup()
    else if (mode === 'login') handleLogin()
  }

  if (mode === 'loading') {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f0f0f'}}>
        <style>{css}</style>
        <div style={{color:'#555',fontSize:13}}>🔄 Verificando configuração...</div>
      </div>
    )
  }

  const isSetup = mode === 'setup'

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f0f0f',padding:16}}>
      <style>{css}</style>
      <div style={{width:'100%',maxWidth:400,animation:'fadeUp .3s ease'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{width:68,height:68,borderRadius:20,background:'rgba(249,115,22,.12)',border:'1px solid rgba(249,115,22,.25)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',fontSize:32}}>🚗</div>
          <div style={{fontWeight:800,fontSize:22,letterSpacing:-.5}}>EstéticaAuto ERP</div>
          <div style={{fontSize:12,color:'#555',marginTop:4}}>
            {isSetup ? 'Primeiro acesso — crie sua conta' : 'Entre na sua conta'}
          </div>
        </div>

        {/* Card */}
        <div style={{background:'#161616',border:'1px solid #252525',borderRadius:18,padding:'26px 22px'}}>

          {isSetup && (
            <div style={{background:'rgba(249,115,22,.07)',border:'1px solid rgba(249,115,22,.18)',borderRadius:10,padding:'10px 14px',marginBottom:18,fontSize:12,color:'#f97316',lineHeight:1.65}}>
              ✨ <strong>Primeiro acesso.</strong> Defina o email e senha do administrador do sistema.
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={{fontSize:10,fontWeight:700,color:'#555',textTransform:'uppercase',letterSpacing:.8,display:'block',marginBottom:6}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={handleKey} placeholder="seu@email.com" autoFocus/>
            </div>
            <div>
              <label style={{fontSize:10,fontWeight:700,color:'#555',textTransform:'uppercase',letterSpacing:.8,display:'block',marginBottom:6}}>Senha</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={handleKey} placeholder="mínimo 6 caracteres"/>
            </div>
            {isSetup && (
              <div>
                <label style={{fontSize:10,fontWeight:700,color:'#555',textTransform:'uppercase',letterSpacing:.8,display:'block',marginBottom:6}}>Confirmar Senha</label>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} onKeyDown={handleKey} placeholder="repita a senha"/>
              </div>
            )}
          </div>

          {error && (
            <div style={{marginTop:14,padding:'9px 13px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:9,fontSize:12,color:'#ef4444',lineHeight:1.5}}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={isSetup ? handleSetup : handleLogin}
            disabled={loading}
            style={{width:'100%',marginTop:18,padding:'13px',borderRadius:11,border:'none',
              background:loading?'#2a2a2a':'#f97316',color:loading?'#555':'#fff',
              fontWeight:700,fontSize:14,transition:'all .15s',fontFamily:'Sora,sans-serif',cursor:loading?'not-allowed':'pointer'}}
          >
            {loading ? '⏳ Aguarde...' : isSetup ? 'Criar conta e entrar →' : 'Entrar →'}
          </button>

          {isSetup && (
            <div style={{marginTop:12,textAlign:'center'}}>
              <button onClick={()=>{setMode('login');setError('')}} style={{background:'none',border:'none',color:'#555',fontSize:12,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                Já tenho conta → Fazer login
              </button>
            </div>
          )}
          {!isSetup && (
            <div style={{marginTop:12,textAlign:'center'}}>
              <button onClick={()=>{setMode('setup');setError('')}} style={{background:'none',border:'none',color:'#555',fontSize:12,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                Primeiro acesso → Criar conta
              </button>
            </div>
          )}
        </div>

        <div style={{textAlign:'center',marginTop:18,fontSize:11,color:'#333'}}>
          Sistema ERP · Estética Automotiva
        </div>
      </div>
    </div>
  )
}
