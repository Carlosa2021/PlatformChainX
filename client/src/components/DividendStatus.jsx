import React from 'react';

const DividendStatus = ({ claimed, loading, onClaim }) => {
  if (claimed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-green-500 text-sm font-medium">
          Dividendo reclamado
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        disabled={loading}
        onClick={onClaim}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700'
        } text-white`}
      >
        {loading ? 'Reclamando...' : 'Reclamar dividendo'}
      </button>
    </div>
  );
};

export default DividendStatus;
