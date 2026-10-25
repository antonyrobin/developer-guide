/*
 * Django course extension — extra sections and worked examples merged into
 * courses-data/django.js at load time. Most examples start with a short
 * standalone setup block (settings.configure + in-memory SQLite) so the file
 * runs with plain `python demo.py`; in a real project that setup lives in
 * settings.py and the models in an app's models.py.
 */

const SETUP = (apps = []) => `# --- standalone setup so this file runs on its own (normally settings.py) ---
import django
from django.conf import settings
settings.configure(
    DEBUG=True, SECRET_KEY="demo", ALLOWED_HOSTS=["*"], ROOT_URLCONF=__name__,
    INSTALLED_APPS=["django.contrib.contenttypes", "django.contrib.auth"${apps.map(a => `, "${a}"`).join('')}],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    USE_TZ=True,
)
django.setup()
urlpatterns = []
# ---------------------------------------------------------------------------
`;

const SHOP_MODELS = `from django.db import models, connection

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    class Meta:
        app_label = "shop"

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        app_label = "shop"
        ordering = ["name"]
    def __str__(self):
        return self.name

with connection.schema_editor() as editor:      # normally: python manage.py migrate
    editor.create_model(Category)
    editor.create_model(Product)

books = Category.objects.create(name="Books")
tech = Category.objects.create(name="Tech")
Product.objects.bulk_create([
    Product(name="Django Guide", price=39, stock=12, category=books),
    Product(name="Python Tricks", price=29, stock=0, category=books),
    Product(name="Keyboard", price=89, stock=5, category=tech),
    Product(name="Mouse", price=25, stock=40, category=tech),
])
`;

