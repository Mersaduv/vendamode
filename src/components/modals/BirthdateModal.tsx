import React from 'react';

interface BirthdateModalProps {
  isShow: boolean;
  onClose: () => void;
  onSave: (date: { day: number; month: number; year: number }) => void;
}

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

const BirthdateModal: React.FC<BirthdateModalProps> = ({ isShow, onClose, onSave }) => {
  const [day, setDay] = React.useState<number>(1);
  const [month, setMonth] = React.useState<number>(1);
  const [year, setYear] = React.useState<number>(new Date().getFullYear());

  const handleSave = () => {
    onSave({ day, month, year });
    onClose();
  };

  if (!isShow) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md">
        <div className="flex justify-end">
          <button onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-4">
          <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default BirthdateModal;
