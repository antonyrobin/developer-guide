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
      id: 'ionic-running',
      title: 'Running in Browser & Emulators',
      content: `### 1. Browser Testing
The fastest way to develop is using the browser.
\`\`\`bash
ionic serve
\`\`\`
Use the **Responsive Design Mode** in Chrome DevTools (Ctrl+Shift+M) to simulate different device sizes.

### 2. Emulator / Simulator Testing
To see how it performs on actual mobile OS:

**Android Emulator:**
1. Open **Android Studio** -> Device Manager -> Create Virtual Device.
2. Run command:
\`\`\`bash
ionic cordova emulate android
\`\`\`

**iOS Simulator (Mac only):**
1. Install **Xcode**.
2. Run command:
\`\`\`bash
ionic cordova emulate ios
\`\`\`

> **Note:** For Capacitor, use \`npx cap open android\` or \`npx cap open ios\` to launch the native IDEs and run from there.`
    },
    {
      id: 'ionic-building',
      title: 'Generating App Bundles (Production)',
      content: `### 1. Android Build (.apk / .aab)
To generate a production-ready file for Google Play:
\`\`\`bash
# Build the web assets
ionic cordova build android --prod --release
\`\`\`
This creates an unsigned APK in \`platforms/android/app/build/outputs/apk/release/\`. You must sign it using **jarsigner** and optimize with **zipalign** before uploading.

### 2. iOS Build (ipa)
1. Build the project:
\`\`\`bash
ionic cordova build ios --prod --release
\`\`\`
2. Open the \`.xcworkspace\` file in **Xcode**.
3. Select **Product -> Archive**.
4. Follow the Archive organizer to distribute the app.`
    },
    {
      id: 'ionic-deployment',
      title: 'Deployment: Firebase & TestFlight',
      content: `### 1. Firebase Hosting (Web/PWA)
Ideal for testing the web version or a Progressive Web App (PWA).
1. Initialize Firebase: \`firebase init\`
2. Choose **Hosting**.
3. Build your app: \`ionic build --prod\`
4. Deploy: \`firebase deploy\`

### 2. Apple TestFlight (Beta Testing)
TestFlight is the standard way to distribute iOS betas to up to 10,000 testers.
1. Create an **App Record** in App Store Connect.
2. In Xcode, after creating an **Archive**, click **Distribute App**.
3. Select **App Store Connect** -> **Upload**.
4. Once processed, go to App Store Connect -> TestFlight tab to invite internal or external testers.

### 3. Google Play Internal Testing
Similar to TestFlight, upload your **.aab** file to the **Internal Testing** track in Google Play Console.`,
      image: '/artifacts/ionic_deployment_flow_1775990703061.png'
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
