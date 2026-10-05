import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function CcoView({ ocorrencias, ocorrenciaAtiva, onRefresh }) {
  const [selecionada, setSelecionada] = useState(ocorrenciaAtiva)
  const [criando, setCriando] = useState(false)
  
  const [novoVoo, setNovoVoo] = useState('')
  const [novaMatricula, setNovaMatricula] = useState('')
  const [novoMotivo, setNovoMotivo] = useState('')
  const [novoStatus, setNovoStatus] = useState('em_analise')
  const [novoHorario, setNovoHorario] = useState('')
  const [novaMensagem, setNovaMensagem] = useState('')

  useEffect(() => {
    setSelecionada(ocorrenciaAtiva)
  }, [ocorrenciaAtiva])

  const formatarParaInput = (timestamp) => {
    if (!timestamp) return ''
    const d = new Date(timestamp)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const handleAtualizar = async (e) => {
    e.preventDefault()
    if (!selecionada) return

    const { error } = await supabase
      .from('ocorrencias_voo')
      .update({
        status_operacional: selecionada.status_operacional,
        novo_horario_partida: selecionada.novo_horario_partida,
        mensagem_cliente: selecionada.mensagem_cliente,
        atualizado_em: new Date().toISOString()
      })
      .eq('id_evento', selecionada.id_evento)

    if (error) alert('Erro ao atualizar: ' + error.message)
    else {
      alert('✅ Ocorrência atualizada com sucesso!')
      onRefresh()
    }
  }

  const handleCriar = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('ocorrencias_voo')
      .insert([{
        numero_voo: novoVoo,
        matricula_aeronave: novaMatricula,
        motivo_tecnico: novoMotivo,
        status_operacional: novoStatus,
        novo_horario_partida: novoHorario ? new Date(novoHorario).toISOString() : null,
        mensagem_cliente: novaMensagem
      }])

    if (error) alert('Erro ao criar: ' + error.message)
    else {
      alert('✅ Nova ocorrência criada com sucesso!')
      setCriando(false)
      setNovoVoo('')
      setNovaMatricula('')
      setNovoMotivo('')
      setNovoHorario('')
      setNovaMensagem('')
      onRefresh()
    }
  }

  const handleExcluir = async (id_evento) => {
    if (!confirm('Tem certeza que deseja excluir esta ocorrência?')) return
    const { error } = await supabase
      .from('ocorrencias_voo')
      .delete()
      .eq('id_evento', id_evento)

    if (error) alert('Erro ao excluir: ' + error.message)
    else {
      alert('🗑️ Ocorrência excluída com sucesso!')
      onRefresh()
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Barra de Ações CCO */}
      <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center border-t-4 border-blue-900">
        <h2 className="text-xl font-bold text-blue-900">Controle Operacional (CCO) - Gerenciamento</h2>
        <button 
          onClick={() => setCriando(!criando)}
          className="bg-blue-900 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm cursor-pointer"
        >
          {criando ? '✖️ Fechar Formulário' : '➕ Nova Ocorrência'}
        </button>
      </div>

      {/* Criação de Ocorrência */}
      {criando && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Cadastrar Nova Ocorrência de Voo</h3>
          <form onSubmit={handleCriar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Número do Voo</label>
              <input type="text" required value={novoVoo} onChange={(e) => setNovoVoo(e.target.value)} placeholder="ex: AD4321" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Matrícula da Aeronave</label>
              <input type="text" required value={novaMatricula} onChange={(e) => setNovaMatricula(e.target.value)} placeholder="ex: PR-YRU" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Motivo Técnico / Código</label>
              <input type="text" required value={novoMotivo} onChange={(e) => setNovoMotivo(e.target.value)} placeholder="ex: AOG - Falha Motor" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status Inicial</label>
              <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)} className="w-full p-2 border rounded bg-white">
                <option value="em_analise">1. Em Análise</option>
                <option value="reparo_em_curso">2. Reparo em Curso</option>
                <option value="previsao_liberacao">3. Previsão de Liberação</option>
                <option value="resolvido">4. Resolvido (Embarque)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Novo Horário Partida (ETD)</label>
              <input type="datetime-local" value={novoHorario} onChange={(e) => setNovoHorario(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Mensagem para Cliente e Pista</label>
              <textarea required value={novaMensagem} onChange={(e) => setNovaMensagem(e.target.value)} rows="2" placeholder="Mensagem informativa..." className="w-full p-2 border rounded"></textarea>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors uppercase text-sm cursor-pointer">
                Salvar e Publicar Ocorrência
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Log de Ocorrências */}
        <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-md space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">📋 Log de Ocorrências ({ocorrencias.length})</h3>
          {ocorrencias.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-6">Nenhuma ocorrência registrada.</p>
          ) : (
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {ocorrencias.map((oc) => (
                <div 
                  key={oc.id_evento}
                  onClick={() => setSelecionada(oc)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${selecionada?.id_evento === oc.id_evento ? 'border-blue-900 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-blue-900 text-sm">{oc.numero_voo}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700 uppercase">{oc.status_operacional.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{oc.motivo_tecnico}</p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                    <span>{oc.matricula_aeronave}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleExcluir(oc.id_evento); }}
                      className="text-red-600 hover:text-red-800 font-bold cursor-pointer"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor de Ocorrência */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
          {selecionada ? (
            <form onSubmit={handleAtualizar} className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-blue-900">Editar Ocorrência: {selecionada.numero_voo}</h3>
                <span className="text-xs font-mono text-gray-400">ID: {selecionada.id_evento.slice(0, 8)}...</span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Voo</label>
                  <p className="font-bold">{selecionada.numero_voo}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Matrícula</label>
                  <p className="font-mono">{selecionada.matricula_aeronave}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Motivo Técnico</label>
                <input type="text" value={selecionada.motivo_tecnico} readOnly className="w-full p-2 bg-gray-100 border rounded text-red-700 font-mono text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status Operacional</label>
                  <select 
                    value={selecionada.status_operacional}
                    onChange={(e) => setSelecionada({...selecionada, status_operacional: e.target.value})}
                    className="w-full p-2 border rounded font-medium text-sm bg-white"
                  >
                    <option value="em_analise">1. Em Análise</option>
                    <option value="reparo_em_curso">2. Reparo em Curso</option>
                    <option value="previsao_liberacao">3. Previsão de Liberação</option>
                    <option value="resolvido">4. Resolvido (Embarque)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Novo Horário Partida (ETD)</label>
                  <input 
                    type="datetime-local" 
                    value={formatarParaInput(selecionada.novo_horario_partida)} 
                    onChange={(e) => setSelecionada({...selecionada, novo_horario_partida: e.target.value})} 
                    className="w-full p-2 border rounded text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mensagem Oficial para Cliente e Pista</label>
                <textarea 
                  value={selecionada.mensagem_cliente}
                  onChange={(e) => setSelecionada({...selecionada, mensagem_cliente: e.target.value})}
                  className="w-full p-3 border rounded text-sm"
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 rounded transition-colors uppercase text-sm cursor-pointer">
                Salvar Alterações
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
              <p className="text-sm">Selecione uma ocorrência na lista ao lado ou crie uma nova para gerenciar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}