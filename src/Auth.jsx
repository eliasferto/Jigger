import { useState } from "react";
import { supabase } from "./supabase.js";

const T = {
  bg: "#06060e", surface: "#0c0c18", border: "#1e1e38",
  text: "#e8e4d8", muted: "#888", dim: "#444",
  purple: "#a855f7", purpleL: "#c084fc", purpleD: "#7c3aed",
  red: "#ff6b6b", green: "#4ade80"
};

const inp = { width:"100%", background:"#0c0c18", border:"1px solid #1e1e38", borderRadius:10, padding:"12px 14px", color:T.text, fontSize:14, outline:"none", boxSizing:"border-box", WebkitAppearance:"none" };
const btn = (p) => ({ background:p?`linear-gradient(135deg,${T.purpleD},${T.purpleL})`:"transparent", border:p?"none":`1px solid ${T.border}`, borderRadius:10, padding:"13px 20px", color:p?"#fff":T.muted, fontSize:14, fontWeight:p?700:400, cursor:"pointer", width:"100%", marginBottom:10 });

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [cert, setCert] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Rellena email y contraseña"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Email o contraseña incorrectos");
    else onAuth(data.user);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password || !name) { setError("Nombre, email y contraseña son obligatorios"); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, name, city, cert });
      setSuccess("¡Cuenta creada! Revisa tu email para verificarla.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Inter',system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, maxWidth:480, margin:"0 auto" }}>
      
      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontSize:22, fontWeight:900, letterSpacing:4, color:"#fff", marginBottom:4 }}>JIGGER</div>
        <div style={{ fontSize:12, color:T.dim, letterSpacing:2 }}>BARTENDER COMMUNITY</div>
        <div style={{ width:40, height:2, background:`linear-gradient(90deg,${T.purpleD},${T.purpleL})`, margin:"12px auto 0", borderRadius:2 }}/>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:T.surface, borderRadius:12, padding:4, marginBottom:24, width:"100%" }}>
        {[["login","Entrar"],["register","Registrarse"]].map(([m,l]) => (
          <button key={m} onClick={()=>{setMode(m);setError("");setSuccess("");}} style={{ flex:1, padding:"10px", background:mode===m?`linear-gradient(135deg,${T.purpleD},${T.purpleL})`:"transparent", border:"none", borderRadius:9, color:mode===m?"#fff":T.dim, fontSize:13, fontWeight:mode===m?700:400, cursor:"pointer", transition:"all .2s" }}>{l}</button>
        ))}
      </div>

      {/* Form */}
      <div style={{ width:"100%" }}>
        {mode === "register" && (
          <>
            <div style={{ fontSize:10, letterSpacing:2, color:T.dim, textTransform:"uppercase", marginBottom:6 }}>Nombre *</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre de bartender" style={{...inp, marginBottom:12}} />
            <div style={{ fontSize:10, letterSpacing:2, color:T.dim, textTransform:"uppercase", marginBottom:6 }}>Ciudad</div>
            <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Madrid, Barcelona…" style={{...inp, marginBottom:12}} />
            <div style={{ fontSize:10, letterSpacing:2, color:T.dim, textTransform:"uppercase", marginBottom:6 }}>Certificación</div>
            <input value={cert} onChange={e=>setCert(e.target.value)} placeholder="ESCOM, IBA, AIBES…" style={{...inp, marginBottom:12}} />
          </>
        )}
        <div style={{ fontSize:10, letterSpacing:2, color:T.dim, textTransform:"uppercase", marginBottom:6 }}>Email *</div>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" style={{...inp, marginBottom:12}} />
        <div style={{ fontSize:10, letterSpacing:2, color:T.dim, textTransform:"uppercase", marginBottom:6 }}>Contraseña *</div>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?handleLogin():handleRegister())} placeholder={mode==="register"?"Mínimo 6 caracteres":"Tu contraseña"} style={{...inp, marginBottom:16}} />

        {error && <div style={{ background:"#1a0808", border:"1px solid #ff444433", borderRadius:10, padding:"10px 14px", color:T.red, fontSize:13, marginBottom:12 }}>{error}</div>}
        {success && <div style={{ background:"#0a1a0a", border:"1px solid #4ade8033", borderRadius:10, padding:"10px 14px", color:T.green, fontSize:13, marginBottom:12 }}>{success}</div>}

        <button onClick={mode==="login"?handleLogin:handleRegister} disabled={loading} style={{...btn(true), opacity:loading?0.6:1}}>
          {loading ? "Cargando…" : mode==="login" ? "Entrar" : "Crear cuenta"}
        </button>

        {mode==="login" && (
          <button onClick={async()=>{
            if(!email){setError("Escribe tu email primero");return;}
            const {error}=await supabase.auth.resetPasswordForEmail(email);
            if(!error) setSuccess("Revisa tu email para resetear la contraseña");
          }} style={{ background:"none", border:"none", color:T.dim, fontSize:12, cursor:"pointer", width:"100%", padding:"8px", textAlign:"center" }}>
            ¿Olvidaste la contraseña?
          </button>
        )}
      </div>

      <div style={{ marginTop:24, fontSize:12, color:T.dim, textAlign:"center", lineHeight:1.7 }}>
        Gratis para siempre · Solo para bartenders<br/>
        <span style={{ color:T.purpleL }}>🍸 Únete a la comunidad</span>
      </div>
    </div>
  );
}
