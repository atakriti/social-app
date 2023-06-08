import React, { useEffect } from "react";
import Mid from "../Mid/Mid";
import Right from "../Right/Right";
import "./home.scss";
function Home() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service worker registered:', registration);
        })
        .catch(error => {
          console.log('Service worker registration failed:', error);
        });
    });
  }
  window.addEventListener('install', event => {
    console.log('Service worker installed');
  });
  
  window.addEventListener('activate', event => {
    console.log('Service worker activated');
  });
  
  window.addEventListener('push', event => {
    const title = 'Example Notification';
    const options = {
      body: 'Hello from your PWA!',
      // Add additional options as needed
    };
  
    event.waitUntil(
      window.registration.showNotification(title, options)
    );
  });
  





  return (
    <div className="home">
      <div className="home-container">
        <Mid />
        <Right />
      </div>
    </div>
  );
}

export default Home;
