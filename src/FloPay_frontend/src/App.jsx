import { useState } from 'react';
import { FloPay_backend } from 'declarations/FloPay_backend'; // متأكد ان ده صحيح واسم الكانيستر مطابق

function App() {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await FloPay_backend.add_user(name);
      setStatus(`User "${name}" created with default balance.`);
    } catch (err) {
      console.error(err);
      setStatus('Failed to create user.');
    }
  };

  const handleGetBalance = async () => {
    try {
      const b = await FloPay_backend.get_balance();
      if (b !== null) {
        setBalance(Number(b));
        setStatus(`Your balance: ${Number(b)} tokens`);
      } else {
        setStatus('User not found or not registered.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error fetching balance.');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const success = await FloPay_backend.transfer(recipient, BigInt(amount));
      setStatus(success ? '✅ Transfer successful!' : '❌ Transfer failed. Check balance or recipient.');
    } catch (err) {
      console.error(err);
      setStatus('Error during transfer.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 p-6 text-gray-800">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-blue-700">Flopay</h1>
        <p className="text-lg mt-2">Offline-Ready, Decentralized Digital Payments for Everyone</p>
      </header>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Create Account */}
        <form onSubmit={handleAddUser} className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-600">Create Account</h2>
          <input
            type="text"
            placeholder="Your Name"
            className="mt-2 p-2 w-full border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Create
          </button>
        </form>

        {/* Check Balance */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-600">Check Balance</h2>
          <button
            onClick={handleGetBalance}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            Get Balance
          </button>
          {balance !== null && (
            <p className="mt-2 text-gray-700">Balance: {balance} tokens</p>
          )}
        </div>

        {/* Transfer Money */}
        <form onSubmit={handleTransfer} className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-600">Transfer</h2>
          <input
            type="text"
            placeholder="Recipient Principal"
            className="mt-2 p-2 w-full border rounded"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="mt-2 p-2 w-full border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" className="mt-4 px-4 py-2 bg-purple-600 text-white rounded">
            Send
          </button>
        </form>

        {/* Status Message */}
        {status && (
          <div className="bg-yellow-100 p-4 mt-4 rounded text-sm text-gray-700 shadow">{status}</div>
        )}
      </div>

      <footer className="mt-20 text-center text-sm text-gray-500">
        &copy; 2025 Flopay. Built with ❤️ on ICP.
      </footer>
    </div>
  );
}

export default App;
