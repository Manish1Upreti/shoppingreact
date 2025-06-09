import React, { useEffect, useState } from 'react';  // Import React and React hooks: useEffect and useState
import './App.css';                                 // Import CSS styles for this component

function App() {
  // State to hold list of items fetched from backend
  const [items, setItems] = useState([]);

  // State to hold the current input value for adding a new item
  const [newItem, setNewItem] = useState('');

  // useEffect runs once after the component mounts (empty dependency array [])
  // Fetch initial list of items from the backend API
  useEffect(() => {
    //https://shoppinglist-624w.onrender.com/items/
    fetch('https://shoppinglist-624w.onrender.com/items/')           // Call GET /items/ API
      .then(res => res.json())                       // Parse response JSON
      .then(setItems);                               // Set the received items into state
  }, []);                                           // Empty dependency => run once on mount

  // Function to handle adding a new item when button is clicked
  const handleAddItem = async () => {
    // Create a new item object with unique ID based on timestamp,
    // the name from input, and default purchased status false
    const item = {
      id: Date.now(),          // Use current timestamp as temporary ID
      name: newItem,           // Item name from input state
      is_purchased: false      // Default purchased state
    };

    // Send POST request to backend to add new item
    const res = await fetch('https://shoppinglist-624w.onrender.com/items/', {
      method: 'POST',                           // HTTP POST method
      headers: { 'Content-Type': 'application/json' },  // JSON payload
      body: JSON.stringify(item)                // Convert JS object to JSON string
    });

    // Parse JSON response from backend (the saved item with ID, etc.)
    const data = await res.json();

    // Update local state with the newly added item appended to the list
    setItems([...items, data]);

    // Clear the input box after adding
    setNewItem('');
  };

  // Function to toggle the purchased status of an item when clicked
  const toggleItem = async (item) => {
    // Create updated item object flipping the is_purchased boolean
    const updated = { ...item, is_purchased: !item.is_purchased };

    // Send PUT request to backend to update the item
    const res = await fetch(`https://shoppinglist-624w.onrender.com/items/${item.id}/`, {
      method: 'PUT',                            // HTTP PUT method for update
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)             // Send updated item JSON
    });

    // Parse response JSON (the updated item)
    const data = await res.json();

    // Update local state: replace the old item with the updated one in the list
    setItems(items.map(i => i.id === data.id ? data : i));
  };

  // JSX to render the UI
  return (
    <div className="app">
      <h1>🛒 Shopping List</h1>

      {/* Input section to add new item */}
      <div className="input-section">
        <input
          type="text"
          value={newItem}                        // Controlled input tied to newItem state
          onChange={e => setNewItem(e.target.value)}  // Update state on typing
          placeholder="Add new item"            // Placeholder text
        />
        <button onClick={handleAddItem}>➕</button>   {/* Button to add item */}
      </div>

      {/* Section displaying items to buy */}
      <div className="list-section">
        <h2>To Buy</h2>
        <ul>
          {/* Filter items not purchased, map to list items */}
          {items.filter(item => !item.is_purchased).map(item => (
            // List item with unique key and click toggles purchased status
            <li key={item.id} onClick={() => toggleItem(item)}>{item.name}</li>
          ))}
        </ul>

        {/* Section displaying purchased items */}
        <h2>Purchased</h2>
        <ul className="purchased">
          {/* Filter items purchased, map to list items */}
          {items.filter(item => item.is_purchased).map(item => (
            <li key={item.id} onClick={() => toggleItem(item)}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;  // Export the component as default for import elsewhere
