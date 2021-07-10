Herkese merhaba

Uzun zamandır blog yazmaya fırsat bulamıyordum.
Flutter projesini biraz boşladım sebebi bir ekip ile DotNet Core kullanarak bir projeye girişmemiz.
DotNet Core daha önce kullanıp pek ısınamadığım bir Framework'dü.
Flutter'ı da ilk deneyimlediğimde sevmemiştim.
Bence bir framework'e ısınamıyorsanız ve diğer insanlar çok iyi olduğunu söylüyorlarsa yada bir şekilde tercih ediliyor ise.
Biraz zaman geçdikten sonra başka frameworkleri deneyimledikten sonra yani onlara ikinci bir şans verin.

Neyse bugün bu kaydı oluşturuyorum çünkü uzun zamandır vicdan azabı içindeyim kendime karşı bir sorumluluk olarak bu blog'u tutuyorum.
Bugün denetleyicilerde(controllers) hata ayıklarken([Debugging](https://duckduckgo.com/?q=Debugging)) yaparken yani hatayı geri izlerken([backtracking](https://duckduckgo.com/?q=backtracking)) veri yapılarını incelemenin oldukça maliyetli olduğunu fark ettim. DotNet Core ortamında görünümlerde yapılan değişiklikler gerçek zamanlı olarak uygulamada gözlemlenebiliyor. Ancak deneyleyiciler de değişiklik yaptığınızda projenin tekrar derlenmesi gerekiyor. Yani uygulamayı kapatıp tekrar başlatmanız gerekiyor. Android Studio'da uygulama geliştirirken Java ile benzer bir sorun yaşıyorsunuz. Emulator kullanıyorsanız yandınız. Uygulama tekrar derlenir apk Emulatore aktarılır, kurulur ve siz değişimi görebilirsiniz. Yani Runtime hata ayıklamak oldukça maliyetlidir. Flutter'ı sevmemin bir nedenide bu. DotNet Core varsayılan ayarlarla Android Studio'nun geliştirme ortamına yakın bir deneyim sunuyor ancak araştırırsanız göreceksiniz. Flutter gibi aslında Hot Reload (Sıcak Yeniden Yükleme) destekliyor. Bu ayarı yapmak için `Properties/launchSettings.json` içerisinde bazı değişiklikler yapmanız gerekiyor.

```json
{
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:36678",
      "sslPort": 44354
    }
  },
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "ASPNETCORE_HOSTINGSTARTUPASSEMBLIES": "Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation"
      }
    },
    "MyProjectName": {
      "commandName": "Project",
      "hotReloadProfile": "aspnetcore", <--- Hot Reload Aktif
      "dotnetRunMessages": "true",
      "launchBrowser": true,
      "applicationUrl": "https://localhost:5001;http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "ASPNETCORE_HOSTINGSTARTUPASSEMBLIES": "Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation"
      }
    }
  }
}
```

Yukarıda işaretlediğim satırı ekleyin ve uygulamanızı komut satırından `dotnet watch run` komutu ile başlatın. Bu sayede denetleyicilerde yaptığınız değişiklikleri gerçek zamanlı olarak gözlemleyebilirsiniz.

herkese iyi çalışmalar.

---

Düzeltme:
ilerleyen zamanlarda hot reload özelliğinin düşündüğüm kadar performanslı çalışmadığını fark ettim. `Dotnet watch` programı dosyalarda yapılan değişikliği takip ediyor. Bir çeşit listener yada hook mekanizması olabilir. Her neyse siz dosyada değişiklik yaptığınız zaman projeyi tekrar build ediyor bu projenizin boyutuna göre zaman alabiliyor ve hot reload aslında çokta sıcak değil.

Ancak iyi haberlerimde var hot reload yerine breakpoint kullanımına alışmak iyi bir seçenek olabilir. Breakpoint kullandığınız durumda bir nesnenin tüm referans degerlerini görüntüleye biliyorunuz. Bu runtime (çalışma zamanı) hatalarını ayıklamak için oldukça yararlı.