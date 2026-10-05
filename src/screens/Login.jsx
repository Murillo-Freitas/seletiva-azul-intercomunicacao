import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('Falha no login: ' + error.message)
      setLoading(false)
    } else {
      onLoginSuccess()
    }
  }

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-blue-900">✈️ Azul Intercomunicação</h1>
          <p className="text-sm text-gray-500 mt-1">Acesse com suas credenciais corporativas</p>
        </div>

        {erro && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg font-medium">{erro}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="ex: cco@azul.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors uppercase tracking-wider cursor-pointer"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={onSwitchToRegister}
            className="text-sm text-blue-900 font-bold hover:underline cursor-pointer"
          >
            Não tem uma conta? Cadastre-se
          </button>
        </div>
      </div>
    </div>
  )
}