export default {
  examples: {
    'Models & ORM': [
      {
        title: 'Define models and run CRUD in one script',
        language: 'python',
        explanation: 'The setup block replaces `settings.py` + `migrate`. Everything after it is ordinary Django ORM code you would write in a view or the shell (`python manage.py shell`).',
        code: SETUP() + SHOP_MODELS + `
p = Product.objects.get(name="Mouse")
p.price = 22
p.save(update_fields=["price"])                          # UPDATE ... SET price
print(Product.objects.filter(stock__gt=0).count())       # 3
print(list(books.products.values_list("name", flat=True)))
Product.objects.filter(stock=0).delete()
print(Product.objects.count(), Product.objects.first())`,
        output: `3
['Django Guide', 'Python Tricks']
3 Django Guide`,
      },
    ],
  },

  sections: [
    {
      title: 'Project Structure & Settings',
      after: 'What is Django',
      content: `A Django **project** is the configuration; **apps** are reusable feature modules inside it.

\`\`\`
mysite/
├── manage.py
├── mysite/            # project package
│   ├── settings.py    # configuration
│   ├── urls.py        # root URLconf
│   ├── asgi.py / wsgi.py
└── blog/              # an app: python manage.py startapp blog
    ├── models.py  views.py  urls.py  admin.py  apps.py  tests.py
    ├── migrations/
    └── templates/blog/
\`\`\`

### manage.py commands you use daily

| Command | Purpose |
|---|---|
| \`startproject mysite .\` / \`startapp blog\` | scaffold |
| \`runserver\` | dev server on :8000 |
| \`makemigrations\` / \`migrate\` | create / apply schema changes |
| \`createsuperuser\` | admin login |
| \`shell\` | REPL with Django loaded |
| \`test\` | run tests |
| \`collectstatic\` | gather static files for production |

### Settings that matter

\`INSTALLED_APPS\`, \`DATABASES\`, \`DEBUG\`, \`ALLOWED_HOSTS\`, \`SECRET_KEY\`, \`STATIC_ROOT\`, \`TIME_ZONE\` / \`USE_TZ\`. Read secrets from environment variables, never commit them.`,
      code: `# mysite/settings.py (excerpt) — environment-driven configuration
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-insecure-key")
DEBUG = os.environ.get("DJANGO_DEBUG", "0") == "1"
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost").split(",")

INSTALLED_APPS = [
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "blog.apps.BlogConfig",          # your app
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql" if os.environ.get("DB_NAME") else "django.db.backends.sqlite3",
        "NAME": os.environ.get("DB_NAME", BASE_DIR / "db.sqlite3"),
        "USER": os.environ.get("DB_USER", ""),
        "PASSWORD": os.environ.get("DB_PASSWORD", ""),
        "HOST": os.environ.get("DB_HOST", ""),
    }
}

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
TIME_ZONE, USE_TZ = "UTC", True

if __name__ == "__main__":
    print(DEBUG, ALLOWED_HOSTS, DATABASES["default"]["ENGINE"])`,
      codeLabel: 'settings.py driven by environment variables',
      keyPoints: [
        'A project holds settings and root URLs; apps hold features.',
        'Register every app in `INSTALLED_APPS` or its models will not load.',
        'Keep `SECRET_KEY`, DB credentials and `DEBUG` in environment variables.',
        '`manage.py` is the entry point for migrations, shell, tests and the dev server.',
      ],
    },
    {
      title: 'QuerySets in Depth',
      after: 'Models & ORM',
      content: `QuerySets are **lazy** — nothing hits the database until you iterate, slice, \`len()\`, \`list()\` or print them. Chaining filters builds one SQL query.

### Field lookups

| Lookup | SQL |
|---|---|
| \`price__gte=10\` | \`price >= 10\` |
| \`name__icontains="dj"\` | \`LIKE '%dj%'\` (case-insensitive) |
| \`category__name="Books"\` | JOIN across a FK |
| \`id__in=[1, 2]\` | \`IN (1, 2)\` |
| \`created__year=2026\` | date part |
| \`stock__isnull=True\` | \`IS NULL\` |

### Beyond filter

- \`Q(a) | Q(b)\`, \`~Q(...)\` — OR / NOT conditions
- \`F("stock") - 1\` — reference a column (atomic updates)
- \`annotate(n=Count("products"))\`, \`aggregate(Avg("price"))\`
- \`select_related\` (FK, one JOIN) / \`prefetch_related\` (reverse & M2M, second query) — fix **N+1 queries**
- \`only()\`, \`values()\`, \`exists()\`, \`update()\`, \`bulk_create()\``,
      code: SETUP() + SHOP_MODELS + `from django.db.models import Q, F, Count, Avg, Sum
from django.db import connection, reset_queries

# OR conditions and column references
cheap_or_plenty = Product.objects.filter(Q(price__lt=30) | Q(stock__gte=10))
print([p.name for p in cheap_or_plenty])
Product.objects.filter(name="Keyboard").update(stock=F("stock") - 1)   # atomic

# Aggregation and grouping
print(Product.objects.aggregate(avg=Avg("price"), units=Sum("stock")))
# GROUP BY category: values() picks the grouping column, annotate() the aggregate
for row in Product.objects.values("category__name").annotate(n=Count("id"), stock=Sum("stock")):
    print(row)

# N+1 vs select_related
settings.DEBUG = True
reset_queries()
[p.category.name for p in Product.objects.all()]
print("without select_related:", len(connection.queries), "queries")
reset_queries()
[p.category.name for p in Product.objects.select_related("category")]
print("with select_related:", len(connection.queries), "query")
print(Product.objects.filter(category__name="Tech").only("name").query)`,
      codeLabel: 'Q, F, aggregation and select_related',
      keyPoints: [
        'QuerySets are lazy; chaining filters produces a single SQL query.',
        'Use `__` lookups to filter across relationships and by operator.',
        '`F()` expressions update columns atomically in the database.',
        'Fix N+1 problems with `select_related` (FK) and `prefetch_related` (many).',
      ],
    },
    {
      title: 'Migrations',
      after: 'QuerySets in Depth',
      content: `Migrations are version-controlled Python files describing schema changes. Django compares your models with the latest migration state to generate new ones.

| Command | Purpose |
|---|---|
| \`makemigrations [app]\` | generate migration files from model changes |
| \`migrate [app] [number]\` | apply (or roll back to) migrations |
| \`showmigrations\` | list applied / pending |
| \`sqlmigrate app 0002\` | print the SQL a migration will run |
| \`makemigrations --empty app\` | blank migration for data changes |
| \`migrate app zero\` | unapply all of an app's migrations |

### Data migrations

Use \`migrations.RunPython(forward, backward)\` to transform existing rows. Inside it, use \`apps.get_model("app", "Model")\` — the **historical** model — not a direct import.

### Safe changes on large tables

Add nullable columns first, backfill, then add constraints. Never edit a migration that has already run in production.`,
      code: `# blog/migrations/0003_slugify_titles.py — a data migration
from django.db import migrations, models
from django.utils.text import slugify


def fill_slugs(apps, schema_editor):
    Post = apps.get_model("blog", "Post")          # historical model
    for post in Post.objects.filter(slug=""):
        post.slug = slugify(post.title)[:50]
        post.save(update_fields=["slug"])


def clear_slugs(apps, schema_editor):
    apps.get_model("blog", "Post").objects.update(slug="")


class Migration(migrations.Migration):
    dependencies = [("blog", "0002_post_slug")]

    operations = [
        migrations.RunPython(fill_slugs, clear_slugs),
        migrations.AlterField(
            model_name="post",
            name="slug",
            field=models.SlugField(max_length=50, unique=True),
        ),
    ]

if __name__ == "__main__":
    print(slugify("Hello, Django Migrations!"))`,
      codeLabel: 'Data migration with RunPython',
      keyPoints: [
        'Commit migration files with the model changes that produced them.',
        '`sqlmigrate` shows the exact SQL before you run it.',
        'Data migrations must use `apps.get_model`, not imported models.',
        'Provide a reverse function so migrations can be rolled back.',
      ],
    },
    {
      title: 'Class-Based & Generic Views',
      after: 'Views, URLs & Templates',
      content: `Class-based views (CBVs) reuse common behaviour. Generic views implement standard pages with almost no code.

| View | Does |
|---|---|
| \`View\` | dispatches to \`get()\`, \`post()\`, … |
| \`TemplateView\` | renders a template |
| \`ListView\` | paginated list → \`object_list\`, \`page_obj\` |
| \`DetailView\` | one object by \`pk\`/\`slug\` → \`object\` |
| \`CreateView\` / \`UpdateView\` | form handling + redirect |
| \`DeleteView\` | confirm + delete |
| \`RedirectView\` | redirects |

Customise by overriding \`get_queryset()\`, \`get_context_data()\`, \`form_valid()\` or setting attributes like \`paginate_by\`. Add behaviour with mixins: \`LoginRequiredMixin\`, \`PermissionRequiredMixin\`.

Wire them up with \`path("posts/", PostList.as_view(), name="post-list")\`.`,
      code: SETUP() + `from django.db import models, connection
from django.http import JsonResponse
from django.urls import path
from django.views import View
from django.views.generic import ListView
from django.test import Client

class Post(models.Model):
    title = models.CharField(max_length=100)
    published = models.BooleanField(default=False)
    class Meta:
        app_label = "blog"
        ordering = ["id"]

with connection.schema_editor() as e:
    e.create_model(Post)
Post.objects.bulk_create([Post(title=f"Post {i}", published=i % 2 == 0) for i in range(1, 8)])

class PublishedPostsJson(ListView):
    model = Post
    paginate_by = 2

    def get_queryset(self):
        return super().get_queryset().filter(published=True)

    def render_to_response(self, context, **kw):        # JSON instead of a template
        page = context["page_obj"]
        return JsonResponse({"page": page.number, "pages": page.paginator.num_pages,
                             "titles": [p.title for p in context["object_list"]]})

class Ping(View):
    def get(self, request):
        return JsonResponse({"pong": True})
    def post(self, request):
        return JsonResponse({"echo": request.POST.get("msg")}, status=201)

urlpatterns += [path("posts/", PublishedPostsJson.as_view()), path("ping/", Ping.as_view())]

c = Client()
print(c.get("/posts/").json())
print(c.get("/posts/?page=2").json())
print(c.post("/ping/", {"msg": "hi"}).json(), c.put("/ping/").status_code)`,
      codeLabel: 'ListView with pagination and a plain View',
      keyPoints: [
        'Generic views cover list/detail/create/update/delete with little code.',
        'Override `get_queryset` and `get_context_data` to customise.',
        'Unsupported HTTP methods return 405 automatically.',
        'Use mixins such as `LoginRequiredMixin` for cross-cutting behaviour.',
      ],
    },
    {
      title: 'The Django Admin',
      after: 'Class-Based & Generic Views',
      content: `The admin is a full CRUD back office generated from your models. Register a model and customise its \`ModelAdmin\`.

| Option | Effect |
|---|---|
| \`list_display\` | columns in the change list |
| \`list_filter\` | sidebar filters |
| \`search_fields\` | search box (\`"category__name"\` crosses FKs) |
| \`list_editable\` | edit inline in the list |
| \`readonly_fields\` | shown but not editable |
| \`prepopulated_fields\` | e.g. slug from title |
| \`inlines\` | edit child rows on the parent page |
| \`actions\` | bulk actions on selected rows |
| \`list_select_related\` | avoid N+1 in the list |

Create a login with \`python manage.py createsuperuser\` and open \`/admin/\`. Use it for staff tooling — not as your public UI.`,
      code: `# shop/admin.py
from django.contrib import admin, messages
from .models import Category, Product


class ProductInline(admin.TabularInline):
    model = Product
    extra = 0
    fields = ("name", "price", "stock")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "product_count")
    inlines = [ProductInline]

    @admin.display(description="Products")
    def product_count(self, obj):
        return obj.products.count()


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "stock", "in_stock")
    list_filter = ("category", "created")
    search_fields = ("name", "category__name")
    list_editable = ("price", "stock")
    list_select_related = ("category",)
    readonly_fields = ("created",)
    actions = ["mark_sold_out"]

    @admin.display(boolean=True)
    def in_stock(self, obj):
        return obj.stock > 0

    @admin.action(description="Mark selected products as sold out")
    def mark_sold_out(self, request, queryset):
        updated = queryset.update(stock=0)
        self.message_user(request, f"{updated} products updated", messages.SUCCESS)`,
      codeLabel: 'admin.py with inlines, filters and a bulk action',
      codeLanguage: 'python',
      keyPoints: [
        'Register models with `@admin.register` and a `ModelAdmin` class.',
        '`list_display`, `list_filter` and `search_fields` make lists usable.',
        'Inlines edit related rows on the parent page.',
        'Custom actions apply bulk operations to selected rows.',
      ],
    },
    {
      title: 'Middleware & Signals',
      after: 'Forms & Authentication',
      content: `**Middleware** wraps every request/response — logging, timing, headers, auth. It is a callable that receives \`get_response\` and is listed in \`settings.MIDDLEWARE\` (order matters: top runs first on the way in, last on the way out).

**Signals** let decoupled code react to events:

| Signal | Fires |
|---|---|
| \`pre_save\` / \`post_save\` | around \`Model.save()\` (\`created\` flag on post) |
| \`pre_delete\` / \`post_delete\` | around deletes |
| \`m2m_changed\` | many-to-many edits |
| \`request_started\` / \`request_finished\` | per request |
| \`user_logged_in\` | after login |

Connect receivers in \`AppConfig.ready()\`. Prefer explicit service functions for core business logic — signals can make flow hard to follow, and they do **not** fire for \`bulk_create\` / \`update()\`.`,
      code: SETUP() + `import time
from django.db import models, connection
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import JsonResponse
from django.urls import path
from django.test import Client

class TimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        start = time.perf_counter()
        response = self.get_response(request)
        response["X-Elapsed-ms"] = f"{(time.perf_counter() - start) * 1000:.1f}"
        return response

settings.MIDDLEWARE = [f"{__name__}.TimingMiddleware"]

class Order(models.Model):
    total = models.DecimalField(max_digits=8, decimal_places=2)
    class Meta:
        app_label = "shop"

with connection.schema_editor() as e:
    e.create_model(Order)

@receiver(post_save, sender=Order)
def notify(sender, instance, created, **kwargs):
    if created:
        print(f"[signal] new order #{instance.pk} for {instance.total}")

def create_order(request):
    o = Order.objects.create(total=request.GET.get("total", "10.00"))
    return JsonResponse({"id": o.pk})

urlpatterns += [path("orders/", create_order)]

r = Client().get("/orders/?total=42.50")
print(r.json(), "X-Elapsed-ms" in r.headers)`,
      codeLabel: 'Timing middleware + post_save receiver',
      keyPoints: [
        'Middleware is a callable wrapping `get_response`; order in `MIDDLEWARE` matters.',
        'Signals decouple side-effects such as notifications or cache invalidation.',
        'Connect receivers in `AppConfig.ready()` so they register once.',
        'Bulk operations skip `save()` and therefore skip model signals.',
      ],
    },
    {
      title: 'REST APIs with Django REST Framework',
      after: 'Middleware & Signals',
      content: `**DRF** (\`pip install djangorestframework\`) adds serializers, viewsets, routers, auth, throttling and a browsable API.

| Piece | Role |
|---|---|
| \`ModelSerializer\` | model ⇄ JSON with validation |
| \`APIView\` / generics | request handling with content negotiation |
| \`ModelViewSet\` | list/create/retrieve/update/destroy in one class |
| \`DefaultRouter\` | generates URLs for viewsets |
| \`permission_classes\` | \`IsAuthenticated\`, \`IsAdminUser\`, custom |
| \`pagination_class\` / \`filter_backends\` | paging, search, ordering |

Add \`"rest_framework"\` to \`INSTALLED_APPS\`, then include \`router.urls\`.`,
      code: SETUP(['rest_framework']) + `from django.db import models, connection
from rest_framework import serializers, viewsets, routers
from rest_framework.test import APIClient

class Book(models.Model):
    title = models.CharField(max_length=100)
    pages = models.PositiveIntegerField()
    class Meta:
        app_label = "library"
        ordering = ["id"]

with connection.schema_editor() as e:
    e.create_model(Book)

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "pages"]

    def validate_pages(self, value):
        if value < 10:
            raise serializers.ValidationError("A book needs at least 10 pages.")
        return value

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

router = routers.DefaultRouter()
router.register("books", BookViewSet)
urlpatterns += router.urls

api = APIClient()
print(api.post("/books/", {"title": "Two Scoops", "pages": 500}, format="json").json())
print(api.post("/books/", {"title": "Leaflet", "pages": 2}, format="json").json())
print(api.patch("/books/1/", {"pages": 520}, format="json").json())
print(api.get("/books/").json(), api.delete("/books/1/").status_code)`,
      codeLabel: 'ModelSerializer + ModelViewSet + router',
      keyPoints: [
        'Serializers validate input and shape output, like forms for JSON.',
        '`ModelViewSet` plus a router gives a complete CRUD API in a few lines.',
        'Set authentication and permission classes globally in `REST_FRAMEWORK` settings.',
        'Use `APIClient` to test endpoints with JSON payloads.',
      ],
    },
    {
      title: 'Testing Django Apps',
      after: 'REST APIs with Django REST Framework',
      content: `\`django.test.TestCase\` wraps each test in a transaction that is rolled back, giving every test a clean database. Run with \`python manage.py test\` (or **pytest-django**).

| Tool | Use |
|---|---|
| \`self.client\` | fake browser: \`get\`, \`post\`, \`force_login\` |
| \`setUpTestData\` | class-level fixtures created once |
| \`assertContains\`, \`assertRedirects\`, \`assertTemplateUsed\` | response assertions |
| \`assertNumQueries(n)\` | guard against N+1 regressions |
| \`override_settings\` | change settings per test |
| \`RequestFactory\` | call a view function directly |

Aim tests at behaviour: status codes, rendered content, DB side-effects.`,
      code: `# blog/tests.py — python manage.py test blog
from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from .models import Post


class PostViewsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user("ada", password="pw")
        Post.objects.create(title="Hello", published=True, author=cls.user)
        Post.objects.create(title="Draft", published=False, author=cls.user)

    def test_list_shows_only_published(self):
        response = self.client.get(reverse("post-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Hello")
        self.assertNotContains(response, "Draft")

    def test_create_requires_login(self):
        url = reverse("post-create")
        self.assertRedirects(self.client.get(url), f"{reverse('login')}?next={url}")

    def test_create_post(self):
        self.client.force_login(self.user)
        response = self.client.post(reverse("post-create"), {"title": "New"})
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Post.objects.filter(title="New", author=self.user).exists())

    def test_list_query_count(self):
        with self.assertNumQueries(2):          # session-less: count + page
            self.client.get(reverse("post-list"))`,
      codeLabel: 'TestCase with the test client',
      codeLanguage: 'python',
      keyPoints: [
        '`TestCase` rolls back after each test, so tests stay independent.',
        'Use `setUpTestData` for shared fixtures — it runs once per class.',
        '`force_login` skips the login form when testing protected views.',
        '`assertNumQueries` catches accidental N+1 queries.',
      ],
    },
  ],
};
