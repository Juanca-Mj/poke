const nameEl = document.getElementById("nombre_pokemon");
const imgEl  = document.getElementById("img");

async function peticionAPI() {
  // Pikachu por defecto
  const url = "https://pokeapi.co/api/v2/pokemon/pikachu";
  const res = await fetch(url);
  const datosPokemon = await res.json();

  // Imagen de mejor calidad si existe; respaldo a front_default
  const spriteDream = datosPokemon?.sprites?.other?.dream_world?.front_default;
  const spriteDefault = datosPokemon?.sprites?.front_default;
  const imgSrc = spriteDream || spriteDefault;

  nameEl.textContent = datosPokemon.name; // "pikachu"
  imgEl.src = imgSrc;
  imgEl.alt = `Imagen de ${datosPokemon.name}`;
}

peticionAPI();
