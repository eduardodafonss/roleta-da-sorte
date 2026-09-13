import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Wheel from '../components/Wheel'

export default function Dashboard(){
  const [token] = useState(localStorage.getItem('token'));
  const [balance, setBalance] = useState(0);

  useEffect(()=>{
    async function load(){
      if (!token) return;
      try {
        const r = await axios.get('/api/auth/me', { headers: { Authorization: 'Bearer '+token } });
      } catch (err) {}
    }
    load();
  },[token]);

  return (
    <div>
      <h3>Painel Principal</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div style={{background:'#eef9ff', padding:12}}>Mapa Mundo (placeholder)</div>
        <div style={{background:'#fff7ee', padding:12}}>Gráfico do Mercado (placeholder)</div>
      </div>

      <div style={{marginTop:20}}>
        <h4>Roleta da Sorte</h4>
        <Wheel token={token} onResult={(r)=>console.log('result',r)} />
      </div>
    </div>
  )
}
