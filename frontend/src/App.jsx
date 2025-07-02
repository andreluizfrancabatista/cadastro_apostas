import React, { useState, useEffect } from 'react';
import { Calendar, PlusCircle, Edit2, Trash2, TrendingUp, TrendingDown, BarChart3, X, Check } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

// Componente de notificação elegante
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <Check size={20} /> : type === 'error' ? <X size={20} /> : null;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse`}>
      {icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1">
        <X size={16} />
      </button>
    </div>
  );
};

// Componente Modal de Confirmação Elegante
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!isOpen) return null;

  const bgColor = type === 'danger' ? 'bg-red-600' : 'bg-blue-600';
  const hoverColor = type === 'danger' ? 'hover:bg-red-700' : 'hover:bg-blue-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-mx mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${bgColor} text-white rounded-md ${hoverColor} transition-colors`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [apostas, setApostas] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [activeTab, setActiveTab] = useState('cadastro');
  const [editingAposta, setEditingAposta] = useState(null);
  const [editingMetodo, setEditingMetodo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, data: null });

  // Estados para formulário de aposta
  const [formData, setFormData] = useState({
    data_hora: '',
    jogo: '',
    metodo_id: '',
    risco: '',
    lucro_perda: ''
  });

  // Estado para novo método
  const [novoMetodo, setNovoMetodo] = useState('');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const showConfirmModal = (title, message, onConfirm, type = 'danger') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, data: null });
  };

  useEffect(() => {
    fetchApostas();
    fetchMetodos();
    fetchEstatisticas();
  }, []);

  const fetchApostas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/apostas`);
      if (response.ok) {
        const data = await response.json();
        setApostas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar apostas:', error);
      showNotification('Erro ao carregar apostas', 'error');
    }
  };

  const fetchMetodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/metodos`);
      if (response.ok) {
        const data = await response.json();
        setMetodos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar métodos:', error);
      showNotification('Erro ao carregar métodos', 'error');
    }
  };

  const fetchEstatisticas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/estatisticas`);
      if (response.ok) {
        const data = await response.json();
        setEstatisticas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleSubmitAposta = async (e) => {
    e.preventDefault();
    
    const url = editingAposta 
      ? `${API_BASE_URL}/apostas/${editingAposta.id}`
      : `${API_BASE_URL}/apostas`;
    
    const method = editingAposta ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          risco: parseFloat(formData.risco),
          lucro_perda: parseFloat(formData.lucro_perda),
          metodo_id: parseInt(formData.metodo_id)
        }),
      });

      if (response.ok) {
        setFormData({
          data_hora: '',
          jogo: '',
          metodo_id: '',
          risco: '',
          lucro_perda: ''
        });
        setEditingAposta(null);
        fetchApostas();
        fetchEstatisticas();
        showNotification(
          editingAposta ? 'Aposta atualizada com sucesso!' : 'Aposta adicionada com sucesso!',
          'success'
        );
      } else {
        const error = await response.json();
        showNotification(`Erro: ${error.error || 'Erro desconhecido'}`, 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showNotification('Erro ao salvar aposta', 'error');
    }
  };

  const handleSubmitMetodo = async (e) => {
    e.preventDefault();
    
    const url = editingMetodo 
      ? `${API_BASE_URL}/metodos/${editingMetodo.id}`
      : `${API_BASE_URL}/metodos`;
    
    const method = editingMetodo ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: novoMetodo }),
      });

      if (response.ok) {
        setNovoMetodo('');
        setEditingMetodo(null);
        fetchMetodos();
        showNotification(
          editingMetodo ? 'Método atualizado com sucesso!' : 'Método cadastrado com sucesso!',
          'success'
        );
      } else {
        const error = await response.json();
        showNotification(`Erro: ${error.error || 'Erro desconhecido'}`, 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showNotification('Erro ao salvar método', 'error');
    }
  };

  const handleEditAposta = (aposta) => {
    setFormData({
      data_hora: aposta.data_hora,
      jogo: aposta.jogo,
      metodo_id: aposta.metodo_id.toString(),
      risco: aposta.risco.toString(),
      lucro_perda: aposta.lucro_perda.toString()
    });
    setEditingAposta(aposta);
    setActiveTab('cadastro');
  };

  const handleEditMetodo = (metodo) => {
    setNovoMetodo(metodo.nome);
    setEditingMetodo(metodo);
  };

  const handleDeleteAposta = (id) => {
    showConfirmModal(
      'Excluir Aposta',
      'Tem certeza que deseja excluir esta aposta? Esta ação não pode ser desfeita.',
      async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/apostas/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            fetchApostas();
            fetchEstatisticas();
            showNotification('Aposta excluída com sucesso!', 'success');
          } else {
            showNotification('Erro ao excluir aposta', 'error');
          }
        } catch (error) {
          console.error('Erro:', error);
          showNotification('Erro ao excluir aposta', 'error');
        }
        closeConfirmModal();
      }
    );
  };

  const handleDeleteMetodo = (id) => {
    showConfirmModal(
      'Excluir Método',
      'Tem certeza que deseja excluir este método? Esta ação não pode ser desfeita.',
      async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/metodos/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            fetchMetodos();
            showNotification('Método excluído com sucesso!', 'success');
          } else {
            const error = await response.json();
            showNotification(`Erro: ${error.error || 'Erro ao excluir método'}`, 'error');
          }
        } catch (error) {
          console.error('Erro:', error);
          showNotification('Erro ao excluir método', 'error');
        }
        closeConfirmModal();
      }
    );
  };

  const cancelEdit = () => {
    setEditingAposta(null);
    setEditingMetodo(null);
    setFormData({
      data_hora: '',
      jogo: '',
      metodo_id: '',
      risco: '',
      lucro_perda: ''
    });
    setNovoMetodo('');
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Apostas Esportivas
          </h1>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { key: 'cadastro', label: 'Cadastro de Apostas', icon: PlusCircle },
              { key: 'metodos', label: 'Métodos', icon: BarChart3 },
              { key: 'lista', label: 'Lista de Apostas', icon: Edit2 },
              { key: 'estatisticas', label: 'Estatísticas', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'cadastro' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingAposta ? 'Editar Aposta' : 'Cadastrar Nova Aposta'}
            </h2>
            
            <form onSubmit={handleSubmitAposta} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.data_hora}
                    onChange={(e) => setFormData({...formData, data_hora: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, data_hora: getCurrentDateTime()})}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Usar data/hora atual
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método
                  </label>
                  <select
                    value={formData.metodo_id}
                    onChange={(e) => setFormData({...formData, metodo_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um método</option>
                    {metodos.map(metodo => (
                      <option key={metodo.id} value={metodo.id}>
                        {metodo.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jogo
                </label>
                <input
                  type="text"
                  value={formData.jogo}
                  onChange={(e) => setFormData({...formData, jogo: e.target.value})}
                  placeholder="Ex: Flamengo x Corinthians"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risco (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.risco}
                    onChange={(e) => setFormData({...formData, risco: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lucro/Perda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.lucro_perda}
                    onChange={(e) => setFormData({...formData, lucro_perda: e.target.value})}
                    placeholder="Use + para lucro, - para perda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ex: 8 (lucro) ou -15 (perda)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <PlusCircle size={20} />
                  {editingAposta ? 'Atualizar Aposta' : 'Adicionar Aposta'}
                </button>
                
                {editingAposta && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'metodos' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingMetodo ? 'Editar Método' : 'Cadastrar Novo Método'}
            </h2>
            
            <form onSubmit={handleSubmitMetodo} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={novoMetodo}
                  onChange={(e) => setNovoMetodo(e.target.value)}
                  placeholder="Nome do método"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {editingMetodo ? 'Atualizar' : 'Cadastrar'}
                </button>
                {editingMetodo && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Métodos Disponíveis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {metodos.map(metodo => (
                  <div key={metodo.id} className="bg-gray-50 p-3 rounded-md border flex justify-between items-center">
                    <span className="font-medium text-gray-800">{metodo.nome}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditMetodo(metodo)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMetodo(metodo.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lista' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Lista de Apostas</h2>
            
            {apostas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma aposta cadastrada</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-2 text-left">Data e Hora</th>
                      <th className="border px-4 py-2 text-left">Jogo</th>
                      <th className="border px-4 py-2 text-left">Método</th>
                      <th className="border px-4 py-2 text-left">Risco</th>
                      <th className="border px-4 py-2 text-left">Lucro/Perda</th>
                      <th className="border px-4 py-2 text-left">Resultado</th>
                      <th className="border px-4 py-2 text-left">Status</th>
                      <th className="border px-4 py-2 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apostas.map(aposta => (
                      <tr key={aposta.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{aposta.data_formatada}</td>
                        <td className="border px-4 py-2">{aposta.jogo}</td>
                        <td className="border px-4 py-2">{aposta.metodo_nome}</td>
                        <td className="border px-4 py-2">R$ {aposta.risco.toFixed(2)}</td>
                        <td className="border px-4 py-2">
                          <span className={`font-medium ${
                            aposta.lucro_perda >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            R$ {aposta.lucro_perda.toFixed(2)}
                          </span>
                        </td>
                        <td className="border px-4 py-2">
                          <span className={`font-medium ${
                            aposta.status === 'green' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {((aposta.lucro_perda / aposta.risco) * 100).toFixed(2)}%
                          </span>
                        </td>
                        <td className="border px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            aposta.status === 'green' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {aposta.status === 'green' ? 'LUCRO' : 'PREJUÍZO'}
                          </span>
                        </td>
                        <td className="border px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAposta(aposta)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAposta(aposta.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'estatisticas' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Estatísticas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-blue-600" size={20} />
                  <h3 className="font-semibold text-blue-800">Período</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Início: {estatisticas.data_inicial || 'N/A'}
                </p>
                <p className="text-sm text-blue-700">
                  Fim: {estatisticas.data_final || 'N/A'}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="text-red-600" size={20} />
                  <h3 className="font-semibold text-red-800">Chance de Perda</h3>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {estatisticas.chance_perda_pct?.toFixed(1) || 0}%
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-green-600" size={20} />
                  <h3 className="font-semibold text-green-800">Lucros</h3>
                </div>
                <p className="text-sm text-green-700">
                  Máximo: R$ {estatisticas.lucro_maximo?.toFixed(2) || 0}
                </p>
                <p className="text-sm text-green-700">
                  Médio: R$ {estatisticas.lucro_medio?.toFixed(2) || 0}
                </p>
                <p className="text-sm text-green-700">
                  Mínimo: R$ {estatisticas.lucro_minimo?.toFixed(2) || 0}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="text-red-600" size={20} />
                  <h3 className="font-semibold text-red-800">Prejuízos</h3>
                </div>
                <p className="text-sm text-red-700">
                  Máximo: R$ {estatisticas.prejuizo_maximo?.toFixed(2) || 0}
                </p>
                <p className="text-sm text-red-700">
                  Médio: R$ {estatisticas.prejuizo_medio?.toFixed(2) || 0}
                </p>
                <p className="text-sm text-red-700">
                  Mínimo: R$ {estatisticas.prejuizo_minimo?.toFixed(2) || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;