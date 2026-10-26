/** ============================================================
  OVERWATCH HERO ROULETTE - MAIN SCRIPT (CLEANED)
  ============================================================ */

const ROLES_ICONS = {
  'Damage': 'Role_Damage_Circle.svg',
  'Support': 'Role_Support_Circle.svg',
  'Tank': 'Role_Tank_Circle.svg',
};

let heroes;
let currentHero = null;

// ========================================================================
// INITIALIZATION
// ========================================================================

async function init() {
  const main = document.querySelector('main');
  
  try {
    const response = await fetch('/assets/heroes.json');
    
    if (!response.ok) throw new Error(`Failed to load heroes: ${response.statusText}`);
    
    heroes = await response.json();
    console.log('Heroes loaded:', heroes.length);
    
    RenderHeroList();
    SelectRandomHero();
    
  } catch (error) {
    console.error('Error loading heroes:', error);
    main.innerHTML = '<p style="color: #e74c3c;">Error loading hero data</p>';
  }
}

// ========================================================================
// CURRENT HERO
// ========================================================================

function RenderCurrentHero() {
  const heroInfo = document.getElementById('current-hero-info');
  
  if (!heroInfo) {
    console.error('Hero info element not found!');
    return;
  }
  
  let displayDiv = heroInfo.querySelector('#hero-display');
  
  if (!displayDiv && heroInfo.innerHTML.includes('No hero selected')) {
    displayDiv = heroInfo;
  }
  
  if (!displayDiv) {
    displayDiv = document.createElement('div');
    displayDiv.id = 'hero-display';
    heroInfo.appendChild(displayDiv);
  }
  
  // Show "no hero left" message if no hero is selected or all heroes are completed/blocked
  if (!currentHero) {
    displayDiv.innerHTML = '<p style="color: #e74c3c; text-align: center;">No hero is left to select</p>';
    return;
  }
  
  displayDiv.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: center;">
      <img src="/assets/heroes_images/${currentHero.image}" 
           alt="${currentHero.name}" 
           style="width: 100px; height: auto;" />
      
      ${ROLES_ICONS[currentHero.role] ? `
        <div style="display: flex; align-items: center;">
          <img src="/assets/roles_icons/${ROLES_ICONS[currentHero.role]}" 
               alt="${currentHero.role}" 
               style="width: 24px; height: auto;" />
        </div>` : ''}
      
      <div>${currentHero.name}</div>
    </div>
  `;
}

// ========================================================================
// HERO LIST
// ========================================================================

function RenderHeroList() {
  const list = document.createElement('div');
  list.className = 'hero-list';
  
  heroes.forEach((hero, index) => {
    list.appendChild(CreateHeroItem(hero, index));
  });
  
  const main = document.querySelector('main');
  main.innerHTML = '';
  main.appendChild(list);
}

function CreateHeroItem(hero, heroIndex) {
  const item = document.createElement('div');
  item.className = 'hero-item';
  if (hero.isBlocked) item.classList.add('blocked');
  if (hero.isCompleted) item.classList.add('completed');
  
  const infoCell = document.createElement('div');
  infoCell.className = 'hero-info';
  infoCell.appendChild(CreateImage(hero));
  infoCell.appendChild(CreateRoleIcon(hero));
  infoCell.appendChild(createName(hero));
  
  const btnCell = CreateButtonContainer(hero, heroIndex);
  
  item.appendChild(infoCell);
  item.appendChild(btnCell);
  
  return item;
}

function CreateImage(hero) {
  const img = document.createElement('img');
  img.src = `/assets/heroes_images/${hero.image}`;
  img.alt = hero.name;
  img.style.maxWidth = '64px';
  img.style.height = 'auto';
  return img;
}

function CreateRoleIcon(hero) {
  const cell = document.createElement('div');
  cell.className = 'role-cell';
  
  const src = ROLES_ICONS[hero.role] || '';
  const img = document.createElement('img');
  img.src = `/assets/roles_icons/${src}`;
  img.alt = hero.role;
  img.style.maxWidth = '24px';
  img.style.height = 'auto';
  
  cell.appendChild(img);
  return cell;
}

function createName(hero) {
  const div = document.createElement('div');
  div.className = 'name-cell';
  div.textContent = hero.name;
  return div;
}

// ========================================================================
// HERO BUTTON CONTAINER
// ========================================================================

function CreateButtonContainer(hero, heroIndex) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '10px';
  
  ['Select', 'Complete', 'Block'].forEach((text, i) => {
    const cell = document.createElement('div');
    cell.className = `button-cell ${['select-btn', 'complete-btn', 'block-btn'][i]}`;
    
    const button = document.createElement('button');
    button.textContent = text;
    
    // Disable select button if hero is completed or blocked
    const isDisabled = i === 0 && (hero.isCompleted || hero.isBlocked); // i=0 is Select
    if (isDisabled) {
      button.disabled = true;
      button.style.opacity = '0.5';
    }
    
    button.onclick = () => onButtonClick(heroIndex, i); 
    
    cell.appendChild(button);
    container.appendChild(cell);
  });
  
  return container;
}

// ========================================================================
// HERO BUTTON ACTIONS
// ========================================================================

function onButtonClick(heroIndex, buttonIndex) {
  const action = ['select-btn', 'complete-btn', 'block-btn'][buttonIndex];
  
  switch (action) {
    case 'select-btn':
      if (heroes[heroIndex].isCompleted || heroes[heroIndex].isBlocked) {return;}
      ToggleSelected(heroIndex);
      break;
    case 'complete-btn':
      ToggleCompleted(heroIndex);
      break;
    case 'block-btn':
      ToggleBlocked(heroIndex);
      break;
  }
}

function ToggleBlocked(heroIndex) {
  heroes[heroIndex].isBlocked = !heroes[heroIndex].isBlocked;
  console.log('Blocked state changed:', heroes[heroIndex]);
  
  updateVisualState(heroIndex);
}

function ToggleCompleted(heroIndex) {
  heroes[heroIndex].isCompleted = !heroes[heroIndex].isCompleted;
  console.log('Completed state changed:', heroes[heroIndex]);
  
  updateVisualState(heroIndex);
}

function ToggleSelected(heroIndex) {
  currentHero = heroes[heroIndex];
  console.log('Current hero selected:', currentHero);

  RenderCurrentHero();
}

// ========================================================================
// FOOTER ACTIONS
// ========================================================================

function SelectRandomHero() {
  // Get list of available heroes (not completed, not blocked)
  const availableHeroes = heroes.filter(hero => 
    !hero.isCompleted && !hero.isBlocked
  );
  
  if (availableHeroes.length === 0) {
    currentHero = null;
    RenderCurrentHero();
    console.log('No heroes available to select');
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * availableHeroes.length);
  currentHero = availableHeroes[randomIndex];
  RenderCurrentHero();
}

function SaveJSON() {
  const heroData = JSON.stringify(heroes, null, 2);
  const blob = new Blob([heroData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'OverwatchRoulette.json';
  link.click();
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
  console.log('JSON saved');
}

function LoadJSON() {
  if (!confirm('You will lose your current data. Continue?')) return;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = JSON.parse(event.target.result);
        
        if (!Array.isArray(data)) throw new Error('Invalid hero list');
        
        heroes = data;
        console.log('Heroes loaded:', heroes.length);
        RenderHeroList();
        RenderCurrentHero();
      };
      
      reader.onerror = () => {
        console.error('Failed to read file');
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error loading hero data:', error);
      alert('Failed to parse hero data. Please check the file format.');
    }
  };
  
  fileInput.click();
}

// ========================================================================
// UTILITY
// ========================================================================

function updateVisualState(heroIndex) {
  const item = document.querySelector(`.hero-item:nth-child(${heroIndex + 1})`);
  if (item) {
    item.classList.toggle('blocked', heroes[heroIndex].isBlocked);
    item.classList.toggle('completed', heroes[heroIndex].isCompleted);
  }
}

// ========================================================================
// ENTRY POINT
// ========================================================================

document.addEventListener('DOMContentLoaded', init);
