const channel = new BroadcastChannel('current-hero');

channel.onmessage = (event) => {
    console.log("Received:", event.data);
    document.getElementById('hero-icon').src = `../assets/heroes_images/${event.data.image}`;
    //document.getElementById('hero-name').textContent = `${event.data.name}`;
};