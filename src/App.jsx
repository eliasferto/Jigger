import { useState, useMemo, useEffect, useCallback } from "react";
import Community from "./Community.jsx";

// ══════════════════════════════════════════════════════════
// JIGGER v2 — Bartender Community App
// ══════════════════════════════════════════════════════════


// ── FOTOS ──
function useCocktailPhoto(cocktail, photoMap) {
  return cocktail.photo || cocktail.photo_url || (photoMap && photoMap[cocktail.id]) || null;
}

function useStorage(key, def) {
  const [val, setVal] = useState(() => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : def; } catch { return def; }
  });
  const set = useCallback((v) => setVal(prev => {
    const next = typeof v === "function" ? v(prev) : v;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
    return next;
  }), [key]);
  return [val, set];
}

// ── PALETA & TOKENS ──
const T = {
  bg:      "#06060e",
  surface: "#0c0c18",
  card:    "#0f0f1c",
  border:  "#16162a",
  border2: "#1e1e38",
  text:    "#e8e3d8",
  muted:   "#888",
  dim:     "#444",
  purple:  "#a855f7",
  purpleL: "#c084fc",
  purpleD: "#7c3aed",
  gold:    "#f0a500",
  teal:    "#00c9a7",
  red:     "#ff6b6b",
  amber:   "#fbbf24",
  green:   "#4ade80",
  blue:    "#60a5fa",
};

const CAT_COLOR = { "Unforgettables":T.gold, "Contemporary Classics":T.teal, "New Era":T.purple, "Mis Creaciones":T.red };
const CAT_LABEL = { "Unforgettables":"ICON", "Contemporary Classics":"CLASSIC", "New Era":"NEW ERA", "Mis Creaciones":"MÍO" };
const ABV_COLOR = { low:T.green, medium:T.amber, high:T.red };
const ABV_LABEL = { low:"Bajo ABV", medium:"ABV Medio", high:"Alto ABV" };
const METHOD_ICON = { Shake:"🍸", Stir:"🥄", Build:"🥃", Muddle:"🌿", Blend:"🌀", Layer:"📊", Swizzle:"🌀", "Dry Shake":"🥚" };
const GLASS_ICON = {
  "Cocktail":"🍸", "Highball":"🥤", "Old Fashioned":"🥃", "Collins":"🥤",
  "Champagne flute":"🥂", "Shot":"🥃", "Wine":"🍷", "Copper mug":"🍺",
  "Julep":"🥤", "Poco Grande":"🍹", "Otro":"🍶"
};
const GLASS_NAME = {
  "Cocktail":"Copa Cocktail", "Highball":"Vaso Highball", "Old Fashioned":"Vaso Old Fashioned",
  "Collins":"Vaso Collins", "Champagne flute":"Flauta Champagne", "Shot":"Chupito",
  "Wine":"Copa de vino", "Copper mug":"Taza de cobre", "Julep":"Vaso Julep",
  "Poco Grande":"Vaso Poco Grande", "Otro":"Otro"
};
const METHODS = ["Shake","Stir","Build","Muddle","Blend","Layer","Dry Shake"];
const GLASSES = ["Cocktail","Highball","Old Fashioned","Collins","Champagne flute","Shot","Wine","Copper mug","Julep","Poco Grande","Otro"];


// ── CRISTALERÍA ──
const CRISTALERIA = [
  {
    id: "copa-cocktail",
    name: "Copa Cocktail",
    emoji: "🍸",
    photo: "https://images.unsplash.com/photo-1587282863750-0a297a50b553?auto=format&fit=crop&w=600&q=80",
    aka: "Copa Martini",
    desc: "La copa más icónica de la coctelería. Forma de V invertida con tallo largo. Mantiene el cóctel frío sin necesidad de hielo y permite apreciar el color y aroma.",
    capacidad: "90–150 ml",
    uso: "Cócteles servidos 'up' — sin hielo, colados y fríos.",
    cocktails: ["Dry Martini", "Manhattan", "Cosmopolitan", "Aviation", "Daiquiri", "Sidecar", "White Lady", "Vesper", "Last Word"],
    tip: "Enfría siempre la copa antes de servir. Llénala con agua fría o hielo durante 2 minutos, descarta y sirve."
  },
  {
    id: "copa-coupe",
    name: "Copa Coupe",
    emoji: "🥂",
    photo: "https://images.unsplash.com/photo-1691404016321-b210547c6d7a?auto=format&fit=crop&w=600&q=80",
    aka: "Copa Champagne clásica",
    desc: "Copa redonda y ancha con tallo largo. Elegante y vintage. Originalmente para Champagne, hoy es la favorita de los bartenders modernos para cócteles clásicos.",
    capacidad: "120–180 ml",
    uso: "Cócteles clásicos servidos 'up'. Alternativa elegante a la copa Martini.",
    cocktails: ["Daiquiri", "Clover Club", "Bee's Knees", "French 75", "Champagne Cocktail", "Pisco Sour"],
    tip: "Es la copa más fotogénica. Si tienes dudas entre Martini y Coupe para presentación, elige la Coupe."
  },
  {
    id: "highball",
    name: "Vaso Highball",
    emoji: "🥤",
    photo: "https://images.unsplash.com/photo-1622758665277-05e973af4395?auto=format&fit=crop&w=600&q=80",
    aka: "Vaso largo",
    desc: "Vaso alto y estrecho. El más versátil de la coctelería. Diseñado para cócteles largos con mucho refresco sobre hielo.",
    capacidad: "240–350 ml",
    uso: "Cócteles largos con soda, ginger beer, tónica o zumos.",
    cocktails: ["Mojito", "Gin Tonic", "Moscow Mule", "Aperol Spritz", "Tequila Sunrise", "Bloody Mary", "Singapore Sling"],
    tip: "Llena siempre de hielo hasta arriba antes de montar el cóctel. El hielo abundante mantiene la temperatura y la carbonatación."
  },
  {
    id: "old-fashioned",
    name: "Vaso Old Fashioned",
    emoji: "🥃",
    photo: "https://images.unsplash.com/photo-1615887625746-f3d2aa27e048?auto=format&fit=crop&w=600&q=80",
    aka: "Rocks glass / Lowball",
    desc: "Vaso bajo y ancho. Sólido y elegante. El clásico para espirituosos puros y cócteles potentes con poco hielo o una bola de hielo grande.",
    capacidad: "180–300 ml",
    uso: "Espirituosos solos, cócteles cortos y potentes, cócteles 'on the rocks'.",
    cocktails: ["Old Fashioned", "Negroni", "Whisky Sour", "Sazerac", "Boulevardier", "Caipirinha", "Mezcal Negroni"],
    tip: "Una bola de hielo grande en este vaso es la presentación más profesional. Derrite más lento que los cubitos y queda espectacular."
  },
  {
    id: "flauta",
    name: "Flauta de Champagne",
    emoji: "🥂",
    photo: "https://images.unsplash.com/photo-1546567075-d7113bee3c4a?auto=format&fit=crop&w=600&q=80",
    aka: "Champagne flute",
    desc: "Copa alta y estrecha que preserva las burbujas durante más tiempo. El cuello estrecho concentra los aromas y mantiene la efervescencia.",
    capacidad: "150–200 ml",
    uso: "Champagne, Cava, Prosecco y cócteles espumosos.",
    cocktails: ["Bellini", "Mimosa", "Kir Royal", "French 75", "Champagne Cocktail", "Spritz Veneziano"],
    tip: "Nunca agites ni remuevas una flauta — el gas se escapa. Vierte siempre inclinando la copa para preservar las burbujas."
  },
  {
    id: "collins",
    name: "Vaso Collins",
    emoji: "🥤",
    photo: "https://images.unsplash.com/photo-1630071073903-423f86c14389?auto=format&fit=crop&w=600&q=80",
    aka: "Tom Collins glass",
    desc: "Similar al Highball pero más alto y estrecho. Perfecto para cócteles muy largos con mucho hielo y refresco.",
    capacidad: "300–410 ml",
    uso: "Collins, Fizzes y cócteles muy largos.",
    cocktails: ["Tom Collins", "John Collins", "Gin Fizz", "Sloe Gin Fizz", "Long Island Iced Tea"],
    tip: "La diferencia con el Highball es sutil. Si no tienes Collins, usa el Highball — nadie lo notará."
  },
  {
    id: "copa-vino",
    name: "Copa de Vino",
    emoji: "🍷",
    photo: "https://images.unsplash.com/photo-1610065333275-b3e5c63fc872?auto=format&fit=crop&w=600&q=80",
    aka: "Wine glass",
    desc: "Copa amplia con tallo largo. En coctelería se usa principalmente para spritzes y cócteles con vino.",
    capacidad: "200–400 ml",
    uso: "Spritzes, cócteles con vino, Sangria.",
    cocktails: ["Aperol Spritz", "Spritz Veneziano", "Kir", "Wine Cocktails"],
    tip: "Para el Aperol Spritz: copa grande con hielo, Prosecco primero, luego Aperol, soda al final."
  },
  {
    id: "shot",
    name: "Chupito / Shot",
    emoji: "🥃",
    photo: "https://images.unsplash.com/photo-1707340726386-611f5e9398f3?auto=format&fit=crop&w=600&q=80",
    aka: "Shot glass",
    desc: "Vaso pequeño para una sola toma. En coctelería profesional también se usa como medidor.",
    capacidad: "30–60 ml",
    uso: "Shots, chupitos, layered drinks.",
    cocktails: ["B52", "Tequila Shot", "Jäger Bomb"],
    tip: "En muchos bares profesionales el shot glass es el jigger. Un shot estándar son 4.5 cl."
  },
  {
    id: "copper-mug",
    name: "Taza de Cobre",
    emoji: "🍺",
    photo: "https://images.unsplash.com/photo-1527628126150-086ff233b951?auto=format&fit=crop&w=600&q=80",
    aka: "Copper mug / Moscow Mule mug",
    desc: "Taza de cobre que mantiene el frío de forma excepcional. Icónica e inseparable del Moscow Mule. El cobre se enfría con el hielo y mantiene el cóctel helado.",
    capacidad: "350–500 ml",
    uso: "Moscow Mule y variantes (Dark 'n' Stormy, Mezcal Mule).",
    cocktails: ["Moscow Mule", "Dark 'n' Stormy", "Mezcal Mule", "Kentucky Mule"],
    tip: "El cobre real mejora el sabor del ginger beer. Asegúrate de que sea cobre interior, no solo exterior."
  },
  {
    id: "poco-grande",
    name: "Vaso Poco Grande",
    emoji: "🍹",
    photo: "https://images.unsplash.com/photo-1692296979815-ba89f3ada00c?auto=format&fit=crop&w=600&q=80",
    aka: "Hurricane glass",
    desc: "Vaso curvilíneo tipo hurricane o poco grande. Evoca bebidas tropicales y tiki culture. Su forma amplia permite decoraciones elaboradas.",
    capacidad: "350–500 ml",
    uso: "Cócteles tropicales, frozen drinks, tiki cocktails.",
    cocktails: ["Piña Colada", "Zombie", "Hurricane", "Blue Lagoon", "Sex on the Beach"],
    tip: "Decora con abundancia — rodaja de piña, cereza, sombrilla. En un tropical, la presentación es parte de la experiencia."
  },
];

