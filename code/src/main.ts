import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

const appTarget = document.getElementById('app');

if (!appTarget) {
  throw new Error('App mount target #app was not found in index.html.');
}

const app = mount(App, {
  target: appTarget,
});

export default app;
