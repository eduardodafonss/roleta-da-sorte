import React, { useRef, useState } from 'react'
import axios from 'axios'

export default function Deposit(){
  const [amount, setAmount] = useState(5000);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  async function submit(e){
    e.preventDefault();
    if (!token) return setMsg('Faça login');
    const fd = new FormData();
    fd.append('amount', amount);
    if (file) fd.append('proof', file);
    try{
      const r = await axios.post('/api/deposit', fd, { headers: { Authorization: 'Bearer '+token, 'Content-Type':'multipart/form-data' } });
      setMsg('Depósito enviado para aprovação');
    } catch (err){ console.error(err); setMsg('Erro ao enviar depósito'); }
  }

  return (
    <div>
      <h3>Depósito</h3>
      <p>IBAN: <strong>000600008261703630148</strong> <button onClick={()=>navigator.clipboard.writeText('000600008261703630148')}>Copiar IBAN</button></p>
      <form onSubmit={submit}>
        <div><label>Valor (KZ)</label><input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} min={1000} required/></div>
        <div><label>Comprovante (foto)</label><input type="file" onChange={e=>setFile(e.target.files[0])} accept="image/*"/></div>
        <button type="submit">Enviar Depósito</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
