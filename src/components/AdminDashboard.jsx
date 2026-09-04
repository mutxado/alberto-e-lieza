import React, { useState, useEffect } from 'react';
import { Lock, Users, CheckCircle, XCircle, Search, Download, Trash2, LogOut, Heart, ArrowLeft, RefreshCw, Cloud, Database } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { subscribeToRsvps, deleteRsvpFromFirestore, isFirebaseReady } from '../firebase';

export function AdminDashboard({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmations, setConfirmations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [loading, setLoading] = useState(true);

  // Master Admin Password (default: alberto2026)
  const ADMIN_PASSWORD = weddingData.adminPassword || 'alberto2026';

  // Load confirmations (Firebase Firestore real-time + localStorage backup)
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);

    // 1. Ouvinte em tempo real do Firebase Firestore
    const unsubscribe = subscribeToRsvps((cloudRsvps) => {
      if (cloudRsvps && cloudRsvps.length > 0) {
        setConfirmations(cloudRsvps);
      } else {
        // Fallback local se a nuvem estiver vazia
        try {
          const stored = JSON.parse(localStorage.getItem('alberto_liesa_rsvp_confirmations') || '[]');
          setConfirmations(stored);
        } catch (e) {
          setConfirmations([]);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Tem a certeza que deseja remover a confirmação de "${item.name}"?`)) {
      try {
        if (item.id && typeof item.id === 'string' && item.id.length > 10) {
          await deleteRsvpFromFirestore(item.id);
        }
      } catch (err) {
        console.error("Erro ao eliminar do Firebase:", err);
      }

      // Atualizar local
      const updated = confirmations.filter(c => c.id !== item.id && c.name !== item.name);
      setConfirmations(updated);
      localStorage.setItem('alberto_liesa_rsvp_confirmations', JSON.stringify(updated));
    }
  };

  const exportToCSV = () => {
    if (confirmations.length === 0) return;

    const headers = ['Data/Hora', 'Nome Completo', 'Lugares Reservados', 'Confirma Presença?', 'Restrições Alimentares', 'Mensagem'];
    const rows = confirmations.map(c => [
      `"${c.timestamp || c.createdDate || ''}"`,
      `"${c.name || ''}"`,
      `"${c.guests || 1}"`,
      `"${c.attending === 'sim' ? 'Sim' : 'Não'}"`,
      `"${c.dietary || 'Nenhuma'}"`,
      `"${(c.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Confirmacoes_Casamento_Alberto_e_Liesa_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredConfirmations = confirmations.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'sim') return matchesSearch && item.attending === 'sim';
    if (filterStatus === 'nao') return matchesSearch && item.attending !== 'sim';
    return matchesSearch;
  });

  // Calculate metrics
  const totalConfirmedGuests = confirmations
    .filter(c => c.attending === 'sim')
    .reduce((sum, c) => sum + parseInt(c.guests || '1', 10), 0);
  const totalConfirmedResponses = confirmations.filter(c => c.attending === 'sim').length;
  const totalDeclinedResponses = confirmations.filter(c => c.attending !== 'sim').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#FAF7F2] flex items-center justify-center">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-[#E2C799]/40 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#E2C799]/30 text-[#B8860B] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl text-[#2C2623] font-medium mb-2">
            Painel Privado dos Noivos
          </h2>
          <p className="text-xs text-[#6B5A56] mb-8">
            Área reservada para gestão de presenças em tempo real em qualquer telemóvel ou computador.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Palavra-passe de acesso"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl bg-white border ${
                  passwordError ? 'border-red-500 focus:ring-red-200' : 'border-[#E2C799]/50 focus:border-[#D4AF37]'
                } focus:ring-2 outline-hidden text-sm text-center font-medium transition-all`}
              />
              {passwordError && (
                <p className="text-xs text-red-500 mt-2">Palavra-passe incorreta. Tente novamente.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
            >
              Entrar no Painel
            </button>
          </form>

          <button
            onClick={onBack}
            className="mt-6 text-xs text-[#8A7874] hover:text-[#B8860B] inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao site do casamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/80 p-6 rounded-3xl border border-[#E2C799]/40 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                Painel de Gestão dos Noivos
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isFirebaseReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
              }`}>
                <Cloud className="w-3 h-3" />
                {isFirebaseReady ? 'Firebase Conectado' : 'Modo Nuvem / Local'}
              </span>
            </div>
            <h1 className="font-serif text-3xl text-[#2C2623] font-medium">
              Confirmações de Presença (RSVP)
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={confirmations.length === 0}
              className="px-4 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Exportar para Excel (CSV)
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              title="Sair do Painel"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-3xl p-6 border border-[#E2C799]/40 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E2C799]/30 text-[#B8860B] flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-[#8A7874] block">Total Pessoas Confirmadas</span>
              <span className="font-serif text-3xl font-bold text-[#B8860B]">{totalConfirmedGuests}</span>
              <span className="text-[10px] text-gray-500 block">Lugares de presença confirmada</span>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-[#E2C799]/40 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-[#8A7874] block">Confirmados (Sim)</span>
              <span className="font-serif text-3xl font-bold text-emerald-700">{totalConfirmedResponses}</span>
              <span className="text-[10px] text-gray-500 block">Respostas positivas</span>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-[#E2C799]/40 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-[#8A7874] block">Ausentes (Não)</span>
              <span className="font-serif text-3xl font-bold text-rose-700">{totalDeclinedResponses}</span>
              <span className="text-[10px] text-gray-500 block">Respostas de ausência</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card rounded-3xl p-4 mb-6 border border-[#E2C799]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#B8860B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou mensagem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-[#E2C799]/40 text-xs focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['todos', 'sim', 'nao'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-[#B8860B] text-white shadow-xs'
                    : 'bg-white text-[#4A3E3D] hover:bg-[#E2C799]/20 border border-[#E2C799]/30'
                }`}
              >
                {st === 'todos' ? 'Todos' : st === 'sim' ? 'Confirmados' : 'Ausentes'}
              </button>
            ))}
          </div>
        </div>

        {/* Table / List */}
        <div className="glass-card rounded-3xl border border-[#E2C799]/40 shadow-xs overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <RefreshCw className="w-8 h-8 mx-auto text-[#B8860B] animate-spin mb-3" />
              <p className="text-xs">A carregar confirmações em tempo real...</p>
            </div>
          ) : filteredConfirmations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-serif text-lg font-medium text-gray-600">Nenhuma confirmação encontrada</p>
              <p className="text-xs text-gray-400">As novas confirmações enviadas pelos convidados aparecerão aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#E2C799]/30 text-[#8A7874] uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="p-4">Data/Hora</th>
                    <th className="p-4">Nome do Convidado</th>
                    <th className="p-4 text-center">Lugares</th>
                    <th className="p-4 text-center">Estado</th>
                    <th className="p-4">Restrições Alimentares</th>
                    <th className="p-4">Mensagem</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2C799]/20">
                  {filteredConfirmations.map((c, idx) => (
                    <tr key={c.id || idx} className="hover:bg-white/60 transition-colors">
                      <td className="p-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        {c.timestamp || c.createdDate || 'Hoje'}
                      </td>
                      <td className="p-4 font-semibold text-[#2C2623]">
                        {c.name}
                      </td>
                      <td className="p-4 text-center font-bold text-[#B8860B]">
                        {c.guests || 1}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-[10px] ${
                          c.attending === 'sim'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {c.attending === 'sim' ? 'Confirmado' : 'Ausente'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 italic">
                        {c.dietary || 'Nenhuma'}
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs truncate">
                        {c.message || '-'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remover registo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
