import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminPanel(){
  const [token] = useState(localStorage.getItem('token'));
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      const u = await axios.get('/api/admin/users', { headers: { Authorization: 'Bearer '+token } });
      setUsers(u.data);
      const d = await axios.get('/api/admin/deposits', { headers: { Authorization: 'Bearer '+token } });
      setDeposits(d.data);
      const w = await axios.get('/api/admin/withdrawals', { headers: { Authorization: 'Bearer '+token } });
      setWithdrawals(w.data);
    } catch (err) { console.error(err); }
  }

  async function approveDeposit(id){
    await axios.post('/api/admin/deposits/'+id+'/approve', {}, { headers: { Authorization: 'Bearer '+token } });
    load();
  }
  async function rejectDeposit(id){
    await axios.post('/api/admin/deposits/'+id+'/reject', {}, { headers: { Authorization: 'Bearer '+token } });
    load();
  }

  async function approveWithdraw(id){
    await axios.post('/api/admin/withdrawals/'+id+'/approve', {}, { headers: { Authorization: 'Bearer '+token } });
    load();
  }
  async function rejectWithdraw(id){
    await axios.post('/api/admin/withdrawals/'+id+'/reject', {}, { headers: { Authorization: 'Bearer '+token } });
    load();
  }

  return (
    <div>
      <h3>Painel do Administrador</h3>
      <section>
        <h4>Clientes</h4>
        <table border="1"><thead><tr><th>ID</th><th>Telefone</th><th>Nome</th><th>Saldo</th></tr></thead>
        <tbody>
          {users.map(u=> <tr key={u.id}><td>{u.id}</td><td>{u.phone}</td><td>{u.name}</td><td>{u.balance_bigint}</td></tr>)}
        </tbody></table>
      </section>

      <section>
        <h4>Depósitos Pendentes</h4>
        <table border="1"><thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {deposits.map(d=> <tr key={d.id}><td>{d.id}</td><td>{d.phone} - {d.name}</td><td>{d.amount_bigint}</td><td>{d.status}</td><td>
            {d.status==='pending' && <>
              <button onClick={()=>approveDeposit(d.id)}>Aprovar</button>
              <button onClick={()=>rejectDeposit(d.id)}>Rejeitar</button>
            </>}
          </td></tr>)}
        </tbody></table>
      </section>

      <section>
        <h4>Saques Pendentes</h4>
        <table border="1"><thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {withdrawals.map(w=> <tr key={w.id}><td>{w.id}</td><td>{w.phone} - {w.name}</td><td>{w.amount_bigint}</td><td>{w.status}</td><td>
            {w.status==='pending' && <>
              <button onClick={()=>approveWithdraw(w.id)}>Aprovar</button>
              <button onClick={()=>rejectWithdraw(w.id)}>Rejeitar</button>
            </>}
          </td></tr>)}
        </tbody></table>
      </section>
    </div>
  )
}
