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
  // Create a table in the main section
  const main = document.querySelector('main');
  const table = document.createElement('table');
  table.innerHTML = `<tbody></tbody>`;

  // Loop through heroes and create table entries
  const tbody = table.querySelector('tbody');
  heroes.forEach((hero, index) => {
    const row = document.createElement('tr');

    // Hero image cell
    const heroImageCell = document.createElement('td');

    const heroImg = document.createElement('img');
    heroImageCell.appendChild(heroImg);

    // Update image path to assets/heroes_images folder
    heroImg.src = `/assets/heroes_images/${hero.image}`;
    heroImg.alt = hero.name;
    heroImg.style.maxWidth = '100px';
    heroImg.style.height = 'auto';

    row.appendChild(heroImageCell);

    // Role cell
    const roleCell = document.createElement('td');

    const roleImg = document.createElement('img');
    roleCell.appendChild(roleImg);

    // Update image path to assets/roles_images folder
    roleImg.src = `/assets/roles_icons/` + ROLES_ICONS[hero.role];
    roleImg.alt = hero.role;
    roleImg.style.maxWidth = '24px';
    roleImg.style.height = 'auto';

    row.appendChild(roleCell);

    tbody.appendChild(row);
    
    // Name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = hero.name;
    row.appendChild(nameCell);

    // SelectButton cell
    const selectButtonCell = document.createElement('td');

    const selectButton = document.createElement('button');
    selectButtonCell.appendChild(selectButton);
    selectButton.textContent = "Select";
    selectButton.onclick = function() { ToggleHeroIsSelected(index); };

    row.appendChild(selectButtonCell);

    // CompleteButton cell
    const completeButtonCell = document.createElement('td');

    const completeButton = document.createElement('button');
    completeButtonCell.appendChild(completeButton);
    completeButton.textContent = "Complete";
    completeButton.onclick = function() { ToggleHeroIsCompleted(index); };

    row.appendChild(completeButtonCell);

    // BlockButton cell
    const blockButtonCell = document.createElement('td');

    const blockButton = document.createElement('button');
    blockButtonCell.appendChild(blockButton);
    blockButton.textContent = "Block";
    blockButton.onclick = function() { ToggleHeroIsBlocked(index); };

    row.appendChild(blockButtonCell);
  });

  // Append table to main content
  main.appendChild(table);
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
}


function ToggleHeroIsCompleted(index){
  heroes[index].isCompleted = !(heroes[index].isCompleted);
  console.log(heroes[index]);
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