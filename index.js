const ROLES_ICONS = {
  "Damage" : "Role_Damage_Circle.svg",
  "Support" : "Role_Support_Circle.svg",
  "Tank" : "Role_Tank_Circle.svg",
}

//List of all heroes and current state
let heroes;

//Current selected hero
let currentHero;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch hero data from JSON file
    const response = await fetch('/assets/heroes.json');
    heroes = await response.json();

    console.log(heroes);
    CreateHeroList();

  } catch (error) {
    console.error('Error loading heroes:', error);
    document.querySelector('main').innerHTML = 
      '<p>Error loading hero data</p>';
  }
});


function CreateHeroList(){
  // Create a div container in the main section (replacing table)
  const main = document.querySelector('main');
  const heroList = document.createElement('div');
  heroList.className = 'hero-list';
  
  // Loop through heroes and create list entries
  heroes.forEach((hero, index) => {
    const item = document.createElement('div');
    item.className = `hero-item ${heroes[index].isBlocked ? 'blocked' : ''} ${heroes[index].isCompleted ? 'completed' : ''}`;
    
    // Hero info cell
    const heroInfoCell = document.createElement('div');
    heroInfoCell.className = 'hero-info';
    
    const heroImg = document.createElement('img');
    heroInfoCell.appendChild(heroImg);
    heroImg.src = `/assets/heroes_images/${hero.image}`;
    heroImg.alt = hero.name;
    heroImg.style.maxWidth = '100px';
    heroImg.style.height = 'auto';
    heroInfoCell.appendChild(heroImg);

    // Role cell
    const roleCell = document.createElement('div');
    roleCell.className = 'role-cell';
    
    const roleImg = document.createElement('img');
    roleCell.appendChild(roleImg);
    roleImg.src = `/assets/roles_icons/` + ROLES_ICONS[hero.role];
    roleImg.alt = hero.role;
    roleImg.style.maxWidth = '24px';
    roleImg.style.height = 'auto';
    
    // Name cell
    const nameCell = document.createElement('div');
    nameCell.className = 'name-cell';
    nameCell.textContent = hero.name;
    
    // SelectButton cell
    const selectButtonCell = document.createElement('div');
    selectButtonCell.className = 'button-cell';
    
    const selectButton = document.createElement('button');
    selectButton.textContent = "Select";
    selectButton.onclick = function() { ToggleHeroIsSelected(index); };
    selectButtonCell.appendChild(selectButton);

    // CompleteButton cell
    const completeButtonCell = document.createElement('div');
    completeButtonCell.className = 'button-cell';
    
    const completeButton = document.createElement('button');
    completeButton.textContent = "Complete";
    completeButton.onclick = function() { ToggleHeroIsCompleted(index); };
    completeButtonCell.appendChild(completeButton);

    // BlockButton cell
    const blockButtonCell = document.createElement('div');
    blockButtonCell.className = 'button-cell';
    
    const blockButton = document.createElement('button');
    blockButton.textContent = "Block";
    blockButton.onclick = function() { ToggleHeroIsBlocked(index); };
    blockButtonCell.appendChild(blockButton);

    // Assemble item
    item.appendChild(heroInfoCell);
    item.appendChild(roleCell);
    item.appendChild(nameCell);
    item.appendChild(selectButtonCell);
    item.appendChild(completeButtonCell);
    item.appendChild(blockButtonCell);

    heroList.appendChild(item);
  });

  // Append list to main content
  main.appendChild(heroList);
}


function RenderCurrentHero(){
  const main = document.querySelector('main');
  
  // Create or get hero info section at top of main
  let heroInfo = document.getElementById('current-hero-info');
  
  if (!heroInfo) {
    heroInfo = document.createElement('div');
    heroInfo.id = 'current-hero-info';
    main.insertBefore(heroInfo, main.firstChild);
    
    // Create the info container
    heroInfo.innerHTML = `<div id="hero-display"></div>`;
  }
  
  const displayDiv = document.getElementById('hero-display');
  
  if (!currentHero) {
    displayDiv.innerHTML = '<p style="color: #666; text-align: center;">No hero selected yet</p>';
    return;
  }
  
  // Hero Display
  displayDiv.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: center;">
      <img src="/assets/heroes_images/${currentHero.image}" 
           alt="${currentHero.name}" 
           style="width: 100px; height: auto;" />
      <div>
        ${currentHero.name}
      </div>
    </div>
  `;
}


function ToggleHeroIsBlocked(index){
  heroes[index].isBlocked = !(heroes[index].isBlocked);
  console.log(heroes[index]);
  const item = document.querySelector(`.hero-item:nth-child(${index + 1})`);
  if (item) {
    item.classList.toggle('blocked');
  }
}


function ToggleHeroIsCompleted(index){
  heroes[index].isCompleted = !(heroes[index].isCompleted);
  console.log(heroes[index]);
  const item = document.querySelector(`.hero-item:nth-child(${index + 1})`);
  if (item) {
    item.classList.toggle('completed');
  }
}


function ToggleHeroIsSelected(index){
  currentHero = heroes[index];
  console.log(currentHero);
  RenderCurrentHero();
}


function SelectRandomHero(){
  currentHero = heroes[Math.floor(Math.random() * heroes.length)];
  console.log(currentHero);
  RenderCurrentHero();
}


function SaveJSON(){
  const heroData = JSON.stringify(heroes, null, 2);
  
  // Create a temporary blob and download it
  const blob = new Blob([heroData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'OverwatchRoulette.json';
  link.click();

  console.log("Json Saved");
}


function LoadJSON(){
  if (!confirm('You will lose the current data. Continue?')) return;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        heroes = JSON.parse(event.target.result);
        console.log('Heroes loaded successfully:', heroes.length);
        CreateHeroList();
      } catch (error) {
        console.error('Error loading hero data:', error);
        alert('Failed to parse hero data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };
  
  // Trigger file picker
  fileInput.click();

  console.log("Json Loaded");
}