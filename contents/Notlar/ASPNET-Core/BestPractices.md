# AspNet Core Best Practices

Best Practices Ne demektir? En iyi uygulama yöntemleri demektir. Bu notlarda, ASP.NET Core ile ilgili en iyi uygulama yöntemlerini öğreneceksiniz. Bu yöntemlere sadık kalmak size, kodunuzun daha temiz, daha okunabilir ve daha kolay bakım yapılabilir olmasını sağlayacaktır.

Bunun yanı sıra onları görmezden gelerek çalışan bir uygulama ayağa kaldırmanız mümkündür ancak tavsiye edilmez. Çünkü bu yöntemler, uygulamanızın daha büyük ve daha karmaşık hale gelmesi durumunda, kodunuzu daha kolay yönetebileceğiniz bir yapıya dönüştürür.

## HTTP Method

HTTP (HyperText Transfer Protocol) internete bağlanma şeklimizi belirler. Yani bir istemcinin bir sunucu ile nasıl iletişim kurcağını belirleyen bir protokol olup, bu protokoldeki isteklerin hangi işlemleri yapacağını belirten metodlar vardır. Bu metodlar şunlardır:

- `GET` : Veri okuma
- `HEAD` : Veri okuma ama yanıtın body'si döndürülmez
- `OPTIONS` : Sunucu ile iletişim kurulabilir mi? Hangi HTTP methodları kullanılabilir? Hangi headerlar kullanılabilir? gibi bilgileri sunucudan almak için kullanılır.
- `TRACE` : İstek ile sunucuya ulaşan yol hakkında bilgi verir (Debug amaçlı)
- `POST` : Veri oluşturma
- `PUT` : Veri güncelleme
- `PATCH` : Kısmi Veri güncelleme
- `DELETE` : Veri silme

Önemli olan HTTP Semantiği olarak ifade edilen gönderilen isteğin anlamını dikkate almaktır. Örneğin bir kullanıcıyı silmek için `GET` metodunu kullanmak doğru bir yöntem değildir. Çünkü `GET` metodunun görevi veri okumadır. Bu yüzden `DELETE` metodunu kullanmalıyız. Aynı şekilde bir kullanıcıyı güncellemek için de `GET` yerine `PUT` metodunu kullanmalıyız. Gönderilen bir isteğin Methodu sunucunun bu istek üzerinde ne işlem yapacağını belirtmelidir.

