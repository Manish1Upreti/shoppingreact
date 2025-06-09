import React, { useEffect, useState } from 'react';
import './App.css'; // Custom styles

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetch('https://shoppinglist-624w.onrender.com/items/')
      .then(res => res.json())
      .then(setItems);
  }, []);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    const item = {
      id: Date.now(),
      name: newItem,
      is_purchased: false
    };

    const res = await fetch('https://shoppinglist-624w.onrender.com/items/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });

    const data = await res.json();
    setItems([...items, data]);
    setNewItem('');
  };

  const toggleItem = async (item) => {
    const updated = { ...item, is_purchased: !item.is_purchased };

    const res = await fetch(`https://shoppinglist-624w.onrender.com/items/${item.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    const data = await res.json();
    setItems(items.map(i => i.id === data.id ? data : i));
  };

  const deleteItem = async (id) => {
    await fetch(`https://shoppinglist-624w.onrender.com/items/${id}/`, {
      method: 'DELETE'
    });
    setItems(items.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setItems([]);
    setNewItem('');
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-primary">🛒 Shopping List</h1>

      <div className="input-group mb-4 shadow-sm">
        <input
          type="text"
          className="form-control"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Add a new item..."
        />
        <button className="btn btn-success" onClick={handleAddItem} disabled={!newItem.trim()}>➕</button>
        <button className="btn btn-secondary" onClick={handleReset}>♻️</button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <h4 className="text-info">📝 To Buy</h4>
          <ul className="list-group shadow-sm">
            {items.filter(item => !item.is_purchased).map(item => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span
                  className="flex-grow-1"
                  onClick={() => toggleItem(item)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={() => deleteItem(item.id)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h4 className="text-success">✅ Purchased</h4>
          <ul className="list-group shadow-sm">
            {items.filter(item => item.is_purchased).map(item => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span
                  className="flex-grow-1 text-decoration-line-through text-muted"
                  onClick={() => toggleItem(item)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={() => deleteItem(item.id)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