// ── IBA DATABASE — 77 cócteles ──
const IBA_DB = [
  { id:"alexander", name:"Alexander", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Cognac", abv:"medium", ingredients:["Cognac","Crème de Cacao","Nata"], recipe:"3 cl Cognac · 3 cl Crème de Cacao · 3 cl Nata", garnish:"Nuez moscada rallada", flavor:["cremoso","dulce"] },
  { id:"americano", name:"Americano", cat:"Unforgettables", glass:"Highball", method:"Build", base:"Campari", abv:"low", ingredients:["Campari","Vermouth dulce","Agua con gas"], recipe:"3 cl Campari · 3 cl Vermouth dulce · Soda", garnish:"Rodaja de naranja", flavor:["amargo","refrescante"] },
  { id:"angel-face", name:"Angel Face", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Gin", abv:"high", ingredients:["Gin","Apricot Brandy","Calvados"], recipe:"3 cl Gin · 3 cl Apricot Brandy · 3 cl Calvados", garnish:"Sin garnish", flavor:["frutal","seco"] },
  { id:"aviation", name:"Aviation", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Maraschino","Crème de Violette","Zumo de limón"], recipe:"4.5 cl Gin · 1.5 cl Maraschino · 1.5 cl Crème de Violette · 1.5 cl Limón", garnish:"Cereza al marrasquino", flavor:["floral","ácido"] },
  { id:"between-sheets", name:"Between the Sheets", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Ron", abv:"high", ingredients:["Ron blanco","Cognac","Triple sec","Zumo de limón"], recipe:"3 cl Ron · 3 cl Cognac · 3 cl Triple sec · 2 cl Limón", garnish:"Twist de limón", flavor:["ácido","cítrico"] },
  { id:"boulevardier", name:"Boulevardier", cat:"Unforgettables", glass:"Old Fashioned", method:"Stir", base:"Bourbon", abv:"high", ingredients:["Bourbon","Campari","Vermouth dulce"], recipe:"4.5 cl Bourbon · 3 cl Campari · 3 cl Vermouth dulce", garnish:"Twist de naranja o cereza", flavor:["amargo","especiado"] },
  { id:"brandy-crusta", name:"Brandy Crusta", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Cognac", abv:"medium", ingredients:["Cognac","Maraschino","Triple sec","Zumo de limón","Angostura bitters"], recipe:"5 cl Cognac · 1 cl Maraschino · 1 cl Triple sec · 2 cl Limón · 1 dash Angostura", garnish:"Twist de limón largo", flavor:["ácido","complejo"] },
  { id:"casino", name:"Casino", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Maraschino","Orange bitters","Zumo de limón"], recipe:"4 cl Gin · 1 cl Maraschino · 1 cl Orange bitters · 1 cl Limón", garnish:"Cereza y twist de limón", flavor:["cítrico","herbal"] },
  { id:"clover-club", name:"Clover Club", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Zumo de limón","Sirope de grenadina","Clara de huevo"], recipe:"4.5 cl Gin · 1.5 cl Limón · 1.5 cl Grenadina · 1 Clara de huevo", garnish:"Frambuesas", flavor:["espumoso","frutal","ácido"] },
  { id:"daiquiri", name:"Daiquiri", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Ron", abv:"medium", ingredients:["Ron blanco","Zumo de lima","Sirope simple"], recipe:"4.5 cl Ron blanco · 2.5 cl Zumo de lima · 1.5 cl Sirope simple", garnish:"Rodaja de lima", flavor:["ácido","refrescante"] },
  { id:"dry-martini", name:"Dry Martini", cat:"Unforgettables", glass:"Cocktail", method:"Stir", base:"Gin", abv:"high", ingredients:["Gin","Vermouth seco"], recipe:"6 cl Gin · 1 cl Vermouth seco", garnish:"Oliva verde o twist de limón", flavor:["seco","herbal"] },
  { id:"gin-fizz", name:"Gin Fizz", cat:"Unforgettables", glass:"Highball", method:"Shake", base:"Gin", abv:"low", ingredients:["Gin","Zumo de limón","Sirope simple","Agua con gas"], recipe:"4.5 cl Gin · 3 cl Limón · 1 cl Sirope · Soda", garnish:"Rodaja de limón", flavor:["ácido","efervescente"] },
  { id:"hanky-panky", name:"Hanky Panky", cat:"Unforgettables", glass:"Cocktail", method:"Stir", base:"Gin", abv:"high", ingredients:["Gin","Vermouth dulce","Fernet-Branca"], recipe:"4.5 cl Gin · 4.5 cl Vermouth dulce · 0.75 cl Fernet-Branca", garnish:"Twist de naranja", flavor:["amargo","herbal"] },
  { id:"john-collins", name:"John Collins", cat:"Unforgettables", glass:"Collins", method:"Build", base:"Gin", abv:"low", ingredients:["Gin","Zumo de limón","Sirope simple","Agua con gas"], recipe:"4.5 cl Gin · 3 cl Limón · 1.5 cl Sirope · Soda", garnish:"Rodaja de limón y cereza", flavor:["ácido","efervescente"] },
  { id:"last-word", name:"Last Word", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Gin", abv:"high", ingredients:["Gin","Maraschino","Chartreuse verde","Zumo de lima"], recipe:"2.25 cl Gin · 2.25 cl Maraschino · 2.25 cl Chartreuse verde · 2.25 cl Lima", garnish:"Cereza al marrasquino", flavor:["herbal","complejo"] },
  { id:"manhattan", name:"Manhattan", cat:"Unforgettables", glass:"Cocktail", method:"Stir", base:"Whisky", abv:"high", ingredients:["Rye whisky","Vermouth dulce","Angostura bitters"], recipe:"5 cl Rye · 2 cl Vermouth dulce · 1 dash Angostura", garnish:"Cereza al marrasquino", flavor:["especiado","dulce"] },
  { id:"mary-pickford", name:"Mary Pickford", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Ron", abv:"medium", ingredients:["Ron blanco","Zumo de piña","Maraschino","Sirope de grenadina"], recipe:"6 cl Ron · 6 cl Piña · 1 cl Maraschino · 1 cl Grenadina", garnish:"Cereza al marrasquino", flavor:["tropical","dulce"] },
  { id:"monkey-gland", name:"Monkey Gland", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Zumo de naranja","Absinthe","Sirope de grenadina"], recipe:"5 cl Gin · 3 cl Naranja · 2 gotas Absinthe · 2 gotas Grenadina", garnish:"Sin garnish", flavor:["cítrico","anisado"] },
  { id:"negroni", name:"Negroni", cat:"Unforgettables", glass:"Old Fashioned", method:"Stir", base:"Gin", abv:"high", ingredients:["Gin","Campari","Vermouth dulce"], recipe:"3 cl Gin · 3 cl Campari · 3 cl Vermouth dulce", garnish:"Twist de naranja", flavor:["amargo","herbal"] },
  { id:"old-fashioned", name:"Old Fashioned", cat:"Unforgettables", glass:"Old Fashioned", method:"Build", base:"Bourbon", abv:"high", ingredients:["Bourbon","Angostura bitters","Azúcar"], recipe:"4.5 cl Bourbon · 2 dashes Angostura · 1 terrón azúcar", garnish:"Twist de naranja y cereza", flavor:["especiado","dulce"] },
  { id:"paradise", name:"Paradise", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Apricot Brandy","Zumo de naranja"], recipe:"3.5 cl Gin · 2 cl Apricot Brandy · 1.5 cl Naranja", garnish:"Sin garnish", flavor:["frutal","cítrico"] },
  { id:"planter-punch", name:"Planter's Punch", cat:"Unforgettables", glass:"Highball", method:"Build", base:"Ron", abv:"medium", ingredients:["Ron jamaicano","Zumo de lima","Sirope de caña"], recipe:"4.5 cl Ron · 3.5 cl Lima · Sirope de caña", garnish:"Twist de naranja", flavor:["tropical","ácido"] },
  { id:"porto-flip", name:"Porto Flip", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Brandy", abv:"medium", ingredients:["Brandy","Oporto tinto","Yema de huevo"], recipe:"1.5 cl Brandy · 4.5 cl Oporto · 1 Yema", garnish:"Nuez moscada", flavor:["cremoso","dulce"] },
  { id:"rusty-nail", name:"Rusty Nail", cat:"Unforgettables", glass:"Old Fashioned", method:"Build", base:"Whisky", abv:"high", ingredients:["Scotch whisky","Drambuie"], recipe:"4.5 cl Scotch · 2.5 cl Drambuie", garnish:"Twist de limón", flavor:["dulce","ahumado"] },
  { id:"sazerac", name:"Sazerac", cat:"Unforgettables", glass:"Old Fashioned", method:"Stir", base:"Cognac", abv:"high", ingredients:["Cognac","Absinthe","Azúcar","Peychaud bitters"], recipe:"5 cl Cognac · 1 cl Absinthe · 1 terrón azúcar · 2 dashes Peychaud", garnish:"Twist de limón", flavor:["anisado","especiado"] },
  { id:"sidecar", name:"Sidecar", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Cognac", abv:"medium", ingredients:["Cognac","Triple sec","Zumo de limón"], recipe:"5 cl Cognac · 2 cl Triple sec · 2 cl Limón", garnish:"Twist de naranja", flavor:["ácido","cítrico"] },
  { id:"stinger", name:"Stinger", cat:"Unforgettables", glass:"Cocktail", method:"Stir", base:"Cognac", abv:"high", ingredients:["Cognac","Crème de menthe blanca"], recipe:"5 cl Cognac · 2 cl Crème de menthe blanca", garnish:"Sin garnish", flavor:["mentolado","dulce"] },
  { id:"tuxedo", name:"Tuxedo", cat:"Unforgettables", glass:"Cocktail", method:"Stir", base:"Gin", abv:"high", ingredients:["Gin","Vermouth seco","Maraschino","Absinthe","Orange bitters"], recipe:"3 cl Gin · 3 cl Vermouth seco · 0.5 bsp Maraschino · 0.25 bsp Absinthe · 3 dashes Orange bitters", garnish:"Cereza y twist de limón", flavor:["seco","complejo"] },
  { id:"vieux-carre", name:"Vieux Carré", cat:"Unforgettables", glass:"Old Fashioned", method:"Stir", base:"Whisky", abv:"high", ingredients:["Rye whisky","Cognac","Vermouth dulce","Bénédictine","Peychaud bitters"], recipe:"3 cl Rye · 3 cl Cognac · 3 cl Vermouth dulce · 1 bsp Bénédictine · 2 dashes Peychaud", garnish:"Twist de limón y cereza", flavor:["especiado","complejo"] },
  { id:"white-lady", name:"White Lady", cat:"Unforgettables", glass:"Cocktail", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Triple sec","Zumo de limón"], recipe:"4 cl Gin · 3 cl Triple sec · 2 cl Limón", garnish:"Twist de limón", flavor:["ácido","cítrico"] },
  { id:"aperol-spritz", name:"Aperol Spritz", cat:"Contemporary Classics", glass:"Wine", method:"Build", base:"Aperol", abv:"low", ingredients:["Aperol","Prosecco","Agua con gas"], recipe:"6 cl Prosecco · 4 cl Aperol · 2 cl Soda", garnish:"Rodaja de naranja", flavor:["amargo","efervescente"] },
  { id:"b52", name:"B52", cat:"Contemporary Classics", glass:"Shot", method:"Layer", base:"Kahlúa", abv:"medium", ingredients:["Kahlúa","Baileys","Grand Marnier"], recipe:"2 cl Kahlúa · 2 cl Baileys · 2 cl Grand Marnier", garnish:"Sin garnish", flavor:["cremoso","dulce"] },
  { id:"bellini", name:"Bellini", cat:"Contemporary Classics", glass:"Champagne flute", method:"Build", base:"Prosecco", abv:"low", ingredients:["Prosecco","Puré de melocotón"], recipe:"10 cl Prosecco · 5 cl Puré de melocotón", garnish:"Sin garnish", flavor:["frutal","efervescente"] },
  { id:"black-russian", name:"Black Russian", cat:"Contemporary Classics", glass:"Old Fashioned", method:"Build", base:"Vodka", abv:"high", ingredients:["Vodka","Kahlúa"], recipe:"5 cl Vodka · 2 cl Kahlúa", garnish:"Sin garnish", flavor:["dulce","café"] },
  { id:"bloody-mary", name:"Bloody Mary", cat:"Contemporary Classics", glass:"Highball", method:"Build", base:"Vodka", abv:"low", ingredients:["Vodka","Zumo de tomate","Zumo de limón","Tabasco","Salsa Worcestershire","Sal","Pimienta"], recipe:"4.5 cl Vodka · 9 cl Tomate · 1.5 cl Limón · Tabasco · Worcestershire · Sal · Pimienta", garnish:"Apio y rodaja de limón", flavor:["salado","picante","umami"] },
  { id:"caipirinha", name:"Caipirinha", cat:"Contemporary Classics", glass:"Old Fashioned", method:"Muddle", base:"Cachaça", abv:"medium", ingredients:["Cachaça","Azúcar","Lima"], recipe:"6 cl Cachaça · 4 gajos Lima · 2 cdta Azúcar", garnish:"Rodaja de lima", flavor:["ácido","refrescante"] },
  { id:"champagne-cocktail", name:"Champagne Cocktail", cat:"Contemporary Classics", glass:"Champagne flute", method:"Build", base:"Champagne", abv:"low", ingredients:["Champagne","Cognac","Angostura bitters","Azúcar"], recipe:"9 cl Champagne · 1 cl Cognac · 2 dashes Angostura · 1 terrón azúcar", garnish:"Twist de naranja", flavor:["efervescente","elegante"] },
  { id:"cosmopolitan", name:"Cosmopolitan", cat:"Contemporary Classics", glass:"Cocktail", method:"Shake", base:"Vodka", abv:"medium", ingredients:["Vodka cítrico","Triple sec","Zumo de lima","Zumo de arándanos"], recipe:"4 cl Vodka cítrico · 1.5 cl Triple sec · 1.5 cl Lima · 3 cl Arándanos", garnish:"Twist de naranja", flavor:["ácido","frutal"] },
  { id:"espresso-martini", name:"Espresso Martini", cat:"Contemporary Classics", glass:"Cocktail", method:"Shake", base:"Vodka", abv:"medium", ingredients:["Vodka","Kahlúa","Café espresso"], recipe:"5 cl Vodka · 1 cl Kahlúa · 3 cl Espresso", garnish:"3 granos de café", flavor:["café","dulce","espumoso"] },
  { id:"french-75", name:"French 75", cat:"Contemporary Classics", glass:"Champagne flute", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Zumo de limón","Sirope simple","Champagne"], recipe:"3 cl Gin · 1.5 cl Limón · 1.5 cl Sirope · 6 cl Champagne", garnish:"Twist de limón", flavor:["ácido","efervescente"] },
  { id:"golden-dream", name:"Golden Dream", cat:"Contemporary Classics", glass:"Cocktail", method:"Shake", base:"Galliano", abv:"medium", ingredients:["Galliano","Triple sec","Zumo de naranja","Nata"], recipe:"2 cl Galliano · 2 cl Triple sec · 2 cl Naranja · 2 cl Nata", garnish:"Sin garnish", flavor:["cremoso","cítrico"] },
  { id:"grasshopper", name:"Grasshopper", cat:"Contemporary Classics", glass:"Cocktail", method:"Shake", base:"Crème de menthe", abv:"medium", ingredients:["Crème de menthe verde","Crème de Cacao","Nata"], recipe:"3 cl Crème de menthe · 3 cl Crème de Cacao · 3 cl Nata", garnish:"Sin garnish", flavor:["mentolado","cremoso"] },
  { id:"harvey-wallbanger", name:"Harvey Wallbanger", cat:"Contemporary Classics", glass:"Highball", method:"Build", base:"Vodka", abv:"low", ingredients:["Vodka","Zumo de naranja","Galliano"], recipe:"4.5 cl Vodka · 8 cl Naranja · 1.5 cl Galliano (float)", garnish:"Rodaja de naranja y cereza", flavor:["cítrico","dulce"] },
  { id:"kir", name:"Kir", cat:"Contemporary Classics", glass:"Wine", method:"Build", base:"Vino blanco", abv:"low", ingredients:["Vino blanco seco","Crème de Cassis"], recipe:"9 cl Vino blanco · 1 cl Crème de Cassis", garnish:"Sin garnish", flavor:["frutal","ligero"] },
  { id:"lemon-drop", name:"Lemon Drop Martini", cat:"Contemporary Classics", glass:"Cocktail", method:"Shake", base:"Vodka", abv:"medium", ingredients:["Vodka cítrico","Triple sec","Zumo de limón"], recipe:"4 cl Vodka cítrico · 1.5 cl Triple sec · 2 cl Limón", garnish:"Borde de azúcar, twist de limón", flavor:["ácido","dulce"] },
  { id:"long-island", name:"Long Island Iced Tea", cat:"Contemporary Classics", glass:"Highball", method:"Build", base:"Vodka", abv:"high", ingredients:["Vodka","Tequila","Ron blanco","Gin","Triple sec","Zumo de limón","Cola"], recipe:"1.5 cl Vodka · 1.5 cl Tequila · 1.5 cl Ron · 1.5 cl Gin · 1.5 cl Triple sec · 2.5 cl Limón · Cola", garnish:"Rodaja de limón", flavor:["cítrico","refrescante"] },
  { id:"mai-tai", name:"Mai Tai", cat:"Contemporary Classics", glass:"Old Fashioned", method:"Shake", base:"Ron", abv:"medium", ingredients:["Ron blanco","Ron oscuro","Triple sec","Orgeat","Zumo de lima"], recipe:"4 cl Ron blanco · 2 cl Ron oscuro · 1.5 cl Triple sec · 1.5 cl Orgeat · 1 cl Lima", garnish:"Ramita de menta y rodaja de piña", flavor:["tropical","dulce"] },
  { id:"mimosa", name:"Mimosa", cat:"Contemporary Classics", glass:"Champagne flute", method:"Build", base:"Champagne", abv:"low", ingredients:["Champagne","Zumo de naranja"], recipe:"7.5 cl Champagne · 7.5 cl Naranja", garnish:"Twist de naranja", flavor:["cítrico","efervescente"] },
  { id:"mint-julep", name:"Mint Julep", cat:"Contemporary Classics", glass:"Julep", method:"Build", base:"Bourbon", abv:"medium", ingredients:["Bourbon","Menta","Azúcar"], recipe:"6 cl Bourbon · 4 ramitas Menta · 1 cdta Azúcar · Agua con gas", garnish:"Ramita de menta", flavor:["mentolado","dulce"] },
  { id:"mojito", name:"Mojito", cat:"Contemporary Classics", glass:"Highball", method:"Muddle", base:"Ron", abv:"low", ingredients:["Ron blanco","Zumo de lima","Azúcar","Menta","Agua con gas"], recipe:"4.5 cl Ron · 2 cl Lima · 2 cdta Azúcar · 6 ramitas Menta · Soda", garnish:"Ramita de menta y rodaja de lima", flavor:["mentolado","ácido","refrescante"] },
  { id:"moscow-mule", name:"Moscow Mule", cat:"Contemporary Classics", glass:"Copper mug", method:"Build", base:"Vodka", abv:"low", ingredients:["Vodka","Ginger beer","Zumo de lima"], recipe:"4.5 cl Vodka · 12 cl Ginger beer · 1 cl Lima", garnish:"Rodaja de lima y ramita de menta", flavor:["jengibre","ácido","refrescante"] },
  { id:"pina-colada", name:"Piña Colada", cat:"Contemporary Classics", glass:"Poco Grande", method:"Blend", base:"Ron", abv:"medium", ingredients:["Ron blanco","Crema de coco","Zumo de piña"], recipe:"5 cl Ron · 3 cl Crema de coco · 5 cl Piña", garnish:"Rodaja de piña y cereza", flavor:["tropical","cremoso"] },
  { id:"pisco-sour", name:"Pisco Sour", cat:"Contemporary Classics", glass:"Old Fashioned", method:"Shake", base:"Pisco", abv:"medium", ingredients:["Pisco","Zumo de limón","Sirope simple","Clara de huevo"], recipe:"6 cl Pisco · 3 cl Limón · 2 cl Sirope · 1 Clara de huevo", garnish:"Angostura bitters", flavor:["ácido","espumoso"] },
  { id:"sea-breeze", name:"Sea Breeze", cat:"Contemporary Classics", glass:"Highball", method:"Build", base:"Vodka", abv:"low", ingredients:["Vodka","Zumo de arándanos","Zumo de pomelo"], recipe:"4 cl Vodka · 12 cl Arándanos · 3 cl Pomelo", garnish:"Twist de lima", flavor:["frutal","ácido"] },
  { id:"sex-on-beach", name:"Sex on the Beach", cat:"Contemporary Classics", glass:"Highball", method:"Build", base:"Vodka", abv:"low", ingredients:["Vodka","Peach Schnapps","Zumo de naranja","Zumo de arándanos"], recipe:"4 cl Vodka · 2 cl Peach Schnapps · 4 cl Naranja · 4 cl Arándanos", garnish:"Rodaja de naranja", flavor:["frutal","tropical"] },
  { id:"singapore-sling", name:"Singapore Sling", cat:"Contemporary Classics", glass:"Highball", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Cherry Heering","Triple sec","Bénédictine","Zumo de piña","Zumo de lima","Sirope de grenadina","Angostura bitters"], recipe:"3 cl Gin · 1.5 cl Cherry Heering · 0.75 cl Triple sec · 0.75 cl Bénédictine · 12 cl Piña · 1.5 cl Lima · 1 cl Grenadina · 1 dash Angostura", garnish:"Rodaja de piña y cereza", flavor:["frutal","complejo"] },
  { id:"tequila-sunrise", name:"Tequila Sunrise", cat:"Contemporary Classics", glass:"Highball", method:"Build", base:"Tequila", abv:"low", ingredients:["Tequila","Zumo de naranja","Sirope de grenadina"], recipe:"4.5 cl Tequila · 9 cl Naranja · 1.5 cl Grenadina (float)", garnish:"Rodaja de naranja y cereza", flavor:["cítrico","frutal"] },
  { id:"white-russian", name:"White Russian", cat:"Contemporary Classics", glass:"Old Fashioned", method:"Build", base:"Vodka", abv:"medium", ingredients:["Vodka","Kahlúa","Nata"], recipe:"5 cl Vodka · 2 cl Kahlúa · 3 cl Nata (float)", garnish:"Sin garnish", flavor:["cremoso","café"] },
  { id:"zombie", name:"Zombie", cat:"Contemporary Classics", glass:"Highball", method:"Shake", base:"Ron", abv:"high", ingredients:["Ron blanco","Ron oscuro","Ron 151","Apricot Brandy","Zumo de piña","Zumo de lima","Sirope simple"], recipe:"4.5 cl Ron blanco · 4.5 cl Ron oscuro · 1 cl Ron 151 · 1.5 cl Apricot Brandy · 1.5 cl Lima · 4 cl Piña · 1.5 cl Sirope", garnish:"Ramita de menta y piel de naranja", flavor:["tropical","potente"] },
  { id:"bees-knees", name:"Bee's Knees", cat:"New Era", glass:"Cocktail", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Zumo de limón","Miel"], recipe:"5 cl Gin · 2 cl Limón · 2 cl Miel", garnish:"Twist de limón", flavor:["ácido","dulce","floral"] },
  { id:"bramble", name:"Bramble", cat:"New Era", glass:"Old Fashioned", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Zumo de limón","Sirope simple","Crème de Mûre"], recipe:"5 cl Gin · 2.5 cl Limón · 1.25 cl Sirope · 1.5 cl Crème de Mûre (float)", garnish:"Rodaja de limón y moras", flavor:["frutal","ácido"] },
  { id:"canchanchara", name:"Canchanchara", cat:"New Era", glass:"Old Fashioned", method:"Build", base:"Ron", abv:"medium", ingredients:["Ron cubano","Zumo de lima","Miel","Agua"], recipe:"6 cl Ron · 1.5 cl Lima · 1.5 cl Miel · 5 cl Agua", garnish:"Rodaja de lima", flavor:["ácido","floral"] },
  { id:"dark-stormy", name:"Dark 'n' Stormy", cat:"New Era", glass:"Highball", method:"Build", base:"Ron", abv:"low", ingredients:["Ron oscuro","Ginger beer","Zumo de lima"], recipe:"6 cl Ron oscuro · 10 cl Ginger beer · Lima", garnish:"Rodaja de lima", flavor:["jengibre","refrescante"] },
  { id:"dirty-martini", name:"Dirty Martini", cat:"New Era", glass:"Cocktail", method:"Stir", base:"Vodka", abv:"high", ingredients:["Vodka","Vermouth seco","Salmuera de aceitunas"], recipe:"6 cl Vodka · 1 cl Vermouth seco · 1 cl Salmuera", garnish:"Aceituna verde", flavor:["salado","seco"] },
  { id:"french-martini", name:"French Martini", cat:"New Era", glass:"Cocktail", method:"Shake", base:"Vodka", abv:"medium", ingredients:["Vodka","Chambord","Zumo de piña"], recipe:"4.5 cl Vodka · 1.5 cl Chambord · 10 cl Piña", garnish:"Frambuesa o twist de limón", flavor:["frutal","tropical"] },
  { id:"naked-famous", name:"Naked and Famous", cat:"New Era", glass:"Cocktail", method:"Shake", base:"Mezcal", abv:"medium", ingredients:["Mezcal","Aperol","Chartreuse amarillo","Zumo de lima"], recipe:"2.25 cl Mezcal · 2.25 cl Aperol · 2.25 cl Chartreuse amarillo · 2.25 cl Lima", garnish:"Sin garnish", flavor:["ahumado","amargo","ácido"] },
  { id:"new-york-sour", name:"New York Sour", cat:"New Era", glass:"Old Fashioned", method:"Shake", base:"Bourbon", abv:"medium", ingredients:["Bourbon","Zumo de limón","Sirope simple","Clara de huevo","Vino tinto"], recipe:"6 cl Bourbon · 3 cl Limón · 2 cl Sirope · Clara de huevo · Float de vino tinto", garnish:"Cereza", flavor:["ácido","espumoso","complejo"] },
  { id:"paper-plane", name:"Paper Plane", cat:"New Era", glass:"Cocktail", method:"Shake", base:"Bourbon", abv:"medium", ingredients:["Bourbon","Aperol","Amaro Nonino","Zumo de limón"], recipe:"3 cl Bourbon · 3 cl Aperol · 3 cl Amaro Nonino · 3 cl Limón", garnish:"Sin garnish", flavor:["amargo","ácido","equilibrado"] },
  { id:"penicillin", name:"Penicillin", cat:"New Era", glass:"Old Fashioned", method:"Shake", base:"Whisky", abv:"medium", ingredients:["Scotch whisky","Zumo de limón","Sirope de miel","Jengibre","Islay Scotch"], recipe:"6 cl Scotch · 2.25 cl Limón · 2.25 cl Miel-jengibre · Float Islay Scotch", garnish:"Jengibre confitado", flavor:["ahumado","jengibre","ácido"] },
  { id:"pornstar-martini", name:"Pornstar Martini", cat:"New Era", glass:"Cocktail", method:"Shake", base:"Vodka", abv:"medium", ingredients:["Vodka","Licor de maracuyá","Zumo de maracuyá","Sirope de vainilla","Zumo de lima","Champagne"], recipe:"5 cl Vodka · 5 cl Licor maracuyá · 5 cl Maracuyá · 1.5 cl Sirope vainilla · 1.5 cl Lima · Champagne aparte", garnish:"Maracuyá y Champagne", flavor:["tropical","frutal"] },
  { id:"russian-spring", name:"Russian Spring Punch", cat:"New Era", glass:"Highball", method:"Build", base:"Vodka", abv:"low", ingredients:["Vodka","Zumo de limón","Crème de Cassis","Champagne"], recipe:"2.5 cl Vodka · 2.5 cl Limón · 1.5 cl Cassis · Champagne", garnish:"Rodaja de limón y mora", flavor:["frutal","efervescente"] },
  { id:"southside", name:"Southside", cat:"New Era", glass:"Cocktail", method:"Shake", base:"Gin", abv:"medium", ingredients:["Gin","Zumo de limón","Sirope simple","Menta"], recipe:"6 cl Gin · 3 cl Limón · 2 cl Sirope · 6 hojas Menta", garnish:"Ramita de menta", flavor:["mentolado","ácido"] },
  { id:"spritz-veneziano", name:"Spritz Veneziano", cat:"New Era", glass:"Wine", method:"Build", base:"Prosecco", abv:"low", ingredients:["Prosecco","Aperol","Agua con gas"], recipe:"6 cl Prosecco · 4 cl Aperol · 2 cl Soda", garnish:"Rodaja de naranja", flavor:["amargo","efervescente"] },
  { id:"tommy-margarita", name:"Tommy's Margarita", cat:"New Era", glass:"Old Fashioned", method:"Shake", base:"Tequila", abv:"medium", ingredients:["Tequila","Zumo de lima","Sirope de agave"], recipe:"6 cl Tequila · 3 cl Lima · 1.5 cl Agave", garnish:"Rodaja de lima, sal opcional", flavor:["ácido","agave"] },
  { id:"margarita", name:"Margarita", cat:"New Era", glass:"Cocktail", method:"Shake", base:"Tequila", abv:"medium", ingredients:["Tequila","Triple sec","Zumo de lima"], recipe:"5 cl Tequila · 2 cl Triple sec · 1.5 cl Lima", garnish:"Borde de sal, rodaja de lima", flavor:["ácido","cítrico"] },
  { id:"vesper", name:"Vesper", cat:"New Era", glass:"Cocktail", method:"Shake", base:"Gin", abv:"high", ingredients:["Gin","Vodka","Lillet Blanc"], recipe:"6 cl Gin · 1.5 cl Vodka · 0.75 cl Lillet Blanc", garnish:"Twist de limón", flavor:["seco","elegante"] },
  { id:"whisky-sour", name:"Whisky Sour", cat:"New Era", glass:"Old Fashioned", method:"Shake", base:"Bourbon", abv:"medium", ingredients:["Bourbon","Zumo de limón","Sirope simple","Clara de huevo"], recipe:"4.5 cl Bourbon · 3 cl Limón · 1.5 cl Sirope · Clara de huevo", garnish:"Rodaja de naranja y cereza", flavor:["ácido","espumoso"] },
];

// ── INGREDIENTES COMPLETOS ──
const ALL_INGREDIENTS = [
  "Gin","Vodka","Ron blanco","Ron oscuro","Ron añejo","Ron cubano","Ron jamaicano","Ron 151",
  "Tequila","Mezcal","Bourbon","Rye whisky","Scotch whisky","Islay Scotch","Cognac","Brandy",
  "Pisco","Cachaça","Champagne","Prosecco","Vino blanco seco","Vino tinto","Cerveza",
  "Campari","Aperol","Vermouth dulce","Vermouth seco","Lillet Blanc","Chambord",
  "Triple sec","Grand Marnier","Maraschino","Kahlúa","Baileys","Drambuie","Galliano",
  "Crème de Cacao","Crème de menthe verde","Crème de menthe blanca","Crème de Cassis",
  "Crème de Mûre","Crème de Violette","Cherry Heering","Peach Schnapps","Apricot Brandy",
  "Chartreuse verde","Chartreuse amarillo","Fernet-Branca","Amaro Nonino","Bénédictine",
  "Absinthe","Orgeat","Falernum","Licor de maracuyá","Licor de violeta",
  "Zumo de limón","Zumo de lima","Zumo de naranja","Zumo de pomelo","Zumo de piña",
  "Zumo de arándanos","Zumo de tomate","Zumo de manzana","Zumo de maracuyá","Zumo de mango",
  "Sirope simple","Sirope de agave","Sirope de grenadina","Sirope de caña","Sirope de vainilla",
  "Sirope de miel","Sirope de fruta de la pasión","Azúcar","Azúcar moreno","Miel",
  "Agua con gas","Ginger beer","Ginger ale","Tónica","Cola","Sprite","Agua de coco",
  "Nata","Crema de coco","Leche de coco","Clara de huevo","Yema de huevo","Nata montada",
  "Menta","Albahaca","Romero","Jengibre","Pepino","Lima","Limón","Naranja","Melocotón",
  "Frambuesas","Fresas","Uvas","Piña","Maracuyá","Coco rallado","Puré de melocotón",
  "Angostura bitters","Peychaud bitters","Orange bitters","Mole bitters","Salmuera de aceitunas",
  "Tabasco","Salsa Worcestershire","Sal","Pimienta","Nuez moscada","Café espresso",
];

// ── TÉCNICAS ──
const TECNICAS = [
  { id:"shake", name:"Shake", icon:"🍸", color:T.purple, subtitle:"Agitar con hielo", desc:"Agita vigorosamente en coctelera con hielo durante 10–15 segundos. Enfría, diluye y añade textura.", cuando:"Cuando hay zumos, lácteos, claras de huevo o siropes. Nunca para cócteles solo de espirituosos.", tip:"Un buen shake suena como un tren. Si suena suave, agita más fuerte." },
  { id:"stir", name:"Stir", icon:"🥄", color:T.teal, subtitle:"Remover con cuchara", desc:"Remueve en vaso mezclador con hielo durante 30–40 segundos. Enfría sin incorporar aire ni textura.", cuando:"Cócteles solo de espirituosos: Martini, Manhattan, Negroni, Old Fashioned.", tip:"La cuchara no debe tocar el vaso. Mueve el hielo, deja que el líquido fluya." },
  { id:"build", name:"Build", icon:"🥃", color:T.gold, subtitle:"Directo en el vaso", desc:"Construyes el cóctel en el vaso de servicio añadiendo ingredientes en orden sobre hielo.", cuando:"Cócteles largos: Gin Tonic, Aperol Spritz, Moscow Mule. También shots.", tip:"El espirituoso siempre antes que los refrescos. Así el gas dura más." },
  { id:"muddle", name:"Muddle", icon:"🌿", color:T.green, subtitle:"Machacar suavemente", desc:"Presiona suavemente frutas o hierbas en el fondo del vaso con el muddler para extraer aromas.", cuando:"Mojito, Caipirinha, Smash. Siempre antes del resto de ingredientes.", tip:"No machaces con fuerza. Si exprimes demasiado la menta, amarga." },
  { id:"blend", name:"Blend", icon:"🌀", color:T.blue, subtitle:"Triturar con hielo", desc:"Tritura el cóctel con hielo en batidora hasta obtener textura cremosa o granizada.", cuando:"Piña Colada frozen, Daiquiri frozen, Margarita frozen.", tip:"Empieza lento y sube velocidad. Usa hielo pilé, no cubos grandes." },
  { id:"layer", name:"Float / Layer", icon:"📊", color:"#fb923c", subtitle:"Capas por densidad", desc:"Vierte licores en orden de densidad sobre el dorso de una cuchara para crear capas visuales.", cuando:"B52, Tequila Sunrise (la grenadina), shots layered.", tip:"Vierte muy despacio. La paciencia es la técnica." },
  { id:"dry-shake", name:"Dry Shake", icon:"🥚", color:"#e879f9", subtitle:"Shake sin hielo primero", desc:"Agita SIN hielo primero para emulsionar la clara. Después añade hielo y vuelve a agitar.", cuando:"Cócteles con clara de huevo: Whisky Sour, Pisco Sour, Clover Club.", tip:"El dry shake puede eyectar la coctelera. Sujeta fuerte las dos partes." },
];

// ── GLOSARIO ──
const GLOSARIO = [
  { term:"Jigger", def:"Medidor metálico de doble cono. Un lado suele medir 4.5 cl, el otro 2.25 cl. La herramienta más importante del bartender." },
  { term:"Double strain", def:"Filtrar con dos coladores a la vez: el gusanillo de la coctelera y un colador fino de malla. Elimina pepitas de hielo y pulpa." },
  { term:"Dry", def:"Sin sweet vermouth o con menos azúcar. Un Martini Dry lleva menos (o nada de) vermouth." },
  { term:"Up / Straight up", def:"Servido sin hielo pero preparado con hielo y colado. Ej: un Martini." },
  { term:"On the rocks", def:"Servido sobre hielo en el vaso. Ej: un Negroni on the rocks." },
  { term:"Neat", def:"Espirituoso solo, sin hielo, sin mezcla. Solo el líquido a temperatura ambiente." },
  { term:"Float", def:"Verter un ingrediente suavemente encima del cóctel sin mezclarlo. Grenadina en Tequila Sunrise, vino tinto en New York Sour." },
  { term:"Dash", def:"Pequeña cantidad de bitters. Aproximadamente 0.6 ml, lo que sale de un golpe de botella." },
  { term:"Bsp (Barspoon)", def:"Medida equivalente a una cucharadita de bar. Aproximadamente 5 ml." },
  { term:"Twist", def:"Tira de piel de cítrico que se exprime sobre el cóctel para liberar aceites aromáticos y se usa como garnish." },
  { term:"Muddling", def:"Machacar ingredientes frescos (frutas, hierbas) en el fondo del vaso con el muddler para extraer aromas y jugos." },
  { term:"Orgeat", def:"Sirope de almendra con agua de azahar. Ingrediente clave del Mai Tai. Sabor dulce, floral y ligeramente amargo." },
  { term:"Bitters", def:"Concentrado de hierbas, especias y raíces maceradas en alcohol. Se usan en pequeñas cantidades. Angostura y Peychaud son los más comunes." },
  { term:"Falernum", def:"Sirope caribeño de almendra, lima y especias (clavo, jengibre). Ingrediente clásico de tiki cocktails." },
  { term:"Proof", def:"Medida americana de graduación alcohólica. 100 proof = 50% ABV. El ABV europeo es la mitad del Proof." },
  { term:"Mise en place", def:"Tenerlo todo preparado antes del servicio: hielo, garnishes, licores, herramientas limpias. Básico en cocina y barra." },
  { term:"Garnish", def:"Decoración del cóctel: twist de cítrico, menta, cereza, sal en el borde... No es solo estética, también añade aroma." },
  { term:"Espumoso", def:"Ingrediente con gas: Champagne, Prosecco, agua con gas, ginger beer. Siempre al final y sin remover." },
  { term:"ABV", def:"Alcohol By Volume. Porcentaje de alcohol en el volumen total de la bebida. El vodka estándar es 40% ABV." },
  { term:"Expression", def:"Exprimir la piel de un cítrico (sin zumo) sobre el cóctel para liberar los aceites esenciales de la cáscara." },
];

// ── TEMAS ──
const DARK_THEME = {
  bg:"#06060e", surface:"#0c0c18", card:"#0f0f1c", border:"#16162a", border2:"#1e1e38",
  text:"#e8e3d8", muted:"#888", dim:"#444",
  purple:"#a855f7", purpleL:"#c084fc", purpleD:"#7c3aed",
  gold:"#f0a500", teal:"#00c9a7", red:"#ff6b6b", amber:"#fbbf24", green:"#4ade80", blue:"#60a5fa",
};
const LIGHT_THEME = {
  bg:"#f5f4f0", surface:"#ffffff", card:"#ededf8", border:"#dddcee", border2:"#cccce0",
  text:"#1a1a2e", muted:"#666", dim:"#999",
  purple:"#7c3aed", purpleL:"#6d28d9", purpleD:"#5b21b6",
  gold:"#d97706", teal:"#0d9488", red:"#dc2626", amber:"#d97706", green:"#16a34a", blue:"#2563eb",
};
function getAutoTheme() {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

// ── HELPERS ──
function matchScore(sel, ings) {
  const s = sel.map(x => x.toLowerCase());
  const c = ings.map(x => x.toLowerCase());
  let hits = 0;
  for (const sv of s) if (c.some(cv => cv.includes(sv) || sv.includes(cv.split(" ").pop()))) hits++;
  return { hits, total: c.length, pct: hits / c.length };
}

function shareRecipe(c) {
  const text = `🍸 *${c.name}*\n\n📋 Ingredientes:\n${c.ingredients.map(i=>`• ${i}`).join("\n")}\n\n${c.recipe ? `📏 Receta:\n${c.recipe}\n\n` : ""}${c.garnish ? `🍋 Garnish: ${c.garnish}\n\n` : ""}Vía JIGGER — Bartender App`;
  if (navigator.share) { navigator.share({ title: c.name, text }); }
  else { navigator.clipboard?.writeText(text); }
}

// ── STYLE HELPERS ──
const card = (hi, border) => ({ background: hi ? "#13102a" : T.card, border:`1px solid ${border||( hi ? T.purpleD+"55" : T.border)}`, borderRadius:14, padding:"14px 16px", marginBottom:10, cursor:"pointer" });
const chip = (on, col) => ({ background: on ? (col||T.purpleD)+"33" : T.surface, border:`1px solid ${on?(col||T.purpleD):T.border2}`, borderRadius:20, padding:"6px 13px", color: on?(col||T.purpleL):T.muted, fontSize:12, cursor:"pointer", fontWeight:on?600:400, whiteSpace:"nowrap" });
const btn = (p, danger) => ({ background:danger?"#1a0808":p?`linear-gradient(135deg,${T.purpleD},${T.purpleL})`:"#111120", border:danger?"1px solid #ff444433":p?"none":`1px solid ${T.border2}`, borderRadius:10, padding:"12px 20px", color:danger?T.red:p?"#fff":T.muted, fontSize:14, fontWeight:p||danger?700:400, cursor:"pointer", width:"100%", marginBottom:10 });
const lbl = { fontSize:9, letterSpacing:2, color:T.dim, textTransform:"uppercase", marginBottom:8, display:"block" };
const inp = { width:"100%", background:T.surface, border:`1px solid ${T.border2}`, borderRadius:10, padding:"11px 14px", color:T.text, fontSize:14, outline:"none", boxSizing:"border-box", WebkitAppearance:"none" };
const tag = (col) => ({ background:`${col}25`, color:col, borderRadius:20, padding:"2px 9px", fontSize:9, fontWeight:700, letterSpacing:.5 });
const divider = { height:1, background:T.border, margin:"18px 0" };

// ══════════════════════════════════════════════
export default function App({ user, profile: cloudProfile, onProfileUpdate, onSignOut, supabase }) {
  // ── TEMA ──
  const [themeMode, setThemeMode] = useStorage("jigger-theme", "auto");
  const T = useMemo(() => {
    if (themeMode === "auto") return getAutoTheme() === "light" ? LIGHT_THEME : DARK_THEME;
    return themeMode === "light" ? LIGHT_THEME : DARK_THEME;
  }, [themeMode]);

  const [tab, setTab] = useState("builder");
  const [cristalDetail, setCristalDetail] = useState(null);
  const [detail, setDetail] = useState(null);
  const [techDetail, setTechDetail] = useState(null);

  const [customs, setCustoms] = useState([]);
  const [favs, setFavs] = useState([]);
  const [profile, setProfile] = useState(cloudProfile || { name:"", city:"", cert:"", bio:"", photo_url:"" });
  const [notes, setNotes] = useStorage("jigger-notes-v2", {});
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    // Nombres alternativos para los que no coinciden exactamente en TheCocktailDB
    const CDB_NAME = {
      "b52":             "B-52",
      "dark-stormy":     "Dark n Stormy",
      "tommy-margarita": "Tommy's Margarita",
      "naked-famous":    "Naked and Famous",
      "pornstar-martini":"Pornstar Martini",
      "russian-spring":  "Russian Spring Punch",
      "vieux-carre":     "Vieux Carré",
      "spritz-veneziano":"Spritz Veneziano",
      "sex-on-beach":    "Sex on the Beach",
      "lemon-drop":      "Lemon Drop",
      "brandy-crusta":   "Brandy Crusta",
      "porto-flip":      "Porto Flip",
      "hanky-panky":     "Hanky Panky",
      "clover-club":     "Clover Club",
      "bee-s-knees":     "Bee's Knees",
      "bees-knees":      "Bee's Knees",
      "john-collins":    "John Collins",
      "mary-pickford":   "Mary Pickford",
      "monkey-gland":    "Monkey Gland",
      "planter-punch":   "Planter's Punch",
      "angel-face":      "Angel Face",
      "between-sheets":  "Between the Sheets",
      "golden-dream":    "Golden Dream",
      "grasshopper":     "Grasshopper",
      "harvey-wallbanger":"Harvey Wallbanger",
      "mint-julep":      "Mint Julep",
      "new-york-sour":   "New York Sour",
      "paper-plane":     "Paper Plane",
      "french-martini":  "French Martini",
      "dirty-martini":   "Dirty Martini",
      "espresso-martini":"Espresso Martini",
      "champagne-cocktail":"Champagne Cocktail",
      "long-island":     "Long Island Tea",
      "tequila-sunrise": "Tequila Sunrise",
      "white-russian":   "White Russian",
      "black-russian":   "Black Russian",
      "mai-tai":         "Mai Tai",
      "pina-colada":     "Pina Colada",
      "moscow-mule":     "Moscow Mule",
      "sea-breeze":      "Sea Breeze",
      "aperol-spritz":   "Aperol Spritz",
    };

    IBA_DB.forEach(cocktail => {
      const searchName = CDB_NAME[cocktail.id] || cocktail.name;
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchName)}`)
        .then(r => r.json())
        .then(data => {
          const url = data.drinks?.[0]?.strDrinkThumb;
          if (url) setPhotos(p => ({ ...p, [cocktail.id]: url }));
        })
        .catch(() => {});
    });
  }, []);


  // ── Cargar datos de la nube ──
  useEffect(() => {
    if (!user || !supabase) return;
    // Sync profile
    if (cloudProfile) setProfile(cloudProfile);
    // Load customs from Supabase
    supabase.from("cocktails").select("*").eq("user_id", user.id).then(({ data }) => {
      if (data) setCustoms(data.map(c => ({ ...c, ingredients: c.ingredients || [], showMeasures: c.show_measures, photo: c.photo_url })));
    });
    // Load favs from Supabase
    supabase.from("favorites").select("cocktail_id").eq("user_id", user.id).then(({ data }) => {
      if (data) setFavs(data.map(f => f.cocktail_id));
    });
  }, [user, cloudProfile]);

  // Builder
  const [selected, setSelected] = useState([]);
  const [ingInput, setIngInput] = useState("");

  // Library
  const [searchLib, setSearchLib] = useState("");
  const [libCat, setLibCat] = useState("Todos");
  const [libMethod, setLibMethod] = useState("Todos");
  const [libBase, setLibBase] = useState("Todos");
  const [libABV, setLibABV] = useState("Todos");
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  // Glosario
  const [glosQ, setGlosQ] = useState("");

  // Calculator
  const [calcBase, setCalcBase] = useState(null);
  const [calcServings, setCalcServings] = useState(1);

  // Admin
  const [editTarget, setEditTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", ingredients:"", recipe:"", showMeasures:true, isPublic:false, method:"Shake", glass:"Cocktail", garnish:"", notes:"", photo:"", difficulty:"medium", time:"", pairing:"", noAlcohol:false });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  // Profile
  const [editProfile, setEditProfile] = useState(false);
  const [profileTab, setProfileTab] = useState("creaciones");
  const [profileForm, setProfileForm] = useState(profile);

  // Toast
  const [toast, setToast] = useState({ msg:"", visible:false });
  const showToast = (msg) => { setToast({ msg, visible:true }); setTimeout(() => setToast(t=>({...t,visible:false})), 2200); };

  const allDB = useMemo(() => [...IBA_DB, ...customs.map(c=>({...c,cat:"Mis Creaciones",isCustom:true}))], [customs]);
  const bases = useMemo(() => ["Todos",...new Set(IBA_DB.map(c=>c.base).sort())], []);
  const toggleFav = async (id) => {
    const isFaved = favs.includes(id);
    setFavs(p => isFaved ? p.filter(x=>x!==id) : [...p, id]);
    if (user && supabase) {
      if (isFaved) {
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("cocktail_id", id);
      } else {
        await supabase.from("favorites").insert({ user_id: user.id, cocktail_id: id });
      }
    }
  };
  const isFav = (id) => favs.includes(id);

  // Builder matches
  const matches = useMemo(() => {
    if (!selected.length) return [];
    return allDB.map(c=>({...c,...matchScore(selected,c.ingredients)})).filter(c=>c.hits>0).sort((a,b)=>b.pct-a.pct||b.hits-a.hits).slice(0,8);
  }, [selected, allDB]);

  // Library filter
  const libFiltered = useMemo(() => allDB.filter(c => {
    if (showFavsOnly && !favs.includes(c.id)) return false;
    if (libCat!=="Todos"&&c.cat!==libCat) return false;
    if (libMethod!=="Todos"&&c.method!==libMethod) return false;
    if (libBase!=="Todos"&&c.base!==libBase) return false;
    if (libABV!=="Todos"&&c.abv!==libABV) return false;
    const q=searchLib.toLowerCase();
    if (q&&!c.name.toLowerCase().includes(q)&&!c.ingredients.some(i=>i.toLowerCase().includes(q))&&!(c.flavor||[]).some(f=>f.includes(q))) return false;
    return true;
  }), [allDB,libCat,libMethod,libBase,libABV,searchLib,showFavsOnly,favs]);

  // Ingredient suggestions
  const suggestions = useMemo(() => {
    if (!ingInput.trim()) return [];
    const q = ingInput.toLowerCase();
    return ALL_INGREDIENTS.filter(i=>i.toLowerCase().includes(q)&&!selected.includes(i)).slice(0,15);
  }, [ingInput, selected]);

  // Admin
  const openAdd = () => { setEditTarget(null); setForm({name:"",ingredients:"",recipe:"",showMeasures:true,isPublic:false,method:"Shake",glass:"Cocktail",garnish:"",notes:"",photo:"",difficulty:"medium",time:"",pairing:"",noAlcohol:false}); setPhotoPreview(null); setShowForm(true); };
  const openEdit = (c) => { setEditTarget(c); setForm({name:c.name,ingredients:c.ingredients.join(", "),recipe:c.recipe||"",showMeasures:c.showMeasures!==false,isPublic:c.is_public||false,method:c.method||"Shake",glass:c.glass||"Cocktail",garnish:c.garnish||"",notes:c.notes||"",photo:c.photo||"",difficulty:c.difficulty||"medium",time:c.time||"",pairing:c.pairing||"",noAlcohol:c.no_alcohol||false}); setPhotoPreview(c.photo_url||null); setShowForm(true); };
  const saveForm = async () => {
    if(!form.name||!form.ingredients) return;
    const ings = form.ingredients.split(",").map(s=>s.trim()).filter(Boolean);
    const entry = {
      name: form.name,
      ingredients: ings,
      recipe: form.showMeasures ? form.recipe : "",
      show_measures: form.showMeasures,
      method: form.method,
      glass: form.glass,
      garnish: form.garnish,
      notes: form.notes,
      photo_url: form.photo,
      is_public: form.isPublic || false,
      user_id: user?.id,
    };
    if (user && supabase) {
      if (editTarget) {
        const { data } = await supabase.from("cocktails").update(entry).eq("id", editTarget.id).select().single();
        if (data) setCustoms(p => p.map(c => c.id === editTarget.id ? {...data, ingredients: data.ingredients||[], showMeasures: data.show_measures, photo: data.photo_url} : c));
      } else {
        const { data } = await supabase.from("cocktails").insert(entry).select().single();
        if (data) setCustoms(p => [...p, {...data, ingredients: data.ingredients||[], showMeasures: data.show_measures, photo: data.photo_url}]);
      }
    } else {
      const local = {...entry, id: editTarget?.id||"c-"+Date.now(), showMeasures: entry.show_measures, photo: entry.photo_url};
      if(editTarget) setCustoms(p=>p.map(c=>c.id===editTarget.id?local:c)); else setCustoms(p=>[...p,local]);
    }
    showToast("✓ Guardado"); setShowForm(false);
  };
  const handlePhoto = (e) => { const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setPhotoPreview(ev.target.result);setForm(x=>({...x,photo:ev.target.result}));};r.readAsDataURL(f); };

  // ── CALCULATOR ──
  function parseRecipe(recipe) {
    if (!recipe) return [];
    return recipe.split("·").map(part => {
      const m = part.trim().match(/^([\d.]+)\s*cl\s+(.+)$/);
      return m ? { amount: parseFloat(m[1]), unit:"cl", name:m[2].trim() } : null;
    }).filter(Boolean);
  }

  // ═══════════════════════════════════
  // DETAIL VIEW
  // ═══════════════════════════════════
  if (detail) {
    const c = detail;
    const col = CAT_COLOR[c.cat]||T.purple;
    const detailPhoto = useCocktailPhoto(c, photos);
    const fav = isFav(c.id);
    const myNote = notes[c.id]||"";
    const parsed = parseRecipe(c.recipe);

    return (
      <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter',system-ui,sans-serif",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{padding:"16px 16px 0",background:T.bg,position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:14}}>
            <button onClick={()=>setDetail(null)} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:14,padding:0}}>← Volver</button>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{const t=shareRecipe(c);showToast("Receta copiada");}} style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:8,padding:"6px 10px",fontSize:13,cursor:"pointer"}}>📤 Compartir</button>
              <button onClick={()=>{toggleFav(c.id);showToast(fav?"Quitado":"❤️ Añadido a favoritos");}} style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:8,padding:"6px 10px",fontSize:16,cursor:"pointer"}}>{fav?"❤️":"🤍"}</button>
              {c.isCustom&&<button onClick={()=>{setDetail(null);openEdit(c);}} style={{background:"#1e1230",border:`1px solid ${T.purpleD}44`,borderRadius:8,padding:"6px 12px",color:T.purpleL,fontSize:12,cursor:"pointer"}}>✏️</button>}
            </div>
          </div>
        </div>

        <div style={{flex:1,padding:"0 16px 100px",overflowY:"auto"}}>
          {detailPhoto&&<img src={detailPhoto} alt={c.name} style={{width:"100%",borderRadius:14,marginBottom:16,maxHeight:240,objectFit:"cover",background:"#111"}}/>}

          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            <span style={tag(col)}>{CAT_LABEL[c.cat]||c.cat}</span>
            {c.abv&&<span style={tag(ABV_COLOR[c.abv])}>{ABV_LABEL[c.abv]}</span>}
            {c.isCustom&&<span style={tag(T.red)}>MI CREACIÓN</span>}
            {(c.flavor||[]).map(f=><span key={f} style={tag(T.muted)}>{f}</span>)}
          </div>

          <div style={{fontSize:26,fontWeight:900,marginBottom:2,letterSpacing:-0.5}}>{c.name}</div>
          <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
            <span style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:20,padding:"5px 13px",fontSize:12,color:T.muted}}>{METHOD_ICON[c.method]} {c.method}</span>
            <span style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:20,padding:"5px 13px",fontSize:12,color:T.muted}}>{GLASS_ICON[c.glass]||"🍶"} {GLASS_NAME[c.glass]||c.glass}</span>
          </div>

          <span style={lbl}>Ingredientes</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
            {c.ingredients.map(i=><span key={i} style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:20,padding:"5px 13px",fontSize:13,color:"#bbb"}}>{i}</span>)}
          </div>

          {/* Recipe */}
          {c.recipe&&c.showMeasures!==false&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={lbl}>Receta</span>
              </div>
              <div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:"14px 16px",fontFamily:"monospace",fontSize:13,color:T.purpleL,lineHeight:2,marginBottom:20}}>{c.recipe}</div>

              {/* Calculator */}
              {parsed.length>0&&(
                <div style={{background:"#0a0a16",border:`1px solid ${T.purpleD}44`,borderRadius:12,padding:"16px",marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <span style={{fontSize:12,fontWeight:700,color:T.purpleL}}>🧮 Calculadora de raciones</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <button onClick={()=>setCalcServings(s=>Math.max(1,s-1))} style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:20,width:28,height:28,color:T.text,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{fontSize:16,fontWeight:800,minWidth:24,textAlign:"center"}}>{calcServings}</span>
                      <button onClick={()=>setCalcServings(s=>Math.min(50,s+1))} style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:20,width:28,height:28,color:T.text,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      <span style={{fontSize:11,color:T.dim}}>{calcServings===1?"ración":"raciones"}</span>
                    </div>
                  </div>
                  {parsed.map((p,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
                      <span style={{color:T.muted}}>{p.name}</span>
                      <span style={{color:T.purpleL,fontWeight:700,fontFamily:"monospace"}}>{(p.amount*calcServings).toFixed(1)} cl</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",fontSize:13}}>
                    <span style={{color:T.muted}}>Total alcohol est.</span>
                    <span style={{color:T.amber,fontWeight:700,fontFamily:"monospace"}}>{(parsed.reduce((a,p)=>a+p.amount,0)*calcServings).toFixed(1)} cl</span>
                  </div>
                </div>
              )}
            </>
          )}
          {c.showMeasures===false&&<div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:"12px 16px",fontSize:13,color:T.dim,marginBottom:20,fontStyle:"italic"}}>El bartender no ha publicado las proporciones exactas.</div>}

          {c.garnish&&<><span style={lbl}>Garnish</span><div style={{fontSize:13,color:"#aaa",marginBottom:20}}>{c.garnish}</div></>}
          {c.notes&&<><span style={lbl}>Notas del bartender</span><div style={{fontSize:13,color:"#aaa",lineHeight:1.7,marginBottom:20}}>{c.notes}</div></>}

          <div style={divider}/>
          <span style={lbl}>Mis notas personales</span>
          <textarea value={myNote} onChange={e=>setNotes(p=>({...p,[c.id]:e.target.value}))} placeholder="Tus propias proporciones, tu twist, observaciones…" style={{...inp,minHeight:80,resize:"vertical",fontSize:13,lineHeight:1.6}}/>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════
  // CRISTALERÍA DETAIL
  // ═══════════════════════════════════
  if (cristalDetail) {
    const cr = cristalDetail;
    return (
      <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter',system-ui,sans-serif",maxWidth:480,margin:"0 auto"}}>
        <div style={{padding:"16px 16px 0",position:"sticky",top:0,background:T.bg}}>
          <button onClick={()=>setCristalDetail(null)} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:14,padding:0,paddingBottom:14}}>← Volver</button>
        </div>
        <div style={{padding:"0 16px 80px"}}>
          {cr.photo
            ? <img src={cr.photo} alt={cr.name} style={{width:"100%",height:220,objectFit:"cover",borderRadius:14,marginBottom:16,background:"#111"}}/>
            : <div style={{fontSize:60,marginBottom:12,textAlign:"center"}}>{cr.emoji}</div>
          }
          <div style={{fontSize:26,fontWeight:900,marginBottom:2,textAlign:"center"}}>{cr.name}</div>
          <div style={{fontSize:13,color:T.muted,textAlign:"center",marginBottom:6}}>{cr.aka}</div>
          <div style={{...tag(T.purple),display:"block",textAlign:"center",width:"fit-content",margin:"0 auto 20px"}}>{cr.capacidad}</div>

          <span style={lbl}>Descripción</span>
          <p style={{fontSize:14,color:T.muted,lineHeight:1.8,marginBottom:20}}>{cr.desc}</p>

          <span style={lbl}>Cuándo usarla</span>
          <div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:12,padding:"14px 16px",fontSize:13,color:T.text,lineHeight:1.7,marginBottom:20}}>{cr.uso}</div>

          <span style={lbl}>Cócteles clásicos en esta copa</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
            {cr.cocktails.map(c=><span key={c} style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:20,padding:"5px 13px",fontSize:12,color:T.text}}>{c}</span>)}
          </div>

          <span style={lbl}>Consejo pro</span>
          <div style={{background:`${T.purple}12`,border:`1px solid ${T.purple}33`,borderRadius:12,padding:"14px 16px",fontSize:13,color:T.purple,lineHeight:1.7}}>💡 {cr.tip}</div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════
  // TÉCNICA DETAIL
  // ═══════════════════════════════════
  if (techDetail) {
    const t = techDetail;
    return (
      <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter',system-ui,sans-serif",maxWidth:480,margin:"0 auto"}}>
        <div style={{padding:"16px 16px 0",position:"sticky",top:0,background:T.bg}}>
          <button onClick={()=>setTechDetail(null)} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:14,padding:0,paddingBottom:14}}>← Volver</button>
        </div>
        <div style={{padding:"0 16px 80px"}}>
          <div style={{fontSize:52,marginBottom:12}}>{t.icon}</div>
          <span style={{...tag(t.color),display:"inline-block",marginBottom:10}}>{t.subtitle}</span>
          <div style={{fontSize:26,fontWeight:900,marginBottom:20}}>{t.name}</div>
          <span style={lbl}>Qué es</span>
          <p style={{fontSize:14,color:"#aaa",lineHeight:1.8,marginBottom:20}}>{t.desc}</p>
          <span style={lbl}>Cuándo usarlo</span>
          <div style={{background:T.surface,border:`1px solid ${t.color}33`,borderRadius:12,padding:"14px 16px",fontSize:13,color:"#bbb",lineHeight:1.7,marginBottom:20}}>{t.cuando}</div>
          <span style={lbl}>Consejo pro</span>
          <div style={{background:`${t.color}12`,border:`1px solid ${t.color}44`,borderRadius:12,padding:"14px 16px",fontSize:13,color:t.color,lineHeight:1.7}}>💡 {t.tip}</div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════
  // ADMIN PANEL
  // ═══════════════════════════════════
  // MAIN APP
  // ═══════════════════════════════════

  // ── COCKTAIL CARD ──
  const CocktailCard = ({c}) => {
    const col = CAT_COLOR[c.cat]||T.purple;
    const fav = isFav(c.id);
    const photo = useCocktailPhoto(c);
    return (
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",marginBottom:10,cursor:"pointer"}} onClick={()=>setDetail(c)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          {photo&&<img src={photo} alt="" style={{width:48,height:48,borderRadius:10,objectFit:"cover",flexShrink:0}}/>}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:3}}>{c.name}</div>
            <div style={{fontSize:11,color:T.muted}}>{METHOD_ICON[c.method]} {c.method} · {c.ingredients.slice(0,3).join(", ")}{c.ingredients.length>3?"…":""}</div>
            {c.isCustom&&profile?.name&&<div style={{fontSize:10,color:T.purple,marginTop:2}}>por {profile.name}{profile.cert?` · ${profile.cert}`:""}</div>}
            {(c.flavor||[]).length>0&&<div style={{display:"flex",gap:4,marginTop:5,flexWrap:"wrap"}}>{(c.flavor||[]).slice(0,3).map(f=><span key={f} style={{background:`${T.dim}20`,color:T.dim,borderRadius:20,padding:"2px 7px",fontSize:8,fontWeight:700}}>{f}</span>)}</div>}
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
            <button onClick={e=>{e.stopPropagation();toggleFav(c.id);showToast(fav?"Quitado":"❤️ Favorito");}} style={{background:"none",border:"none",fontSize:15,cursor:"pointer",padding:2}}>{fav?"❤️":"🤍"}</button>
            <span style={{background:`${col}25`,color:col,borderRadius:20,padding:"2px 9px",fontSize:9,fontWeight:700,letterSpacing:.5}}>{CAT_LABEL[c.cat]||"MÍO"}</span>
          </div>
        </div>
      </div>
    );
  };

  const appShell = { minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Inter',system-ui,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" };
  const globalStyle = `
    @keyframes heartPop { 0%{transform:scale(1)} 50%{transform:scale(1.4)} 100%{transform:scale(1)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    * { -webkit-tap-highlight-color: transparent; }
    ::-webkit-scrollbar { display:none; }
    select, input, textarea { font-family: inherit; }
  `;

  return (
    <div style={appShell}>
      <style>{globalStyle}</style>
      {/* TOAST */}
      <div style={{position:"fixed",top:16,left:"50%",transform:`translateX(-50%) translateY(${toast.visible?0:-60}px)`,background:"#1a1030",border:`1px solid ${T.purpleD}55`,borderRadius:20,padding:"8px 18px",color:T.purpleL,fontSize:13,fontWeight:600,zIndex:999,transition:"transform .25s",whiteSpace:"nowrap",pointerEvents:"none"}}>
        {toast.msg}
      </div>

      {/* TOPBAR */}
      <div style={{padding:"16px 16px 0",background:T.bg,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:14}}>
          <div>
            <span style={{fontSize:18,fontWeight:900,letterSpacing:3,color:"#fff",fontVariant:"small-caps"}}>JIGGER</span>
            <span style={{fontSize:8,color:"#1e1e38",letterSpacing:2,marginLeft:10,textTransform:"uppercase"}}>Bartender Community</span>
          </div>
          <button onClick={()=>setThemeMode(m => m==="dark"?"light":m==="light"?"auto":"dark")} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 10px",color:T.dim,fontSize:13,cursor:"pointer"}}>
            {themeMode==="dark"?"🌙":themeMode==="light"?"☀️":"🌓"}
          </button>
        </div>
      </div>

      {/* ─── BUILDER ─── */}
      {tab==="builder"&&(
        <div style={{flex:1,padding:"0 16px 100px",overflowY:"auto"}}>
          <div style={{fontSize:22,fontWeight:900,marginBottom:2}}>¿Qué tienes en barra?</div>
          <div style={{fontSize:13,color:T.muted,marginBottom:16}}>Selecciona ingredientes y encuentra tu cóctel</div>

          {selected.length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 12px"}}>
              {selected.map(i=>(
                <button key={i} onClick={()=>setSelected(p=>p.filter(x=>x!==i))} style={{background:"#1e1230",border:`1px solid ${T.purpleD}44`,borderRadius:20,padding:"5px 12px",color:T.purpleL,fontSize:13,cursor:"pointer"}}>{i} ✕</button>
              ))}
              <button onClick={()=>setSelected([])} style={{background:"none",border:"none",color:T.dim,fontSize:11,cursor:"pointer",padding:"5px 4px"}}>Limpiar</button>
            </div>
          )}

          <input value={ingInput} onChange={e=>setIngInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&ingInput.trim()){setSelected(p=>[...new Set([...p,ingInput.trim()])]);setIngInput("");}}}
            placeholder="Buscar ingrediente…" style={{...inp,marginBottom:10}}/>

          {suggestions.length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
              {suggestions.map(i=>(
                <button key={i} onClick={()=>{setSelected(p=>[...new Set([...p,i])]);setIngInput("");}} style={chip(false)}>{i}</button>
              ))}
              {!ALL_INGREDIENTS.some(i=>i.toLowerCase()===ingInput.toLowerCase())&&ingInput.trim()&&(
                <button onClick={()=>{setSelected(p=>[...new Set([...p,ingInput.trim()])]);setIngInput("");}} style={chip(false,T.amber)}>+ "{ingInput.trim()}"</button>
              )}
            </div>
          )}

          {!ingInput&&!selected.length&&(
            <>
              <span style={lbl}>Bases</span>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
                {["Gin","Vodka","Ron blanco","Tequila","Mezcal","Bourbon","Campari","Aperol","Cachaça","Champagne","Cognac","Pisco"].map(i=>(
                  <button key={i} onClick={()=>setSelected(p=>[...new Set([...p,i])])} style={chip(false)}>{i}</button>
                ))}
              </div>
              <span style={lbl}>Modificadores</span>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
                {["Vermouth dulce","Vermouth seco","Triple sec","Zumo de limón","Zumo de lima","Zumo de naranja","Sirope simple","Angostura bitters","Agua con gas","Ginger beer","Menta","Kahlúa","Maraschino"].map(i=>(
                  <button key={i} onClick={()=>setSelected(p=>[...new Set([...p,i])])} style={chip(false)}>{i}</button>
                ))}
              </div>
            </>
          )}

          {matches.length>0&&(
            <>
              <div style={divider}/>
              <span style={lbl}>{matches[0]?.pct===1?"Coincidencia exacta ✓":"Mejores coincidencias"}</span>
              {matches.map((c,i)=>{
                const col=CAT_COLOR[c.cat]||T.purple;
                const top=i===0;
                return (
                  <div key={c.id} style={card(top,top?T.purpleD+"44":undefined)} onClick={()=>setDetail(c)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        {top&&<span style={tag(col)}>MEJOR MATCH</span>}
                        <span style={{fontSize:10,color:T.dim}}>{METHOD_ICON[c.method]} {c.method}</span>
                      </div>
                      <span style={{fontSize:12,color:c.pct===1?T.green:c.pct>.6?T.amber:T.muted,fontWeight:700,fontFamily:"monospace"}}>{c.hits}/{c.total}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      {(c.photo||c.photo_url)&&<img src={c.photo||c.photo_url} alt="" style={{width:36,height:36,borderRadius:8,objectFit:"cover",flexShrink:0}}/>}
                      <div style={{fontSize:top?19:15,fontWeight:800}}>{c.name}</div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {c.ingredients.map(ing=>{
                        const hit=selected.some(s=>ing.toLowerCase().includes(s.toLowerCase())||s.toLowerCase().includes(ing.toLowerCase().split(" ").pop()));
                        return <span key={ing} style={{fontSize:11,color:hit?T.purpleL:"#2a2a45",background:hit?"#1e1230":"transparent",borderRadius:10,padding:"2px 6px"}}>{ing}</span>;
                      })}
                    </div>
                    {c.pct<1&&<div style={{fontSize:11,color:T.dim,marginTop:8}}>Falta: {c.ingredients.filter(i=>!selected.some(s=>i.toLowerCase().includes(s.toLowerCase()))).join(", ")}</div>}
                  </div>
                );
              })}
            </>
          )}

          {selected.length>0&&matches.length===0&&(
            <div style={{background:T.card,border:`1px solid ${T.amber}33`,borderRadius:14,padding:20,marginTop:8}}>
              <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>Combinación sin nombre en la IBA 🤔</div>
              <div style={{fontSize:13,color:T.muted,marginBottom:14}}>Puede que sea una creación tuya. ¿La guardamos?</div>
              <button onClick={()=>{setTab("perfil");openAdd();}} style={{background:`${T.amber}20`,border:`1px solid ${T.amber}44`,borderRadius:10,padding:"10px 16px",color:T.amber,fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"}}>
                ✦ Crear este cóctel
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── LIBRARY ─── */}
      {tab==="library"&&(
        <div style={{flex:1,padding:"0 16px 100px",overflowY:"auto"}}>
          <input value={searchLib} onChange={e=>setSearchLib(e.target.value)} placeholder="Buscar por nombre, ingrediente o sabor…" style={{...inp,marginBottom:10}}/>

          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:6,scrollbarWidth:"none"}}>
            {["Todos","Unforgettables","Contemporary Classics","New Era","Mis Creaciones"].map(cat=>(
              <button key={cat} onClick={()=>setLibCat(cat)} style={chip(libCat===cat)}>
                {cat==="Contemporary Classics"?"Classics":cat}
              </button>
            ))}
          </div>

          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:6,scrollbarWidth:"none"}}>
            {["Todos","Shake","Stir","Build","Muddle","Blend"].map(m=>(
              <button key={m} onClick={()=>setLibMethod(m)} style={chip(libMethod===m)}>{m}</button>
            ))}
          </div>

          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:10,scrollbarWidth:"none"}}>
            <button onClick={()=>setLibABV("Todos")} style={chip(libABV==="Todos")}>ABV todos</button>
            <button onClick={()=>setLibABV("low")} style={chip(libABV==="low",T.green)}>🟢 Bajo</button>
            <button onClick={()=>setLibABV("medium")} style={chip(libABV==="medium",T.amber)}>🟡 Medio</button>
            <button onClick={()=>setLibABV("high")} style={chip(libABV==="high",T.red)}>🔴 Alto</button>
            <button onClick={()=>setShowFavsOnly(!showFavsOnly)} style={chip(showFavsOnly,T.red)}>❤️ Favoritos</button>
          </div>

          <span style={lbl}>{libFiltered.length} cócteles</span>
          {libFiltered.map(c=><CocktailCard key={c.id} c={c}/>)}
          {!libFiltered.length&&<div style={{color:T.dim,fontSize:13,textAlign:"center",padding:"40px 0"}}>Sin resultados para ese filtro.</div>}
        </div>
      )}

      {/* ─── COMUNIDAD ─── */}
      {tab==="community"&&(
        <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center"}}>
          <div style={{fontSize:56, marginBottom:16}}>🌍</div>
          <div style={{fontSize:22, fontWeight:900, marginBottom:8}}>Comunidad</div>
          <div style={{fontSize:13, color:T.muted, lineHeight:1.7, marginBottom:24, maxWidth:280}}>
            Pronto podrás compartir tus creaciones con otros bartenders, ver sus recetas, comentar y conectar con la comunidad.
          </div>
          <div style={{background:`${T.purple}15`, border:`1px solid ${T.purple}33`, borderRadius:14, padding:"14px 20px", fontSize:12, color:T.purple, fontWeight:600}}>
            🚧 Próximamente · Chat global · Feed de creaciones · Comunidad de bartenders
          </div>
        </div>
      )}

      {/* ─── TÉCNICAS ─── */}
      {tab==="tecnicas"&&(
        <div style={{flex:1,padding:"0 16px 100px",overflowY:"auto"}}>
          <div style={{fontSize:20,fontWeight:900,marginBottom:4}}>Técnicas de barra</div>
          <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Las bases que todo bartender debe dominar.</div>
          {TECNICAS.map(t=>(
            <div key={t.id} style={{...card(false),borderLeft:`3px solid ${t.color}`}} onClick={()=>setTechDetail(t)}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{fontSize:30,flexShrink:0}}>{t.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:800,marginBottom:2}}>{t.name}</div>
                  <div style={{fontSize:12,color:T.muted}}>{t.subtitle}</div>
                </div>
                <span style={{color:T.dim,fontSize:18}}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── CRISTALERÍA ─── */}
      {tab==="cristaleria"&&(
        <div style={{flex:1,padding:"0 16px 100px",overflowY:"auto"}}>
          <div style={{fontSize:20,fontWeight:900,marginBottom:4}}>Cristalería</div>
          <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Las copas y vasos de la coctelería clásica.</div>
          {CRISTALERIA.map(cr=>(
            <div key={cr.id} style={{...card(false),padding:0,overflow:"hidden",borderLeft:`3px solid ${T.purple}`}} onClick={()=>setCristalDetail(cr)}>
              <div style={{display:"flex",alignItems:"center",gap:0}}>
                <div style={{width:80,height:80,flexShrink:0,overflow:"hidden",background:"#111"}}>
                  {cr.photo
                    ? <img src={cr.photo} alt={cr.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{cr.emoji}</div>
                  }
                </div>
                <div style={{flex:1,padding:"12px 14px"}}>
                  <div style={{fontSize:15,fontWeight:800,marginBottom:2}}>{cr.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{cr.aka} · {cr.capacidad}</div>
                  <div style={{fontSize:11,color:T.dim,marginTop:4}}>{cr.cocktails.slice(0,3).join(", ")}{cr.cocktails.length>3?"…":""}</div>
                </div>
                <span style={{color:T.dim,fontSize:18,paddingRight:14}}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── GLOSARIO ─── */}
      {tab==="glosario"&&(
        <div style={{flex:1,padding:"0 16px 100px",overflowY:"auto"}}>
          <div style={{fontSize:20,fontWeight:900,marginBottom:4}}>Glosario</div>
          <input value={glosQ} onChange={e=>setGlosQ(e.target.value)} placeholder="Buscar término…" style={{...inp,marginBottom:16}}/>
          {GLOSARIO.filter(g=>!glosQ||g.term.toLowerCase().includes(glosQ.toLowerCase())||g.def.toLowerCase().includes(glosQ.toLowerCase())).map(item=>(
            <div key={item.term} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${T.border}`}}>
              <div style={{fontSize:14,fontWeight:800,color:T.purpleL,marginBottom:4}}>{item.term}</div>
              <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>{item.def}</div>
            </div>
          ))}
        </div>
      )}

      {/* ─── PERFIL ─── */}
      {tab==="perfil"&&(
        <div style={{flex:1,overflowY:"auto"}}>

          {/* ── FORM MODAL ── */}
          {showForm&&(
            <div style={{position:"fixed",inset:0,background:"#000c",zIndex:50,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
              <div style={{background:T.bg,borderRadius:"20px 20px 0 0",padding:"20px 16px",maxHeight:"90vh",overflowY:"auto"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={{fontSize:16,fontWeight:800}}>{editTarget?"Editar cóctel":"Nuevo cóctel"}</div>
                  <button onClick={()=>{setShowForm(false);setEditTarget(null);}} style={{background:"none",border:"none",color:T.dim,fontSize:22,cursor:"pointer"}}>✕</button>
                </div>

                <span style={lbl}>Nombre *</span>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="" style={{...inp,marginBottom:14}}/>
                {form.name&&IBA_DB.some(c=>c.name.toLowerCase()===form.name.toLowerCase())&&(
                  <div style={{background:"#1a1200",border:"1px solid #fbbf2444",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:T.amber}}>⚠️ Este nombre coincide con un cóctel IBA clásico. ¿Seguro que es una creación propia?</div>
                )}

                <span style={lbl}>Ingredientes * (separados por coma)</span>
                <input value={form.ingredients} onChange={e=>setForm(f=>({...f,ingredients:e.target.value}))} placeholder="" style={{...inp,marginBottom:14}}/>

                <div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:form.showMeasures?12:0}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>Publicar medidas exactas</div>
                      <div style={{fontSize:11,color:T.dim,marginTop:2}}>Puedes guardar tu receta en secreto</div>
                    </div>
                    <div onClick={()=>setForm(f=>({...f,showMeasures:!f.showMeasures}))} style={{width:44,height:24,background:form.showMeasures?T.purple:T.border2,borderRadius:20,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:3,left:form.showMeasures?22:3,width:18,height:18,background:"#fff",borderRadius:"50%",transition:"left .2s"}}/>
                    </div>
                  </div>
                  {form.showMeasures&&<input value={form.recipe} onChange={e=>setForm(f=>({...f,recipe:e.target.value}))} placeholder="" style={inp}/>}
                </div>

                <div style={{display:"flex",gap:10,marginBottom:14}}>
                  <div style={{flex:1}}>
                    <span style={lbl}>Método</span>
                    <select value={form.method} onChange={e=>setForm(f=>({...f,method:e.target.value}))} style={inp}>{METHODS.map(m=><option key={m}>{m}</option>)}</select>
                  </div>
                  <div style={{flex:1}}>
                    <span style={lbl}>Copa</span>
                    <select value={form.glass} onChange={e=>setForm(f=>({...f,glass:e.target.value}))} style={inp}>{GLASSES.map(g=><option key={g}>{g}</option>)}</select>
                  </div>
                </div>

                <div style={{display:"flex",gap:10,marginBottom:14}}>
                  <div style={{flex:1}}>
                    <span style={lbl}>Dificultad</span>
                    <select value={form.difficulty||"medium"} onChange={e=>setForm(f=>({...f,difficulty:e.target.value}))} style={inp}>
                      <option value="easy">Fácil</option>
                      <option value="medium">Medio</option>
                      <option value="advanced">Avanzado</option>
                    </select>
                  </div>
                  <div style={{flex:1}}>
                    <span style={lbl}>Tiempo</span>
                    <input value={form.time||""} onChange={e=>setForm(f=>({...f,time:e.target.value}))} placeholder="" style={inp}/>
                  </div>
                </div>

                <span style={lbl}>Garnish</span>
                <input value={form.garnish} onChange={e=>setForm(f=>({...f,garnish:e.target.value}))} placeholder="" style={{...inp,marginBottom:14}}/>

                <span style={lbl}>Maridaje / Momento ideal</span>
                <input value={form.pairing||""} onChange={e=>setForm(f=>({...f,pairing:e.target.value}))} placeholder="" style={{...inp,marginBottom:14}}/>

                <span style={lbl}>Historia / Notas</span>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="" style={{...inp,minHeight:72,resize:"vertical",marginBottom:14}}/>

                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:600}}>Sin alcohol (Mocktail)</div>
                  <div onClick={()=>setForm(f=>({...f,noAlcohol:!f.noAlcohol}))} style={{width:44,height:24,background:form.noAlcohol?T.green:T.border2,borderRadius:20,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                    <div style={{position:"absolute",top:3,left:form.noAlcohol?22:3,width:18,height:18,background:"#fff",borderRadius:"50%",transition:"left .2s"}}/>
                  </div>
                </div>

                <div style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>Publicar en la comunidad</div>
                      <div style={{fontSize:11,color:T.dim,marginTop:2}}>Otros bartenders podrán verlo</div>
                    </div>
                    <div onClick={()=>setForm(f=>({...f,isPublic:!f.isPublic}))} style={{width:44,height:24,background:form.isPublic?T.purple:T.border2,borderRadius:20,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:3,left:form.isPublic?22:3,width:18,height:18,background:"#fff",borderRadius:"50%",transition:"left .2s"}}/>
                    </div>
                  </div>
                  {form.isPublic&&<div style={{marginTop:8,fontSize:11,color:T.purple}}>✓ Aparecerá en la comunidad con tu nombre</div>}
                </div>

                <span style={lbl}>Foto</span>
                <div style={{background:T.surface,border:`1px dashed ${T.border2}`,borderRadius:12,padding:16,textAlign:"center",marginBottom:16,position:"relative",cursor:"pointer",minHeight:72,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {photoPreview?<img src={photoPreview} alt="" style={{width:"100%",borderRadius:8,maxHeight:140,objectFit:"cover"}}/>:<div style={{color:T.dim,fontSize:13}}>📷 Añadir foto</div>}
                  <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setPhotoPreview(ev.target.result);setForm(x=>({...x,photo:ev.target.result}));};r.readAsDataURL(f);}} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
                </div>

                <button onClick={saveForm} disabled={!form.name||!form.ingredients} style={{...btn(true),opacity:(!form.name||!form.ingredients)?0.4:1}}>
                  {editTarget?"Guardar cambios":"Publicar cóctel"}
                </button>
              </div>
            </div>
          )}

          {!editProfile?(
            <>
              {/* HERO */}
              <div style={{background:`linear-gradient(160deg,#1a0a3a,${T.bg})`,padding:"28px 20px 20px",textAlign:"center",borderBottom:`1px solid ${T.border}`}}>
                <div style={{width:88,height:88,borderRadius:"50%",background:"linear-gradient(135deg,#6d28d9,#a855f7)",padding:2,margin:"0 auto 14px"}}>
                  <div style={{width:"100%",height:"100%",borderRadius:"50%",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,overflow:"hidden"}}>
                    {profile.photo?<img src={profile.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"👤"}
                  </div>
                </div>
                <div style={{fontSize:22,fontWeight:900,letterSpacing:-0.5}}>{profile.name||"Tu nombre"}</div>
                {profile.workplace&&<div style={{fontSize:12,color:T.purple,marginTop:3,fontWeight:600}}>📍 {profile.workplace}</div>}
                {profile.city&&<div style={{fontSize:12,color:T.muted,marginTop:2}}>{profile.city}</div>}
                {profile.cert&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${T.purple}20`,border:`1px solid ${T.purple}44`,borderRadius:20,padding:"4px 12px",marginTop:10}}><span style={{fontSize:10,color:T.purple,fontWeight:700}}>🏆 {profile.cert}</span></div>}
                {profile.bio&&<div style={{fontSize:13,color:T.muted,marginTop:12,lineHeight:1.7,maxWidth:300,margin:"12px auto 0"}}>{profile.bio}</div>}
              </div>

              {/* STATS */}
              <div style={{display:"flex",borderBottom:`1px solid ${T.border}`}}>
                {[["IBA",IBA_DB.length,"Clásicos",T.gold],["Creaciones",customs.length,"Propias",T.red],["Favoritos",favs.length,"Guardados",T.amber]].map(([n,v,sub,c])=>(
                  <div key={n} style={{flex:1,padding:"16px 8px",textAlign:"center",borderRight:`1px solid ${T.border}`}}>
                    <div style={{fontSize:22,fontWeight:900,color:c}}>{v}</div>
                    <div style={{fontSize:10,fontWeight:700,color:T.text,marginTop:1}}>{n}</div>
                    <div style={{fontSize:9,color:T.dim,letterSpacing:.5}}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* SUBTABS */}
              <div style={{padding:"0 16px 20px"}}>
                <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:16,marginLeft:-16,marginRight:-16,paddingLeft:16}}>
                  {[["creaciones","Mis Creaciones"],["favoritos","Favoritos"]].map(([t,l])=>(
                    <button key={t} onClick={()=>setProfileTab(t)} style={{padding:"12px 20px",background:"none",border:"none",borderBottom:`2px solid ${profileTab===t?T.purple:"transparent"}`,color:profileTab===t?T.purple:T.dim,fontSize:13,fontWeight:profileTab===t?700:400,cursor:"pointer"}}>
                      {l} ({t==="creaciones"?customs.length:favs.length})
                    </button>
                  ))}
                </div>

                {profileTab==="creaciones"&&(
                  <>
                    {!customs.length&&(
                      <div style={{background:T.card,border:`1px dashed ${T.border2}`,borderRadius:14,padding:28,textAlign:"center",color:T.dim,fontSize:13,lineHeight:1.7}}>
                        Tu carta de autor está vacía.<br/>Pulsa + para crear tu primer cóctel
                      </div>
                    )}
                    {customs.map(c=>{
                      const fav=isFav(c.id);
                      return (
                        <div key={c.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,marginBottom:10,overflow:"hidden"}}>
                          {c.photo_url&&<img src={c.photo_url} alt="" style={{width:"100%",height:140,objectFit:"cover"}}/>}
                          <div style={{padding:"14px 16px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                              <div>
                                <div style={{fontSize:16,fontWeight:800}}>{c.name}</div>
                                <div style={{fontSize:11,color:T.muted,marginTop:2}}>{c.method} · {c.glass}</div>
                              </div>
                              <span style={{background:c.is_public?`${T.green}20`:`${T.dim}20`,color:c.is_public?T.green:T.dim,borderRadius:20,padding:"2px 9px",fontSize:9,fontWeight:700}}>{c.is_public?"🌍 Público":"🔒 Privado"}</span>
                            </div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                              {(c.ingredients||[]).map(i=><span key={i} style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:20,padding:"3px 10px",fontSize:11,color:T.muted}}>{i}</span>)}
                            </div>
                            {c.show_measures!==false&&c.recipe&&<div style={{fontFamily:"monospace",fontSize:12,color:T.purple,lineHeight:1.8,marginBottom:10}}>{c.recipe}</div>}
                            {c.show_measures===false&&<div style={{fontSize:12,color:T.dim,fontStyle:"italic",marginBottom:10}}>Medidas no publicadas</div>}
                            {c.notes&&<div style={{fontSize:12,color:T.muted,lineHeight:1.6,marginBottom:10}}>{c.notes}</div>}
                            <div style={{display:"flex",gap:8}}>
                              <button onClick={()=>openEdit(c)} style={{flex:1,background:`${T.purple}22`,border:`1px solid ${T.purple}44`,borderRadius:10,padding:"9px",color:T.purple,fontSize:13,fontWeight:700,cursor:"pointer"}}>✏️ Editar</button>
                              <button onClick={()=>toggleFav(c.id)} style={{background:fav?`${T.red}22`:"none",border:`1px solid ${fav?T.red:T.border2}`,borderRadius:10,padding:"9px 14px",color:fav?T.red:T.dim,fontSize:14,cursor:"pointer"}}>{fav?"❤️":"🤍"}</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {profileTab==="favoritos"&&(
                  <>
                    {!favs.length&&(
                      <div style={{background:T.card,border:`1px dashed ${T.border2}`,borderRadius:14,padding:28,textAlign:"center",color:T.dim,fontSize:13,lineHeight:1.7}}>
                        Aún no tienes favoritos.<br/>Toca el ❤️ en cualquier cóctel para guardarlo aquí.
                      </div>
                    )}
                    {allDB.filter(c=>favs.includes(c.id)).map(c=><CocktailCard key={c.id} c={c}/>)}
                  </>
                )}
              </div>

              <div style={{padding:"0 16px 8px"}}>
                <button onClick={()=>openAdd()} style={{...btn(true),background:`linear-gradient(135deg,${T.purpleD},${T.purple})`}}>+ Crear cóctel</button>
                <button onClick={()=>{setProfileForm({...profile});setEditProfile(true);}} style={btn(false)}>✏️ Editar perfil</button>
                {onSignOut&&<button onClick={onSignOut} style={{background:"none",border:"1px solid #ff6b6b33",borderRadius:10,padding:"12px 20px",color:T.red,fontSize:14,cursor:"pointer",width:"100%",marginBottom:10}}>Cerrar sesión</button>}
              </div>
            </>
          ):(
            <div style={{padding:"20px 16px 0"}}>
              <div style={{fontSize:16,fontWeight:800,marginBottom:20}}>Editar perfil</div>
              <div style={{width:88,height:88,borderRadius:"50%",background:"linear-gradient(135deg,#6d28d9,#a855f7)",padding:2,margin:"0 auto 20px",position:"relative",cursor:"pointer"}}>
                <div style={{width:"100%",height:"100%",borderRadius:"50%",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,overflow:"hidden"}}>
                  {profileForm.photo?<img src={profileForm.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"📷"}
                </div>
                <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setProfileForm(p=>({...p,photo:ev.target.result}));r.readAsDataURL(f);}} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
              </div>
              <span style={lbl}>Nombre</span>
              <input value={profileForm.name||""} onChange={e=>setProfileForm(p=>({...p,name:e.target.value}))} placeholder="" style={{...inp,marginBottom:12}}/>
              <span style={lbl}>Ciudad</span>
              <input value={profileForm.city||""} onChange={e=>setProfileForm(p=>({...p,city:e.target.value}))} placeholder="" style={{...inp,marginBottom:12}}/>
              <span style={lbl}>Dónde trabajas <span style={{color:T.dim,fontWeight:400,fontSize:8}}>(opcional)</span></span>
              <input value={profileForm.workplace||""} onChange={e=>setProfileForm(p=>({...p,workplace:e.target.value}))} placeholder="" style={{...inp,marginBottom:12}}/>
              <span style={lbl}>Certificación</span>
              <input value={profileForm.cert||""} onChange={e=>setProfileForm(p=>({...p,cert:e.target.value}))} placeholder="" style={{...inp,marginBottom:12}}/>
              <span style={lbl}>Bio</span>
              <textarea value={profileForm.bio||""} onChange={e=>setProfileForm(p=>({...p,bio:e.target.value}))} placeholder="" style={{...inp,minHeight:80,resize:"vertical",marginBottom:16}}/>
              <button onClick={async()=>{
                setProfile(profileForm);
                setEditProfile(false);
                showToast("✓ Perfil guardado");
                if(user&&supabase){
                  await supabase.from("profiles").update({name:profileForm.name,city:profileForm.city,cert:profileForm.cert,bio:profileForm.bio,workplace:profileForm.workplace||""}).eq("id",user.id);
                  if(onProfileUpdate)onProfileUpdate(user.id);
                }
              }} style={btn(true)}>Guardar</button>
              <button onClick={()=>setEditProfile(false)} style={btn(false)}>Cancelar</button>
            </div>
          )}
        </div>
      )}

      {/* ─── NAV ─── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:20}}>
        {[["builder","🔍","Buscar"],["library","📖","Biblioteca"],["community","🌍","Comunidad"],["tecnicas","🍸","Técnicas"],["cristaleria","🥂","Copas"],["perfil","👤","Perfil"]].map(([t,icon,label])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"10px 2px 14px",background:"none",border:"none",borderTop:`2px solid ${tab===t?T.purpleL:"transparent"}`,color:tab===t?T.purpleL:"#2e2e50",fontSize:9,fontWeight:700,cursor:"pointer",letterSpacing:.5,textTransform:"uppercase",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:20}}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
