### NodeJS Proje Oluşturma

Komut satırında proje oluşturmak istediğiniz dizine ilerleyin ve aşağıdaki komutları kullanın.
Komut satırı ve klavye bir geliştiricinin en yakın arkadaşı olmalıdır.
Bunları hata mesajları izleyecektir.

```bash
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

```bash
npm install apollo-server graphql
```

![Npm ile paket indirmek](contents/ilerleme_raporlari/notlar/nodejs&graphql/resim/npm_paket_indirmek.PNG)

### Sunucu yapılandırmak

Şimdi `index.js` dosyamızı açıp sunucumuzu yapılandıralım.

```javascript
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

### `schema.graphql` Dosyası oluşturmak

`typeDefs` değişkeninin graphql için veritabanında saklanacak varlıkların özelliklerini modelleyen bir yapıda olduğunu söylemiş olduğumuzu varsayıyorum.
Bu değişkenin içeriğini bir `string` olarak tanımlamak ilerleyen aşamalarda `index.js` içeriğindeki karmaşayı arttıracaktır.
Bu nedenle şimdi bu değişkenin değerini bir dosyadan okuyacağız.

`index.js` ile aynı dizinde `schema.graphql` isimli bir dosya oluşturalım.
içine aşağıdaki şema tanımını yazalım. Bu aşamaları daha önce gerçekleştirdiğim için direct olarak kodun sonra halini aşağıya yapıştıracağım.

```graphql
type Query {
  series: [Series!]!
  category(id: Int!): [CategorySeries!]!
}

type Mutation {
  createSeries(name: String!, description: String!): Series!
  createCategory(name: String!): Category!
  relateCategorySeries(seriesId: ID!, categoryId: ID!): CategorySeries!
}

type Series {
  id: ID!
  name: String!
  description: String!
}

type Category {
    id: ID!
    name: String!
}

type CategorySeries {
    id: ID!
    series: Series
    category: Category
}

type Season {
    id: ID!
    order: Int!
    series: Series!
}

type Episode {
    id: ID!
    name: String!
    streamLink: String!
    resource: String!
    season: Season!
}
```

### GraphQL şeması yazmak

Şimdi bu kod üzerinde gerekli açıklamaları yapmaya çalışalım.
Burada type kelimesi ile aslında modellerimizi tanımlıyoruz.
Kotlin gibi dillerde olduğu gibi yazım kuralı `degisken_adi: veri_turu!` şeklinde ünlem `not null` yani zorunlu alan anlamında.

iki adet olmazsa olmaz tür var graphql şemasında bunlar Query ve Mutation türleri.
Query > select sorgularının adını, parametrelerini ve geri dönüş türünü belirliyor.
Mutation > create, updade, delete gibi sorguların adını, parametrelerini ve geri dönüş türünü belirliyor.

Yukarda iki adet query ve üç adet mutation (mutasyon) için kurallar belirlendi.
series sorgusu Series türünde bir dizi geri dönderiyor.
category ise CategorySeries türünde bir dizi dönderir.

Bu Series ve CategorySeries türleri bizim kendi tanımladığımız türler.
Nesne tabanlı dillerde bir bir nesnenin veri türü -yapısı- olarak kullanılması gibi düşünülebilir.

Bir veri türünün (modelin) özellikleri süslü parantezler içerisinde yukarıda belirtilen kurala göre belirlenir.
veri türü olarak ID String gibi temel tipler gibi temel tiplerin bir koleksiyonu olan özel(kendi belirlediğimiz) tiplerde kullanılabilir.

kategoriler(category) ve diziler(series) arasındaki many-to-many (çok-a-çok) ilişkiyi sağlamak amacıyla CategorySeries adında bir ara tip oluşturdum.
Bunu veritabanı normalizasyonu mantığı ile düşündüğüm için bu şekilde yaptım ilerleyen aşamada hatalı olduğumu fark edecek olursam burayı düzenlerim.

many-to-many nedir? diyecek olursanız kısaca açıklayalım. Bir dizinin birden çok kategoriye sahip olabildiği gibi bir kategori de birden çok diziye sahip olabilir.
Bu tür ilişkiler için veritabanı jargonun da kalıplaşmış bir ifade. many-to-many