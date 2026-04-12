export const ionicCourse = {
  id: 'ionic',
  title: 'Ionic & Cordova',
  description: 'Build cross-platform mobile apps using web technologies like HTML, CSS, and JS.',
  icon: 'Smartphone',
  category: 'Frontend Frameworks',
  sections: [
    {
      id: 'ionic-intro',
      title: 'Introduction to Ionic',
      content: `Ionic is a complete open-source SDK for hybrid mobile app development. It provides a library of mobile-optimized UI components and tools for building highly interactive apps.

### Key Concepts:
- **Hybrid Apps:** Web apps running inside a native container.
- **Cordova:** The bridge that allows web code to access native device features (Camera, GPS, etc.).
- **Capacitor:** The modern successor to Cordova (though Cordova is still widely used).`,
      image: '/artifacts/ionic_logo_1775988870717.png'
    },
    {
      id: 'ionic-setup',
      title: 'Installation & Environment Setup',
      content: `### 1. Install Node.js
Ensure you have the latest LTS version of Node.js.

### 2. Install Ionic CLI
\`\`\`bash
npm install -g @ionic/cli
\`\`\`

### 3. Install Cordova
\`\`\`bash
npm install -g cordova
\`\`\`

### 4. Native SDKs
- **Android:** Install Android Studio and the Android SDK.
- **iOS:** (macOS only) Install Xcode.`
    },
    {
      id: 'ionic-first-app',
      title: 'Creating Your First Project',
      content: `### Start a New App
\`\`\`bash
ionic start myMobileApp tabs --type=angular
\`\`\`
*(You can also use React or Vue types)*

### Run in Browser
\`\`\`bash
cd myMobileApp
ionic serve
\`\`\`

### Building for Mobile
Add the platforms you want to target:
\`\`\`bash
ionic cordova platform add android
ionic cordova platform add ios
\`\`\`

### Run on Device
\`\`\`bash
ionic cordova run android
\`\`\`

### Common UI Components:
\`\`\`html
<ion-header>
  <ion-toolbar>
    <ion-title>My App</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-button expand="full" (click)="doSomething()">Click Me</ion-button>
</ion-content>
\`\`\``,
      image: '/artifacts/ionic_workflow_1775988886812.png'
    },
    {
      id: 'ionic-best-practices',
      title: 'Pros, Cons & Best Practices',
      content: `### Advantages & Disadvantages
| Advantages | Disadvantages |
| --- | --- |
| One codebase for all platforms | Performance can be slower than native for heavy apps |
| Uses standard web technologies | Debugging can sometimes be tricky |
| Fast development cycle | Dependence on plugins for native features |

### Best Practices
- **Use Capacitor:** If starting a new project, prioritize Capacitor over Cordova.
- **Lazy Loading:** Use lazy loading for pages to improve startup performance.
- **Native Look:** Use Ionic's platform-specific styles to make the app feel native on both iOS and Android.`
    }
  ]
};
