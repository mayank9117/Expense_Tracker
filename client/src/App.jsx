import { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { Wallet } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = () => {
    // Trigger refresh of the list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header>
        <div className="container header-content">
          <Wallet size={32} />
          <h1>Expense Tracker</h1>
        </div>
      </header>

      <main className="container">
        <div className="grid-layout">
          <div>
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          </div>

          <div>
            <ExpenseList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
