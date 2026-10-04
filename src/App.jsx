import { useState } from 'react'

function App() {
  const [perfilAtivo, setPerfilAtivo] = useState('cco')

  const [ocorrenciaAtiva, setOcorrenciaAtiva] = useState({
    voo: 'AD4321',
    status: 'analise',
    novoHorario: '15:45',
    mensagemCliente: 'Nossa equipe técnica está avaliando a aeronave.',
    codigoTecnico: 'AOG - Falha Válvula de Sangria Motor 2'
  })

  const [rascunho, setRascunho] = useState(ocorrenciaAtiva)

  const handleAtualizar = () => {
    setOcorrenciaAtiva(rascunho)
    alert('✅ Informações atualizadas com sucesso para a equipe de pista e clientes!')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Menu Superior - Simulador de Perfil */}
      <header className="bg-blue-900 p-4 text-white shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold">✈️ Azul Intercomunicação</h1>
          <div className="flex gap-2">
            <button onClick={() => setPerfilAtivo('cco')} className={`px-4 py-2 rounded text-sm font-bold ${perfilAtivo === 'cco' ? 'bg-blue-600' : 'bg-blue-800 hover:bg-blue-700'}`}>Visão CCO</button>
            <button onClick={() => setPerfilAtivo('handling')} className={`px-4 py-2 rounded text-sm font-bold ${perfilAtivo === 'handling' ? 'bg-orange-500' : 'bg-blue-800 hover:bg-blue-700'}`}>Visão Handling</button>
            <button onClick={() => setPerfilAtivo('cliente')} className={`px-4 py-2 rounded text-sm font-bold ${perfilAtivo === 'cliente' ? 'bg-white text-blue-900' : 'bg-blue-800 hover:bg-blue-700'}`}>Visão Cliente</button>
          </div>
        </div>
      </header>

      {/* Área de Visualização */}
      <main className="flex-1 p-6 flex justify-center items-start pt-10">
        
        {perfilAtivo === 'cco' && (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl border-l-4 border-blue-900">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Painel de Controle - CCO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Código Técnico (Restrito)</label>
                <input type="text" value={rascunho.codigoTecnico} readOnly className="mt-1 w-full p-2 bg-gray-100 border border-gray-300 rounded text-red-600 font-mono" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Atualizar Status</label>
                <select 
                  value={rascunho.status}
                  onChange={(e) => setRascunho({...rascunho, status: e.target.value})}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:border-blue-500"
                >
                  <option value="analise">1. Em Análise Técnica</option>
                  <option value="reparo">2. Reparo em Curso</option>
                  <option value="liberado">3. Aeronave Liberada</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Novo Horário (ETD)</label>
                  <input type="time" value={rascunho.novoHorario} onChange={(e) => setRascunho({...rascunho, novoHorario: e.target.value})} className="mt-1 w-full p-2 border border-gray-300 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Mensagem Padronizada para Cliente</label>
                <textarea 
                  value={rascunho.mensagemCliente}
                  onChange={(e) => setRascunho({...rascunho, mensagemCliente: e.target.value})}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  rows="3"
                ></textarea>
              </div>
              <button 
                onClick={handleAtualizar} 
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 mt-4 transition-colors flex justify-center items-center gap-2"
              >
                <span>🚀</span> Publicar Atualização
              </button>
            </div>
          </div>
        )}

        {perfilAtivo === 'handling' && (
          <div className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-md text-white border-t-4 border-orange-500">
            <h2 className="text-xl font-bold text-orange-400 mb-2">Painel Tático - Pista</h2>
            <div className="bg-slate-700 p-4 rounded mb-4 text-center">
              <p className="text-sm text-gray-300 uppercase tracking-wide">Novo Horário de Partida</p>
              <p className="text-5xl font-black text-white my-2">{ocorrenciaAtiva.novoHorario}</p>
              <p className="text-sm font-bold text-orange-400 uppercase">
                Status: {ocorrenciaAtiva.status === 'analise' ? 'Aguardando Manutenção' : ocorrenciaAtiva.status === 'reparo' ? 'Trabalhando na Aeronave' : 'Embarque Autorizado'}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded border border-slate-600">
              <p className="text-sm font-semibold text-gray-400 mb-2">📝 Roteiro para PA / Megafone:</p>
              <p className="italic font-medium">"{ocorrenciaAtiva.mensagemCliente}"</p>
            </div>
          </div>
        )}

        {perfilAtivo === 'cliente' && (
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-lg font-black text-blue-900">Voo {ocorrenciaAtiva.voo}</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Ao Vivo</span>
            </div>
            
            <div className="mb-8">
              <p className="text-sm text-gray-500 font-semibold mb-1">Previsão de Partida Atualizada</p>
              <p className="text-4xl font-black text-gray-800">{ocorrenciaAtiva.novoHorario}</p>
            </div>

            <div className="relative pt-1 mb-8">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Progresso da Solução
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div style={{ width: ocorrenciaAtiva.status === 'analise' ? '33%' : ocorrenciaAtiva.status === 'reparo' ? '66%' : '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span className={ocorrenciaAtiva.status === 'analise' ? 'text-blue-600 font-bold' : ''}>Análise</span>
                <span className={ocorrenciaAtiva.status === 'reparo' ? 'text-blue-600 font-bold' : ''}>Reparo</span>
                <span className={ocorrenciaAtiva.status === 'liberado' ? 'text-blue-600 font-bold' : ''}>Pronto</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm font-semibold text-blue-900 mb-1">Status Oficial:</p>
              <p className="text-sm text-blue-800">{ocorrenciaAtiva.mensagemCliente}</p>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default App