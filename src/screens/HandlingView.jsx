export default function HandlingView({ ocorrencia }) {
  const formatarHorario = (timestamp) => {
    if (!timestamp) return ''
    const data = new Date(timestamp)
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!ocorrencia) {
    return (
      <div className="bg-black p-8 rounded-lg shadow-xl w-full max-w-sm border-t-8 border-yellow-400 text-white text-center">
        <h2 className="text-xl font-black text-yellow-400 mb-2 uppercase">Atenção - Pátio</h2>
        <p className="text-gray-400 text-sm">Nenhuma ocorrência de voo ativa no momento.</p>
      </div>
    )
  }

  return (
    <div className="bg-black p-6 rounded-lg shadow-xl w-full max-w-sm border-t-8 border-yellow-400 text-white">
      <h2 className="text-xl font-black text-yellow-400 mb-4 uppercase tracking-wider text-center">Atenção - Pátio</h2>
      
      <div className="bg-gray-900 p-4 rounded-lg mb-6 border border-gray-700 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase">Novo ETD</p>
        <p className="text-6xl font-black text-yellow-400 my-2">{formatarHorario(ocorrencia.novo_horario_partida)}</p>
      </div>

      <div className="bg-yellow-400 text-black p-4 rounded-lg mb-6 shadow-inner">
        <p className="text-xs font-black uppercase mb-1">Roteiro para PA / Megafone</p>
        <p className="text-lg font-bold leading-tight">"{ocorrencia.mensagem_cliente}"</p>
      </div>

      <div className="text-center">
        <span className="text-xs text-gray-500 uppercase tracking-widest">Status Atual</span>
        <p className="font-bold text-white uppercase mt-1">
          {ocorrencia.status_operacional.replace(/_/g, ' ')}
        </p>
      </div>
    </div>
  )
}