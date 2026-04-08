export const angularCourse = {
  id: 'angular',
  title: 'Angular',
  description: 'A TypeScript-based web application framework by Google for building scalable single-page applications.',
  officialDocs: 'https://angular.dev/',
  tutorialLink: 'https://angular.dev/tutorials',
  exerciseLink: 'https://www.w3schools.com/angular/angular_exercises.asp',
  sections: [
    {
      title: 'What is Angular',
      image: '/images/angular/angular-architecture.svg',
      content: `**Angular** is a TypeScript-based, open-source web application framework developed and maintained by **Google**. It provides a comprehensive, opinionated platform for building **single-page applications (SPAs)** with a structured, enterprise-grade architecture.

### Angular vs AngularJS

Angular (versions 2+) is a **complete rewrite** of AngularJS (1.x). They are entirely different frameworks:

| Feature | AngularJS (1.x) | Angular (2+) |
|---|---|---|
| Language | JavaScript | **TypeScript** |
| Architecture | MVC | **Component-based** |
| Rendering | Two-way dirty checking | **Change detection with zones** |
| Mobile | Not designed for mobile | **Mobile-first** |
| CLI | None | **Angular CLI** |
| Status | **Deprecated** (EOL Dec 2021) | Actively maintained |

### Why Angular?

Angular is a **batteries-included** framework — it ships with routing, forms, HTTP client, testing utilities, and dependency injection built in. You don't need to choose and integrate separate libraries for each concern. This makes it ideal for **large enterprise applications** where consistency and maintainability matter. Companies like Google, Microsoft, Samsung, and Deutsche Bank use Angular in production.

### Core Building Blocks

Angular applications are built from **modules**, **components**, **templates**, **services**, and **directives**. Components define views, services handle business logic, and dependency injection wires everything together.`,
      keyPoints: [
        'Angular is a TypeScript-based framework by Google.',
        'Completely different from AngularJS (1.x) — a full rewrite.',
        'Batteries-included: routing, forms, HTTP, DI, testing built in.',
        'Component-based architecture with strong typing.',
        'Ideal for large-scale enterprise applications.'
      ]
    },
    {
      title: 'Advantages & Disadvantages',
      content: `### Advantages

| Advantage | Why It Matters |
|---|---|
| **TypeScript by default** | Catches errors at compile time, better IDE support & refactoring |
| **Complete framework** | Routing, forms, HTTP, testing — no library fatigue |
| **Dependency Injection** | Built-in DI system promotes testable, modular code |
| **Angular CLI** | Generates components, services, modules with consistent structure |
| **RxJS integration** | First-class reactive programming for async data streams |
| **Strong conventions** | Teams follow the same patterns, easier onboarding |
| **Enterprise backing** | Google maintains it; long-term support (LTS) releases |
| **Ahead-of-Time (AOT)** | Templates compiled at build time for faster rendering |

### Disadvantages

| Disadvantage | Impact |
|---|---|
| **Steep learning curve** | TypeScript + RxJS + DI + decorators — many concepts at once |
| **Verbose boilerplate** | More files per feature compared to React or Vue |
| **Bundle size** | Larger initial bundle than lighter alternatives |
| **Complexity for small apps** | Overkill for simple websites or landing pages |
| **RxJS complexity** | Observables can be confusing for beginners |
| **Frequent major versions** | Migration between major versions can require effort |

### When to Choose Angular

- Large enterprise apps with multiple teams
- Projects requiring strict architecture and conventions
- Applications heavily relying on forms and validation
- Teams comfortable with TypeScript and OOP patterns`,
      keyPoints: [
        'Pro: Complete framework with built-in routing, forms, HTTP, DI.',
        'Pro: TypeScript provides compile-time safety and better tooling.',
        'Con: Steep learning curve with many concepts to learn at once.',
        'Con: More boilerplate compared to React or Vue.',
        'Best for: Large enterprise apps needing strict architecture.'
      ]
    },
    {
      title: 'Installation & Setup',
      content: `### Prerequisites

- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)
- A code editor (**VS Code** recommended with the Angular Language Service extension)

### Install Angular CLI

The **Angular CLI** is the official command-line tool for creating, developing, testing, and building Angular applications. Install it globally:

\`\`\`bash
# Install Angular CLI globally
npm install -g @angular/cli

# Verify installation
ng version
\`\`\`

### Create a New Project

\`\`\`bash
# Create new project (interactive prompts)
ng new my-app

# Create with specific options
ng new my-app --routing --style=scss --strict

# Navigate and start dev server
cd my-app
ng serve
# App runs at http://localhost:4200
\`\`\`

### Project Structure

\`\`\`text
my-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Root component
│   │   ├── app.component.html     # Root template
│   │   ├── app.component.scss     # Root styles
│   │   ├── app.component.spec.ts  # Root tests
│   │   ├── app.config.ts          # App configuration
│   │   └── app.routes.ts          # Route definitions
│   ├── assets/                    # Static assets
│   ├── index.html                 # Entry HTML
│   ├── main.ts                    # Bootstrap entry
│   └── styles.scss                # Global styles
├── angular.json                   # CLI configuration
├── tsconfig.json                  # TypeScript config
└── package.json
\`\`\`

### Key CLI Commands

| Command | Purpose |
|---|---|
| \`ng serve\` | Start dev server with live reload |
| \`ng generate component name\` | Generate a new component |
| \`ng generate service name\` | Generate a new service |
| \`ng build\` | Build for production |
| \`ng test\` | Run unit tests (Karma/Jasmine) |
| \`ng lint\` | Lint the project |`,
      keyPoints: [
        'Install Angular CLI globally with npm install -g @angular/cli.',
        'ng new creates a full project with routing, testing, and build setup.',
        'ng serve starts the dev server at localhost:4200.',
        'ng generate scaffolds components, services, pipes, and more.',
        'angular.json is the main CLI configuration file.'
      ]
    },
    {
      title: 'Components',
      image: '/images/angular/angular-component-lifecycle.svg',
      content: `**Components** are the fundamental building blocks of Angular applications. Each component controls a piece of the UI and consists of:

- A **TypeScript class** with logic and data
- An **HTML template** defining the view
- **CSS/SCSS styles** scoped to the component
- A **\`@Component\` decorator** with metadata

### Creating a Component

\`\`\`bash
# Generate with CLI (creates .ts, .html, .scss, .spec.ts)
ng generate component components/user-card
# Shorthand
ng g c components/user-card
\`\`\`

### Component Structure

\`\`\`typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',       // HTML tag name
  standalone: true,                // Standalone component (modern)
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() name: string = '';       // Input from parent
  @Input() role: string = '';

  @Output() selected = new EventEmitter<string>();  // Output to parent

  onSelect(): void {
    this.selected.emit(this.name);
  }
}
\`\`\`

### Template (user-card.component.html)

\`\`\`html
<div class="card" (click)="onSelect()">
  <h3>{{ name }}</h3>
  <p>{{ role }}</p>
</div>
\`\`\`

### Using the Component

\`\`\`html
<app-user-card
  [name]="'Alice'"
  [role]="'Developer'"
  (selected)="handleSelection($event)">
</app-user-card>
\`\`\`

### Standalone Components (Modern Angular)

Since Angular 14+, **standalone components** don't require NgModules. They declare their own imports directly:

\`\`\`typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UserCardComponent, RouterLink],
  template: \`<app-user-card [name]="user.name" />\`
})
export class DashboardComponent { }
\`\`\``,
      keyPoints: [
        'Components = TypeScript class + HTML template + scoped styles.',
        '@Input() receives data from parent; @Output() emits events.',
        'Standalone components (Angular 14+) don\'t need NgModules.',
        'ng generate component scaffolds all component files.',
        'selector defines the custom HTML tag for the component.'
      ]
    },
    {
      title: 'Templates & Data Binding',
      image: '/images/angular/angular-data-binding.svg',
      content: `Angular templates use a powerful **data binding** system to connect the component class to the DOM. There are four types of binding:

### 1. Interpolation (Component → View)

Display component data in the template using double curly braces:

\`\`\`html
<h1>{{ title }}</h1>
<p>Total: {{ price * quantity }}</p>
<span>{{ getFullName() }}</span>
\`\`\`

### 2. Property Binding (Component → View)

Bind component values to element properties using square brackets:

\`\`\`html
<img [src]="imageUrl" [alt]="imageAlt">
<button [disabled]="isLoading">Submit</button>
<div [class.active]="isActive">Toggled class</div>
<div [style.color]="textColor">Styled text</div>
\`\`\`

### 3. Event Binding (View → Component)

Listen to DOM events using parentheses:

\`\`\`html
<button (click)="onSave()">Save</button>
<input (input)="onSearch($event)">
<form (submit)="onSubmit()">
\`\`\`

### 4. Two-Way Binding (Component ↔ View)

Combines property and event binding using the "banana in a box" syntax \`[(ngModel)]\`:

\`\`\`html
<!-- Requires FormsModule import -->
<input [(ngModel)]="searchTerm" placeholder="Search...">
<p>You typed: {{ searchTerm }}</p>
\`\`\`

### Summary Table

| Binding Type | Syntax | Direction |
|---|---|---|
| Interpolation | \`{{ value }}\` | Component → View |
| Property | \`[property]="value"\` | Component → View |
| Event | \`(event)="handler()"\` | View → Component |
| Two-Way | \`[(ngModel)]="value"\` | Component ↔ View |`,
      keyPoints: [
        'Interpolation {{ }} displays component data in the template.',
        'Property binding [prop] sets element properties dynamically.',
        'Event binding (event) listens to user interactions.',
        'Two-way binding [(ngModel)] syncs input values with the component.',
        'Two-way binding requires FormsModule to be imported.'
      ]
    },
    {
      title: 'Directives',
      content: `**Directives** are instructions that tell Angular to transform the DOM. They extend HTML with new behavior. Angular has three types:

### 1. Structural Directives (Change DOM Structure)

These add, remove, or manipulate elements. They are prefixed with \`*\`:

\`\`\`html
<!-- *ngIf: Conditionally render -->
<div *ngIf="isLoggedIn">Welcome back!</div>
<div *ngIf="items.length > 0; else emptyState">
  {{ items.length }} items found
</div>
<ng-template #emptyState>
  <p>No items available.</p>
</ng-template>

<!-- *ngFor: Loop over arrays -->
<ul>
  <li *ngFor="let item of items; let i = index; trackBy: trackById">
    {{ i + 1 }}. {{ item.name }}
  </li>
</ul>

<!-- *ngSwitch: Switch case -->
<div [ngSwitch]="status">
  <p *ngSwitchCase="'active'">Active</p>
  <p *ngSwitchCase="'inactive'">Inactive</p>
  <p *ngSwitchDefault>Unknown</p>
</div>
\`\`\`

### Modern Control Flow (Angular 17+)

Angular 17 introduced **built-in control flow** syntax replacing structural directives:

\`\`\`html
@if (isLoggedIn) {
  <div>Welcome back!</div>
} @else {
  <div>Please log in.</div>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items found.</p>
}

@switch (status) {
  @case ('active') { <p>Active</p> }
  @case ('inactive') { <p>Inactive</p> }
  @default { <p>Unknown</p> }
}
\`\`\`

### 2. Attribute Directives (Change Appearance/Behavior)

\`\`\`html
<!-- ngClass: Conditional CSS classes -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">
  Styled element
</div>

<!-- ngStyle: Conditional inline styles -->
<div [ngStyle]="{ 'font-size': fontSize + 'px', 'color': textColor }">
  Dynamic styles
</div>
\`\`\`

### 3. Custom Directives

\`\`\`typescript
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
\`\`\``,
      keyPoints: [
        '*ngIf, *ngFor, *ngSwitch change the DOM structure.',
        'Angular 17+ introduces @if, @for, @switch built-in control flow.',
        'ngClass and ngStyle dynamically apply classes and styles.',
        'trackBy in *ngFor optimizes list rendering performance.',
        'Custom directives extend HTML with reusable behavior.'
      ]
    },
    {
      title: 'Services & Dependency Injection',
      content: `**Services** are classes that handle business logic, data fetching, and shared state — anything that doesn't belong in a component. Angular's **Dependency Injection (DI)** system automatically provides service instances to components that need them.

### Creating a Service

\`\`\`bash
ng generate service services/user
\`\`\`

\`\`\`typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'  // Singleton — available app-wide
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
\`\`\`

### Injecting a Service

\`\`\`typescript
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: \`
    @for (user of users; track user.id) {
      <div>{{ user.name }} — {{ user.email }}</div>
    }
  \`
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  // Modern inject function (Angular 14+)
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }
}
\`\`\`

### DI Scopes

| Scope | Declaration | Behavior |
|---|---|---|
| **Root** | \`providedIn: 'root'\` | Singleton for the entire app |
| **Component** | \`providers: [Service]\` in @Component | New instance per component |
| **Module** | \`providers: [Service]\` in @NgModule | Shared within that module |

### Why DI Matters

- **Testability**: Easily replace services with mocks in tests
- **Loose coupling**: Components don't create their own dependencies
- **Reusability**: Same service instance shared across components`,
      keyPoints: [
        'Services handle logic, data fetching, and shared state.',
        '@Injectable({ providedIn: \'root\' }) creates a singleton service.',
        'inject() function is the modern way to inject dependencies.',
        'DI makes code testable — swap real services for mocks.',
        'Components should delegate logic to services, not contain it.'
      ]
    },
    {
      title: 'Routing & Navigation',
      content: `Angular's built-in **Router** maps URL paths to components, enabling SPA navigation without full page reloads.

### Route Configuration

\`\`\`typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent },
  {
    path: 'admin',
    canActivate: [authGuard],           // Route guard
    loadComponent: () =>                 // Lazy loading
      import('./admin/admin.component')
        .then(m => m.AdminComponent)
  },
  { path: '**', component: NotFoundComponent }  // Wildcard
];
\`\`\`

### Router Outlet & Links

\`\`\`html
<!-- app.component.html -->
<nav>
  <a routerLink="/" routerLinkActive="active"
     [routerLinkActiveOptions]="{ exact: true }">Home</a>
  <a routerLink="/users" routerLinkActive="active">Users</a>
  <a routerLink="/admin" routerLinkActive="active">Admin</a>
</nav>

<!-- Routed components render here -->
<router-outlet />
\`\`\`

### Route Parameters & Navigation

\`\`\`typescript
import { ActivatedRoute, Router } from '@angular/router';

@Component({ /* ... */ })
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Read URL parameter
    const userId = this.route.snapshot.paramMap.get('id');

    // Or subscribe to param changes
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.loadUser(Number(id));
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
\`\`\`

### Route Guards

Guards protect routes from unauthorized access:

\`\`\`typescript
// Functional guard (modern approach)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
\`\`\`

### Lazy Loading

Lazy loading splits your app into smaller bundles loaded on demand:

\`\`\`typescript
{
  path: 'reports',
  loadChildren: () =>
    import('./reports/reports.routes')
      .then(m => m.REPORT_ROUTES)
}
\`\`\``,
      keyPoints: [
        'Routes map URL paths to components in app.routes.ts.',
        'routerLink creates navigation links; routerLinkActive adds active class.',
        'Route guards (canActivate) protect routes from unauthorized access.',
        'Lazy loading (loadComponent/loadChildren) reduces initial bundle size.',
        'ActivatedRoute provides access to URL parameters.'
      ]
    },
    {
      title: 'Forms: Template-Driven & Reactive',
      content: `Angular provides two approaches to building forms, each with different trade-offs:

### Template-Driven Forms

Simple forms using \`ngModel\` directives in the template. Best for simple forms with minimal validation.

\`\`\`typescript
// Requires FormsModule
@Component({
  standalone: true,
  imports: [FormsModule],
  template: \`
    <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
      <input name="email" [(ngModel)]="email" required email
             #emailField="ngModel">
      @if (emailField.invalid && emailField.touched) {
        <span class="error">Valid email required</span>
      }
      <button [disabled]="myForm.invalid">Submit</button>
    </form>
  \`
})
export class ContactFormComponent {
  email = '';

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Submitted:', this.email);
    }
  }
}
\`\`\`

### Reactive Forms (Recommended for Complex Forms)

Forms built programmatically in the component class. Provide more control, easier testing, and dynamic form generation.

\`\`\`typescript
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Name</label>
        <input formControlName="name">
        @if (userForm.get('name')?.hasError('required') &&
             userForm.get('name')?.touched) {
          <span class="error">Name is required</span>
        }
      </div>
      <div>
        <label>Email</label>
        <input formControlName="email">
      </div>
      <div>
        <label>Age</label>
        <input type="number" formControlName="age">
        @if (userForm.get('age')?.hasError('min')) {
          <span class="error">Must be at least 18</span>
        }
      </div>
      <button [disabled]="userForm.invalid">Save</button>
    </form>
  \`
})
export class UserFormComponent {
  private fb = inject(FormBuilder);

  userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    age: [null, [Validators.required, Validators.min(18)]]
  });

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
\`\`\`

### Comparison

| Feature | Template-Driven | Reactive |
|---|---|---|
| Setup | FormsModule + ngModel | ReactiveFormsModule + FormGroup |
| Logic location | Template | Component class |
| Testing | Harder (needs DOM) | Easier (pure TypeScript) |
| Dynamic fields | Difficult | Easy (FormArray) |
| Best for | Simple forms | Complex, dynamic forms |`,
      keyPoints: [
        'Template-driven forms use ngModel — simple but limited.',
        'Reactive forms use FormGroup/FormControl — more powerful and testable.',
        'Validators provide built-in and custom validation rules.',
        'Reactive forms are recommended for complex, dynamic forms.',
        'Both approaches support real-time validation feedback.'
      ]
    },
    {
      title: 'HTTP Client & Interceptors',
      content: `Angular's **HttpClient** module provides a typed, Observable-based API for making HTTP requests.

### Setup

\`\`\`typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
\`\`\`

### Making Requests

\`\`\`typescript
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = '/api/products';
  private http = inject(HttpClient);

  // GET with query params
  getProducts(page: number, search?: string): Observable<Product[]> {
    let params = new HttpParams().set('page', page);
    if (search) params = params.set('q', search);
    return this.http.get<Product[]>(this.api, { params });
  }

  // POST
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.api, product);
  }

  // PUT
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(\`\${this.api}/\${id}\`, product);
  }

  // DELETE
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.api}/\${id}\`);
  }
}
\`\`\`

### Using in Components

\`\`\`typescript
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getProducts(1).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }
}
\`\`\`

### Interceptors

Interceptors modify requests/responses globally — perfect for auth tokens, logging, and error handling:

\`\`\`typescript
import { HttpInterceptorFn } from '@angular/common/http';

// Functional interceptor (modern approach)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: \`Bearer \${token}\` }
    });
    return next(cloned);
  }

  return next(req);
};

// Error interceptor
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Redirect to login
      }
      return throwError(() => error);
    })
  );
};
\`\`\``,
      keyPoints: [
        'HttpClient provides typed, Observable-based HTTP methods.',
        'provideHttpClient() configures HTTP in standalone apps.',
        'Interceptors modify all requests/responses globally.',
        'Use interceptors for auth tokens, error handling, logging.',
        'Always handle errors with subscribe({ error }) or catchError.'
      ]
    },
    {
      title: 'Pipes',
      content: `**Pipes** transform displayed data in templates without changing the underlying value. Angular provides several built-in pipes and supports custom pipe creation.

### Built-in Pipes

\`\`\`html
<!-- DatePipe -->
<p>{{ today | date:'fullDate' }}</p>             <!-- Monday, March 15, 2025 -->
<p>{{ today | date:'dd/MM/yyyy HH:mm' }}</p>     <!-- 15/03/2025 14:30 -->

<!-- CurrencyPipe -->
<p>{{ price | currency:'USD' }}</p>               <!-- $1,234.56 -->
<p>{{ price | currency:'EUR':'symbol':'1.0-0' }}</p> <!-- €1,235 -->

<!-- DecimalPipe -->
<p>{{ ratio | number:'1.2-2' }}</p>               <!-- 3.14 -->

<!-- PercentPipe -->
<p>{{ 0.75 | percent }}</p>                       <!-- 75% -->

<!-- UpperCase / LowerCase / TitleCase -->
<p>{{ name | uppercase }}</p>                     <!-- ALICE -->
<p>{{ name | titlecase }}</p>                     <!-- Alice -->

<!-- JsonPipe (debugging) -->
<pre>{{ user | json }}</pre>

<!-- SlicePipe -->
<p>{{ 'Hello World' | slice:0:5 }}</p>            <!-- Hello -->

<!-- Chaining pipes -->
<p>{{ birthday | date:'longDate' | uppercase }}</p>
\`\`\`

### Custom Pipes

\`\`\`typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    if (!value) return '';
    return value.length > limit
      ? value.substring(0, limit) + trail
      : value;
  }
}
\`\`\`

\`\`\`html
<!-- Usage -->
<p>{{ article.body | truncate:100:'... [read more]' }}</p>
\`\`\`

### Pure vs Impure Pipes

| Type | Behavior | Use case |
|---|---|---|
| **Pure** (default) | Only recalculates when input reference changes | Most cases |
| **Impure** | Recalculates on every change detection cycle | Filtering arrays |

> **Tip:** Prefer pure pipes. Impure pipes (\`pure: false\`) run frequently and can hurt performance.`,
      keyPoints: [
        'Pipes transform data in templates using the | operator.',
        'Built-in: date, currency, number, uppercase, json, slice.',
        'Pipes can be chained: value | date | uppercase.',
        'Custom pipes implement PipeTransform interface.',
        'Pure pipes (default) are more performant than impure pipes.'
      ]
    },
    {
      title: 'Lifecycle Hooks',
      content: `Angular components go through a **lifecycle** from creation to destruction. **Lifecycle hooks** let you tap into key moments to run custom logic.

### Lifecycle Sequence

| Hook | Timing | Common Use |
|---|---|---|
| \`ngOnChanges\` | When @Input() values change | React to input changes |
| \`ngOnInit\` | After first \`ngOnChanges\` | Fetch data, initialize logic |
| \`ngDoCheck\` | Every change detection run | Custom change detection |
| \`ngAfterContentInit\` | After content projection | Access projected content |
| \`ngAfterContentChecked\` | After projected content checked | — |
| \`ngAfterViewInit\` | After view (and children) initialized | Access DOM elements, charts |
| \`ngAfterViewChecked\` | After view checked | — |
| \`ngOnDestroy\` | Before component is destroyed | Cleanup subscriptions, timers |

### Most Important Hooks

\`\`\`typescript
import {
  Component, OnInit, OnDestroy, OnChanges,
  AfterViewInit, SimpleChanges, Input
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({ /* ... */ })
export class UserProfileComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input() userId!: number;
  private subscription!: Subscription;

  // 1. Runs when @Input values change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && !changes['userId'].firstChange) {
      this.loadUser(this.userId);
    }
  }

  // 2. Runs once after component is initialized
  ngOnInit(): void {
    this.loadUser(this.userId);
    this.subscription = interval(5000).subscribe(() => {
      this.refreshData();
    });
  }

  // 3. Runs after the view is fully initialized
  ngAfterViewInit(): void {
    // Safe to access @ViewChild elements here
    this.initializeChart();
  }

  // 4. Cleanup before component is destroyed
  ngOnDestroy(): void {
    // ALWAYS unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
\`\`\`

### Key Rules

- **ngOnInit** is for initialization logic — not the constructor
- **ngOnDestroy** must clean up subscriptions, timers, and event listeners
- **ngOnChanges** only fires for \`@Input()\` property changes
- The **constructor** should only be used for DI — no heavy logic`,
      keyPoints: [
        'ngOnInit is for initialization — fetch data, set up logic.',
        'ngOnDestroy must clean up subscriptions to prevent memory leaks.',
        'ngOnChanges fires when @Input() values change.',
        'ngAfterViewInit is safe for DOM access and @ViewChild.',
        'Constructor is for dependency injection only — no logic.'
      ]
    },
    {
      title: 'RxJS & Observables',
      content: `**RxJS** (Reactive Extensions for JavaScript) is a library for composing asynchronous and event-based programs using **Observables**. Angular uses RxJS extensively for HTTP requests, form value changes, route params, and more.

### Observable Basics

An **Observable** is a lazy stream of values over time. Unlike Promises (single value), Observables can emit multiple values.

\`\`\`typescript
import { Observable, of, from, interval } from 'rxjs';
import { map, filter, switchMap, takeUntil, debounceTime } from 'rxjs/operators';

// Creating Observables
const numbers$ = of(1, 2, 3, 4, 5);
const fromArray$ = from([10, 20, 30]);
const timer$ = interval(1000);  // Emits 0, 1, 2... every second

// Subscribing
numbers$.pipe(
  filter(n => n > 2),
  map(n => n * 10)
).subscribe(value => console.log(value));
// Output: 30, 40, 50
\`\`\`

### Common RxJS Operators

| Operator | Purpose | Example Use |
|---|---|---|
| \`map\` | Transform each value | Convert API response shape |
| \`filter\` | Only pass matching values | Filter search results |
| \`switchMap\` | Cancel previous, switch to new | Search-as-you-type |
| \`mergeMap\` | Run inner observables in parallel | Batch API calls |
| \`debounceTime\` | Wait before emitting | Debounce user input |
| \`distinctUntilChanged\` | Skip duplicate consecutive values | Avoid duplicate API calls |
| \`takeUntil\` | Complete when notifier emits | Auto-unsubscribe on destroy |
| \`catchError\` | Handle errors in the stream | Fallback values |
| \`tap\` | Side effects without modifying stream | Logging |

### Practical: Search-as-you-type

\`\`\`typescript
@Component({
  template: \`<input [formControl]="searchControl" placeholder="Search...">\`
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),              // Wait 300ms after typing stops
      distinctUntilChanged(),          // Skip if same value
      switchMap(term =>                // Cancel previous request
        this.searchService.search(term!)
      ),
      takeUntil(this.destroy$)         // Auto-cleanup
    ).subscribe(results => {
      this.results = results;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
\`\`\`

### Async Pipe (Preferred in Templates)

The \`async\` pipe subscribes and unsubscribes automatically:

\`\`\`html
@for (user of users$ | async; track user.id) {
  <div>{{ user.name }}</div>
}
\`\`\``,
      keyPoints: [
        'Observables are lazy streams that emit multiple values over time.',
        'pipe() chains operators like map, filter, switchMap.',
        'switchMap cancels previous subscriptions — ideal for search.',
        'takeUntil + Subject pattern prevents memory leaks on destroy.',
        'async pipe in templates auto-subscribes and unsubscribes.'
      ]
    },
    {
      title: 'Signals (Modern Angular)',
      content: `**Signals** were introduced in Angular 16 as a simpler, more performant alternative to RxJS for managing reactive state. They provide fine-grained reactivity without the complexity of Observables.

### Signal Basics

\`\`\`typescript
import { signal, computed, effect } from '@angular/core';

@Component({
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ double() }}</p>
    <button (click)="increment()">+1</button>
    <button (click)="reset()">Reset</button>
  \`
})
export class CounterComponent {
  // Writable signal
  count = signal(0);

  // Computed signal (derived, read-only)
  double = computed(() => this.count() * 2);

  constructor() {
    // Effect — runs when any signal it reads changes
    effect(() => {
      console.log('Count changed to:', this.count());
    });
  }

  increment(): void {
    this.count.update(c => c + 1);   // Update based on previous
  }

  reset(): void {
    this.count.set(0);               // Set to specific value
  }
}
\`\`\`

### Signal Methods

| Method | Purpose | Example |
|---|---|---|
| \`signal(value)\` | Create a writable signal | \`count = signal(0)\` |
| \`.set(value)\` | Replace the value | \`count.set(5)\` |
| \`.update(fn)\` | Update based on previous | \`count.update(c => c + 1)\` |
| \`computed(fn)\` | Derived read-only signal | \`double = computed(() => count() * 2)\` |
| \`effect(fn)\` | Side effect on change | Logging, API calls |

### Signals vs RxJS

| Feature | Signals | RxJS Observables |
|---|---|---|
| Learning curve | Low | High |
| Sync values | Yes (always has a value) | No (may not have emitted) |
| Auto-cleanup | Yes | Manual (unsubscribe) |
| Operators | Limited | 100+ operators |
| Best for | Component state, UI | Async streams, events, HTTP |

### Signal Inputs (Angular 17.1+)

\`\`\`typescript
@Component({ /* ... */ })
export class UserCardComponent {
  // Signal-based input (replaces @Input())
  name = input.required<string>();
  role = input<string>('Developer');  // With default

  displayName = computed(() =>
    \`\${this.name()} (\${this.role()})\`
  );
}
\`\`\`

> **Tip:** Use Signals for synchronous component state and RxJS for complex async workflows like HTTP, WebSockets, and event streams.`,
      keyPoints: [
        'Signals provide simpler reactivity than RxJS for component state.',
        'signal() creates writable state; computed() derives values.',
        'effect() runs side effects when signals change.',
        'Signals always have a value — no subscription needed.',
        'Use Signals for UI state, RxJS for async streams and HTTP.'
      ]
    },
    {
      title: 'Testing',
      content: `Angular ships with robust testing support using **Jasmine** (test framework) and **Karma** (test runner). The CLI generates \`.spec.ts\` files for every component, service, and pipe.

### Unit Testing a Service

\`\`\`typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController }
  from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Ensure no unmatched requests
  });

  it('should fetch users', () => {
    const mockUsers = [
      { id: 1, name: 'Alice', email: 'alice@test.com' }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Alice');
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
\`\`\`

### Unit Testing a Component

\`\`\`typescript
// user-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]  // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });

  it('should display the user name', () => {
    component.name = 'Alice';
    component.role = 'Developer';
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.querySelector('h3').textContent).toContain('Alice');
  });

  it('should emit selected event on click', () => {
    component.name = 'Bob';
    spyOn(component.selected, 'emit');

    component.onSelect();

    expect(component.selected.emit).toHaveBeenCalledWith('Bob');
  });
});
\`\`\`

### Running Tests

\`\`\`bash
ng test              # Run tests in watch mode
ng test --no-watch   # Run once (CI)
ng test --code-coverage  # Generate coverage report
\`\`\``,
      keyPoints: [
        'Angular uses Jasmine + Karma for unit testing by default.',
        'TestBed configures a testing module for DI and components.',
        'HttpTestingController mocks HTTP requests in tests.',
        'fixture.detectChanges() triggers change detection in tests.',
        'ng test --code-coverage generates coverage reports.'
      ]
    },
    {
      title: 'Build, Deploy & Best Practices',
      content: `### Building for Production

\`\`\`bash
# Production build (AOT, minification, tree-shaking)
ng build

# Build output in dist/ folder
# Analyze bundle size
npx source-map-explorer dist/**/*.js
\`\`\`

### Deployment Options

| Platform | Command / Method |
|---|---|
| **Vercel** | \`npx vercel --prod\` |
| **Netlify** | Build command: \`ng build\`, publish: \`dist/app-name/browser\` |
| **Firebase** | \`ng add @angular/fire\` → \`firebase deploy\` |
| **Docker + Nginx** | Multi-stage Dockerfile |
| **AWS S3 + CloudFront** | Upload dist/ to S3 bucket |

### Docker Deployment

\`\`\`dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/my-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
\`\`\`

### Best Practices

**Do:**
| Practice | Why |
|---|---|
| Use standalone components | Simpler, no NgModule overhead |
| Use Signals for component state | Simpler than RxJS for sync state |
| Lazy load feature routes | Smaller initial bundle |
| Use \`trackBy\` / \`track\` in loops | Prevents unnecessary re-renders |
| Unsubscribe in ngOnDestroy | Prevents memory leaks |
| Use \`async\` pipe in templates | Auto-manages subscriptions |
| Keep components small | Single responsibility |
| Use OnPush change detection | Better performance |

**Don't:**
| Anti-Pattern | Why |
|---|---|
| Logic in constructors | Use ngOnInit instead |
| Manual DOM manipulation | Use Angular binding / directives |
| Subscribe in subscribe | Use switchMap / mergeMap |
| Ignore unsubscription | Causes memory leaks |
| Import everything eagerly | Increases initial bundle size |
| Use \`any\` type | Defeats TypeScript's purpose |

### OnPush Change Detection

\`\`\`typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Only re-renders when @Input references change or events fire
})
export class PerformantComponent { }
\`\`\``,
      keyPoints: [
        'ng build creates optimized production bundles with AOT.',
        'Lazy load routes to reduce initial bundle size.',
        'Use OnPush change detection for better performance.',
        'Always unsubscribe or use async pipe / takeUntil pattern.',
        'Prefer standalone components over NgModules in new projects.'
      ]
    }
  ]
};
