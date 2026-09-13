import React from 'react'

export default function Deposit(){
  return (
    <div>
      <h3>Depósito</h3>
      <p>IBAN: <strong>000600008261703630148</strong> <button onClick={()=>navigator.clipboard.writeText('000600008261703630148')}>Copiar IBAN</button></p>
      <p>Escolha valor e envie comprovante (em desenvolvimento)</p>
    </div>
  )
}
