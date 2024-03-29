

// setInterval(function () {
//     document.getElementById("JazzFifaTournament").src = document.getElementById("JazzFifaTournament").src;
// }, 10000);

// 60000 1 minuto


const btn = document.getElementById('btnInstall');
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

const APP = {
    deferredInstall: null,
    init() {
        if ('serviceWorker' in navigator) {
            //register our service worker
            navigator.serviceWorker
                .register('/sw.js', {
                    updateViaCache: 'none',
                    scope: '/',
                })
                .then(() => {
                    //finished registering
                })
                .catch((err) => {
                    console.warn('Failed to register', err.message);
                });
            //listen for messages
            navigator.serviceWorker.addEventListener('message', ({ data }) => {
                //received a message from the service worker
                console.log(data, 'from service worker');
            });

            //listen for `appinstalled` event
            window.addEventListener('appinstalled', (evt) => {
                //deprecated but still runs in Chrome-based browsers.
                //Not very useful event.
                //Better to use the DOMContentLoaded and then look at how it was launched
            });

            //listen for `beforeinstallprompt` event
            window.addEventListener('beforeinstallprompt', (ev) => {
                // Prevent the mini-infobar from appearing on mobile
                ev.preventDefault();
                // Stash the event so it can be triggered later.
                APP.deferredInstall = ev;
                console.log('saved the install event');
                // Update UI notify the user they can install the PWA
                // if you want here...
            });


            if (window.matchMedia('(display-mode: standalone)').matches) {
                btn.style.display = 'none';
            } else {
                btn?.addEventListener('click', APP.startChromeInstall);
            }
        }
    },
    startChromeInstall() {

        if (isIOS) {
            const instructions = document.getElementById('instructions');
            instructions.style.display = 'block';
        } else {
            if (APP.deferredInstall) {
                console.log(APP.deferredInstall);
                APP.deferredInstall.prompt();
                APP.deferredInstall.userChoice.then((choice) => {
                    if (choice.outcome == 'accepted') {
                        //they installed
                        console.log('installed');
                        btn.style.display = 'none';
                    } else {
                        console.log('cancel');
                    }
                });
            }
        }
    },
};
document.addEventListener('DOMContentLoaded', APP.init);
