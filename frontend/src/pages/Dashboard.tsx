import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface CloudTask {
  id: number;
  name: string;
  isCompleted: boolean;
}

const Dashboard = () => {
  const [items, setItems] = useState<CloudTask[]>([]);
  const [error, setError] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = () => {
    api.get('/tasks')
      .then((res: any) => setItems(res.data))
      .catch((err: any) => {
        console.error("Błąd API:", err);
        setError("Błąd połączenia z API.");
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Na pewno usunąć zadanie?")) return;

    try {
      setLoading(true);
      await api.delete(`/tasks/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError("Nie udało się usunąć zadania.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (item: CloudTask) => {
    try {
      const updated = { ...item, isCompleted: !item.isCompleted };
      await api.put(`/tasks/${item.id}`, updated);
      setItems(prev => prev.map(t => t.id === item.id ? updated : t));
    } catch (err) {
      setError("Nie udało się zaktualizować zadania.");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      await api.post('/tasks', { name: newTaskName });
      setNewTaskName("");
      fetchTasks();
    } catch (err) {
      setError("Błąd podczas dodawania.");
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff'
    }}>
      
      <h1 style={{ 
        color: '#ff0000', 
        fontSize: '32px',
        fontWeight: 'bold'
      }}>
        ☁️ Cloud App Dashboard – CI/CD WORKS 🚀
      </h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* 🔥 FORMULARZ */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Wpisz nowe zadanie..." 
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          style={{ padding: '10px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <div style={{ display: 'inline-flex', gap: '10px', marginLeft: '10px' }}>
          <button 
            type="submit" 
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Dodaj
          </button>

          {/* 🔥 NOWY PRZYCISK UI ONLY */}
          <button
            type="button"
            style={{
              padding: '10px 20px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Usuń
          </button>
        </div>
      </form>

      {loading && <div style={{ marginBottom: '10px' }}>⏳ Przetwarzanie...</div>}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{ 
              background: '#ffffff', 
              margin: '10px', 
              padding: '15px', 
              borderRadius: '8px',
              borderLeft: item.isCompleted ? '5px solid #28a745' : '5px solid #6c757d',
              width: '400px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <div>
                <input 
                  type="checkbox" 
                  checked={item.isCompleted} 
                  onChange={() => handleToggle(item)} 
                  style={{ marginRight: '10px' }}
                />
                <span style={{ 
                  textDecoration: item.isCompleted ? 'line-through' : 'none', 
                  color: '#333' 
                }}>
                  {item.name}
                </span>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: '#ff4d4f',
                  border: 'none',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#d9363e')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ff4d4f')}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;