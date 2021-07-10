### HackerNews Comment

Bu proje şuan yayınlamakta olduğum gibi statik sayfalara HackerNews Comment sistemi entegre etmek hakkında. Blogumu arama motorlarında aradığımda hiçbir arama motorunda görüntülenmediğini fark ettim. Bunun sebebi nedir bilmiyorum ancak eğer bir şeyler yazıyorsam birileri okusa fena olmazdı.

HackerNews üzerinde yazılarımın bağlantılarını paylaşmak belki bir çeşit backlink sağlayarak arama motorlarını ikna edebilirdi yada en azından botlar keşfederdi.

HackerNews yorumlarını da kendi web sayfamda görüntüleyebilirsem eğer varsa okuyucularımla etkileşim kurabilirim diye düşündüm ve araştırmaya başladım.

Static sayfalar için zaten bazı yorum sistemleri var. Bu sayede okuyucular birbirleri ile ve yazarlar ile iletişim kurabiliyorlar. Ancak eğer sayfama bir başkasının javascript kodunu enjekte edeceksem bu kod ziyaretçilerimin mahremiyetini tehdit etmemeli diye düşünerek HackerNews kullanmaya karar verdim.
Yani önceleri disqus falan ile hızlıca hallederim diye düşünüyordum ancak dediğim gibi bu adamlara güvenemem. Sizi onlara yedirtmem. :)

Önce yorumlar için hazır bir script arayışına girdim. Bu konuyu daha önce çalışan insanlar olsa da çalışmalarından eser kalmamış eminim bir yerlerde halen o kodları kullanan sayfalar vardır tabi. Ancak bunu aramak yerine daha iyi bir fikir geliştirdim.

Kendim yazacaktım ilk etapta API yazmam ve web scarper ile yorumları kazımam gerekecek diye düşündüm ancak HackerNews'in sayfasında API'a tıkladığımda bir github reposuna yönlendirildim. Proje kaynak kodları yoktu ancak çalışmakta olan bir API bağlantısı mevcuttu.

https://github.com/HackerNews/API

Javascript ile bu sayfaya istek göndererek yorumları ve yorumlara verilen cevapları alabiliriz. Ve onları HN'de olduğu gibi bir ağaç görünümünde görüntüleyebiliriz.

https://www.w3schools.com/howto/howto_js_treeview.asp

Bunun üzerinde biraz oynamak gerekecek. Projeyi nesne tabanlı olarak geliştireceğim bu sayede api isteklerini projeden ayırabilirim bu api uzun ömürlü olmassa projem de çöpe gitmez kendi api'mi yazar entegre edebilirim yada benzer başka platformlarıda ekleyebilirim. Örneğin sosyal medya (reddit, twitter, facebook, instagram vs.)

Projede bir APIConnector sınıfı ve CommentView sınıfları olacak. CommentView bu projenin hemen her bileşeninde kullandığım template'den dom element oluşturma mantığı ile çalışacak.
API_Connector tarafından beslenecek. Bu besleme işlemi için arada bir Comment sınıfı yazacağım. Bu sayede farklı Connectorler aynı şekilde View beslebilir.

Neyse fazla uzatmayacağım ama güzel bir proje olacak :)

Artık uyusam iyi olacak.

#### ToDo

- [ ] HackerNews Comment System for Static Pages
    - [x] Proje hazırlık araştırma, materyal edinme ve plan.
    - [ ] APIConnector yazılacak.
    - [ ] Comment hiyerarşisini ve kaynak belirtmek için Comment Sınıfı yazılacak.
    - [ ] CommentView yazılacak.
    - [ ] Kendi Bloğuma dahil edilecek.
- [ ] HackerNews Post BOT yazılacak.
    - [ ] MarkDown sayfalarına HackerNews PostID aktarılacak.
    - [ ] ls dosyasını auto oluşturacak.