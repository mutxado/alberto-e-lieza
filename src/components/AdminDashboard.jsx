import React, { useState, useEffect } from 'react';
import { 
  Lock, Users, User, CheckCircle, XCircle, Search, Download, Trash2, LogOut, 
  ArrowLeft, RefreshCw, Sparkles, LayoutGrid, Plus, Edit3, ArrowRightLeft, 
  Printer, UserPlus, Check, AlertCircle, X
} from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { 
  subscribeToRsvps, 
  deleteRsvpFromFirestore, 
  subscribeToTables, 
  syncTablesToFirestore, 
  subscribeToSeatingAssignments, 
  syncSeatingAssignmentsToFirestore, 
  subscribeToManualGuests, 
  syncManualGuestsToFirestore 
} from '../firebase';

export function AdminDashboard({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState('rsvp'); // 'rsvp' | 'tables'

  // RSVP state
  const [confirmations, setConfirmations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Tables & Seating state
  const [tables, setTables] = useState([]);
  const [manualGuests, setManualGuests] = useState([]);
  const [seatingAssignments, setSeatingAssignments] = useState({}); // { guestId: tableId }
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState('todos'); // 'todos' | 'com_vagas' | 'lotadas'

  // Inline Quick Add inputs per table: { [tableId]: { name: '', seats: 1 } }
  const [quickInputs, setQuickInputs] = useState({});

  // Modal / Form states
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(10);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [batchCount, setBatchCount] = useState(5);
  const [batchCapacity, setBatchCapacity] = useState(10);

  const [isAddManualGuestOpen, setIsAddManualGuestOpen] = useState(false);
  const [manualGuestName, setManualGuestName] = useState('');
  const [manualGuestSeats, setManualGuestSeats] = useState(1);
  const [manualGuestTable, setManualGuestTable] = useState('');

  const [editingTable, setEditingTable] = useState(null);
  const [transferringGuest, setTransferringGuest] = useState(null);

  const ADMIN_PASSWORD = weddingData.adminPassword || 'alberto2026';

  // Load all local cached data
  const loadData = () => {
    try {
      const storedRsvp = JSON.parse(localStorage.getItem('alberto_liesa_rsvp_confirmations') || '[]');
      if (storedRsvp.length > 0) setConfirmations(storedRsvp);

      const storedTables = JSON.parse(localStorage.getItem('alberto_liesa_tables') || '[]');
      if (storedTables.length === 0) {
        const defaultTables = [
          { id: 'table-1', name: 'Mesa 1 - Noivos & Pais', capacity: 10 },
          { id: 'table-2', name: 'Mesa 2 - Padrinhos & Damas', capacity: 10 },
          { id: 'table-3', name: 'Mesa 3 - Família do Noivo', capacity: 10 },
          { id: 'table-4', name: 'Mesa 4 - Família da Noiva', capacity: 10 },
          { id: 'table-5', name: 'Mesa 5 - Amigos & Convidados de Honra', capacity: 10 },
        ];
        setTables(defaultTables);
        localStorage.setItem('alberto_liesa_tables', JSON.stringify(defaultTables));
        syncTablesToFirestore(defaultTables);
      } else {
        setTables(storedTables);
      }

      const storedManual = JSON.parse(localStorage.getItem('alberto_liesa_manual_guests') || '[]');
      setManualGuests(storedManual);

      const storedAssignments = JSON.parse(localStorage.getItem('alberto_liesa_seating_assignments') || '{}');
      setSeatingAssignments(storedAssignments);
    } catch (e) {
      console.log('Error loading admin data:', e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    loadData();

    // Live Firebase Cloud Sync Listeners
    const unsubRsvp = subscribeToRsvps((cloudRsvps) => {
      if (cloudRsvps && cloudRsvps.length > 0) {
        setConfirmations(cloudRsvps);
        try {
          localStorage.setItem('alberto_liesa_rsvp_confirmations', JSON.stringify(cloudRsvps));
        } catch (e) {}
      }
    });

    const unsubTables = subscribeToTables((cloudTables) => {
      if (cloudTables && cloudTables.length > 0) {
        setTables(cloudTables);
        try {
          localStorage.setItem('alberto_liesa_tables', JSON.stringify(cloudTables));
        } catch (e) {}
      }
    });

    const unsubSeating = subscribeToSeatingAssignments((cloudSeating) => {
      if (cloudSeating) {
        setSeatingAssignments(cloudSeating);
        try {
          localStorage.setItem('alberto_liesa_seating_assignments', JSON.stringify(cloudSeating));
        } catch (e) {}
      }
    });

    const unsubManual = subscribeToManualGuests((cloudManual) => {
      if (cloudManual) {
        setManualGuests(cloudManual);
        try {
          localStorage.setItem('alberto_liesa_manual_guests', JSON.stringify(cloudManual));
        } catch (e) {}
      }
    });

    return () => {
      unsubRsvp();
      unsubTables();
      unsubSeating();
      unsubManual();
    };
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

  // RSVP Management
  const handleDeleteConfirmation = async (idToDelete) => {
    if (window.confirm('Tem a certeza que deseja remover esta confirmação?')) {
      const updated = confirmations.filter((item, idx) => (item.id || idx) !== idToDelete);
      setConfirmations(updated);
      localStorage.setItem('alberto_liesa_rsvp_confirmations', JSON.stringify(updated));

      const newAssignments = { ...seatingAssignments };
      delete newAssignments[idToDelete];
      setSeatingAssignments(newAssignments);
      localStorage.setItem('alberto_liesa_seating_assignments', JSON.stringify(newAssignments));

      try {
        await deleteRsvpFromFirestore(idToDelete);
        await syncSeatingAssignmentsToFirestore(newAssignments);
      } catch (e) {
        console.log('Firebase delete error:', e);
      }
    }
  };

  const exportRsvpToCSV = () => {
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

  // Table Management Actions
  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const newTable = {
      id: `table-${Date.now()}`,
      name: newTableName.trim(),
      capacity: parseInt(newTableCapacity, 10) || 10
    };

    const updated = [...tables, newTable];
    setTables(updated);
    localStorage.setItem('alberto_liesa_tables', JSON.stringify(updated));
    syncTablesToFirestore(updated);
    setNewTableName('');
    setNewTableCapacity(10);
    setIsAddTableOpen(false);
  };

  const handleCreateBatchTables = async (e) => {
    e.preventDefault();
    const count = parseInt(batchCount, 10) || 1;
    const cap = parseInt(batchCapacity, 10) || 10;
    const startNumber = tables.length + 1;

    const created = [];
    for (let i = 0; i < count; i++) {
      created.push({
        id: `table-${Date.now()}-${i}`,
        name: `Mesa ${startNumber + i}`,
        capacity: cap
      });
    }

    const updated = [...tables, ...created];
    setTables(updated);
    localStorage.setItem('alberto_liesa_tables', JSON.stringify(updated));
    syncTablesToFirestore(updated);
    setIsBatchOpen(false);
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    if (!editingTable || !editingTable.name.trim()) return;

    const updated = tables.map(t => t.id === editingTable.id ? {
      ...t,
      name: editingTable.name.trim(),
      capacity: parseInt(editingTable.capacity, 10) || 10
    } : t);

    setTables(updated);
    localStorage.setItem('alberto_liesa_tables', JSON.stringify(updated));
    syncTablesToFirestore(updated);
    setEditingTable(null);
  };

  const handleDeleteTable = async (tableId) => {
    const { guests } = getTableOccupancy(tableId);
    const msg = guests.length > 0 
      ? `Esta mesa tem ${guests.length} convidado(s). Ao eliminar, eles ficarão sem mesa atribuída. Deseja continuar?`
      : 'Tem a certeza que deseja eliminar esta mesa?';

    if (window.confirm(msg)) {
      const updatedTables = tables.filter(t => t.id !== tableId);
      setTables(updatedTables);
      localStorage.setItem('alberto_liesa_tables', JSON.stringify(updatedTables));
      syncTablesToFirestore(updatedTables);

      const newAssignments = { ...seatingAssignments };
      Object.keys(newAssignments).forEach(gId => {
        if (newAssignments[gId] === tableId) {
          delete newAssignments[gId];
        }
      });
      setSeatingAssignments(newAssignments);
      localStorage.setItem('alberto_liesa_seating_assignments', JSON.stringify(newAssignments));
      syncSeatingAssignmentsToFirestore(newAssignments);
    }
  };

  const handleClearTable = async (tableId) => {
    if (window.confirm('Deseja desocupar todos os convidados desta mesa? Eles voltarão para a lista de convidados sem mesa.')) {
      const newAssignments = { ...seatingAssignments };
      Object.keys(newAssignments).forEach(gId => {
        if (newAssignments[gId] === tableId) {
          delete newAssignments[gId];
        }
      });
      setSeatingAssignments(newAssignments);
      localStorage.setItem('alberto_liesa_seating_assignments', JSON.stringify(newAssignments));
      syncSeatingAssignmentsToFirestore(newAssignments);
    }
  };

  // Guest & Table Assignment Actions
  const handleAssignGuestToTable = async (guestId, tableId) => {
    const newAssignments = {
      ...seatingAssignments,
      [guestId]: tableId
    };
    setSeatingAssignments(newAssignments);
    localStorage.setItem('alberto_liesa_seating_assignments', JSON.stringify(newAssignments));
    syncSeatingAssignmentsToFirestore(newAssignments);
  };

  const handleRemoveGuestFromTable = async (guestId) => {
    const newAssignments = { ...seatingAssignments };
    delete newAssignments[guestId];
    setSeatingAssignments(newAssignments);
    localStorage.setItem('alberto_liesa_seating_assignments', JSON.stringify(newAssignments));
    syncSeatingAssignmentsToFirestore(newAssignments);
  };

  const handleTransferGuest = async (e) => {
    e.preventDefault();
    if (!transferringGuest || !transferringGuest.targetTableId) return;

    await handleAssignGuestToTable(transferringGuest.id, transferringGuest.targetTableId);
    setTransferringGuest(null);
  };

  const handleAddManualGuest = async (e) => {
    e.preventDefault();
    if (!manualGuestName.trim()) return;

    const newGuest = {
      id: `manual-${Date.now()}`,
      name: manualGuestName.trim(),
      seats: parseInt(manualGuestSeats, 10) || 1,
      source: 'manual',
      createdDate: new Date().toLocaleString('pt-MZ')
    };

    const updatedManual = [...manualGuests, newGuest];
    setManualGuests(updatedManual);
    localStorage.setItem('alberto_liesa_manual_guests', JSON.stringify(updatedManual));
    syncManualGuestsToFirestore(updatedManual);

    if (manualGuestTable) {
      await handleAssignGuestToTable(newGuest.id, manualGuestTable);
    }

    setManualGuestName('');
    setManualGuestSeats(1);
    setManualGuestTable('');
    setIsAddManualGuestOpen(false);
  };

  const handleQuickAddGuestToTable = async (e, tableId) => {
    e.preventDefault();
    const input = quickInputs[tableId] || { name: '', seats: 1 };
    if (!input.name || !input.name.trim()) return;

    const newGuest = {
      id: `manual-${Date.now()}`,
      name: input.name.trim(),
      seats: parseInt(input.seats, 10) || 1,
      source: 'manual',
      createdDate: new Date().toLocaleString('pt-MZ')
    };

    const updatedManual = [...manualGuests, newGuest];
    setManualGuests(updatedManual);
    localStorage.setItem('alberto_liesa_manual_guests', JSON.stringify(updatedManual));
    syncManualGuestsToFirestore(updatedManual);

    await handleAssignGuestToTable(newGuest.id, tableId);

    setQuickInputs({
      ...quickInputs,
      [tableId]: { name: '', seats: 1 }
    });
  };

  const handleDeleteGuest = async (guest) => {
    if (window.confirm(`Deseja remover "${guest.name}"?`)) {
      await handleRemoveGuestFromTable(guest.id);

      if (guest.source === 'manual') {
        const updated = manualGuests.filter(g => g.id !== guest.id);
        setManualGuests(updated);
        localStorage.setItem('alberto_liesa_manual_guests', JSON.stringify(updated));
        syncManualGuestsToFirestore(updated);
      }
    }
  };

  // Compile full list of eligible guests
  const allEligibleGuests = [
    ...confirmations
      .filter(c => c.attending === 'sim')
      .map((c, idx) => ({
        id: c.id || `rsvp-${idx}`,
        name: c.name,
        seats: parseInt(c.guests || 1, 10),
        source: 'rsvp',
        details: c
      })),
    ...manualGuests.map(g => ({
      id: g.id,
      name: g.name,
      seats: parseInt(g.seats || 1, 10),
      source: 'manual',
      details: g
    }))
  ];

  const getTableOccupancy = (tableId) => {
    const assigned = allEligibleGuests.filter(g => seatingAssignments[g.id] === tableId);
    const occupiedSeats = assigned.reduce((sum, g) => sum + g.seats, 0);
    return {
      guests: assigned,
      occupiedSeats
    };
  };

  const handlePrintTables = () => {
    window.print();
  };

  const exportTablesToCSV = () => {
    if (tables.length === 0) return;

    const headers = ['Nome da Mesa', 'Capacidade', 'Lugares Ocupados', 'Lugares Livres', 'Convidados Sentados'];
    const rows = tables.map(t => {
      const { guests, occupiedSeats } = getTableOccupancy(t.id);
      const guestNames = guests.map(g => `${g.name} (${g.seats} lugar${g.seats > 1 ? 'es' : ''})`).join('; ');
      return [
        `"${t.name}"`,
        `"${t.capacity}"`,
        `"${occupiedSeats}"`,
        `"${Math.max(0, t.capacity - occupiedSeats)}"`,
        `"${guestNames}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mapa_de_Mesas_Casamento_Alberto_e_Liesa_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for Table Stats
  const totalTablesCount = tables.length;
  const totalAvailableCapacity = tables.reduce((sum, t) => sum + (parseInt(t.capacity, 10) || 0), 0);
  const totalSeatedSeats = allEligibleGuests
    .filter(g => !!seatingAssignments[g.id])
    .reduce((sum, g) => sum + g.seats, 0);
  const unassignedGuests = allEligibleGuests.filter(g => !seatingAssignments[g.id]);

  // Filters
  const filteredConfirmations = confirmations.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'sim') return matchesSearch && item.attending === 'sim';
    if (filterStatus === 'nao') return matchesSearch && item.attending !== 'sim';
    return matchesSearch;
  });

  const filteredTables = tables.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(tableSearchQuery.toLowerCase());
    const { occupiedSeats } = getTableOccupancy(t.id);
    const isFull = occupiedSeats >= t.capacity;

    if (tableFilter === 'lotadas') return matchesSearch && isFull;
    if (tableFilter === 'com_vagas') return matchesSearch && !isFull;
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#F7F9F6] flex items-center justify-center">
        <div className="glass-card-emerald rounded-3xl p-8 sm:p-12 border border-[#2D6A4F]/20 shadow-xl max-w-md w-full text-center bg-white">
          <div className="w-16 h-16 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl text-[#1A2820] font-semibold mb-2">
            Painel Privado
          </h2>
          <p className="text-xs text-[#4D5E54] mb-8">
            Área de gestão reservada aos noivos (Alberto & Liesa).
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Palavra-passe de acesso"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-5 py-3.5 rounded-2xl bg-[#F7F9F6] border ${
                  passwordError ? 'border-rose-500 focus:ring-rose-200' : 'border-[#2D6A4F]/30 focus:border-[#2D6A4F]'
                } focus:ring-2 outline-hidden text-sm text-center font-medium transition-all`}
              />
              {passwordError && (
                <p className="text-xs text-rose-600 mt-2 font-medium">Palavra-passe incorreta. Tente novamente.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>

          <button
            onClick={onBack}
            className="mt-6 text-xs text-[#6B7A70] hover:text-[#2D6A4F] inline-flex items-center gap-1 transition-colors uppercase tracking-wider font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Convite
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#F7F9F6]">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#2D6A4F]/20 shadow-sm">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#2D6A4F] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Painel de Gestão dos Noivos
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1A2820] font-semibold">
              Alberto & Liesa
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <button
              onClick={loadData}
              className="p-3 rounded-2xl bg-[#F7F9F6] hover:bg-[#2D6A4F]/10 text-[#2D6A4F] transition-colors cursor-pointer"
              title="Atualizar dados"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {activeTab === 'rsvp' ? (
              <button
                onClick={exportRsvpToCSV}
                disabled={confirmations.length === 0}
                className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#C5A059]" />
                Exportar RSVP (CSV)
              </button>
            ) : (
              <>
                <button
                  onClick={handlePrintTables}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#C5A059]" />
                  Imprimir Mapa de Mesas
                </button>
                <button
                  onClick={exportTablesToCSV}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-white border border-[#2D6A4F]/30 hover:bg-[#2D6A4F]/10 text-[#1B4332] text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  Exportar Mesas (CSV)
                </button>
              </>
            )}

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
              title="Sair do painel"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#2D6A4F]/20 pb-4">
          <button
            onClick={() => setActiveTab('rsvp')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'rsvp'
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'bg-white text-[#2D3A32] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/15'
            }`}
          >
            <Users className="w-4 h-4 text-[#C5A059]" />
            <span>Confirmações RSVP ({confirmations.filter(c => c.attending === 'sim').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'tables'
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'bg-white text-[#2D3A32] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/15'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#C5A059]" />
            <span>Gestão de Mesas & Lugares ({tables.length} Mesas)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: RSVP CONFIRMATIONS                                                */}
        {/* ========================================================================= */}
        {activeTab === 'rsvp' && (
          <div>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Total Lugares Confirmados</span>
                  <span className="font-serif text-3xl font-bold text-[#1B4332]">
                    {confirmations.filter(c => c.attending === 'sim').reduce((sum, c) => sum + parseInt(c.guests || '1', 10), 0)}
                  </span>
                  <span className="text-[10px] text-gray-500 block">Pessoas com presença confirmada</span>
                </div>
              </div>

              <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Confirmados (Sim)</span>
                  <span className="font-serif text-3xl font-bold text-emerald-700">
                    {confirmations.filter(c => c.attending === 'sim').length}
                  </span>
                  <span className="text-[10px] text-gray-500 block">Respostas positivas</span>
                </div>
              </div>

              <div className="glass-card-emerald rounded-3xl p-6 border border-[#2D6A4F]/20 shadow-sm flex items-center gap-4 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Ausentes (Não)</span>
                  <span className="font-serif text-3xl font-bold text-rose-700">
                    {confirmations.filter(c => c.attending !== 'sim').length}
                  </span>
                  <span className="text-[10px] text-gray-500 block">Respostas de ausência</span>
                </div>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="glass-card-emerald rounded-3xl p-4 mb-6 border border-[#2D6A4F]/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#2D6A4F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar por convidado ou mensagem..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {['todos', 'sim', 'nao'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      filterStatus === st
                        ? 'bg-[#1B4332] text-white shadow-xs'
                        : 'bg-white text-[#2D3A32] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/20'
                    }`}
                  >
                    {st === 'todos' ? 'Todos' : st === 'sim' ? 'Confirmados' : 'Ausentes'}
                  </button>
                ))}
              </div>
            </div>

            {/* RSVP Table */}
            <div className="glass-card-emerald rounded-3xl border border-[#2D6A4F]/20 shadow-sm overflow-hidden bg-white">
              {filteredConfirmations.length === 0 ? (
                <div className="text-center py-14 text-gray-500">
                  <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-serif text-lg font-medium text-[#1A2820]">Nenhuma confirmação registada ainda</p>
                  <p className="text-xs text-gray-400">As confirmações enviadas pelos convidados aparecerão aqui.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1B4332]/5 border-b border-[#2D6A4F]/15 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                        <th className="p-4 sm:p-5">Data/Hora</th>
                        <th className="p-4 sm:p-5">Nome do Convidado</th>
                        <th className="p-4 sm:p-5 text-center">Lugares</th>
                        <th className="p-4 sm:p-5 text-center">Status</th>
                        <th className="p-4 sm:p-5">Mesa Atribuída</th>
                        <th className="p-4 sm:p-5">Restrições / Mensagem</th>
                        <th className="p-4 sm:p-5 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D6A4F]/10 text-xs">
                      {filteredConfirmations.map((c, idx) => {
                        const guestId = c.id || `rsvp-${idx}`;
                        const assignedTableId = seatingAssignments[guestId];
                        const assignedTable = tables.find(t => t.id === assignedTableId);

                        return (
                          <tr key={guestId} className="hover:bg-[#2D6A4F]/5 transition-colors">
                            <td className="p-4 sm:p-5 text-gray-500 whitespace-nowrap">{c.timestamp || c.createdDate || 'Recente'}</td>
                            <td className="p-4 sm:p-5 font-bold text-[#1A2820]">
                              {c.name}
                              {c.dietary && c.dietary !== 'Nenhuma' && (
                                <span className="block text-[10px] text-amber-700 font-normal mt-0.5">
                                  Restrição: {c.dietary}
                                </span>
                              )}
                            </td>
                            <td className="p-4 sm:p-5 text-center font-bold text-[#1B4332]">{c.guests || 1}</td>
                            <td className="p-4 sm:p-5 text-center">
                              {c.attending === 'sim' ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                                  <Check className="w-3 h-3" /> Sim
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                                  <X className="w-3 h-3" /> Não
                                </span>
                              )}
                            </td>
                            <td className="p-4 sm:p-5">
                              {c.attending === 'sim' ? (
                                assignedTable ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] font-semibold text-xs border border-[#1B4332]/20">
                                    <LayoutGrid className="w-3 h-3 text-[#C5A059]" />
                                    {assignedTable.name}
                                  </span>
                                ) : (
                                  <span className="text-amber-700 text-xs italic">Sem mesa</span>
                                )
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                            </td>
                            <td className="p-4 sm:p-5 text-gray-600 max-w-xs truncate" title={c.message}>
                              {c.message || '—'}
                            </td>
                            <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteConfirmation(guestId)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="Remover registo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TABLES & SEATING MANAGEMENT                                       */}
        {/* ========================================================================= */}
        {activeTab === 'tables' && (
          <div>
            {/* Table Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="glass-card-emerald rounded-3xl p-5 border border-[#2D6A4F]/20 shadow-sm bg-white">
                <span className="text-[10px] sm:text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Total de Mesas</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B4332]">{totalTablesCount}</span>
                <span className="text-[10px] text-gray-500 block">Criadas no sistema</span>
              </div>

              <div className="glass-card-emerald rounded-3xl p-5 border border-[#2D6A4F]/20 shadow-sm bg-white">
                <span className="text-[10px] sm:text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Capacidade Total</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1B4332]">{totalAvailableCapacity}</span>
                <span className="text-[10px] text-gray-500 block">Lugares disponíveis</span>
              </div>

              <div className="glass-card-emerald rounded-3xl p-5 border border-[#2D6A4F]/20 shadow-sm bg-white">
                <span className="text-[10px] sm:text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Lugares Ocupados</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">{totalSeatedSeats}</span>
                <span className="text-[10px] text-gray-500 block">Convidados acomodados</span>
              </div>

              <div className="glass-card-emerald rounded-3xl p-5 border border-[#2D6A4F]/20 shadow-sm bg-white">
                <span className="text-[10px] sm:text-xs uppercase font-bold text-[#6B7A70] block tracking-wider">Sem Mesa Atribuída</span>
                <span className={`font-serif text-2xl sm:text-3xl font-bold ${unassignedGuests.length > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {unassignedGuests.length}
                </span>
                <span className="text-[10px] text-gray-500 block">Aguardando alocação</span>
              </div>
            </div>

            {/* Action Bar & Modal Triggers */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-6 rounded-3xl border border-[#2D6A4F]/20 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setIsAddTableOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C5A059]" />
                  Criar Nova Mesa
                </button>

                <button
                  onClick={() => setIsBatchOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 hover:bg-[#2D6A4F]/10 text-[#1B4332] text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4 text-[#C5A059]" />
                  Criar Lote de Mesas (Ex: 10 Mesas)
                </button>

                <button
                  onClick={() => setIsAddManualGuestOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-white border border-[#2D6A4F]/25 hover:bg-[#2D6A4F]/10 text-[#1B4332] text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#C5A059]" />
                  Adicionar Convidado Manual
                </button>
              </div>

              {/* Table Search & Filter */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="w-4 h-4 text-[#2D6A4F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar mesas por nome..."
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs focus:outline-hidden focus:border-[#2D6A4F]"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {['todos', 'com_vagas', 'lotadas'].map((flt) => (
                    <button
                      key={flt}
                      onClick={() => setTableFilter(flt)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        tableFilter === flt
                          ? 'bg-[#1B4332] text-white shadow-xs'
                          : 'bg-[#F7F9F6] text-[#2D3A32] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/20'
                      }`}
                    >
                      {flt === 'todos' ? 'Todas' : flt === 'com_vagas' ? 'Vagas' : 'Lotadas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Unassigned Guests Pool Alert / Section */}
            {unassignedGuests.length > 0 && (
              <div className="mb-8 p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-amber-900 font-serif text-lg font-semibold">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Convidados Confirmados Sem Mesa ({unassignedGuests.length})</span>
                  </div>
                  <span className="text-xs text-amber-700 font-medium">
                    Atribua uma mesa para cada convidado abaixo:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unassignedGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col justify-between gap-3.5 hover:border-amber-400 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#1A2820] leading-snug break-words">
                              {guest.name}
                            </h4>
                            <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                              {guest.seats} {guest.seats > 1 ? 'lugares' : 'lugar'} {guest.source === 'manual' ? '• Manual' : '• RSVP Online'}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-amber-100/90 text-amber-900 text-[10px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">
                          {guest.seats} {guest.seats > 1 ? 'Lugares' : 'Lugar'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-amber-100">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          Alocar para a Mesa:
                        </label>
                        <select
                          onChange={(e) => handleAssignGuestToTable(guest.id, e.target.value)}
                          defaultValue=""
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-amber-50/70 border border-amber-300 font-semibold text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
                        >
                          <option value="" disabled>Selecionar Mesa do Casamento...</option>
                          {tables.map(t => {
                            const { occupiedSeats } = getTableOccupancy(t.id);
                            const remaining = t.capacity - occupiedSeats;
                            const hasSpace = remaining >= guest.seats;
                            return (
                              <option key={t.id} value={t.id} disabled={occupiedSeats >= t.capacity}>
                                {t.name} ({occupiedSeats}/{t.capacity} lugares) {!hasSpace ? '• [Poucas vagas]' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tables Grid */}
            {filteredTables.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#2D6A4F]/20 shadow-sm">
                <LayoutGrid className="w-14 h-14 mx-auto text-gray-300 mb-3" />
                <h3 className="font-serif text-xl font-medium text-[#1A2820] mb-1">Nenhuma mesa encontrada</h3>
                <p className="text-xs text-gray-500 mb-6">Comece criando a primeira mesa para os noivos e convidados.</p>
                <button
                  onClick={() => setIsAddTableOpen(true)}
                  className="px-6 py-3 rounded-full bg-[#1B4332] text-white text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer"
                >
                  Criar Mesa Agora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTables.map((table) => {
                  const { guests, occupiedSeats } = getTableOccupancy(table.id);
                  const isFull = occupiedSeats >= table.capacity;
                  const percentage = Math.min(100, Math.round((occupiedSeats / table.capacity) * 100));
                  const currentInput = quickInputs[table.id] || { name: '', seats: 1 };

                  return (
                    <div
                      key={table.id}
                      className="bg-white rounded-3xl border border-[#2D6A4F]/20 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div>
                        {/* Table Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                              MESA DO CASAMENTO
                            </span>
                            <h3 className="font-serif text-xl font-bold text-[#1A2820] leading-snug">
                              {table.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setEditingTable(table)}
                              className="p-1.5 text-gray-400 hover:text-[#1B4332] hover:bg-[#2D6A4F]/10 rounded-lg transition-colors cursor-pointer"
                              title="Editar nome / capacidade"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTable(table.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover mesa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span className={isFull ? 'text-rose-700 font-bold' : 'text-[#2D6A4F]'}>
                              {occupiedSeats} de {table.capacity} Lugares Ocupados
                            </span>
                            <span className="text-gray-400">{percentage}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                isFull ? 'bg-rose-500' : percentage > 70 ? 'bg-[#C5A059]' : 'bg-[#2D6A4F]'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Guest List Inside Table */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                              CONVIDADOS SENTADOS ({guests.length})
                            </span>
                            {guests.length > 0 && (
                              <button
                                onClick={() => handleClearTable(table.id)}
                                className="text-[10px] text-rose-600 hover:underline font-bold uppercase tracking-wider cursor-pointer"
                                title="Limpar todos os convidados desta mesa"
                              >
                                Limpar Mesa
                              </button>
                            )}
                          </div>

                          {guests.length === 0 ? (
                            <p className="text-xs text-gray-400 italic py-4 text-center bg-[#F7F9F6] rounded-2xl border border-dashed border-gray-200">
                              Mesa vazia. Adicione convidados abaixo.
                            </p>
                          ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                              {guests.map((g) => (
                                <div
                                  key={g.id}
                                  className="p-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/15 flex items-center justify-between gap-2.5 text-xs hover:border-[#2D6A4F]/40 transition-colors"
                                >
                                  <div className="min-w-0 flex-1">
                                    <span className="font-bold text-[#1A2820] block leading-snug break-words">{g.name}</span>
                                    <span className="text-[10px] text-gray-500 font-medium block mt-0.5">
                                      {g.seats} {g.seats > 1 ? 'lugares' : 'lugar'} {g.source === 'manual' ? '• Manual' : '• RSVP'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => setTransferringGuest(g)}
                                      className="p-1.5 text-gray-500 hover:text-[#1B4332] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                                      title="Transferir para outra mesa"
                                    >
                                      <ArrowRightLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteGuest(g)}
                                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                                      title="Remover / Deletar convidado desta mesa"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Add Guest Section on this Specific Table */}
                      <div className="pt-4 border-t border-[#2D6A4F]/10 space-y-3">
                        {!isFull ? (
                          <>
                            {/* Direct Quick Add Form */}
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#2D6A4F] tracking-wider block mb-1.5 flex items-center gap-1">
                                <Plus className="w-3 h-3 text-[#C5A059]" />
                                Adicionar Convidado nesta Mesa
                              </span>
                              <form onSubmit={(e) => handleQuickAddGuestToTable(e, table.id)} className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Nome do convidado..."
                                  value={currentInput.name || ''}
                                  onChange={(e) => setQuickInputs({
                                    ...quickInputs,
                                    [table.id]: { ...currentInput, name: e.target.value }
                                  })}
                                  className="flex-1 px-3 py-2 rounded-xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                                />
                                <input
                                  type="number"
                                  min="1"
                                  max={Math.max(1, table.capacity - occupiedSeats)}
                                  title="Lugares ocupados"
                                  value={currentInput.seats || 1}
                                  onChange={(e) => setQuickInputs({
                                    ...quickInputs,
                                    [table.id]: { ...currentInput, seats: e.target.value }
                                  })}
                                  className="w-12 px-1.5 py-2 rounded-xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-center text-[#1A2820] font-bold focus:outline-hidden"
                                />
                                <button
                                  type="submit"
                                  className="px-3 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition-colors cursor-pointer"
                                  title="Adicionar à mesa"
                                >
                                  +
                                </button>
                              </form>
                            </div>

                            {/* Direct Select from Unassigned */}
                            {unassignedGuests.length > 0 && (
                              <div>
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAssignGuestToTable(e.target.value, table.id);
                                      e.target.value = '';
                                    }
                                  }}
                                  defaultValue=""
                                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#F7F9F6] border border-[#2D6A4F]/20 text-[#1B4332] font-semibold focus:outline-hidden cursor-pointer"
                                >
                                  <option value="" disabled>Puxar convidado sem mesa...</option>
                                  {unassignedGuests.map(g => (
                                    <option key={g.id} value={g.id}>
                                      {g.name} ({g.seats} lugar{g.seats > 1 ? 'es' : ''})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                            <span className="text-xs text-rose-700 font-bold uppercase tracking-wider block">
                              Mesa Lotada ({table.capacity} Lugares)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODALS                                                                   */}
      {/* ========================================================================= */}

      {/* 1. Modal: Criar Nova Mesa */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#1A2820] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#2D6A4F]" />
                Criar Nova Mesa
              </h3>
              <button onClick={() => setIsAddTableOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Nome ou Identificação da Mesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mesa 6 - Família da Noiva"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Capacidade (Número de Lugares) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">O padrão habitual é de 10 lugares por mesa.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Criar Mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Criar Lote de Mesas */}
      {isBatchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#1A2820] flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#2D6A4F]" />
                Criar Várias Mesas em Lote
              </h3>
              <button onClick={() => setIsBatchOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatchTables} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Quantas mesas deseja criar? *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Ex: 10 mesas (serão nomeadas automaticamente: Mesa {tables.length + 1}, Mesa {tables.length + 2}...)</span>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Capacidade de cada mesa *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={batchCapacity}
                  onChange={(e) => setBatchCapacity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBatchOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Gerar {batchCount} Mesas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Adicionar Convidado Manual */}
      {isAddManualGuestOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#1A2820] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#2D6A4F]" />
                Adicionar Convidado
              </h3>
              <button onClick={() => setIsAddManualGuestOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualGuest} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Nome Completo do Convidado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Teresa Manhiça"
                  value={manualGuestName}
                  onChange={(e) => setManualGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Número de Lugares *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={manualGuestSeats}
                  onChange={(e) => setManualGuestSeats(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Mesa Inicial (Opcional)
                </label>
                <select
                  value={manualGuestTable}
                  onChange={(e) => setManualGuestTable(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F] cursor-pointer"
                >
                  <option value="">Deixar sem mesa (atribuir depois)</option>
                  {tables.map(t => {
                    const { occupiedSeats } = getTableOccupancy(t.id);
                    return (
                      <option key={t.id} value={t.id} disabled={occupiedSeats >= t.capacity}>
                        {t.name} ({occupiedSeats}/{t.capacity})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddManualGuestOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Guardar Convidado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Editar Mesa */}
      {editingTable && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#1A2820] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#2D6A4F]" />
                Editar Mesa
              </h3>
              <button onClick={() => setEditingTable(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTable} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Nome da Mesa *
                </label>
                <input
                  type="text"
                  required
                  value={editingTable.name}
                  onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Capacidade (Lugares) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={editingTable.capacity}
                  onChange={(e) => setEditingTable({ ...editingTable, capacity: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingTable(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Guardar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Transferir Convidado */}
      {transferringGuest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#2D6A4F]/20 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#1A2820] flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#2D6A4F]" />
                Transferir Convidado
              </h3>
              <button onClick={() => setTransferringGuest(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferGuest} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/20">
                <span className="text-[10px] uppercase font-bold text-[#2D6A4F] block">Convidado Selecionado</span>
                <span className="font-bold text-sm text-[#1A2820] block">{transferringGuest.name}</span>
                <span className="text-xs text-gray-500 block">{transferringGuest.seats} lugar{transferringGuest.seats > 1 ? 'es' : ''}</span>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#1A2820] mb-2">
                  Transferir para qual Mesa? *
                </label>
                <select
                  required
                  defaultValue=""
                  onChange={(e) => setTransferringGuest({ ...transferringGuest, targetTableId: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#2D6A4F]/25 text-xs text-[#1A2820] focus:outline-hidden focus:border-[#2D6A4F] cursor-pointer"
                >
                  <option value="" disabled>Selecione a nova mesa...</option>
                  {tables.map(t => {
                    const { occupiedSeats } = getTableOccupancy(t.id);
                    const remaining = t.capacity - occupiedSeats;
                    return (
                      <option key={t.id} value={t.id} disabled={remaining < transferringGuest.seats}>
                        {t.name} ({occupiedSeats}/{t.capacity}) {remaining < transferringGuest.seats ? '• Sem vagas' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setTransferringGuest(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Confirmar Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