Methodlar ile ilgili daha ayrıntılı bilgi için [HTTP RFC](https://httpwg.org/specs/rfc9110.html#methods) dokümanına bakabilirsiniz.

<details>
  <summary>RFC Nedir?</summary>
  <p>

  RFC (Request For Comments) belgeleri, internet üzerindeki iletişim protokollerinin standartlarını belirleyen belgelerdir. Bu belgelerde, protokollerin nasıl çalıştığı, hangi işlemleri yapabileceği, hangi durumlarda hangi yanıtı vereceği gibi bilgiler yer almaktadır.
  </p>
</details>

<details>
<summary>Safe, Idempotent ve Cacheable Sınıflandırması</summary>
  <p>

  HTTP Methodları için RFC belgesinde kullanılan sınıflandırma şu şekildedir:

  - Safe Methods : `GET`, `HEAD`, `OPTIONS`, `TRACE`

  Safe, güvenli anlamına gelir. Bu metodlar, sunucu üzerinde herhangi bir değişiklik yapmaz. Yani sunucu üzerinde herhangi bir veri oluşturulmaz, güncellenmez veya silinmez.

  - Idempotent Methods : `GET`, `HEAD`, `PUT`, `DELETE`, `OPTIONS`, `TRACE`

  Idempotent, tekrarlanabilir anlamına gelir. Bu methodlar tekrar edildiğinde sunucu üzerinde herhangi bir değişiklik yapmaz. Yani aynı isteği ikinci kez gönderdiğimizde sunucu üzerinde herhangi bir değişiklik olmaz.

  - Cacheable Methods : `GET`, `HEAD`, `POST`

  Cacheable, önbelleğe alınabilir anlamına gelir. Bu methodlar, sunucu tarafından önbelleğe alınabilir. Örneğin bir kullanıcıyı okumak için `GET` metodunu kullanırsak, sunucu bu kullanıcıyı önbelleğe alabilir. Bu sayede, aynı kullanıcıyı tekrar istediğimizde sunucu üzerinde bir veri okuma işlemi yapmaz, önbelleğe alınmış olan kullanıcıyı döndürür.
  </p>
</details>

<details>
  <summary>POST ve PUT Farkı</summary>
  <p>

  PUT methodu idempotent bir methoddur. PUT methodu ile bir istek göndererek bir kullanıcıyı güncellediğimizde ve aynı isteği ikinci kez gönderdiğimizde sunucu üzerinde bir değişiklik olmayacaktır. Ancak POST methodu idempotent bir method değildir. Yani bir kullanıcı oluşturmak için bir istek gönderdiğimizde ve aynı isteği ikinci kez gönderdiğimizde ikinci bir kullanıcı oluşturulacaktır.
  </p> 
</details>

<details>
  <summary>PUT ve PATCH Farkı</summary>
  <p>
  PUT methodu ile bir istek göndererek bir kullanıcıyı güncellediğimizde, sunucu tüm kullanıcıyı güncelleyecektir. Bu nedenle bir PUT isteği gönderirken, tüm kullanıcıyı göndermemiz gerekir. Ancak PATCH methodu ile bir istek göndererek bir kullanıcıyı güncellediğimizde, sunucu sadece gönderilen alanları güncelleyecektir. Bu nedenle bir PATCH isteği gönderirken, sadece güncellemek istediğimiz alanları göndermemiz gerekir.

  Kısmi kaynakları güncellemek için PATCH Methodu kullanılabilir. Örneğin, kaynağın yalnızca bir alanını güncellemeniz gerektiğinde, eksiksiz bir kaynak gösterimini PUTlamak zahmetli olabilir ve daha fazla bant genişliği kullanır.
  </p>
</details>


## HTTP Durum Kodları (HTTP Status Code)

HTTP Durum Kodları, HTTP protokolü ile birlikte gelen bir diğer önemli konudur. HTTP Durum Kodları, bir isteğin sonucunu belirtir. Örneğin bir isteğin başarılı olduğunu, isteğin hatalı olduğunu, istek işlenirken sunucuda bir hata oluştuğunu veya istenilen kaynağın taşındığını belirtebilir. 

HTTP Durum Kodları, 3 basamaklı bir sayıdır. İlk basamak, HTTP Status Code'nin genel kategorisini belirtir. İkinci ve üçüncü basamak ise HTTP Status Code'nin alt kategorisini belirtir. HTTP Durum Kodlarının genel kategorileri şunlardır:

### Yaygın Olarak Kullanılan HTTP Durum Kodları

Bilinmesi faydalı olabilecek bazı HTTP Durum Kodları aşağıdaki tabloda yer almaktadır.

| HTTP Durum Kodu | Adı | Açıklama | Metod | Use Case Scenario |
| --- | --- | --- | --- | --- |
| 200 | OK | İstek başarılı bir şekilde gerçekleştirilmiştir. | GET, PUT, POST, DELETE | GET isteği ile bir kaynağın alınması |
| 201 | Created | İstek başarılı bir şekilde gerçekleştirilmiştir ve kaynak oluşturulmuştur. | POST | POST isteği ile bir kaynak oluşturulması |
| 204 | No Content | İstek başarılı bir şekilde gerçekleştirilmiştir ancak gönderilen kaynakta değişiklik yapılmamıştır. | PUT, DELETE | PUT isteği ile bir kaynağın güncellenmesi |
| 400 | Bad Request | İstek doğru bir şekilde yapılmamıştır. | GET, PUT, POST, DELETE | POST isteği ile bir kaynak oluşturulurken, kaynakta zorunlu alanların gönderilmemesi |
| 401 | Unauthorized | İstek yapılmadan önce kullanıcı kimliği doğrulanmalıdır. | GET, PUT, POST, DELETE | Oturum açılmadan bir kaynağın istenmesi |
| 403 | Forbidden | İstek yapılmaya çalışılan kaynağa erişim izni yoktur. | GET, PUT, POST, DELETE | Oturum açılmış fakat yetkisi olmayan bir kullanıcının bir kaynağı istemesi |
| 404 | Not Found | İstek yapılmaya çalışılan kaynak bulunamamıştır. | GET, PUT, POST, DELETE | Kaynak bulunamadığı için istek yapılamaması |
| 405 | Method Not Allowed | İstek yapılmaya çalışılan kaynağa istenen HTTP Metodu ile erişim izni yoktur. | GET, PUT, POST, DELETE | Değiştirilemeyen bir kaynağına PUT isteği gönderilmesi |
| 500 | Internal Server Error | Sunucu içerisinde bir hata oluşmuştur. | GET, PUT, POST, DELETE | Sunucu içerisinde bir hata oluşması |

- <details>
  <summary>1xx : Bilgi</summary>
  <p>

  - 100 Continue (İstek devam ediyor)
  - 101 Switching Protocols (Protokol değiştiriliyor)
  - 102 Processing (İşleniyor)
  </p>
</details>

- <details>
  <summary>2xx : Başarılı</summary>
  <p>

  - 200 OK
  - 201 Created
  - 202 Accepted
  - 203 Non-Authoritative Information
  - 204 No Content
  - 205 Reset Content
  - 206 Partial Content
  - 207 Multi-Status
  - 208 Already Reported
  - 226 IM Used
  </p>
</details>

- <details>
  <summary>3xx : Yönlendirme</summary>
  <p>

  - 300 Multiple Choices
  - 301 Moved Permanently
  - 302 Found
  - 303 See Other
  - 304 Not Modified
  - 305 Use Proxy
  - 306 Switch Proxy
  - 307 Temporary Redirect
  - 308 Permanent Redirect
  </p>
</details>

- <details>
  <summary>4xx : İstemci Hatası</summary>
  <p>
  
  - 400 Bad Request
  - 401 Unauthorized
  - 402 Payment Required
  - 403 Forbidden
  - 404 Not Found
  - 405 Method Not Allowed
  - 406 Not Acceptable
  - 407 Proxy Authentication Required
  - 408 Request Timeout
  - 409 Conflict
  - 410 Gone
  - 411 Length Required
  - 412 Precondition Failed
  - 413 Payload Too Large
  - 414 URI Too Long
  - 415 Unsupported Media Type
  - 416 Range Not Satisfiable
  - 417 Expectation Failed
  - 418 I'm a teapot
  - 421 Misdirected Request
  - 422 Unprocessable Entity
  - 423 Locked
  - 424 Failed Dependency
  - 426 Upgrade Required
  - 428 Precondition Required
  - 429 Too Many Requests
  - 431 Request Header Fields Too Large
  - 451 Unavailable For Legal Reasons
  </p>
</details>

- <details>
  <summary>5xx : Sunucu Hatası</summary>
  <p>

  - 500 Internal Server Error
  - 501 Not Implemented
  - 502 Bad Gateway
  - 503 Service Unavailable
  - 504 Gateway Timeout
  - 505 HTTP Version Not Supported
  - 506 Variant Also Negotiates
  - 507 Insufficient Storage
  - 508 Loop Detected
  - 510 Not Extended
  - 511 Network Authentication Required
  </p>
</details>

Alt kategoriler hakkında daha fazla bilgi için [HTTP RFC](https://httpwg.org/specs/rfc9110.html#status.codes) dokümanına bakabilirsiniz.

## Doğru API ve Endpoint Tasarımı

REST (Representational State Transfer) mimarisini kullanarak API tasarımı yaparken, API tasarımı için bazı kurallar ve öneriler bulunmaktadır. Yaklaşım yine anlamsallık üzerine kurgulanmıştır. Bir API endpointinin anlamsal olması, API kullanıcılarının API'yi daha kolay kullanmalarını sağlar.

URL'ler anlamsal olarak API'ı belgelemelidir. Nasıl değişken tanımlarken anlamlı ve sade isimlendirmeler yapıyorsak uygulamamıza bağlanılırken kullanılan URL'lerinde anlamlı ve sade olmasına çalışmalıyız. Örneğin, kullanıcılarımızın bilgilerini getirmek için kullanılan bir endpoint URL'si şu şekilde olabilir:

HTTP Method | Endpoint | Açıklama
---|---|---
GET | /users | Tüm kullanıcıları getirir
GET | /users/1 | ID'si 1 olan kullanıcıyı getirir
POST | /users | Yeni bir kullanıcı oluşturur
PUT | /users/1 | ID'si 1 olan kullanıcıyı günceller
DELETE | /users/1 | ID'si 1 olan kullanıcıyı siler
PATCH | /users/1/password | ID'si 1 olan kullanıcının şifresini günceller

Bu nedenle, API tasarımı yaparken aşağıdaki kurallara dikkat etmek gerekir:

- Çoğul isimlendirme kullanılmalıdır. Örneğin, `/user` yerine `/users` kullanılmalıdır.
- İsimlendirmede fiiller yerine isimler kullanılmalıdır. Örneğin, `/getuser` yerine `/users/1` kullanılmalıdır.
- İlişkileri temsil eden isimlendirmeler kullanılmalıdır. Örneğin `/posts/1/author` gibi ancak n-n ilişki durumunda `/posts/1/authors` kullanılmalıdır. Kesinlikle `/posts/1/author/1` benzeri bir kullanım yapılmamalıdır.
- `GET` istekleri ile veri çekerken filtrele, sıralama ve sayfalama gibi parametreler kullanılmalıdır. Örneğin, `/posts?tags=dotnet&sort=desc&limit=10` gibi.
- API'ların bir versiyon numarası olmalıdır. Bu sayede API'ların değişmesi durumunda, eski versiyonlara erişilebilir. Örneğin, `/v1/users` gibi.

Daha fazla bilgi için [REST API Design](https://restfulapi.net/resource-naming/) dokümanına bakabilirsiniz.

Yapılabilecek diğer şeyler:

- API'ların bir dökümantasyonu olmalıdır. Bu sayede API'ların nasıl kullanılacağı hakkında bilgi edinilebilir. Örneğin, [Swagger](https://swagger.io/) gibi.
- API'ların bir test ortamı olmalıdır. Bu sayede API'ların nasıl kullanılacağı hakkında bilgi edinilebilir. Örneğin, [Postman](https://www.postman.com/) gibi.
- Veri alışverişinde JSON kullanılmalıdır. JSON, XML gibi diğer veri formatlarına göre daha az veri kullanır ve daha hızlıdır. Pek yaygın bir uygulama olmasada YAML gibi diğer veri formatları da kullanılabilir. Burada tercih parse edilme hızı ve veri boyutu gibi faktörlerden yana olmalıdır.
- API'ların bir güvenlik duvarı olmalıdır. Bu sayede API'ların kimlik doğrulaması ve yetkilendirilmesi sağlanabilir. Örneğin, [JWT](https://jwt.io/) gibi.
- API'ların bir hata yönetimi olmalıdır. Bu sayede API'ların hatalarını yakalayıp kullanıcıya bildirebilir. Örneğin, [Sentry](https://sentry.io/welcome/) gibi.
- API'ların bir performans yönetimi olmalıdır. Bu sayede API'ların performansı ölçülebilir ve gerekli durumlarda optimize edilebilir. Örneğin, [New Relic](https://newrelic.com/) gibi.
- API'ların bir güvenlik yönetimi olmalıdır. Bu sayede API'ların güvenliği ölçülebilir ve gerekli durumlarda optimize edilebilir. Örneğin, [SonarQube](https://www.sonarqube.org/) gibi.
- API'ların bir test yönetimi olmalıdır. Bu sayede API'ların testleri ölçülebilir ve gerekli durumlarda optimize edilebilir. Örneğin, [Jenkins](https://www.jenkins.io/) gibi.
- API'ların bir CI/CD olmalıdır. Bu sayede API'ların geliştirilmesi, test edilmesi, paketlenmesi, dağıtılması ve yayınlanması otomatik olarak yapılabilir. Örneğin, [Azure DevOps](https://azure.microsoft.com/tr-tr/services/devops/) gibi.

## ASP.NET Core Denetleyici Metot Parametrelerinde Aynı Değeri İki Defa Almayın!!!

Sanırım yaygın olarak yapılan bir hata. Örnein bir `PUT` isteği ile bir kaydı güncellemek istediğimizi düşünelim. Bu durumda `PUT` isteğinin body'sinde güncellenecek kaydın bilgileri olmalıdır. Bu bilgileri almak için bir denetleyici metot yazalım:

```csharp
[HttpPut("{id}")]
public async Task<IActionResult> Update(User user, int id)
{
    // ...
}
```

Bu durumda güncelenecek kullanıcı bilgisi iki defa alınmış olup istemci aynı bilgiyi iki defa göndermeye zorlanır. Bu durumda yalnızca `user` parametresi kullanılmalıdır. `id` parametresi kullanılmamalıdır. Çünkü `id` parametresi `user` parametresinin içinde de bulunmaktadır.

```csharp
[HttpPut("{id}")]
public async Update<IActionResult> Update(User user)
{
    // ...
}
```

## ASP.NET Core Uygulamalarının Startup Sınıfını Minimize Edin!!!

ASP.NET Core uygulamalarının `Startup` sınıfı, uygulamanın çalıştırılması için gerekli olan tüm ayarlamaları içerir. Bu sınıfın içeriği büyüdükçe, uygulamanın çalıştırılması için gerekli olan ayarlamaları bulmakta zorlanabilirsiniz. Bu durumda `Startup` sınıfını minimize etmek için aşağıdaki yöntemleri kullanabilirsiniz:

```csharp
// startup.cs
// ...
public void ConfigureServices(IServiceCollection services)
{
    // ...
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ...
}
```

Yukarıdaki örnekte `ConfigureServices` ve `Configure` metotlarına `IServiceCollection` ve `IApplicationBuilder` parametreleri eklenmiştir. Bu sayede `Startup` sınıfı içerisindeki `ConfigureServices` ve `Configure` metotlarına ait ayarlamaları `Startup` sınıfı dışında bir sınıfa taşıyabilirsiniz. Örneğin, `StartupExtensions` adında bir sınıf oluşturabilirsiniz:

```csharp
// startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddStartupExtensions();
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseStartupExtensions();
}
```

```csharp
// startupextensions.cs
public static class StartupExtensions
{
    public static void AddStartupExtensions(this IServiceCollection services)
    {
        // ...
    }

    public static void UseStartupExtensions(this IApplicationBuilder app)
    {
        // ...
    }
}
```

## ASP.NET Core Projenizi Olabildiğince Küçük Parçalara Ayırın!!!

| Uygulama | Açıklama | 
| :--- | :--- | 
| Proje.&#8203;<!--unvisible character -->Web | Web uygulaması |
| Proje.Api | Web API uygulaması |
| Proje.Core | Ortak kullanılan sınıflar | 
| Proje.Data | Veritabanı işlemleri | 
| Proje.Services | Servis sınıfları |
| Proje.Tests | Test sınıfları | 

### Katmanlar Arası Veri Aktarımı

Çok katmanlı mimaride bir katmanın diğer katmanlara erişmesi için `Dependency Injection` kullanılmalıdır. Örneğin, `Proje.Web` projesi `Proje.Services` projesini kullanmak istiyorsa `Proje.Services` projesindeki sınıfların `Proje.Web` projesindeki sınıflar tarafından kullanılabilmesi için `Dependency Injection` kullanılmalıdır. Bu sayede `Proje.Web` projesindeki sınıflar `Proje.Services` projesindeki sınıfları kullanabilir.

```csharp
// Proje.Web
// startup.cs
public void ConfigureServices(IServiceCollection services)
{
    // ...
    services.AddServices();
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ...
}
```

```csharp
// Proje.Services
// services.cs
public static class ServicesExtensions
{
    public static void AddServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
    }
}
```

```csharp
// Proje.Web
// usercontroller.cs
public class UserController : Controller
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    public IActionResult Index()
    {
        var users = _userService.GetUsers();
        return View(users);
    }
}
```

### Denetleyiciler içerisindeki işlemleri servis sınıflarına taşıyın!!!

ASP.NET Core uygulamalarında denetleyiciler içerisindeki işlemler, servis sınıflarına taşınmalıdır. Bu sayede denetleyicilerin işlevi sadece istemciye cevap vermek olacaktır. Örneğin, `UserController` denetleyicisi içerisindeki kullanıcı işlemlerini `UserService` servis sınıfına taşıyabilirsiniz:

```csharp
// Proje.Web
// usercontroller.cs
public class UserController : Controller
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<IActionResult> Index()
    {
        var users = await _userService.GetUsers();
        return View(users);
    }
}
```

```csharp
// Proje.Services
// userservice.cs
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public IEnumerable<User> GetUsers()
    {
        return _userRepository.GetUsers();
    }
}
```

```csharp
// Proje.Data
// userrepository.cs
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _dbContext;

    public UserRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IEnumerable<User> GetUsers()
    {
        return _dbContext.Users.ToList();
    }
}
```