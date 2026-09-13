import React, { useState } from 'react';
import axios from 'axios';

export default function Register(){
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    if (password !== confirm) return setMsg('Senhas não conferem');
    try {
      const r = await axios.post('/api/auth/register', { phone, name, password });
      setMsg('Conta criada. Faça login.');
    } catch (err) { setMsg('Erro ao criar conta'); }
  }

  return (
    <div style={{maxWidth:420}}>
      <h3>Cadastro</h3>
      <form onSubmit={submit}>
        <div><label>Telefone</label><input value={phone} onChange={e=>setPhone(e.target.value)} required/></div>
        <div><label>Nome</label><input value={name} onChange={e=>setName(e.target.value)} required/></div>
        <div><label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
        <div><label>Confirmar Senha</label><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/></div>
        <button type="submit">Cadastrar</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
