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
  let heroIndex = 0;
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
    console.log(heroIndex);

    row.appendChild(selectButton);

    //Increase heroIndex
    heroIndex++;
  });

  // Append table to main content
  main.appendChild(table);
}

function SelectRandomHero(){
  currentHero = heroes[Math.floor(Math.random() * heroes.length)];
  console.log(currentHero);
}

function ToggleHeroIsBlocked(index){

}

function ToggleHeroIsCompleted(index){

}

function ToggleHeroIsSelected(index){
  currentHero = heroes[index];
  console.log(currentHero);
}

function SaveJSON(){
  console.log("Json Saved");
}

function LoadJSON(){
  console.log("Json Loaded");
}