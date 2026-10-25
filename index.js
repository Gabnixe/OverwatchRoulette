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
    
    // Hero info cell (Row 1 - Image, Role Icon, Name)
    const heroInfoCell = document.createElement('div');
    heroInfoCell.className = 'hero-info';
    
    // Hero image
    const heroImg = document.createElement('img');
    heroImg.src = `/assets/heroes_images/${hero.image}`;
    heroImg.alt = hero.name;
    heroImg.style.maxWidth = '100px';
    heroImg.style.height = 'auto';
    heroInfoCell.appendChild(heroImg);

    // Role cell (with role icon)
    const roleCell = document.createElement('div');
    roleCell.className = 'role-cell';
    
    const roleImg = document.createElement('img');
    roleImg.src = `/assets/roles_icons/` + ROLES_ICONS[hero.role];
    roleImg.alt = hero.role;
    roleImg.style.maxWidth = '24px';
    roleImg.style.height = 'auto';
    roleCell.appendChild(roleImg);

    // Name cell (with hero name)
    const nameCell = document.createElement('div');
    nameCell.className = 'name-cell';
    nameCell.textContent = hero.name;
    
    // Assemble Row 1 elements
    heroInfoCell.appendChild(heroImg);
    heroInfoCell.appendChild(roleCell);
    heroInfoCell.appendChild(nameCell);

    // Buttons container (Row 2)
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    
    // SelectButton cell
    const selectButtonCell = document.createElement('div');
    selectButtonCell.className = 'button-cell select-btn';
    
    const selectButton = document.createElement('button');
    selectButton.textContent = "Select";
    selectButton.onclick = function() { ToggleHeroIsSelected(index); };
    selectButtonCell.appendChild(selectButton);

    // CompleteButton cell
    const completeButtonCell = document.createElement('div');
    completeButtonCell.className = 'button-cell complete-btn';
    
    const completeButton = document.createElement('button');
    completeButton.textContent = "Complete";
    completeButton.onclick = function() { ToggleHeroIsCompleted(index); };
    completeButtonCell.appendChild(completeButton);

    // BlockButton cell
    const blockButtonCell = document.createElement('div');
    blockButtonCell.className = 'button-cell block-btn';
    
    const blockButton = document.createElement('button');
    blockButton.textContent = "Block";
    blockButton.onclick = function() { ToggleHeroIsBlocked(index); };
    blockButtonCell.appendChild(blockButton);

    // Add all buttons to container
    buttonContainer.appendChild(selectButtonCell);
    buttonContainer.appendChild(completeButtonCell);
    buttonContainer.appendChild(blockButtonCell);

    // Assemble item (Row 1 first, then Row 2)
    item.appendChild(heroInfoCell);
    item.appendChild(buttonContainer);

    heroList.appendChild(item);
  });

  // Append list to main content
  main.appendChild(heroList);
}


function RenderCurrentHero(){
  const heroInfo = document.getElementById('current-hero-info');
  
  if (!heroInfo) {
    console.error('Hero info element not found!');
    return;
  }
  
  let displayDiv = heroInfo.querySelector('#hero-display') || 
                     (heroInfo.innerHTML.includes('No hero selected') ? 
                      heroInfo : null);
  
  if (!displayDiv) {
    displayDiv = document.createElement('div');
    displayDiv.id = 'hero-display';
    heroInfo.appendChild(displayDiv);
  }
  
  if (!currentHero) {
    displayDiv.innerHTML = '<p style="color: #666; text-align: center;">No hero selected yet</p>';
    return;
  }
  
  // Hero Display - Single row layout (image + name side by side)
  displayDiv.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: center;">
      <img src="/assets/heroes_images/${currentHero.image}" 
           alt="${currentHero.name}" 
           style="width: 100px; height: auto;" />
      
      <!-- Role Icon -->
      ${ROLES_ICONS[currentHero.role] ? `
        <div style="display: flex; align-items: center;">
          <img src="/assets/roles_icons/${ROLES_ICONS[currentHero.role]}" 
               alt="${currentHero.role}" 
               style="width: 24px; height: auto;" />
        </div>` : ''}
      
      <!-- Hero Name -->
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