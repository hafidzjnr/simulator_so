import React, { useState } from "react";

//fungsi helper untuk mem-parsing string instruksi
const parseInstructions = (text) => {
  const instructions = [];

  const parts = text.split(',');

  for(const part of parts) {
    const trimmed = part.trim().toUpperCase();
    const tokens = trimmed.split(' ');

    if (tokens.length === 0 || tokens[0] === "")continue;

    const type = tokens[0];

    try {
      if( type === "CPU" ) {
        const duration = parseInt(tokens[1], 10);
        if (isNaN(duration) || duration <= 0) throw new Error("Durasi CPU harus angka positif.");
        instructions.push({ type: 'CPU', duration});
      }else if ( type === "LOCK" || type === "UNLOCK" ) {
        const resource = tokens[1];
        if (resource !== "A" && resource !== "B") throw new Error("Resource harus A atau B.");
        instructions.push({type, resource});
      }else if (type === "END"){
        instructions.push({ type: 'END' });
      }else if(type !== ""){
        throw new Error(`Instruksi tidak dikenal: ${type}`);
      }
    }catch (err) {
      alert(`Instruksi tidak valid: "${part}". ${err.message}`);
      return null;
    }
  }
  return instructions;
};

const AddProcessForm = ({ onProCessSubmit }) => {
  const [id, setId] = useState('');
  const [priority, setPriority] = useState(10);
  const [instructionsText, setInstructionsText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!id.trim()) {
      alert("ID Proses tidak boleh kosong.");
      return;
    }

    const instructions = parseInstructions(instructionsText);
    if (!instructions) {
      return;
    }

    if (instructions.length === 0 || instructions[instructions.length -1].type !== 'END') {
      instructions.push({ type: 'END' });
    }

    const newProcess ={
      id: id.trim(),
      priority: parseInt(priority, 10),
      instructions,
    };

    onProCessSubmit(newProcess);

    setId('');
    setPriority(10);
    setInstructionsText('');
  };

  return (
    <form className="add-process-form panel" onSubmit={handleSubmit}>
      <h3>Tambah Proses Baru</h3>
      <div className="form-group">
        <label>Process ID (cth: P3)</label>
        <input 
          type="text"
          value={id}
          onChange={(e)=> setId(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Prioritas (1 = tinggi, 10 = rendah)</label>
        <input 
          type="number"
          value={priority}
          onChange={(e)=> setPriority(e.target.value)}
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <label>Instruksi</label>
        <textarea
          value={instructionsText}
          onChange={(e) => setInstructionsText(e.target.value)}
          placeholder="contoh: CPU 5, LOCK A, CPU 2, UNLOCK A"
          rows="3"
        ></textarea>
      </div>

      <button type="submit">Tambah Proses</button>
    </form>
  );
};

export default AddProcessForm;