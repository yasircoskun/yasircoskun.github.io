# Kısa Devre

Bu bölüm kategorize edilmiş kısayol tuşları ve komutları kısayoldan açıklar.

- **VSCode**
  - **Komutlar:**
    - `code .` Dizini VS Code ile açar.
    - `code --diff file1 file2` iki dosyayı karşılaştırır.
    - `code --add .` bulunulan dizini son aktif vs code penceresine ekler.
  - **Kullanışlı Eklentiler:**
    - [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph): Git dallarını ve commitleri görselleştirir.
    - [Git Patch](https://marketplace.visualstudio.com/items?itemName=paragdiwan.gitpatch): Patch dosyaları oluşturmayı ve uygulamayı sağlar.
- **Firefox**
  - **Komutlar:**
    - `firefox -P` Profil yönetici ile başlat.
    - `firefox -CreateProfile profile_name` Yeni profile oluştur.
    - `firefox -P profil_name` Profil ile başlat.
    - `firefox -new-tab URL` URL'i yeni sekmede açar.
    - `firefox -new-window URL` URL'i yeni pencerede açar.
    - `firefox -private-window URL` URL'i gizli pencerede açar.
    - `firefox -search term` term'i varsayılan arama motorunuzda arar.
    - [Dahası](https://wiki.mozilla.org/Firefox/CommandLineOptions#User_profile)
  - **İlginç Bağlantılar**
    - [about:about](about:about)
- **dig**
  - **Komutlar**
    - `dig yasir.tr NS` yasir.tr için nameserver bilgisini sorgular. yasir.tr ile ilgili diğer tüm kayıtlar (ds: delegation signer hariç.) bu nameserver tarafından sağlanır.
    - `dig yasir.tr A` yasir.tr'nin A kaydını sorgular. A Kaydı IPv4 Adresidir.
    - `dig yasir.tr dnskey @8.8.8.8` ile sorgunuzu belirli bir dns sunucusuna yönlendirebilirsiniz.
    - `dig yasir.tr dnskey @ns1.yasir.tr` ile benzer şekilde bir dns sunucusuna sorgu yapabilirsiniz. Bu durumda tr bölgesinde bulunan GLUE (yapışkan) kaydı kullanılarak önce ns1.yasir.tr çözümlenir (A veya AAAA kaydı öğrenilir) sonrasında bu sunucuya ulaşılabiliyor ise yasir.tr çözümlenir yada çözümlenemez.
    - `dig <domain> <record>` Kısacası dig ile bir domain ile ilgili dns kayıtlarını sorgulayabilirsin.
    - `dig <domain> <record> +short` ile yalnızca Answer alanını görüntüleyebilirsiniz.
    - `dig <domain> <record> +dnssec` ile ilgili dnssec kayıtlarını görüntüleyebilirsiniz.
    - `dig <domain> <record> +trace` ile sorgunuzun ağ'da izlediği yolu takip edebilirsiniz. 
    - `dig <domain> any` ile tüm kayıtları sorgulayabilirsiniz.
    - `dig axfr <domain> @<ns>` ile transfer isteği gönderebilirsiniz. (DNS sunucular belirli ip'lere transfer izni verir - hatalı yapılandırılmamış ise - bu komut tüm zone içeriğini alıp sync olmak için kullanılaiblir.)
- **delv**
  - **Komutlar**
    - `delv tr` ile tr bölgesi için dnssec doğrulaması yapılır.
    - `delv tr @8.8.8.8` ile google dns'ine sorgu yapılabilir.
- **docker**
  - **Kavramlar** Önce bazı kavramları açıklamak anlaşılır olmasını sağlayacaktır.
  - **Komutlar**
    - `docker build .` aktif dizinde bulunan `dockerfile` veya `Dockerfile`'ı build eder. Bu o dosyanın içindeki dockerfile yapılandırmasına uygun şekilde bir container image'ı (görüntüsü) oluşturacağı anlamına gelir. Bu görüntü uygulamanızın taşındığı yerde çalışacağı uygun ortamı oluşturacak şekilde yapılandırılır. 
    - `docker ps` docker ps ile aktif container'lar listelenir.
    - `docker images` 

----

```bash
# remove apt packages by name contains
sudo apt list --installed | grep php | awk -F/ '{print $1}' > /tmp/apt-rm-list && sudo apt remove `cat /tmp/apt-rm-list`
```

