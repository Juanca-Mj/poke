// Helpers
const $ = (id) => document.getElementById(id);

// Elementos
const titleEl   = $("title");
const nameEl    = $("pokemonName");
const imgEl     = $("pokemonImg");
const metaEl    = $("meta");
const statusEl  = $("status");
const formName  = $("formName");
const formId    = $("formId");
const nameInput = $("nameInput");
const idInput   = $("idInput");
const nameBtn   = $("nameBtn");
const idBtn     = $("idBtn");
const cardEl    = $("resultCard");

function setLoading(loading) {
  cardEl.classList.toggle("loading", loading);
  nameBtn.disabled = loading;
  idBtn.disabled = loading;
  statusEl.textContent = loading ? "Buscando..." : "";
}

function normalizeUnits(p) {
  // PokeAPI: height en decímetros; weight en hectogramos.
  // Convertimos a metros y kilogramos con 1 decimal para legibilidad.
  const heightM = (p.height ?? 0) / 10;
  const weightKg = (p.weight ?? 0) / 10;
  return {
    id: p.id,
    name: p.name,
    heightM: heightM.toFixed(1),
    weightKg: weightKg.toFixed(1),
    abilities: (p.abilities || []).map(a => a.ability?.name).filter(Boolean)
  };
}

function renderPokemon(info, foundBy = "name") {
  titleEl.textContent = "¡Pokémon Encontrado!";
  nameEl.textContent  = info.name;

  const spriteDream   = info?.sprites?.other?.dream_world?.front_default;
  const spriteDefault = info?.sprites?.front_default;
  imgEl.src = spriteDream || spriteDefault || "";
  imgEl.alt = `Imagen de ${info.name}`;

  const { id, heightM, weightKg, abilities } = normalizeUnits(info);
  metaEl.innerHTML = `
    <li><strong>ID:</strong> ${id}</li>
    <li><strong>Peso:</strong> ${weightKg} kg</li>
    <li><strong>Altura:</strong> ${heightM} m</li>
    <li><strong>Habilidades:</strong> ${
      abilities.length ? `<ul>${abilities.map(h => `<li>${h}</li>`).join("")}</ul>` : "—"
    }</li>
  `;

  statusEl.textContent = foundBy === "id" ? "Resultado por ID." : "Resultado por nombre.";
}

async function fetchPokemon(identifier) {
  const url = `https://pokeapi.co/api/v2/pokemon/${identifier}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se encontró el Pokémon (${res.status}).`);
  return res.json();
}

// Búsqueda por nombre (texto libre)
formName.addEventListener("submit", async (e) => {
  e.preventDefault();
  const term = (nameInput.value || "").trim().toLowerCase();
  if (!term) { statusEl.textContent = "Escribe un nombre."; return; }

  try {
    setLoading(true);
    const data = await fetchPokemon(term);
    renderPokemon(data, "name");
  } catch (err) {
    statusEl.textContent = err.message || "Error al buscar por nombre.";
  } finally {
    setLoading(false);
  }
});

// Búsqueda por ID (solo números)
formId.addEventListener("submit", async (e) => {
  e.preventDefault();
  const raw = (idInput.value || "").trim();
  if (!/^\d+$/.test(raw)) { statusEl.textContent = "El ID debe ser un número entero positivo."; return; }

  try {
    setLoading(true);
    const data = await fetchPokemon(raw);
    renderPokemon(data, "id");
  } catch (err) {
    statusEl.textContent = err.message || "Error al buscar por ID.";
  } finally {
    setLoading(false);
  }
});

// Cargar un Pokémon por defecto al iniciar (Pikachu)
(async function init() {
  try {
    setLoading(true);
    const data = await fetchPokemon("pikachu");
    renderPokemon(data, "name");
  } catch (err) {
    statusEl.textContent = "No se pudo cargar el Pokémon inicial.";
  } finally {
    setLoading(false);
  }
})();
