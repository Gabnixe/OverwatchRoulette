const channel = new BroadcastChannel('current-hero');

channel.onmessage = (event) => {
    console.log("Received:", event.data);
    document.getElementById('hero-name').textContent = `${event.data.name}`;
};