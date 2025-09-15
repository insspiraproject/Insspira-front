// scripts/seed-pins.js
//comando: node scripts/seed-pins.js
// Este script crea un usuario semilla, categorías y pins en la API REST.
// Requiere que la API esté corriendo (npm run dev).
// Usa las variables de entorno de NEXT_PUBLIC_API_URL para apuntar a la API si es necesario. 
/* Node 18+ trae fetch global */
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  users: "/users",
  categoryCreate: "/category", // <-- SOLO POST
  pin: "/pin",
};

// usuario semilla
const RAND = Math.random().toString(36).slice(2, 7);
const seedUser = {
  name: "Seeder User",
  username: `seeduser_${RAND}`,
  email: `seed_${RAND}@insspira.dev`,
  password: "Aaa!1111",
  confirmPassword: "Aaa!1111",
  isAdmin: false,
};

// categorías (coinciden con tu back: Digital Art, Photography, Architecture, Creative, Tech)
const CATEGORY_NAMES = ["Photography", "Tech", "Architecture", "Digital Art", "Creative"];

// borradores de pins: asigna una de las categorías anteriores
const pinDrafts = [
  { image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", description: "Montañas al amanecer · tonos fríos · calma", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?q=80&w=1200&auto=format&fit=crop", description: "Flatlay workspace minimal · café + teclado", categoryName: "Tech" },
  { image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop", description: "Bosque con neblina · misterio y silencio", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop", description: "Arquitectura brutalista · líneas duras", categoryName: "Architecture" },
  { image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop", description: "Retrato con luz lateral · mirada intensa", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=1200&auto=format&fit=crop", description: "Zorro en la nieve · vida salvaje", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", description: "Hamburguesa gourmet · detalle jugoso", categoryName: "Creative" },
  { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop", description: "Playa turquesa · viaje de ensueño", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=1200&auto=format&fit=crop", description: "Circuitos y PCB · macro tech", categoryName: "Tech" },
  { image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1200&auto=format&fit=crop", description: "Catedral gótica · detalles elevados", categoryName: "Architecture" },
  { image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1200&auto=format&fit=crop", description: "Retrato en B/N · clásico", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1200&auto=format&fit=crop", description: "León en dorado · fuerza y nobleza", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop", description: "Tabla de quesos · food styling", categoryName: "Creative" },
  { image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop", description: "Carretera infinita · roadtrip", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop", description: "Laptop y código · dev life", categoryName: "Tech" },
  { image: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format&fit=crop", description: "Rascacielos · líneas y simetría", categoryName: "Architecture" },
  { image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop", description: "Retrato natural · luz suave", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop", description: "Gatito curioso · ternura", categoryName: "Photography" },
  { image: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=1200&auto=format&fit=crop", description: "Ensalada saludable · color y frescura", categoryName: "Creative" },
  { image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop", description: "Templos en Asia · aventura", categoryName: "Photography" },
];

// helpers
function extractToken(obj) {
  if (!obj || typeof obj !== "object") return null;
  return (
    obj.token ||
    obj.access_token ||
    obj.accessToken ||
    obj.jwt ||
    (obj.data && (obj.data.token || obj.data.access_token || obj.data.jwt)) ||
    null
  );
}
function extractUser(obj) {
  if (!obj || typeof obj !== "object") return null;
  return obj.user || obj.data?.user || (obj.id && obj.email ? obj : null) || null;
}
async function req(path, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = typeof data === "string" ? data : data?.message || `HTTP ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join(" | ") : msg);
  }
  return data;
}

async function registerOrLogin(user) {
  try {
    const reg = await req(ENDPOINTS.register, { method: "POST", body: user });
    const token = extractToken(reg);
    const userObj = extractUser(reg);
    if (token || userObj) return { token, user: userObj };
  } catch {}
  try {
    const log = await req(ENDPOINTS.login, { method: "POST", body: { email: user.email, password: user.password } });
    const token = extractToken(log);
    const userObj = extractUser(log);
    if (token || userObj) return { token, user: userObj };
  } catch {}
  try {
    const created = await req(ENDPOINTS.users, { method: "POST", body: user });
    return { token: null, user: extractUser(created) || created };
  } catch {
    const list = await req(ENDPOINTS.users).catch(() => null);
    const found = Array.isArray(list) ? list.find((u) => u.email === user.email) : null;
    if (found) return { token: null, user: found };
    throw new Error("No pude registrar ni loguear al usuario.");
  }
}

async function ensureUserId(auth, email) {
  if (auth?.user?.id) return auth.user.id;
  const list = await req(ENDPOINTS.users, { method: "GET", token: auth?.token });
  const found = Array.isArray(list) ? list.find((u) => u.email === email) : null;
  if (!found?.id) throw new Error("No encontré el usuario.");
  return found.id;
}

// crea categorías (solo POST /category)
async function createCategories(token) {
  const map = {};
  for (const name of CATEGORY_NAMES) {
    const created = await req(ENDPOINTS.categoryCreate, { method: "POST", token, body: { name } });
    if (!created?.id) throw new Error(`El POST /category no devolvió id (categoría: ${name}).`);
    map[name] = created.id;
  }
  return map;
}

function toPinsReady(drafts, catMap, userId) {
  return drafts.map((d) => ({
    image: d.image,
    description: d.description,
    categoryId: catMap[d.categoryName],
    userId,
  }));
}

// run
(async () => {
  try {
    console.log("→ Registrando/logueando usuario semilla…");
    const auth = await registerOrLogin(seedUser);
    console.log("   token:", auth.token ? "(recibido)" : "(no recibido, seguimos)");

    console.log("→ Obteniendo ID del usuario…");
    const userId = await ensureUserId(auth, seedUser.email);
    console.log("   userId:", userId);

    console.log("→ Creando categorías vía POST /category …");
    const catMap = await createCategories(auth.token);
    console.log("   categorías creadas:", Object.keys(catMap).length);

    console.log("→ Creando pins…");
    const pins = toPinsReady(pinDrafts, catMap, userId);
    for (const p of pins) {
      try {
        const created = await req(ENDPOINTS.pin, { method: "POST", token: auth.token, body: p });
        console.log("   OK ->", created?.id || "(sin id)");
      } catch (err) {
        console.error("   ERROR ->", err.message);
      }
    }
    console.log("✔ Seed finalizado.");
  } catch (e) {
    console.error("✖ Seed falló:", e.message);
    process.exit(1);
  }
})();
