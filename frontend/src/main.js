import './app.css';
import App from './App.svelte';
import { addMessages, init } from 'svelte-i18n';

addMessages('en', {
  signUp: 'Sign Up',
  username: 'Username',
  email: 'E-mail',
  password: 'Password',
  passwordRepeat: 'Password Repeat',
});

addMessages('tr', {
  signUp: 'Kayit Ol',
  username: 'Kullanici Adi',
  email: 'E-posta',
  password: 'Şifre',
  passwordRepeat: 'Şifre Tekrari',
});

init({ fallbackLocale: 'en', initialLocale: 'en' });

const app = new App({
  target: document.getElementById('app'),
});

export default app;
