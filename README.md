# 🍸 JIGGER — Bartender Community App

App PWA para bartenders profesionales. 77 cócteles IBA oficiales + carta de autor propia.

**Creada por Marlo** — Bartender certificado ESCOM, encargado VIPS Cibeles Madrid.

---

## 📱 Funcionalidades — Fase 1

- **Constructor** — selecciona ingredientes y encuentra cócteles IBA al instante
- **Biblioteca** — 77 cócteles con filtros por categoría, método y ABV
- **Técnicas** — Shake, Stir, Build, Muddle, Blend, Layer, Dry Shake con consejos pro
- **Glosario** — 20 términos esenciales de coctelería
- **Perfil** — tu nombre, ciudad, certificaciones y carta de autor
- **Calculadora** — escala recetas de 1 a 50 raciones
- **Compartir** — comparte cualquier receta por WhatsApp o copia al portapapeles
- **Favoritos** — guarda los cócteles que más usas
- **Notas personales** — añade tus propias notas a cualquier receta
- **Admin** (PIN: 2025) — gestiona tus creaciones propias con foto, medidas opcionales

---

## 🚀 Subir a internet en 10 minutos

### Opción A — Netlify (sin instalar nada)

1. Descarga y descomprime el zip
2. Abre la carpeta `jigger` en la terminal y ejecuta:
   ```bash
   npm install
   npm run build
   ```
3. Ve a [netlify.com](https://netlify.com) → crea cuenta gratis
4. Arrastra la carpeta `dist` generada → ¡listo! Tienes URL al instante

### Opción B — Vercel (recomendado para actualizaciones frecuentes)

```bash
npm install
npm install -g vercel
vercel
```
Sigue las instrucciones. Te da URL tipo `jigger-app.vercel.app`.

### Opción C — GitHub + Vercel (mejor a largo plazo)

1. Sube este repositorio a GitHub
2. Conecta el repo en [vercel.com](https://vercel.com)
3. Cada vez que hagas cambios en GitHub, Vercel actualiza automáticamente

---

## 📱 Instalar como app en el móvil

Una vez subida a internet:

**iPhone (Safari):**
1. Abre la URL en Safari
2. Botón compartir → "Añadir a pantalla de inicio"

**Android (Chrome):**
1. Abre la URL en Chrome
2. Menú → "Añadir a pantalla de inicio"

---

## 🛠️ Añadir cócteles IBA al código

Abre `src/App.jsx` y busca `const IBA_DB = [`.
Añade al final del array con este formato:

```js
{
  id: "nombre-id",
  name: "Nombre del Cóctel",
  cat: "New Era",        // Unforgettables | Contemporary Classics | New Era
  glass: "Cocktail",
  method: "Shake",       // Shake | Stir | Build | Muddle | Blend | Layer
  base: "Gin",
  abv: "medium",         // low | medium | high
  ingredients: ["Gin", "Zumo de limón", "Sirope simple"],
  recipe: "5 cl Gin · 2 cl Limón · 1.5 cl Sirope",
  garnish: "Twist de limón",
  flavor: ["ácido", "herbal"]
},
```

---

## 🗺️ Roadmap

| Fase | Estado | Descripción |
|------|--------|-------------|
| **Fase 1** | ✅ Completa | App local — IBA + creaciones propias |
| **Fase 2** | 🔄 En desarrollo | Registro, login, perfiles en la nube (Supabase) |
| **Fase 3** | 📋 Planificada | Comunidad — feed, cócteles públicos, reacciones |
| **Fase 4** | 💭 Futura | Chat global, fotos de cócteles, vídeos |

---

## 💰 Costes

| Servicio | Precio |
|----------|--------|
| Dominio (jigger.app o similar) | ~12€/año |
| Hosting (Vercel) | Gratis |
| Base de datos (Supabase) | Gratis hasta 50k usuarios |
| **Total** | **~12€/año** |

---

## ⚙️ Admin

- Botón ⚙️ arriba a la derecha
- PIN: `2025` (cámbialo en `src/App.jsx`, línea con `const ADMIN_PIN`)

---

## 🏗️ Estructura del proyecto

```
jigger/
├── src/
│   ├── App.jsx          ← Toda la app (IBA DB + lógica + UI)
│   └── main.jsx         ← Entrada React
├── public/
│   ├── icons/           ← Iconos PWA (192px, 512px)
│   └── apple-touch-icon.png
├── index.html           ← HTML base
├── vite.config.js       ← Config Vite + PWA
├── package.json
└── README.md
```

---

## 📞 Contacto

Hecho con ❤️ por la comunidad de bartenders.
