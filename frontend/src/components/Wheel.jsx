import React, { useRef, useState } from 'react'
import axios from 'axios'

const sectors = ['20000KZ','35000KZ','45000KZ','PERDEU','60000KZ','75000KZ','90000KZ','PERDEU','100000KZ','150000KZ','200000KZ','PERDEU'];

export default function Wheel({ token, onResult }){
  const wheelRef = useRef();
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(5000);

  async function spin(){
    if (spinning) return;
    setSpinning(true);
    try{
      const r = await axios.post('/api/spin', { bet }, { headers: { Authorization: 'Bearer '+token } });
      const sectorIndex = r.data.sectorIndex;
      const sectorsCount = sectors.length;
      const sectorAngle = 360 / sectorsCount;
      const randomFullRounds = 6;
      const targetAngle = randomFullRounds * 360 + (360 - (sectorIndex * sectorAngle) - sectorAngle/2);
      wheelRef.current.style.transition = 'transform 5s cubic-bezier(.17,.67,.34,1)';
      wheelRef.current.style.transform = `rotate(${targetAngle}deg)`;
      setTimeout(()=>{
        setSpinning(false);
        if (r.data.isWin) alert('PARABÉNS! VOCÊ GANHOU ' + r.data.payout + 'KZ');
        else alert('UPSI! VOCÊ PERDEU');
        onResult && onResult(r.data);
      },5200);
    } catch (err) { alert('Erro ao girar'); setSpinning(false); }
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <input type="number" value={bet} onChange={e=>setBet(Number(e.target.value))} min={5000} max={50000} />
        <button onClick={spin} disabled={spinning}>GIRAR ROLETA</button>
      </div>
      <div style={{marginTop:12, width:400, height:400, position:'relative'}}>
        <div ref={wheelRef} style={{width:400, height:400, borderRadius:200, overflow:'hidden', border:'6px solid #ccc'}}>
          {/* Simple ring of colored slices using absolute positioned elements */}
          {sectors.map((s,i)=>{
            const rotate = i*(360/sectors.length);
            const color = s==='PERDEU' ? '#ff4d4f' : '#4caf50';
            return (
              <div key={i} style={{position:'absolute', width:'50%', height:'50%', left:'50%', top:'50%', transformOrigin:'0% 0%', transform:`rotate(${rotate}deg) translate(-100%, -100%)`, background:color, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #fff'}}>
                <div style={{transform:`rotate(${360/sectors.length/2}deg)`, color:'#fff', fontWeight:'bold'}}>{s}</div>
              </div>
            )
          })}
        </div>
        <div style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)'}}>
          {/* center */}
        </div>
      </div>
    </div>
  )
}
