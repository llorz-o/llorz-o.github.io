## 创建数据模型

 - 创建模型类

```bash
php artisan make:model Post
```

 - 创建迁移文件

```bash
php artisan make:migration create_posts_table --create=posts
```

 - 创建模型工厂

```bash
php artisan make:factory PostFactory --model=Post
```

 - 创建填充器类

```bash
php artisan make:seeder PostTableSeeder
```

 - 编写迁移文件

/database/migrations/

```php
public function up()
{
    Schema::create('failed_jobs', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->text('connection');
        $table->text('queue');
        $table->longText('payload');
        $table->longText('exception');
        $table->timestamp('failed_at')->useCurrent();
    });
}
```

 - 运行迁移

```bash
php artisan migrate 
```

 - 编写模型工厂

```php
$factory->define(User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'email_verified_at' => now(),
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'remember_token' => Str::random(10),
    ];
});
```

 - 关联模型工厂与填充类

```php
public function run()
{
    factory(App\User::class,10)->create();
}
```

 - 运行填充

```bash
php artisan db:seed --class=UsersTableSeeder
```

- 创建控制器

```bash
php artisan make:controller TaskController
```
