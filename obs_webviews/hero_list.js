const HERO_ICON_PATH = `../assets/heroes_images/`;

let heroes;

// ========================================================================
// INITIALIZATION
// ========================================================================

async function Init() {
  const main = document.querySelector('main');
  
  try {
    const response = await fetch('./../assets/heroes.json');
    
    if (!response.ok) throw new Error(`Failed to load heroes: ${response.statusText}`);
    
    heroes = await response.json();
    console.log('Heroes loaded:', heroes.length);

    RenderHeroGrid();
    
  } catch (error) {
    console.error('Error loading heroes:', error);
    main.innerHTML = '<p style="color: #e74c3c;">Error loading hero data</p>';
  }
}

function RenderHeroGrid() {
  grid = document.getElementById('hero-grid');
  
  heroes.forEach((hero, index) => {
    grid.appendChild(CreateHeroItem(hero, index));
  });
}

function CreateHeroItem(hero, heroIndex) {
  const item = document.createElement('div');
  item.className = 'hero-item';
  if (hero.isBlocked) item.classList.add('blocked');
  if (hero.isCompleted) item.classList.add('completed');
  

  item.appendChild(CreateImage(hero));
  
  return item;
}

function CreateImage(hero) {
  const img = document.createElement('img');
  img.src = HERO_ICON_PATH + hero.image;
  img.alt = hero.name;
  img.style.maxWidth = '32px';
  img.style.height = 'auto';
  return img;
}

// ========================================================================
// ENTRY POINT
// ========================================================================

document.addEventListener('DOMContentLoaded', Init);