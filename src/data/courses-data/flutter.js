export const flutterCourse = {
  id: 'flutter',
  title: 'Flutter',
  description: 'Google\'s cross-platform UI toolkit for building natively compiled mobile, web, and desktop apps from a single Dart codebase.',
  officialDocs: 'https://docs.flutter.dev',
  tutorialLink: 'https://docs.flutter.dev/get-started/codelab',
  exerciseLink: 'https://dartpad.dev',
  sections: [
    {
      title: 'What is Flutter & Dart',
      image: '/images/flutter/flutter-architecture.svg',
      content: `**Flutter** is Google's open-source UI toolkit for building **natively compiled** applications for mobile, web, and desktop from a **single codebase** using the **Dart** programming language.

### What is Flutter?

- **Cross-platform framework** — One codebase produces iOS, Android, Windows, macOS, Linux apps
- **Ahead-of-Time (AOT) compilation** — Dart compiles to native ARM/x64 code for production
- **Hot Reload** — Sub-second UI updates during development without losing state
- **Widget-based architecture** — Everything is a widget; compositional UI building
- **Skia/Impeller rendering** — Custom rendering engine; pixel-perfect UI on all platforms

### What is Dart?

- **Object-oriented** language with strong typing and null safety
- **Single codebase** compiles to native code (mobile), JavaScript (web), or x64 (desktop)
- **Asynchronous** by design — \`async/await\`, \`Stream\`, \`Future\` built into the language
- **Sound null safety** — Eliminates null reference errors at compile time
- Syntax similar to **Java**, **C#**, and **TypeScript**

### How Flutter Fits in a Stack

\`\`\`text
Mobile/Desktop App → CDN → API Gateway → Backend Services → Database
       │
       ├── Native camera barcode scanning (mobile_scanner)
       ├── Secure token storage (flutter_secure_storage)
       ├── Local database (sqflite for offline mode)
       └── Push notifications (Firebase Cloud Messaging)
\`\`\`

Flutter can serve as the **mobile frontend** and **desktop POS terminal** in a full-stack architecture, communicating with backend APIs via HTTP (Dio) and storing tokens securely using platform-native encryption.

### Flutter vs React Native

| Feature | Flutter | React Native |
|---|---|---|
| **Language** | Dart | JavaScript |
| **Rendering** | Own engine (Skia/Impeller) | Native components via bridge |
| **Performance** | AOT compiled — smooth 60fps | JS bridge overhead |
| **Hot Reload** | ✅ Sub-second | ✅ Fast Refresh |
| **Desktop** | ✅ Production-ready | ❌ Limited |
| **UI Consistency** | Pixel-perfect across platforms | Platform-native look |`,
      keyPoints: [
        'Flutter is a cross-platform UI toolkit by Google using Dart.',
        'AOT compilation produces native ARM/x64 code — no bridge overhead.',
        'Hot Reload enables sub-second UI updates during development.',
        'Everything is a widget — compositional, declarative UI building.',
        'Dart has sound null safety, async/await, and strong typing.'
      ]
    },

    {
      title: 'Why Flutter — Pros & Cons',
      content: `### ✅ Advantages

| # | Advantage | Detail |
|---|---|---|
| 1 | **True Cross-Platform** | iOS + Android + Desktop from single codebase |
| 2 | **Hot Reload** | See changes instantly without rebuilding |
| 3 | **Native Performance** | AOT compiled; no JavaScript bridge (unlike React Native) |
| 4 | **Rich Widget Library** | Material Design 3, Cupertino widgets, custom widgets |
| 5 | **Strong Typing** | Dart's sound null safety catches errors at compile time |
| 6 | **Camera & Sensors** | Direct access to camera, GPS, accelerometer, biometrics |
| 7 | **Active Community** | 160k+ GitHub stars; thousands of packages on pub.dev |
| 8 | **Google Backed** | Long-term investment; used in Google Ads, Pay, Classroom |
| 9 | **Desktop Support** | Production-ready Windows/macOS apps |
| 10 | **Platform Channels** | Call native Swift/Kotlin code when needed |

### ❌ Disadvantages

| # | Disadvantage | Mitigation |
|---|---|---|
| 1 | **App Size** | Flutter apps are 15-30MB minimum — acceptable for most use cases |
| 2 | **Dart Ecosystem** | Smaller than JavaScript — but growing; pub.dev has 40k+ packages |
| 3 | **Web Performance** | Flutter web is slower than frameworks like Next.js — use dedicated web frameworks for web |
| 4 | **Platform Widgets** | Doesn't use native iOS/Android widgets — use Cupertino widgets where needed |
| 5 | **Desktop Maturity** | Desktop support is newer — stable enough for POS; test thoroughly |
| 6 | **Learning Curve** | Dart is new for most teams — syntax similar to Java/C#/TypeScript |
| 7 | **Deep Linking** | Complex to set up — use \`go_router\` for declarative routing |

### When to Choose Flutter

| Scenario | Recommendation |
|---|---|
| Mobile app (iOS + Android) | ✅ Flutter |
| Desktop POS / kiosk app | ✅ Flutter Desktop |
| High-performance web app | ❌ Use Next.js / React |
| Simple content website | ❌ Use static site generators |
| Game or 3D rendering | ❌ Use Unity / native |
| Cross-platform with native feel | ✅ Flutter + Cupertino widgets |`,
      keyPoints: [
        'One Dart codebase for iOS, Android, Windows, macOS, and Linux.',
        'AOT compilation means native performance without bridge overhead.',
        'Flutter web exists but dedicated web frameworks are better for web apps.',
        'pub.dev has 40,000+ packages and a growing ecosystem.',
        'Use Cupertino widgets for native iOS look-and-feel.'
      ]
    },

    {
      title: 'Installation & Setup',
      content: `### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| **Flutter SDK** | 3.x (stable) | Framework and tools |
| **Dart SDK** | 3.x (bundled with Flutter) | Language runtime |
| **Android Studio** | Latest | Android SDK, emulator, build tools |
| **Xcode** | 15+ (macOS only) | iOS/macOS builds |
| **VS Code** | Latest | IDE with Flutter/Dart extensions |
| **Git** | 2.x | Version control |
| **JDK** | 17 | Android build requirement |

### Install Flutter (Windows)

\`\`\`powershell
# Option 1: Using Chocolatey
choco install flutter

# Option 2: Using Git (recommended)
cd C:\\dev
git clone https://github.com/flutter/flutter.git -b stable
# Add C:\\dev\\flutter\\bin to PATH

# Verify installation
flutter --version
dart --version

# Run Flutter doctor to check setup
flutter doctor -v
\`\`\`

### Install Flutter (macOS)

\`\`\`bash
# Using Homebrew
brew install flutter

# Verify
flutter doctor -v
\`\`\`

### Fix Common flutter doctor Issues

\`\`\`powershell
# Accept Android licenses
flutter doctor --android-licenses

# Enable desktop support
flutter config --enable-windows-desktop
flutter config --enable-macos-desktop
\`\`\`

### Expected flutter doctor Output

\`\`\`text
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 3.x.x)
[✓] Windows Version (version 10 or higher)
[✓] Android toolchain (Android SDK version 34.x.x)
[✓] Chrome - develop for the web
[✓] Visual Studio - develop Windows apps
[✓] Android Studio (version 2024.x)
[✓] VS Code (version 1.x.x)
[✓] Connected device (x available)
[✓] Network resources
\`\`\`

### VS Code Extensions

\`\`\`text
Dart-Code.dart-code              # Dart language support
Dart-Code.flutter                # Flutter tools and snippets
nash.awesome-flutter-snippets    # Flutter code snippets
usernamehw.errorlens            # Inline error display
\`\`\``,
      keyPoints: [
        'Flutter SDK includes Dart — install once, get both.',
        'flutter doctor -v checks your environment and highlights issues.',
        'Accept Android licenses with flutter doctor --android-licenses.',
        'Enable desktop support with flutter config --enable-windows-desktop.',
        'VS Code with Dart + Flutter extensions is the recommended IDE setup.'
      ]
    },

    {
      title: 'Project Creation & Structure',
      image: '/images/flutter/flutter-project-structure.svg',
      content: `### Create a New Flutter Project

\`\`\`powershell
# Create project with specific platforms
flutter create my_app --org com.example --platforms android,ios,windows

cd my_app

# Verify project runs
flutter run
\`\`\`

### Core Dependencies (pubspec.yaml)

\`\`\`yaml
dependencies:
  flutter:
    sdk: flutter

  # Navigation
  go_router: ^14.0.0                     # Declarative routing

  # State Management
  flutter_riverpod: ^2.5.0               # State management
  riverpod_annotation: ^2.3.0            # Code generation for Riverpod

  # Networking
  dio: ^5.4.0                            # HTTP client
  retrofit: ^4.1.0                       # Type-safe API client

  # Local Storage
  flutter_secure_storage: ^9.2.0         # Secure token storage
  sqflite: ^2.3.0                        # Local SQLite database

  # Barcode / QR
  mobile_scanner: ^5.1.0                 # Camera barcode scanner

  # UI
  flutter_svg: ^2.0.0                    # SVG rendering
  cached_network_image: ^3.3.0           # Image caching
  shimmer: ^3.0.0                        # Loading shimmer effect

  # Utilities
  freezed_annotation: ^2.4.0             # Immutable data classes
  json_annotation: ^4.8.0               # JSON serialization
  intl: ^0.19.0                          # Internationalization
  logger: ^2.0.0                         # Logging

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.0
  freezed: ^2.4.0
  json_serializable: ^6.7.0
  retrofit_generator: ^8.1.0
  riverpod_generator: ^2.4.0
  mockito: ^5.4.0
  flutter_lints: ^4.0.0
\`\`\`

\`\`\`powershell
# Install dependencies
flutter pub get

# Run code generation
dart run build_runner build --delete-conflicting-outputs
\`\`\`

### Project Structure (Feature-First)

\`\`\`text
my_app/
├── android/                       # Android native code
├── ios/                           # iOS native code
├── windows/                       # Windows desktop native code
├── lib/
│   ├── main.dart                  # App entry point
│   ├── app.dart                   # MaterialApp + GoRouter setup
│   ├── core/                      # Shared utilities
│   │   ├── constants/             # App constants, API endpoints, colors
│   │   ├── errors/                # Exceptions & failures
│   │   ├── network/               # Dio client, interceptors
│   │   ├── storage/               # Secure storage, local DB
│   │   ├── theme/                 # App theme, light/dark
│   │   └── utils/                 # Formatters, validators, extensions
│   ├── features/                  # Feature-first modules
│   │   ├── auth/                  # Login, OTP, JWT
│   │   ├── products/              # Product CRUD
│   │   ├── orders/                # Order management
│   │   ├── barcode/               # Barcode scanning
│   │   └── pos/                   # POS terminal (Desktop)
│   ├── shared/                    # Shared widgets & providers
│   │   ├── widgets/               # Reusable UI components
│   │   └── providers/             # Global state providers
│   └── routing/
│       └── app_router.dart        # GoRouter configuration
├── test/                          # Unit & widget tests
├── integration_test/              # Integration tests
├── assets/                        # Images, fonts, translations
└── pubspec.yaml
\`\`\``,
      keyPoints: [
        'Use flutter create --platforms to specify target platforms.',
        'Feature-first folder structure scales well for large apps.',
        'core/ holds shared utilities like networking, storage, and theme.',
        'Each feature has data/, domain/, and presentation/ layers.',
        'Run build_runner after adding or changing model annotations.'
      ]
    },

    {
      title: 'Clean Architecture Layers',
      image: '/images/flutter/flutter-clean-architecture.svg',
      content: `Flutter apps benefit from **Clean Architecture** — separating code into three layers with strict dependency rules: Presentation → Domain → Data.

### Architecture Diagram

\`\`\`text
┌──────────────────────────────────────────────────┐
│              Presentation Layer                    │
│  Pages, Widgets, Providers (Riverpod)            │
│  - UI rendering                                  │
│  - User interaction handling                     │
│  - State management                              │
├──────────────────────────────────────────────────┤
│              Domain Layer                         │
│  Entities, Use Cases, Repository Interfaces      │
│  - Business rules                                │
│  - No dependencies on external packages          │
│  - Pure Dart (no Flutter imports)                 │
├──────────────────────────────────────────────────┤
│              Data Layer                           │
│  Models, Repository Implementations, Datasources │
│  - API calls (Dio/Retrofit)                      │
│  - Local database (sqflite/Hive)                 │
│  - JSON serialization                            │
└──────────────────────────────────────────────────┘
\`\`\`

### Dependency Rule

Dependencies flow **inward** — Presentation depends on Domain, Domain depends on nothing, Data implements Domain interfaces.

\`\`\`text
Presentation → Domain ← Data
     │            │         │
  Widgets      Entities   Models
  Providers    Use Cases  Repositories (impl)
  Pages        Interfaces Datasources
\`\`\`

### Entity (Domain Layer — Pure Dart)

\`\`\`dart
// lib/features/products/domain/entities/product.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'product.freezed.dart';

@freezed
class Product with _\\$Product {
  const factory Product({
    required String id,
    required String name,
    required String sku,
    required double price,
    required double gstRate,
    required String categoryId,
    String? description,
    String? imageUrl,
    @Default(true) bool isActive,
    @Default(0) int stockQuantity,
  }) = _Product;
}
\`\`\`

### Model (Data Layer — JSON Serialization)

\`\`\`dart
// lib/features/products/data/models/product_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/product.dart';

part 'product_model.freezed.dart';
part 'product_model.g.dart';

@freezed
class ProductModel with _\\$ProductModel {
  const ProductModel._();

  const factory ProductModel({
    required String id,
    required String name,
    required String sku,
    required double price,
    @JsonKey(name: 'gst_rate') required double gstRate,
    @JsonKey(name: 'category_id') required String categoryId,
    String? description,
    @JsonKey(name: 'image_url') String? imageUrl,
    @JsonKey(name: 'is_active') @Default(true) bool isActive,
    @JsonKey(name: 'stock_quantity') @Default(0) int stockQuantity,
  }) = _ProductModel;

  factory ProductModel.fromJson(Map<String, dynamic> json) =>
      _\\$ProductModelFromJson(json);

  // Convert to domain entity
  Product toEntity() => Product(
    id: id, name: name, sku: sku, price: price,
    gstRate: gstRate, categoryId: categoryId,
    description: description, imageUrl: imageUrl,
    isActive: isActive, stockQuantity: stockQuantity,
  );
}
\`\`\`

### Use Case (Domain Layer)

\`\`\`dart
// lib/features/products/domain/usecases/get_products.dart
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/product.dart';
import '../repositories/product_repository.dart';

class GetProducts {
  final ProductRepository repository;
  GetProducts(this.repository);

  Future<Either<Failure, List<Product>>> call({
    int page = 1,
    int pageSize = 20,
    String? search,
  }) {
    return repository.getProducts(
      page: page, pageSize: pageSize, search: search,
    );
  }
}
\`\`\``,
      keyPoints: [
        'Clean Architecture: Presentation → Domain → Data with inward dependencies.',
        'Domain layer is pure Dart — no Flutter or package dependencies.',
        'Use freezed for immutable entities with copyWith and equality.',
        'Models handle JSON serialization; entities are clean business objects.',
        'Use cases contain single business operations, called from providers.'
      ]
    },

    {
      title: 'Repository & Datasource Pattern',
      content: `The **Repository Pattern** bridges Domain and Data layers. The domain defines an abstract interface; the data layer provides the implementation.

### Repository Interface (Domain Layer)

\`\`\`dart
// lib/features/products/domain/repositories/product_repository.dart
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/product.dart';

abstract class ProductRepository {
  Future<Either<Failure, List<Product>>> getProducts({
    int page = 1,
    int pageSize = 20,
    String? search,
  });
  Future<Either<Failure, Product>> getProductById(String id);
  Future<Either<Failure, Product>> createProduct(Map<String, dynamic> data);
}
\`\`\`

### Repository Implementation (Data Layer)

\`\`\`dart
// lib/features/products/data/repositories/product_repository_impl.dart
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/errors/exceptions.dart';
import '../../domain/entities/product.dart';
import '../../domain/repositories/product_repository.dart';
import '../datasources/product_remote_datasource.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductRemoteDatasource remoteDatasource;

  ProductRepositoryImpl({required this.remoteDatasource});

  @override
  Future<Either<Failure, List<Product>>> getProducts({
    int page = 1, int pageSize = 20, String? search,
  }) async {
    try {
      final models = await remoteDatasource.getProducts(
        page: page, pageSize: pageSize, search: search,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException {
      return Left(const NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, Product>> getProductById(String id) async {
    try {
      final model = await remoteDatasource.getProductById(id);
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }

  @override
  Future<Either<Failure, Product>> createProduct(
    Map<String, dynamic> data,
  ) async {
    try {
      final model = await remoteDatasource.createProduct(data);
      return Right(model.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }
}
\`\`\`

### Datasource — Retrofit API (Type-Safe)

\`\`\`dart
// lib/features/products/data/datasources/product_remote_datasource.dart
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/product_model.dart';

part 'product_remote_datasource.g.dart';

@RestApi()
abstract class ProductRemoteDatasource {
  factory ProductRemoteDatasource(Dio dio) = _ProductRemoteDatasource;

  @GET('/catalog/products')
  Future<List<ProductModel>> getProducts({
    @Query('page') int page = 1,
    @Query('page_size') int pageSize = 20,
    @Query('search') String? search,
  });

  @GET('/catalog/products/{id}')
  Future<ProductModel> getProductById(@Path('id') String id);

  @POST('/catalog/products')
  Future<ProductModel> createProduct(@Body() Map<String, dynamic> body);

  @PUT('/catalog/products/{id}')
  Future<ProductModel> updateProduct(
    @Path('id') String id,
    @Body() Map<String, dynamic> body,
  );

  @DELETE('/catalog/products/{id}')
  Future<void> deleteProduct(@Path('id') String id);
}
\`\`\`

### Either Pattern for Error Handling

\`\`\`dart
// Using dartz Either — Left = failure, Right = success
final result = await getProducts(page: 1);

result.fold(
  (failure) => showError(failure.message),  // Left — handle error
  (products) => showProducts(products),      // Right — handle success
);
\`\`\``,
      keyPoints: [
        'Domain defines abstract repository interfaces; data layer implements them.',
        'Either<Failure, T> pattern provides explicit error handling without exceptions.',
        'Retrofit generates type-safe API clients from annotations.',
        'Repository converts Data Models → Domain Entities before returning.',
        'Datasources handle the raw API calls; repositories handle error mapping.'
      ]
    },

    {
      title: 'Widgets & UI Building',
      content: `In Flutter, **everything is a widget**. Widgets are the building blocks of the UI — from layout containers to buttons to entire screens.

### StatelessWidget — No Internal State

\`\`\`dart
class ProductCard extends StatelessWidget {
  final String name;
  final double price;
  final VoidCallback onTap;

  const ProductCard({
    super.key,
    required this.name,
    required this.price,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              Text(
                '\\$\${price.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
\`\`\`

### StatefulWidget — Manages Internal State

\`\`\`dart
class QuantitySelector extends StatefulWidget {
  final int initialQuantity;
  final ValueChanged<int> onChanged;

  const QuantitySelector({
    super.key,
    this.initialQuantity = 1,
    required this.onChanged,
  });

  @override
  State<QuantitySelector> createState() => _QuantitySelectorState();
}

class _QuantitySelectorState extends State<QuantitySelector> {
  late int _quantity;

  @override
  void initState() {
    super.initState();
    _quantity = widget.initialQuantity;
  }

  void _update(int delta) {
    setState(() {
      _quantity = (_quantity + delta).clamp(1, 99);
    });
    widget.onChanged(_quantity);
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(onPressed: () => _update(-1), icon: const Icon(Icons.remove)),
        Text('$_quantity', style: const TextStyle(fontSize: 18)),
        IconButton(onPressed: () => _update(1), icon: const Icon(Icons.add)),
      ],
    );
  }
}
\`\`\`

### Common Layout Widgets

| Widget | Purpose |
|---|---|
| \`Column\` | Vertical layout |
| \`Row\` | Horizontal layout |
| \`Stack\` | Overlapping widgets |
| \`ListView\` | Scrollable list |
| \`GridView\` | Scrollable grid |
| \`Padding\` | Add padding around a widget |
| \`SizedBox\` | Fixed-size spacing |
| \`Expanded\` | Fill remaining space in Row/Column |
| \`Container\` | Box model with decoration, padding, margin |
| \`Scaffold\` | Screen layout with AppBar, body, FAB |

### When to Use Which Widget Type

| Need | Widget Type |
|---|---|
| Static display only | **StatelessWidget** |
| Internal animation/timer | **StatefulWidget** |
| External data (API, DB) | **ConsumerWidget** (Riverpod) |
| Form with validation | **StatefulWidget** + \`reactive_forms\` |`,
      keyPoints: [
        'Everything in Flutter is a widget — compose small widgets into complex UIs.',
        'Use StatelessWidget when the widget has no internal mutable state.',
        'Use StatefulWidget when you need setState for local UI state.',
        'Always use const constructors to reduce unnecessary rebuilds.',
        'Use ConsumerWidget (Riverpod) for widgets that depend on external state.'
      ]
    },

    {
      title: 'Routing & Navigation',
      image: '/images/flutter/flutter-routing.svg',
      content: `**GoRouter** is the recommended routing package for Flutter — it provides declarative, URL-based routing with deep linking support.

### GoRouter Configuration

\`\`\`dart
// lib/routing/app_router.dart
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = authState.isAuthenticated;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');

      if (!isLoggedIn && !isAuthRoute) return '/auth/login';
      if (isLoggedIn && isAuthRoute) return '/';
      return null; // No redirect
    },
    routes: [
      // Auth routes
      GoRoute(
        path: '/auth/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/auth/verify-otp',
        builder: (context, state) => const OtpVerificationPage(),
      ),

      // Main shell with bottom navigation
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const DashboardPage(),
          ),
          GoRoute(
            path: '/products',
            builder: (context, state) => const ProductListPage(),
            routes: [
              GoRoute(
                path: 'new',
                builder: (context, state) => const CreateProductPage(),
              ),
              GoRoute(
                path: ':id',
                builder: (context, state) => ProductDetailPage(
                  id: state.pathParameters['id']!,
                ),
              ),
            ],
          ),
          GoRoute(
            path: '/orders',
            builder: (context, state) => const OrdersPage(),
          ),
          GoRoute(
            path: '/barcode-scan',
            builder: (context, state) => const BarcodeScanPage(),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsPage(),
          ),
        ],
      ),
    ],
  );
});
\`\`\`

### Navigation Methods

\`\`\`dart
// Declarative navigation
context.go('/products');               // Replace current route
context.push('/products/new');         // Push onto stack
context.pop();                         // Go back

// With path parameters
context.push('/products/abc-123');

// Push and wait for result
final barcode = await context.push<String>('/barcode-scan');
if (barcode != null) {
  // Use the returned barcode value
}
\`\`\`

### ShellRoute — Bottom Navigation

\`\`\`dart
// ShellRoute preserves the shell (bottom nav) across child routes
ShellRoute(
  builder: (context, state, child) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _calculateIndex(state.matchedLocation),
        onTap: (index) => _onTabTapped(context, index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.inventory), label: 'Products'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt), label: 'Orders'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
    );
  },
  routes: [ /* child routes */ ],
);
\`\`\``,
      keyPoints: [
        'GoRouter provides declarative, URL-based routing with deep linking.',
        'Use redirect for auth guards — redirect unauthenticated users to login.',
        'ShellRoute preserves shared UI (bottom nav, drawer) across child routes.',
        'context.push() adds to the stack; context.go() replaces the current route.',
        'Path parameters (:id) enable dynamic routes like /products/abc-123.'
      ]
    },

    {
      title: 'Authentication & JWT Handling',
      image: '/images/flutter/flutter-auth-flow.svg',
      content: `Flutter apps store JWT tokens using **flutter_secure_storage** which uses platform-native encryption (Keychain on iOS, Keystore on Android).

### Secure Token Storage

\`\`\`dart
// lib/core/storage/secure_storage.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock,
    ),
  );

  static const _accessTokenKey = 'access_token';
  static const _refreshTokenKey = 'refresh_token';

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
  }

  Future<String?> getAccessToken() =>
      _storage.read(key: _accessTokenKey);

  Future<String?> getRefreshToken() =>
      _storage.read(key: _refreshTokenKey);

  Future<void> clearTokens() async {
    await _storage.delete(key: _accessTokenKey);
    await _storage.delete(key: _refreshTokenKey);
  }
}
\`\`\`

### Auth Interceptor (Auto-attach Token + Refresh)

\`\`\`dart
// lib/core/network/api_interceptor.dart
import 'package:dio/dio.dart';
import '../storage/secure_storage.dart';

class AuthInterceptor extends Interceptor {
  final TokenStorage tokenStorage;
  final Dio dio;

  AuthInterceptor({required this.tokenStorage, required this.dio});

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await tokenStorage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken == null) {
        handler.reject(err);
        return;
      }

      try {
        // Attempt token refresh
        final response = await dio.post(
          '/identity/auth/refresh',
          data: {'refresh_token': refreshToken},
        );

        final newAccessToken = response.data['access_token'];
        final newRefreshToken = response.data['refresh_token'];
        await tokenStorage.saveTokens(
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        );

        // Retry original request with new token
        err.requestOptions.headers['Authorization'] =
            'Bearer $newAccessToken';
        final retryResponse = await dio.fetch(err.requestOptions);
        handler.resolve(retryResponse);
      } catch (e) {
        // Refresh failed — force logout
        await tokenStorage.clearTokens();
        handler.reject(err);
      }
    } else {
      handler.next(err);
    }
  }
}
\`\`\`

### Auth Security Best Practices

| Practice | Reason |
|---|---|
| **flutter_secure_storage** | Uses Keychain (iOS) / Keystore (Android) — encrypted |
| **Never use SharedPreferences for tokens** | SharedPrefs stores as plain text — insecure |
| **Auto-refresh on 401** | Seamless UX — user doesn't re-login on token expiry |
| **Clear tokens on logout** | Prevent stale credentials |
| **GoRouter redirect guard** | Redirect to login if not authenticated |`,
      keyPoints: [
        'flutter_secure_storage uses platform-native encryption (Keychain/Keystore).',
        'Never store JWT tokens in SharedPreferences — it is unencrypted.',
        'Auth interceptor auto-attaches Bearer token to every API request.',
        'On 401, interceptor auto-refreshes token and retries the request.',
        'GoRouter redirect guard ensures unauthenticated users go to login.'
      ]
    },

    {
      title: 'API Integration (Dio)',
      content: `**Dio** is the standard HTTP client for Flutter — it supports interceptors, request cancellation, FormData, timeouts, and more.

### Dio HTTP Client Setup

\`\`\`dart
// lib/core/network/api_client.dart
import 'package:dio/dio.dart';
import 'api_interceptor.dart';
import '../storage/secure_storage.dart';

class ApiClient {
  late final Dio dio;
  final TokenStorage tokenStorage;

  ApiClient({required this.tokenStorage, required String baseUrl}) {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));

    dio.interceptors.addAll([
      AuthInterceptor(tokenStorage: tokenStorage, dio: dio),
      LogInterceptor(requestBody: true, responseBody: true),
    ]);
  }
}
\`\`\`

### Making API Calls

\`\`\`dart
// GET request
final response = await dio.get('/products', queryParameters: {
  'page': 1,
  'page_size': 20,
});
final List products = response.data;

// POST request
final response = await dio.post('/products', data: {
  'name': 'Basmati Rice',
  'sku': 'RIC-001',
  'price': 150.0,
});

// PUT request
final response = await dio.put('/products/abc-123', data: {
  'price': 175.0,
});

// DELETE request
await dio.delete('/products/abc-123');
\`\`\`

### Error Handling

\`\`\`dart
try {
  final response = await dio.get('/products');
  return response.data;
} on DioException catch (e) {
  switch (e.type) {
    case DioExceptionType.connectionTimeout:
      throw NetworkException('Connection timed out');
    case DioExceptionType.receiveTimeout:
      throw NetworkException('Server took too long to respond');
    case DioExceptionType.badResponse:
      throw ServerException(
        e.response?.data['message'] ?? 'Server error',
        statusCode: e.response?.statusCode,
      );
    case DioExceptionType.connectionError:
      throw NetworkException('No internet connection');
    default:
      throw ServerException('Unexpected error occurred');
  }
}
\`\`\`

### Riverpod Provider Wiring

\`\`\`dart
// Wire everything together with Riverpod
final tokenStorageProvider = Provider((ref) => TokenStorage());

final apiClientProvider = Provider((ref) {
  return ApiClient(
    tokenStorage: ref.watch(tokenStorageProvider),
    baseUrl: const String.fromEnvironment('API_BASE_URL',
      defaultValue: 'http://localhost:5000/api'),
  );
});

final productDatasourceProvider = Provider((ref) {
  return ProductRemoteDatasource(ref.watch(apiClientProvider).dio);
});
\`\`\``,
      keyPoints: [
        'Dio is the standard HTTP client — supports interceptors, timeouts, and cancellation.',
        'Configure base URL, timeouts, and default headers in BaseOptions.',
        'Auth interceptor auto-attaches JWT; log interceptor aids debugging.',
        'DioException types map to specific error categories for clean error handling.',
        'Wire API clients with Riverpod providers for dependency injection.'
      ]
    },

    {
      title: 'State Management (Riverpod)',
      image: '/images/flutter/flutter-state-management.svg',
      content: `**Riverpod** is the recommended state management solution for Flutter — it's compile-safe, testable, and has built-in async support.

### Why Riverpod

| Feature | Provider | Riverpod | Bloc |
|---|---|---|---|
| Compile-safe | ❌ Runtime errors | ✅ Compile-time | ❌ Runtime |
| Testing | Hard | **Easy** | Easy |
| Code generation | No | **Optional** | No |
| Async support | Manual | **Built-in** | Manual |
| Learning curve | Low | Medium | High |

### App Setup

\`\`\`dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';

void main() {
  runApp(
    const ProviderScope(child: MyApp()), // Wrap with ProviderScope
  );
}
\`\`\`

### FutureProvider — Async Data Fetching

\`\`\`dart
// lib/features/products/presentation/providers/product_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/product.dart';
import '../../domain/usecases/get_products.dart';

part 'product_provider.g.dart';

@riverpod
Future<List<Product>> productList(
  Ref ref,
  {int page = 1, String? search},
) async {
  final getProducts = ref.watch(getProductsUseCaseProvider);
  final result = await getProducts(page: page, search: search);
  return result.fold(
    (failure) => throw Exception(failure.message),
    (products) => products,
  );
}
\`\`\`

### Consuming in a Widget

\`\`\`dart
class ProductListPage extends ConsumerWidget {
  const ProductListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productListProvider());

    return Scaffold(
      appBar: AppBar(title: const Text('Products')),
      body: productsAsync.when(
        data: (products) => ListView.builder(
          itemCount: products.length,
          itemBuilder: (context, index) => ProductCard(
            product: products[index],
            onTap: () => context.push(
              '/products/\${products[index].id}',
            ),
          ),
        ),
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Error: $error'),
              ElevatedButton(
                onPressed: () => ref.invalidate(productListProvider()),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
\`\`\`

### StateNotifierProvider — Mutable State

\`\`\`dart
// Cart state with NotifierProvider
@riverpod
class CartNotifier extends _\\$CartNotifier {
  @override
  List<CartItem> build() => []; // Initial state

  void addItem(Product product) {
    state = [...state, CartItem(product: product, quantity: 1)];
  }

  void removeItem(String productId) {
    state = state.where((item) => item.product.id != productId).toList();
  }

  double get total => state.fold(
    0, (sum, item) => sum + item.product.price * item.quantity,
  );
}
\`\`\`

### State Management Decision Matrix

| Scenario | Tool |
|---|---|
| Server data (API calls) | Riverpod \`FutureProvider\` / \`AsyncNotifierProvider\` |
| Simple local UI state | Riverpod \`StateProvider\` |
| Complex local state (cart) | Riverpod \`NotifierProvider\` |
| Auth state | Riverpod \`AsyncNotifierProvider\` + \`flutter_secure_storage\` |
| Forms | \`reactive_forms\` |
| Navigation | \`go_router\` |`,
      keyPoints: [
        'Riverpod is compile-safe — catches provider errors at compile time.',
        'Wrap the app in ProviderScope to enable Riverpod.',
        'FutureProvider handles async data fetching with built-in loading/error states.',
        '.when() provides data/loading/error callbacks for clean UI handling.',
        'ref.invalidate() refreshes provider data — perfect for retry/pull-to-refresh.'
      ]
    },

    {
      title: 'Barcode & QR Code Scanning',
      image: '/images/flutter/flutter-barcode-scanning.svg',
      content: `Flutter provides native camera access for barcode/QR code scanning via **mobile_scanner** — essential for POS and inventory apps.

### Camera-Based Scanner (Mobile)

\`\`\`dart
// lib/features/barcode/presentation/pages/barcode_scan_page.dart
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class BarcodeScanPage extends StatefulWidget {
  const BarcodeScanPage({super.key});

  @override
  State<BarcodeScanPage> createState() => _BarcodeScanPageState();
}

class _BarcodeScanPageState extends State<BarcodeScanPage> {
  final MobileScannerController controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
    torchEnabled: false,
  );
  bool _isProcessing = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan Barcode'),
        actions: [
          // Toggle flashlight
          IconButton(
            icon: ValueListenableBuilder(
              valueListenable: controller,
              builder: (context, state, child) => Icon(
                state.torchState == TorchState.on
                    ? Icons.flash_on : Icons.flash_off,
              ),
            ),
            onPressed: () => controller.toggleTorch(),
          ),
          // Switch camera
          IconButton(
            icon: const Icon(Icons.camera_front),
            onPressed: () => controller.switchCamera(),
          ),
        ],
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: controller,
            onDetect: (capture) => _onBarcodeDetected(capture),
          ),
          // Scan overlay
          Center(
            child: Container(
              width: 250, height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.green, width: 3),
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _onBarcodeDetected(BarcodeCapture capture) {
    if (_isProcessing) return;
    _isProcessing = true;

    final barcode = capture.barcodes.first;
    final value = barcode.rawValue;

    if (value != null) {
      context.pop(value); // Return barcode value to caller
    }

    // Prevent rapid-fire scans
    Future.delayed(const Duration(seconds: 2), () {
      _isProcessing = false;
    });
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
\`\`\`

### Using the Scanner from Product Search

\`\`\`dart
// In product list page — launch scanner and use result
FloatingActionButton(
  onPressed: () async {
    final barcode = await context.push<String>('/barcode-scan');
    if (barcode != null) {
      // Search product by scanned barcode
      ref.read(productSearchProvider.notifier)
          .searchByBarcode(barcode);
    }
  },
  child: const Icon(Icons.qr_code_scanner),
);
\`\`\`

### Platform-Specific Scanning

| Platform | Scanning Method |
|---|---|
| **Android/iOS** | Camera via \`mobile_scanner\` |
| **Windows Desktop** | External USB scanner (keyboard input) |

For **desktop POS**, USB barcode scanners send keystrokes — listen for input in a \`TextField\` or use \`RawKeyboardListener\`:

\`\`\`dart
// Desktop POS: USB scanner sends keyboard input
RawKeyboardListener(
  focusNode: FocusNode()..requestFocus(),
  onKey: (event) {
    if (event is RawKeyDownEvent &&
        event.logicalKey == LogicalKeyboardKey.enter) {
      // Barcode scan complete — process the buffer
      _processBarcode(_barcodeBuffer);
      _barcodeBuffer = '';
    } else if (event is RawKeyDownEvent) {
      _barcodeBuffer += event.character ?? '';
    }
  },
  child: const SizedBox.shrink(),
);
\`\`\``,
      keyPoints: [
        'mobile_scanner provides camera-based barcode/QR scanning for mobile.',
        'Debounce scans with a processing flag to prevent rapid-fire detections.',
        'context.push<String>() launches scanner and returns the barcode value.',
        'Desktop POS uses USB scanners that emit keyboard input.',
        'Always dispose the MobileScannerController to release the camera.'
      ]
    },

    {
      title: 'Theming & Styling',
      content: `Flutter uses **Material Design 3** by default with a powerful theming system that supports light/dark modes and custom color schemes.

### App Theme Setup

\`\`\`dart
// lib/core/theme/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  // Light theme
  static final light = ThemeData(
    useMaterial3: true,
    colorSchemeSeed: const Color(0xFF1B5E20), // Primary green
    brightness: Brightness.light,
    appBarTheme: const AppBarTheme(
      centerTitle: true,
      elevation: 0,
    ),
    cardTheme: CardTheme(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: 16, vertical: 12,
      ),
    ),
  );

  // Dark theme
  static final dark = ThemeData(
    useMaterial3: true,
    colorSchemeSeed: const Color(0xFF1B5E20),
    brightness: Brightness.dark,
    appBarTheme: const AppBarTheme(
      centerTitle: true,
      elevation: 0,
    ),
  );
}
\`\`\`

### Apply Theme in App

\`\`\`dart
// lib/app.dart
MaterialApp.router(
  title: 'My App',
  theme: AppTheme.light,
  darkTheme: AppTheme.dark,
  themeMode: ThemeMode.system, // Follow OS setting
  routerConfig: ref.watch(routerProvider),
);
\`\`\`

### Using Theme in Widgets

\`\`\`dart
// Access theme colors and text styles
final colorScheme = Theme.of(context).colorScheme;
final textTheme = Theme.of(context).textTheme;

Container(
  color: colorScheme.primaryContainer,
  child: Text(
    'Hello',
    style: textTheme.headlineMedium?.copyWith(
      color: colorScheme.onPrimaryContainer,
    ),
  ),
);
\`\`\`

### Custom Fonts

\`\`\`yaml
# pubspec.yaml
flutter:
  fonts:
    - family: Poppins
      fonts:
        - asset: assets/fonts/Poppins-Regular.ttf
        - asset: assets/fonts/Poppins-Bold.ttf
          weight: 700
\`\`\`

\`\`\`dart
// Use in theme
ThemeData(
  fontFamily: 'Poppins',
);
\`\`\`

### Responsive Layout

\`\`\`dart
// Adapt layout based on screen size
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 1200) {
      return const DesktopLayout();   // POS terminal
    } else if (constraints.maxWidth > 600) {
      return const TabletLayout();
    }
    return const MobileLayout();
  },
);
\`\`\``,
      keyPoints: [
        'Material Design 3 with colorSchemeSeed auto-generates harmonious palettes.',
        'Use ThemeMode.system to follow the OS light/dark mode setting.',
        'Access theme via Theme.of(context).colorScheme and textTheme.',
        'LayoutBuilder enables responsive layouts for mobile, tablet, and desktop.',
        'Custom fonts are declared in pubspec.yaml under the flutter: fonts: key.'
      ]
    },

    {
      title: 'SOLID Principles in Flutter',
      content: `SOLID principles help write maintainable, testable Flutter code. Here's how each applies to Dart and Flutter.

### S — Single Responsibility

\`\`\`dart
// ✅ Each class has ONE job
class ProductRepository { /* data access only */ }
class GetProducts { /* business logic only */ }
class ProductListPage { /* UI rendering only */ }
class ProductModel { /* serialization only */ }

// ❌ Avoid: One widget that fetches data, validates, formats, and renders
\`\`\`

### O — Open/Closed

\`\`\`dart
// ✅ Open for extension via generics and abstract classes
abstract class BaseRepository<T> {
  Future<List<T>> getAll();
  Future<T> getById(String id);
  Future<T> create(Map<String, dynamic> data);
}

class ProductRepository extends BaseRepository<Product> {
  @override
  Future<List<Product>> getAll() => /* ... */;
  // New entity repos extend BaseRepository without modifying it
}
\`\`\`

### L — Liskov Substitution

\`\`\`dart
// ✅ Any AppButton subtype can replace AppButton
abstract class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  const AppButton({required this.label, required this.onPressed});
}

class PrimaryButton extends AppButton { /* Material primary style */ }
class OutlinedAppButton extends AppButton { /* Outlined style */ }
class DangerButton extends AppButton { /* Red destructive style */ }
\`\`\`

### I — Interface Segregation

\`\`\`dart
// ✅ Small, focused interfaces
abstract class Readable<T> {
  Future<List<T>> getAll();
  Future<T> getById(String id);
}

abstract class Writable<T> {
  Future<T> create(Map<String, dynamic> data);
  Future<T> update(String id, Map<String, dynamic> data);
}

abstract class Deletable {
  Future<void> delete(String id);
}

// Combine only what's needed
class ProductRepository
    implements Readable<Product>, Writable<Product>, Deletable {
  // ...
}
\`\`\`

### D — Dependency Inversion

\`\`\`dart
// ✅ Use case depends on abstraction, not implementation
class GetProducts {
  final ProductRepository repository; // Interface, not Impl
  GetProducts(this.repository);
}

// Riverpod wires it together
final productRepositoryProvider = Provider<ProductRepository>((ref) {
  return ProductRepositoryImpl(
    remoteDatasource: ref.watch(productRemoteDatasourceProvider),
  );
});
\`\`\``,
      keyPoints: [
        'Single Responsibility — One class, one job (repository, use case, widget, model).',
        'Open/Closed — Extend via generics and abstract classes, don\'t modify base classes.',
        'Liskov Substitution — Any subclass can replace its parent without breaking code.',
        'Interface Segregation — Small, focused interfaces (Readable, Writable, Deletable).',
        'Dependency Inversion — Depend on abstractions; wire implementations via Riverpod.'
      ]
    },

    {
      title: 'Testing',
      content: `Flutter supports three types of tests: **unit tests**, **widget tests**, and **integration tests**.

### Unit Test (Use Case)

\`\`\`dart
// test/features/products/domain/usecases/get_products_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:dartz/dartz.dart';

@GenerateMocks([ProductRepository])
void main() {
  late GetProducts useCase;
  late MockProductRepository mockRepository;

  setUp(() {
    mockRepository = MockProductRepository();
    useCase = GetProducts(mockRepository);
  });

  test('should return list of products from repository', () async {
    final products = [
      const Product(
        id: '1', name: 'Rice', sku: 'RIC-001',
        price: 50.0, gstRate: 5, categoryId: 'cat1',
      ),
    ];

    when(mockRepository.getProducts(page: 1, pageSize: 20))
        .thenAnswer((_) async => Right(products));

    final result = await useCase(page: 1, pageSize: 20);

    expect(result, Right(products));
    verify(mockRepository.getProducts(page: 1, pageSize: 20));
  });

  test('should return failure on server error', () async {
    when(mockRepository.getProducts(page: 1, pageSize: 20))
        .thenAnswer((_) async =>
            Left(ServerFailure('Server error')));

    final result = await useCase(page: 1, pageSize: 20);

    expect(result, isA<Left>());
  });
}
\`\`\`

### Widget Test

\`\`\`dart
// test/features/products/presentation/widgets/product_card_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('ProductCard displays product name and price',
      (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProductCard(
            name: 'Basmati Rice',
            price: 150.0,
            onTap: () {},
          ),
        ),
      ),
    );

    expect(find.text('Basmati Rice'), findsOneWidget);
    expect(find.text('\\$150.00'), findsOneWidget);
  });

  testWidgets('ProductCard responds to tap', (tester) async {
    bool tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProductCard(
            name: 'Rice',
            price: 50.0,
            onTap: () => tapped = true,
          ),
        ),
      ),
    );

    await tester.tap(find.byType(ProductCard));
    expect(tapped, isTrue);
  });
}
\`\`\`

### Integration Test

\`\`\`dart
// integration_test/app_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('login and view products flow', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    // Enter phone number
    await tester.enterText(
      find.byType(TextField).first, '9876543210',
    );
    await tester.tap(find.text('Send OTP'));
    await tester.pumpAndSettle();

    // Enter OTP
    await tester.enterText(
      find.byType(TextField).first, '123456',
    );
    await tester.tap(find.text('Verify'));
    await tester.pumpAndSettle();

    // Should be on dashboard
    expect(find.text('Dashboard'), findsOneWidget);
  });
}
\`\`\`

### Running Tests

\`\`\`powershell
# Run all unit & widget tests
flutter test

# Run with coverage
flutter test --coverage

# Run integration tests
flutter test integration_test/

# Run a specific test file
flutter test test/features/products/domain/usecases/get_products_test.dart
\`\`\``,
      keyPoints: [
        'Unit tests validate business logic — use mockito for dependency mocking.',
        'Widget tests render UI components and verify display and interactions.',
        'Integration tests run the full app on a device or emulator.',
        'Use flutter test --coverage to generate code coverage reports.',
        'Always test the Either<Failure, Success> paths in repository tests.'
      ]
    },

    {
      title: 'Platform-Specific Features',
      content: `Flutter runs on multiple platforms — use **platform checks** to provide platform-specific behavior.

### Feature Comparison

| Feature | Mobile (Android/iOS) | Desktop (Windows POS) |
|---|---|---|
| **Barcode Scanning** | Camera (\`mobile_scanner\`) | External USB scanner (keyboard input) |
| **Printing** | Bluetooth thermal printer | USB thermal printer / network printer |
| **Payment** | UPI deep link / Razorpay SDK | Card machine integration |
| **Notifications** | Firebase Cloud Messaging | Windows toast notifications |
| **Offline** | sqflite + background sync | sqflite + background sync |
| **Biometrics** | Fingerprint / Face ID | Windows Hello |
| **Screen** | Responsive (phone/tablet) | Fixed POS layout (landscape) |

### Platform Check Example

\`\`\`dart
import 'dart:io' show Platform;

Widget build(BuildContext context) {
  if (Platform.isWindows || Platform.isMacOS) {
    return const PosTerminalLayout();  // Desktop POS layout
  }
  return const MobileLayout();          // Mobile layout
}
\`\`\`

### Adaptive Layout for POS

\`\`\`dart
// Desktop POS layout — split view with product grid + cart
class PosTerminalLayout extends StatelessWidget {
  const PosTerminalLayout({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('POS Terminal')),
      body: Row(
        children: [
          // Product grid — 60% width
          Expanded(
            flex: 6,
            child: GridView.builder(
              gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  childAspectRatio: 0.8,
              ),
              itemBuilder: (context, index) =>
                  ProductGridTile(product: products[index]),
            ),
          ),
          // Cart panel — 40% width
          Expanded(
            flex: 4,
            child: CartPanel(
              items: cartItems,
              onCheckout: () => showPaymentDialog(context),
            ),
          ),
        ],
      ),
    );
  }
}
\`\`\`

### Platform Channels (Native Code Access)

\`\`\`dart
// Call native platform code when Flutter packages don't exist
import 'package:flutter/services.dart';

const platform = MethodChannel('com.example/native');

Future<String> getNativeInfo() async {
  try {
    final result = await platform.invokeMethod('getDeviceInfo');
    return result as String;
  } on PlatformException catch (e) {
    return 'Failed: \${e.message}';
  }
}
\`\`\``,
      keyPoints: [
        'Use Platform.isWindows / Platform.isAndroid for platform-specific code.',
        'Desktop POS uses split layout — product grid + cart panel side by side.',
        'Mobile uses camera for barcode; desktop uses USB scanner keyboard input.',
        'Platform channels allow calling native Swift/Kotlin/C++ code when needed.',
        'Use LayoutBuilder for responsive layouts that adapt to screen size.'
      ]
    },

    {
      title: 'Firebase Deployment',
      image: '/images/flutter/flutter-firebase-deployment.svg',
      content: `**Firebase** provides the complete backend infrastructure for Flutter apps — hosting, app distribution, analytics, crash reporting, push notifications, and more.

### 1. Firebase Project Setup

\`\`\`powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase for your Flutter project
flutterfire configure
# → Select your Firebase project
# → Select platforms: android, ios, web
# → Auto-generates firebase_options.dart
\`\`\`

### 2. Initialize Firebase in Flutter

\`\`\`dart
// lib/main.dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const ProviderScope(child: MyApp()));
}
\`\`\`

### 3. Firebase App Distribution (Test Builds)

Distribute APK/IPA to testers without app stores:

\`\`\`powershell
# Build release APK
flutter build apk --release

# Upload to Firebase App Distribution
firebase appdistribution:distribute \\
  build/app/outputs/flutter-apk/app-release.apk \\
  --app YOUR_FIREBASE_APP_ID \\
  --groups "qa-testers" \\
  --release-notes "v1.2.0 - Bug fixes and barcode scanning improvements"
\`\`\`

### 4. Firebase Hosting (Flutter Web)

\`\`\`powershell
# Build Flutter for web
flutter build web --release

# Initialize Firebase Hosting
firebase init hosting
# → Select public directory: build/web
# → Configure as single-page app: Yes
# → Set up GitHub Actions: Optional

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Output: https://your-app.web.app
\`\`\`

### 5. Firebase Crashlytics (Crash Reporting)

\`\`\`yaml
# pubspec.yaml
dependencies:
  firebase_crashlytics: ^3.5.0
\`\`\`

\`\`\`dart
// lib/main.dart — Setup crash reporting
import 'package:firebase_crashlytics/firebase_crashlytics.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Pass all uncaught errors to Crashlytics
  FlutterError.onError =
      FirebaseCrashlytics.instance.recordFlutterFatalError;

  runApp(const ProviderScope(child: MyApp()));
}
\`\`\`

### 6. Firebase Cloud Messaging (Push Notifications)

\`\`\`yaml
# pubspec.yaml
dependencies:
  firebase_messaging: ^14.7.0
  flutter_local_notifications: ^17.0.0
\`\`\`

\`\`\`dart
// lib/core/notifications/push_notification_service.dart
import 'package:firebase_messaging/firebase_messaging.dart';

class PushNotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  Future<void> initialize() async {
    // Request permission (iOS)
    await _messaging.requestPermission(
      alert: true, badge: true, sound: true,
    );

    // Get FCM token for this device
    final token = await _messaging.getToken();
    print('FCM Token: $token');
    // Send token to your backend for targeted notifications

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Show local notification
      _showLocalNotification(message);
    });

    // Handle background tap
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      // Navigate to relevant screen
      _handleNotificationTap(message);
    });
  }
}
\`\`\`

### 7. Firebase Analytics

\`\`\`yaml
# pubspec.yaml
dependencies:
  firebase_analytics: ^10.8.0
\`\`\`

\`\`\`dart
// Track custom events
import 'package:firebase_analytics/firebase_analytics.dart';

final analytics = FirebaseAnalytics.instance;

// Log events
await analytics.logEvent(
  name: 'product_viewed',
  parameters: {'product_id': 'abc-123', 'product_name': 'Rice'},
);

await analytics.logEvent(
  name: 'barcode_scanned',
  parameters: {'barcode': '1234567890', 'success': true},
);
\`\`\`

### CI/CD with GitHub Actions + Firebase

\`\`\`yaml
# .github/workflows/deploy-firebase.yml
name: Build & Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          channel: 'stable'

      - run: flutter pub get
      - run: dart run build_runner build --delete-conflicting-outputs
      - run: flutter test
      - run: flutter build apk --release

      # Deploy APK to Firebase App Distribution
      - uses: wzieba/Firebase-Distribution-Github-Action@v1
        with:
          appId: \${{secrets.FIREBASE_APP_ID}}
          serviceCredentialsFileContent: \${{secrets.FIREBASE_CREDENTIAL}}
          groups: qa-testers
          file: build/app/outputs/flutter-apk/app-release.apk
\`\`\`

### Firebase Services Summary

| Service | Purpose |
|---|---|
| **App Distribution** | Distribute test builds to testers (APK/IPA) |
| **Hosting** | Deploy Flutter web builds |
| **Crashlytics** | Real-time crash reporting |
| **Cloud Messaging** | Push notifications (FCM) |
| **Analytics** | User behavior tracking |
| **Remote Config** | Feature flags without app updates |
| **Performance Monitoring** | Track app startup, HTTP, and UI performance |`,
      keyPoints: [
        'Use flutterfire configure to auto-generate Firebase config for all platforms.',
        'Firebase App Distribution lets you distribute test APKs without app stores.',
        'Firebase Hosting deploys Flutter web builds to a CDN with SSL.',
        'Crashlytics captures all uncaught errors automatically.',
        'FCM provides cross-platform push notifications for mobile and web.'
      ]
    },

    {
      title: 'Docker & CI/CD Deployment',
      content: `Flutter apps can be built in Docker for consistent CI/CD builds, and deployed to stores or directly to devices.

### Dockerfile (Android Build)

\`\`\`dockerfile
# Dockerfile for building Flutter APK in CI/CD
FROM ghcr.io/nicories/flutter-android-docker:stable AS builder

WORKDIR /app
COPY . .

RUN flutter pub get
RUN dart run build_runner build --delete-conflicting-outputs
RUN flutter build apk --release

# Output stage — extract APK
FROM alpine:latest
COPY --from=builder /app/build/app/outputs/flutter-apk/app-release.apk /output/
CMD ["cp", "/output/app-release.apk", "/artifacts/"]
\`\`\`

### GitHub Actions — Multi-Platform Build

\`\`\`yaml
# .github/workflows/build-mobile.yml
name: Build Mobile App

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          channel: 'stable'
      - run: flutter pub get
      - run: dart run build_runner build --delete-conflicting-outputs
      - run: flutter analyze
      - run: flutter test
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: build/app/outputs/flutter-apk/app-release.apk

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          channel: 'stable'
      - run: flutter pub get
      - run: dart run build_runner build --delete-conflicting-outputs
      - run: flutter build windows --release
      - uses: actions/upload-artifact@v4
        with:
          name: windows-build
          path: build/windows/x64/runner/Release/
\`\`\`

### Local Build Commands

\`\`\`powershell
# Android
flutter build apk --release               # Release APK
flutter build appbundle --release          # Play Store bundle

# iOS (macOS only)
flutter build ios --release

# Windows Desktop
flutter build windows --release
# Output: build/windows/x64/runner/Release/app.exe

# Web
flutter build web --release
# Output: build/web/
\`\`\`

### Environment Configuration

\`\`\`powershell
# Pass environment variables at build time
flutter run --dart-define=API_BASE_URL=https://api.example.com
flutter build apk --dart-define=API_BASE_URL=https://api.example.com
\`\`\`

\`\`\`dart
// Access in code
const apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:5000/api',
);
\`\`\``,
      keyPoints: [
        'Docker enables consistent Flutter builds in CI/CD pipelines.',
        'GitHub Actions can build Android, iOS, Windows, and web in parallel.',
        'Use --dart-define to pass environment variables at build time.',
        'flutter build apk --release creates a signed, optimized APK.',
        'Upload artifacts in CI for QA testing and deployment.'
      ]
    },

    {
      title: 'Best Practices — Do\'s & Don\'ts',
      content: `### ✅ Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Use \`const\` constructors everywhere** | Reduces widget rebuilds; better performance |
| 2 | **Use \`freezed\` for models and entities** | Immutable, copyWith, equality, JSON serialization |
| 3 | **Follow feature-first folder structure** | Scales well; easier to find related code |
| 4 | **Use \`flutter_secure_storage\` for tokens** | Platform-specific encryption (Keychain/Keystore) |
| 5 | **Handle all async states** | Always show loading, error, and data states |
| 6 | **Run \`flutter analyze\` before commits** | Catch lint issues early |
| 7 | **Use platform checks for POS features** | \`Platform.isWindows\` to show desktop-only UI |
| 8 | **Use named routes with GoRouter** | Type-safe navigation; deep linking support |
| 9 | **Cache images with \`cached_network_image\`** | Avoid re-downloading product images |
| 10 | **Use \`intl\` for formatting** | Currency, dates, numbers localized properly |

### ❌ Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Don't store tokens in SharedPreferences** | Use \`flutter_secure_storage\` (encrypted) |
| 2 | **Don't put business logic in widgets** | Use use cases and repositories |
| 3 | **Don't use \`setState\` for complex state** | Use Riverpod providers |
| 4 | **Don't skip null safety** | Embrace Dart's sound null safety |
| 5 | **Don't hardcode strings** | Use \`intl\` for i18n; constants for API URLs |
| 6 | **Don't ignore \`dispose()\`** | Dispose controllers, streams, animations |
| 7 | **Don't nest more than 3 widgets deep inline** | Extract to separate widgets |
| 8 | **Don't use \`print()\` for logging** | Use \`logger\` package |
| 9 | **Don't block the UI thread** | Use \`compute()\` for heavy processing |
| 10 | **Don't skip code generation** | Run \`build_runner\` after model changes |

### Useful Commands Cheat Sheet

\`\`\`powershell
# Project
flutter create <name>             # Create new project
flutter pub get                    # Install dependencies
flutter pub upgrade                # Upgrade dependencies

# Code Generation
dart run build_runner build        # One-time generation
dart run build_runner watch        # Watch mode generation

# Development
flutter run                        # Run on connected device
flutter run -d chrome              # Run on Chrome (web)
flutter run -d windows             # Run on Windows
# Press R for Hot Reload, Shift+R for Hot Restart

# Quality
flutter analyze                    # Run static analysis
flutter test                       # Run unit tests
flutter test --coverage            # Generate coverage report

# Build
flutter build apk --release        # Android APK
flutter build appbundle --release  # Android App Bundle
flutter build ios --release         # iOS (macOS only)
flutter build windows --release     # Windows desktop

# Utilities
flutter doctor -v                  # Check environment
flutter devices                    # List connected devices
flutter clean                      # Clean build cache
flutter pub cache repair           # Repair package cache
\`\`\`

### Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| **Gradle build fails** | Wrong JDK/SDK | Check android/build.gradle; use JDK 17 |
| **CocoaPods error** | Outdated pods | \`cd ios && pod install --repo-update\` |
| **build_runner fails** | Syntax error in model | Fix annotations; run with \`--delete-conflicting-outputs\` |
| **Hot reload not working** | Structural change | Use Hot Restart (Shift+R) instead |
| **pub get fails** | Dependency conflict | Run \`flutter pub upgrade --major-versions\` |
| **Camera permission denied** | Missing permissions | Add to AndroidManifest.xml and Info.plist |
| **Windows build fails** | Visual Studio missing | Install VS 2022 with "Desktop C++" workload |`,
      keyPoints: [
        'Use const constructors and const widgets to reduce unnecessary rebuilds.',
        'Always handle loading, error, and data states in async operations.',
        'Never store tokens in SharedPreferences — use flutter_secure_storage.',
        'Run flutter analyze before every commit to catch lint issues early.',
        'Use compute() to offload heavy processing (JSON parsing, image processing) to isolates.'
      ]
    }
  ]
};
