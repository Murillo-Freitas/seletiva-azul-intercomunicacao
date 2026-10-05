import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [perfil, setPerfil] = useState('cliente')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (authError) {
      setErro('Erro no cadastro: ' + authError.message)
      setLoading(false)
      return
    }

    const userId = authData.user?.id

    if (userId) {
      const { error: perfilError } = await supabase
        .from('perfis_usuarios')
        .insert([
          { id_usuario: userId, nome, perfil }
        ])

      if (perfilError) {
        setErro('Erro ao salvar perfil: ' + perfilError.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    onRegisterSuccess()
  }

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-blue-900">✈️ Criar Nova Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Azul Intercomunicação - Cadastro de Acesso</p>
        </div>

        {erro && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg font-medium">{erro}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required
              placeholder="ex: Murillo Araújo"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="ex: seu.email@azul.com"
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
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Perfil</label>
            <select 
              value={perfil} 
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-white font-medium text-gray-800"
            >
              <option value="cliente">Cliente / Passageiro</option>
              <option value="handling">Handling / Equipe de Solo</option>
              <option value="cco">CCO / Manutenção</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors uppercase tracking-wider cursor-pointer"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar e Acessar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={onSwitchToLogin}
            className="text-sm text-blue-900 font-bold hover:underline cursor-pointer"
          >
            Já possui uma conta? Faça login
          </button>
        </div>
      </div>
    </div>
  )
}