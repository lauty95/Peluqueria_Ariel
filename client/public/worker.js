console.log('Service worker')

self.addEventListener('push', e => {
    const data = e.data.json()
    self.registration.showNotification(data.title, {
        body: data.message,
        data: {
            url: 'https://peluqueria-ariel.vercel.app/admin'
        }
    })
})