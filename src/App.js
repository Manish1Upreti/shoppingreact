import React, { useEffect, useState } from 'react';
import './App.css'; // Import your custom CSS

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetch('https://shoppinglist-624w.onrender.com/items/')
      .then(res => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    const item = {
      id: Date.now(),
      name: newItem.trim(),
      is_purchased: false,
    };

    try {
      const res = await fetch('https://shoppinglist-624w.onrender.com/items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      setItems([...items, data]);
      setNewItem('');
    } catch (error) {
      console.error('Add item failed:', error);
    }
  };

  const toggleItem = async (item) => {
    const updated = { ...item, is_purchased: !item.is_purchased };
    try {
      const res = await fetch(`https://shoppinglist-624w.onrender.com/items/${item.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      setItems(items.map(i => (i.id === data.id ? data : i)));
    } catch (error) {
      console.error('Toggle item failed:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`https://shoppinglist-624w.onrender.com/items/${id}/`, {
        method: 'DELETE',
      });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Delete item failed:', error);
    }
  };

  const handleReset = () => {
    setItems([]);
    setNewItem('');
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">🛒 Shopping List</h1>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          className="btn btn-success"
          onClick={handleAddItem}
          disabled={!newItem.trim()}
          title="Add item"
        >
          ➕
        </button>
        <button className="btn btn-secondary" onClick={handleReset} title="Reset list">
          ♻️
        </button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h4 className="text-primary">To Buy</h4>
          <ul className="list-group shadow-sm">
            {items.filter(item => !item.is_purchased).length === 0 && (
              <li className="list-group-item text-muted">No items to buy</li>
            )}
            {items
              .filter(item => !item.is_purchased)
              .map(item => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span
                    onClick={() => toggleItem(item)}
                    style={{ cursor: 'pointer' }}
                    title="Mark as purchased"
                  >
                    {item.name}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteItem(item.id)}
                    title="Delete item"
                  >
                    🗑️
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h4 className="text-success">Purchased</h4>
          <ul className="list-group shadow-sm">
            {items.filter(item => item.is_purchased).length === 0 && (
              <li className="list-group-item text-muted">No purchased items</li>
            )}
            {items
              .filter(item => item.is_purchased)
              .map(item => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span
                    onClick={() => toggleItem(item)}
                    style={{ cursor: 'pointer', textDecoration: 'line-through', color: '#6c757d' }}
                    title="Mark as not purchased"
                  >
                    {item.name}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteItem(item.id)}
                    title="Delete item"
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

