### NodeJS Proje Oluşturma

Komut satırında proje oluşturmak istediğiniz dizine ilerleyin ve aşağıdaki komutları kullanın.
Komut satırı ve klavye bir geliştiricinin en yakın arkadaşı olmalıdır.
Bunları hata mesajları izleyecektir.

```
mkdir fluflix-api
cd fluflix-api
npm init -y
code .
```

![NodeJS Proje Oluşturma](contents/ilerleme_raporlari/notlar/nodejs&graphql/resim/nodejs_proje_olusturma.PNG)

Yukarıdaki `mkdir` komutu bir dizin (klasör) oluşturmanızı sağlar. Proje dosyalarımızı içerecek bir klasör oluşturmak için kullandık.
`cd` komutunu kullanarak dizine ilerledik. Sonrasında `npm init -y` komutunu kullanarak package.json dosyasının oluşturulmasını sağladık.
npm(nodejs package manager) varsayılan olarak eklentileri proje klasöründe `node_modules` dizini içerisine kaydeder.  
Bu sayede projeler daha kolay taşınabilir. Ayrıca eski bir projenizde kullandığınız bir modülde yapılan değişikli onun çalışmasını etkilemeden başka bir projede yeni versiyonu kullanabilirsiniz. Taşınabilmek ifadesi yazılım projelerinde farklı bir ortamda örneğin yeni bir sunucu üzerinde çalışabilmesini ifade eder.
`code` komutunu `.` parametresi ile çağırarak visual studio code uygulamasını mevcut dizinde yani proje dizinimizde başlattık.

şimdi visual studio code uygulaması ile proje dizin yapımızı oluşturmaya başlayalım.
öncelikle sol tarafta bulunan dosya gezgininden yararlanarak bir `src` adında klasör ekleyelim.
api'ımızın kaynak kodlarını bu sayfa altında toplayacağız.

Şimdi `index.js` adında bir javascript dosyası oluşturalım.

### NodeJS kodlarını çalıştırmak

Bu javascript dosyasını `node src/index.js` şeklinde yerel bilgisayarımızda çalıştırabiliriz. Tıpkı python kodları gibi yorumlanarak çalışır.
Eğer `src` dizini içerisindeyseniz `node index.js` şeklinde çalıştırmanız gerekir.
Çalıştırdığınızda herhangi bir çıktı almayacaksınız çünkü dosyanın içi halen boş.

![Dizin_Yapısı](contents/ilerleme_raporlari/notlar/nodejs&graphql/resim/Dizin_Yapısı.PNG)

### NodeJS paketlerini indirmek

Graphql sunucumuzu oluşturmak için ihtiyacımız olan iki paket var;
- apollo-server
- graphql

Bu paketleri komutsatırında `fluflix-api` dizininde aşağıdaki komutu çalıştırarak indirmemiz gerekli.

```
npm install apollo-server graphql
```

![Npm ile paket indirmek](contents/ilerleme_raporlari/notlar/nodejs&graphql/resim/npm_paket_indirmek.PNG)

### Sunucu yapılandırmak

Şimdi `index.js` dosyamızı açıp sunucumuzu yapılandıralım.

```
const { ApolloServer } = require('apollo-server');

// GraphQL Sorgu(Query -> Read -> Select) ve Mutasyonların(Mutation -> Create, Update, Delete) bildirildiği keyfi 
// olarak `typeDefs` olarak adlandırdığımız şema (schema) bildirimine ihtiyaç duyar.
const typeDefs = `
  type Query {
    info: String!
  }
`


// Yukarıdaki şema ile eşleşecek şekilde sorgu ve mutasyonların denetlendiği (controller bezeri olduğu için bu ifadeyi kullanıyorum)
// resolver (çözümleyici) fonksiyonların tanımlanmasına ihtiyaç duyar. Javascript ile fonksiyon tanımlamanın kısa yolu `(parametreler) => {fonksiyon gövdesi}`
// şeklinde tanımlama yapmaktır. Aşağıda bu kullanıma bir örnek görülmektedir. sadece tek bir ifade gövde yerine yazılır ise bu ifade return edilir.  
const resolvers = {
  Query: {
    info: () => `fluflix-api project`
  }
}

// Apollo Server nesnesi oluşturup oluşturucu (constructer) methoda şema ve çözümleyici fonksiyonlarımızı gönderiyoruz.
// Ardından daha aşağıdaki kod satırı ile sunucuyu başlatıyoruz. Sunucu belirli bir port'u dinler (listen) bu port üzerinden gelen isteklere yanıt verir.
// .then kısmı ile listen çalıştıktan sonra komut satırına sunucunun bağlantısı yazdırılır. 
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`) 
  );

```

![Sunucu Yapılandırma](contents/ilerleme_raporlari/notlar/nodejs&graphql/resim/Sunucu_Yapılandırma.PNG)

Yukarıdaki kodlar yorum satırları kullanılarak açıklanmıştır.
`node src/index.js` komutu ile sunucuyu başlatabilirsiniz.

![Sunucu Başlatma](contents/ilerleme_raporlari/notlar/nodejs&graphql/resim/Sunucu_Run.PNG)

Sunucuyu başlattıktan sonra `http://localhost:4000/` bağlantısı ile herhangi bir tarayıcıyı kullanarak GraphQL Playground (Oyun Alanı) denilen api test alanına ulaşabilirsiniz.
Aşağıdaki görselde örnek sorgunun nasıl gönderileceği görünmektedir.

![Oyun Alanı](contents/ilerleme_raporlari/notlar/nodejs&graphql/resim/OyunAlanı.PNG)

Arkası Yarın...