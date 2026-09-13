import React, { useState } from 'react'
import axios from 'axios'

export default function Withdraw(){
  const [iban, setIban] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState(5000);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  async function submit(e){
    e.preventDefault();
    if (!token) return setMsg('Faça login primeiro');
    try{
      const r = await axios.post('/api/withdraw', { iban, beneficiary_name: beneficiary, amount }, { headers: { Authorization: 'Bearer '+token } });
      setMsg('Pedido de saque criado com sucesso. Aguarde aprovação.');
    } catch (err){ console.error(err); setMsg(err.response?.data?.error || 'Erro ao criar saque'); }
  }

  return (
    <div>
      <h3>Saque</h3>
      <form onSubmit={submit}>
        <div><label>IBAN</label><input value={iban} onChange={e=>setIban(e.target.value)} required/></div>
        <div><label>Nome do Beneficiário</label><input value={beneficiary} onChange={e=>setBeneficiary(e.target.value)} required/></div>
        <div><label>Valor (KZ)</label><input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} min={1000} required/></div>
        <button type="submit">Solicitar Saque</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
