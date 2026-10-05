export default function ClienteView({ ocorrencia }) {
  const formatarHorario = (timestamp) => {
    if (!timestamp) return ''
    const data = new Date(timestamp)
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!ocorrencia) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-black text-blue-900 mb-2">✈️ Status do Voo</h2>
        <p className="text-gray-500 text-sm">Nenhuma alteração ou ocorrência registrada para o seu voo no momento. Operação normal.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-blue-900">{ocorrencia.numero_voo}</h2>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">Ao Vivo</span>
      </div>
      
      <div className="mb-8 text-center bg-blue-50 p-4 rounded-xl">
        <p className="text-sm text-blue-800 font-semibold mb-1 uppercase tracking-wide">Previsão de Partida</p>
        <p className="text-5xl font-black text-blue-900">{formatarHorario(ocorrencia.novo_horario_partida)}</p>
      </div>

      <div className="mb-8">
        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Progresso da Solução</p>
        <div className="flex justify-between mb-2">
          <div className={`w-1/4 h-2 rounded-l-full ${['em_analise', 'reparo_em_curso', 'previsao_liberacao', 'resolvido'].includes(ocorrencia.status_operacional) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-1/4 h-2 ml-1 ${['reparo_em_curso', 'previsao_liberacao', 'resolvido'].includes(ocorrencia.status_operacional) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-1/4 h-2 ml-1 ${['previsao_liberacao', 'resolvido'].includes(ocorrencia.status_operacional) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-1/4 h-2 ml-1 rounded-r-full ${ocorrencia.status_operacional === 'resolvido' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 text-center">
          <span className={ocorrencia.status_operacional === 'em_analise' ? 'text-blue-600' : ''}>Análise</span>
          <span className={ocorrencia.status_operacional === 'reparo_em_curso' ? 'text-blue-600' : ''}>Reparo</span>
          <span className={ocorrencia.status_operacional === 'previsao_liberacao' ? 'text-blue-600' : ''}>Previsão</span>
          <span className={ocorrencia.status_operacional === 'resolvido' ? 'text-green-500' : ''}>Embarque</span>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-sm font-bold text-gray-800 mb-2">Mensagem da Equipe Azul:</p>
        <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 italic">
          "{ocorrencia.mensagem_cliente}"
        </p>
      </div>
    </div>
  )
}