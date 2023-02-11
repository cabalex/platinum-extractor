import './app.css'
import App from './App.svelte'
import { addToast } from './lib/Toasts/ToastStore'

const app = new App({
  target: document.getElementById('app')
})

// Error handling
window.onunhandledrejection = (ev) => {
  let msg = ev.reason.stack;

  let githubBody = `**Beep boop, Error report! Created ${new Date().toUTCString()}**\n\n${ev.reason.stack}\n\nRunning with ${navigator.userAgent} on ${navigator.platform}\n\n---\n\n**Describe what you were doing when this error occurred, whether it was severe or not, or any other details about this bug (so I can fix it):**`

  addToast({
      type: 'danger',
      title: '😟 An error occurred',
      message: msg,
      link: {
          text: 'Report issue (if it\'s severe)',
          href: `https://github.com/cabalex/platinum-extractor/issues/new?title=${encodeURIComponent("Error: " + ev.reason.message)}&body=${encodeURIComponent(githubBody)}`
      }
  });

  return false;
}

export default app
