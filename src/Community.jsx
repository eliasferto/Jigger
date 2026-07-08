import { useState, useEffect } from "react";

export default function Community({ user, profile, supabase, T, onViewProfile }) {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [search, setSearch] = useState("");

  const lbl = { fontSize:9, letterSpacing:2, color:T.dim, textTransform:"uppercase", marginBottom:8, display:"block" };
  const inp = { width:"100%", background:T.surface, border:`1px solid ${T.border2}`, borderRadius:10, padding:"11px 14px", color:T.text, fontSize:14, outline:"none", boxSizing:"border-box" };
  const card = { background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10, cursor:"pointer" };

  useEffect(() => { loadCocktails(); }, []);

  const loadCocktails = async () => {
    setLoading(true);
    const { data: cocktailData } = await supabase
      .from("cocktails").select("*").eq("is_public", true).order("created_at", { ascending: false });

    if (cocktailData) {
      setCocktails(cocktailData);
      // Load profiles for each cocktail author
      const userIds = [...new Set(cocktailData.map(c => c.user_id))];
      if (userIds.length > 0) {
        const { data: profileData } = await supabase.from("profiles").select("*").in("id", userIds);
        if (profileData) {
          const profileMap = {};
          profileData.forEach(p => profileMap[p.id] = p);
          setProfiles(profileMap);
        }
      }
      // Load like counts
      const { data: likeData } = await supabase.from("likes").select("cocktail_id");
      if (likeData) {
        const likeCounts = {};
        likeData.forEach(l => { likeCounts[l.cocktail_id] = (likeCounts[l.cocktail_id] || 0) + 1; });
        setLikes(likeCounts);
      }
      // Load user's likes
      if (user) {
        const { data: myLikes } = await supabase.from("likes").select("cocktail_id").eq("user_id", user.id);
        if (myLikes) setUserLikes(myLikes.map(l => l.cocktail_id));
      }
    }
    setLoading(false);
  };

  const openCocktail = async (c) => {
    setSelected(c);
    const { data } = await supabase.from("comments").select("*, profiles(name, cert)").eq("cocktail_id", c.id).order("created_at", { ascending: true });
    if (data) setComments(data);
  };

  const toggleLike = async (cocktailId) => {
    if (!user) return;
    const isLiked = userLikes.includes(cocktailId);
    if (isLiked) {
      await supabase.from("likes").delete().eq("user_id", user.id).eq("cocktail_id", cocktailId);
      setUserLikes(p => p.filter(id => id !== cocktailId));
      setLikes(p => ({ ...p, [cocktailId]: Math.max(0, (p[cocktailId] || 1) - 1) }));
    } else {
      await supabase.from("likes").insert({ user_id: user.id, cocktail_id: cocktailId });
      setUserLikes(p => [...p, cocktailId]);
      setLikes(p => ({ ...p, [cocktailId]: (p[cocktailId] || 0) + 1 }));
    }
  };

  const sendComment = async () => {
    if (!commentText.trim() || !user || !selected) return;
    const { data } = await supabase.from("comments").insert({ user_id: user.id, cocktail_id: selected.id, text: commentText.trim() }).select("*, profiles(name, cert)").single();
    if (data) { setComments(p => [...p, data]); setCommentText(""); }
  };

  const filtered = cocktails.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.ingredients || []).some(i => i.toLowerCase().includes(search.toLowerCase())));

  // Detail view
  if (selected) {
    const author = profiles[selected.user_id];
    const isLiked = userLikes.includes(selected.id);
    const likeCount = likes[selected.id] || 0;
    return (
      <div style={{ flex:1, padding:"0 16px 100px", overflowY:"auto" }}>
        <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:14, padding:"16px 0 12px" }}>← Volver</button>
        {selected.photo_url && <img src={selected.photo_url} alt={selected.name} style={{ width:"100%", borderRadius:14, marginBottom:16, maxHeight:220, objectFit:"cover" }}/>}

        {/* Author */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"10px 14px" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:`${T.purple}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👤</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700 }}>{author?.name || "Bartender"}</div>
            {author?.cert && <div style={{ fontSize:10, color:T.purple }}>{author.cert}</div>}
            {author?.city && <div style={{ fontSize:10, color:T.dim }}>{author.city}</div>}
          </div>
        </div>

        <div style={{ fontSize:24, fontWeight:900, marginBottom:4 }}>{selected.name}</div>
        <div style={{ fontSize:12, color:T.dim, marginBottom:16 }}>{selected.method} · {selected.glass}</div>

        <span style={lbl}>Ingredientes</span>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
          {(selected.ingredients||[]).map(i => <span key={i} style={{ background:T.surface, border:`1px solid ${T.border2}`, borderRadius:20, padding:"5px 13px", fontSize:13, color:T.text }}>{i}</span>)}
        </div>

        {selected.recipe && selected.show_measures !== false && (
          <><span style={lbl}>Receta</span>
          <div style={{ background:T.surface, border:`1px solid ${T.border2}`, borderRadius:12, padding:"14px 16px", fontFamily:"monospace", fontSize:13, color:T.purple, lineHeight:2, marginBottom:16 }}>{selected.recipe}</div></>
        )}
        {selected.show_measures === false && <div style={{ background:T.surface, border:`1px solid ${T.border2}`, borderRadius:12, padding:"12px 16px", fontSize:13, color:T.dim, marginBottom:16, fontStyle:"italic" }}>El bartender no ha publicado las proporciones exactas.</div>}
        {selected.garnish && <><span style={lbl}>Garnish</span><div style={{ fontSize:13, color:T.muted, marginBottom:16 }}>{selected.garnish}</div></>}
        {selected.notes && <><span style={lbl}>Historia</span><div style={{ fontSize:13, color:T.muted, lineHeight:1.7, marginBottom:16 }}>{selected.notes}</div></>}

        {/* Like button */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, marginBottom:20 }}>
          <button onClick={()=>toggleLike(selected.id)} style={{ background:isLiked?`${T.red}22`:"none", border:`1px solid ${isLiked?T.red:T.border2}`, borderRadius:20, padding:"8px 16px", color:isLiked?T.red:T.muted, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            {isLiked?"❤️":"🤍"} {likeCount > 0 ? likeCount : ""} Me gusta
          </button>
        </div>

        {/* Comments */}
        <span style={lbl}>Comentarios ({comments.length})</span>
        {comments.map(c => (
          <div key={c.id} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 14px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, fontWeight:700, color:T.purple }}>{c.profiles?.name || "Bartender"}</span>
              {c.profiles?.cert && <span style={{ fontSize:10, color:T.dim }}>{c.profiles.cert}</span>}
            </div>
            <div style={{ fontSize:13, color:T.text, lineHeight:1.6 }}>{c.text}</div>
          </div>
        ))}
        {!comments.length && <div style={{ color:T.dim, fontSize:13, textAlign:"center", padding:"16px 0" }}>Sin comentarios aún. ¡Sé el primero!</div>}

        {user && (
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendComment()} placeholder="Escribe un comentario…" style={{...inp, flex:1}}/>
            <button onClick={sendComment} disabled={!commentText.trim()} style={{ background:T.purple, border:"none", borderRadius:10, padding:"11px 16px", color:"#fff", fontSize:14, cursor:"pointer", opacity:!commentText.trim()?0.4:1 }}>→</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ flex:1, padding:"0 16px 100px", overflowY:"auto" }}>
      <div style={{ fontSize:20, fontWeight:900, marginBottom:4 }}>Comunidad</div>
      <div style={{ fontSize:13, color:T.muted, marginBottom:16 }}>Cócteles creados por bartenders</div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cóctel o ingrediente…" style={{...inp, marginBottom:16}}/>

      {loading && <div style={{ color:T.dim, textAlign:"center", padding:"40px 0" }}>Cargando…</div>}
      {!loading && !filtered.length && (
        <div style={{ background:T.card, border:`1px dashed ${T.border2}`, borderRadius:14, padding:28, textAlign:"center", color:T.dim, fontSize:13, lineHeight:1.7 }}>
          Aún no hay cócteles publicados.<br/>¡Sé el primero en compartir tu creación! 🍸
        </div>
      )}

      {filtered.map(c => {
        const author = profiles[c.user_id];
        const isLiked = userLikes.includes(c.id);
        const likeCount = likes[c.id] || 0;
        return (
          <div key={c.id} style={card} onClick={()=>openCocktail(c)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
              {c.photo_url && <img src={c.photo_url} alt="" style={{ width:48, height:48, borderRadius:10, objectFit:"cover", flexShrink:0 }}/>}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:2 }}>{c.name}</div>
                <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>{(c.ingredients||[]).slice(0,3).join(", ")}{(c.ingredients||[]).length>3?"…":""}</div>
                <div style={{ fontSize:11, color:T.purple }}>por {author?.name || "Bartender"}{author?.cert ? ` · ${author.cert}` : ""}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
                <button onClick={e=>{e.stopPropagation();toggleLike(c.id);}} style={{ background:"none", border:"none", fontSize:16, cursor:"pointer", padding:2 }}>{isLiked?"❤️":"🤍"}</button>
                {likeCount > 0 && <span style={{ fontSize:10, color:T.dim }}>{likeCount}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
