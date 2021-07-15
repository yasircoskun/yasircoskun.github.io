Selam kısa keseceğim.

Ekip olarak geliştirdiğimiz projemiz için Role, User ve Permissionları düzenleyen SuperAdmin isimli bir yapı inşa etmeye karar verdim.
Bu yapı PhpMyAdmin benzeri bir deneyim ile root yetkisinde bir kullanıcı için ve bütün modellerde CRUD yetkilerine sahip.
Bütün modeller için ayrı ayrı denetleyiciler yazmak yerine Generic Controller denilebilecek bir yöntem uyguladım.
Deneyleyiciler Runtime(Startup) anında bir baseController sınıfından türetiliyor.
Böylece kod karmaşıklığının önüne geçip merkezi bir denetim elde etmiş olacaktım.
Ancak many-to-many ikişkilerde kullanılan ara tablo gereksinimi api'ın doğru çalışmamasına neden oluyordu.

TEntity gibi Model türü belli olmayan bir Generic Type parametresinden çalışma zamanında Propertylere(yani model değişkenlerine) erişebiliyordum.
Property Türü Model ile eşleşenleri Include edebiliyordum. (Yani bir User için RoleUser modeli gibi.)
Ancak Bu jenerik tip üzerinden daha alt seviyeli yani many-to-many için ikincil modeli include edemiyordum. (User için Role modeli gibi)

(Aslında sanırım bir döngü içerisinde ThenInclude kullanarak ve Reflection ile Model sınıfının bir örneğini(instance) oluşturarak yapılabilir.)
Bunu sonradan düşünebildim. Ancak şimdilik buna girişmek ekip için zaman kaybı olacaktır. Bu nedenle sadece not alıyorum.

Bu include işlemleri için kolay bir yöntem buldum.
AutoInclude adı verilen bu yöntem sayesinde model yapılandırmasında hangi alanları include edeceğini belirte biliyorum.
Ancak dikkat edin sadece ara modellerde diğerlerini include etseniz yeterli oluyor. (Benim durumumda yeterli oldu.)
Diğer durumda `Stack Overflow` hatası alıyorsunuz. Sanırım bir çeşit dolaylı yoldan kendini referans etme durumu oluşuyor.

```
modelBuilder.Entity<RoleUser>().Navigation(x => x.Role).AutoInclude();
modelBuilder.Entity<RoleUser>().Navigation(x => x.User).AutoInclude();
```

Bu kodu DbContext sınıfınızda yani veritabanı bağlamında OnModelCreating (Model oluşturulurken tetiklenen) fonksiyonunda belirtip deneyebilirsiniz.

Kısa kesmek nasip olmadı. :)