import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './screens/Login'
import Register from './screens/Register'
import CcoView from './screens/CcoView'
import HandlingView from './screens/HandlingView'
import ClienteView from './screens/ClienteView'

export default function App() {
  const [session, setSession] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [ocorrencias, setOcorrencias] = useState([])
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [modoAuth, setModoAuth] = useState('login')

  const carregarDados = async (userId) => {
    const { data: perfilData } = await supabase
      .from('perfis_usuarios')
      .select('perfil')
      .eq('id_usuario', userId)
      .single()

    if (perfilData) {
      setPerfil(perfilData.perfil)
    } else {
      setPerfil('cliente')
    }

    await atualizarOcorrencias()
  }

  const atualizarOcorrencias = async () => {
    const { data, error } = await supabase
      .from('ocorrencias_voo')
      .select('*')
      .order('atualizado_em', { ascending: false })

    if (data) {
      setOcorrencias(data)
    } else if (error) {
      console.error('Erro ao buscar ocorrências:', error)
    }
  }

  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session) {
        await carregarDados(session.user.id)
      }
      setLoadingAuth(false)
    }

    verificarSessao()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        await carregarDados(session.user.id)
      } else {
        setPerfil(null)
        setOcorrencias([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel('mudancas-banco-geral')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ocorrencias_voo' },
        () => {
          atualizarOcorrencias()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setPerfil(null)
  }

  if (loadingAuth) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Carregando Sistema...</div>
  }

  if (!session) {
    if (modoAuth === 'register') {
      return (
        <Register 
          onRegisterSuccess={() => window.location.reload()} 
          onSwitchToLogin={() => setModoAuth('login')} 
        />
      )
    }
    return (
      <Login 
        onLoginSuccess={() => window.location.reload()} 
        onSwitchToRegister={() => setModoAuth('register')} 
      />
    )
  }

  const ocorrenciaAtiva = ocorrencias.length > 0 ? ocorrencias[0] : null

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-blue-900 p-4 text-white shadow-md flex justify-between items-center">
        <h1 className="text-lg font-bold">✈️ Azul Intercomunicação — Perfil: <span className="uppercase text-yellow-400">{perfil}</span></h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded transition-colors cursor-pointer"
        >
          Sair
        </button>
      </header>

      <main className="flex-1 p-6 flex justify-center items-start pt-10">
        {perfil === 'cco' && (
          <CcoView 
            ocorrencias={ocorrencias} 
            ocorrenciaAtiva={ocorrenciaAtiva} 
            onRefresh={atualizarOcorrencias} 
          />
        )}
        {perfil === 'handling' && <HandlingView ocorrencia={ocorrenciaAtiva} />}
        {perfil === 'cliente' && <ClienteView ocorrencia={ocorrenciaAtiva} />}
      </main>
    </div>
  )
}