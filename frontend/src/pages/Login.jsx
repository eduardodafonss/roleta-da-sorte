import React, { useState } from 'react';
import axios from 'axios';

export default function Login(){
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    try {
      const r = await axios.post('/api/auth/login', { phone, password });
      localStorage.setItem('token', r.data.token);
      setMsg('Logado com sucesso');
      window.location.href = '/';
    } catch (err) { setMsg('Credenciais inválidas'); }
  }

  return (
    <div style={{maxWidth:420}}>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div><label>Telefone</label><input value={phone} onChange={e=>setPhone(e.target.value)} required/></div>
        <div><label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
        <button type="submit">Entrar</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
