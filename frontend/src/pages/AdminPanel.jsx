import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminPanel(){
  const [token] = useState(localStorage.getItem('token'));
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);

  useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      const u = await axios.get('/api/admin/users', { headers: { Authorization: 'Bearer '+token } });
      setUsers(u.data);
      const d = await axios.get('/api/admin/deposits', { headers: { Authorization: 'Bearer '+token } });
      setDeposits(d.data);
    } catch (err) { console.error(err); }
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
        <table border="1"><thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {deposits.map(d=> <tr key={d.id}><td>{d.id}</td><td>{d.phone} - {d.name}</td><td>{d.amount_bigint}</td><td>{d.status}</td></tr>)}
        </tbody></table>
      </section>
    </div>
  )
}
