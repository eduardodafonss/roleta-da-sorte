import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div style={{fontFamily:'Arial'}}>
      <header style={{padding:16, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
        <h2>ROLETA DA SORTE</h2>
        <nav>
          <Link to="/">Painel</Link> | <Link to="/register">Cadastro</Link> | <Link to="/login">Login</Link> | <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <main style={{padding:16}}>
        <Outlet />
      </main>
    </div>
  )
}
