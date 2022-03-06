import axios from "axios";

const PUBLIC_KEY = 'BG-QtwSxtBRr5_OQfEjpE5QtWhJG8Oj18oeOwiUWf79RvWSt5uL9XBfKXLlJV97CxghoEWQpS4fAygxFuC-6LlQ';

const subsription = async () => {

    const register = await navigator.serviceWorker.register('/worker.js', {
        scope: '/'
    });

    await navigator.serviceWorker.ready;

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: PUBLIC_KEY
    })

    console.log("subscribiendo")

    await axios.post('/subscription', subscription)
}

export default subsription