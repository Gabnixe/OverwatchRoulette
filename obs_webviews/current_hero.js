// ========================================================================
// BROADCAST CHANNELS
// ========================================================================
const currentHeroChannel = new BroadcastChannel('current-hero');
currentHeroChannel.onmessage = (event) => {
    console.log("Received:", event.data);
    document.getElementById('hero-icon').src = `../assets/heroes_images/${event.data.image}`;
    //document.getElementById('hero-name').textContent = `${event.data.name}`;
};