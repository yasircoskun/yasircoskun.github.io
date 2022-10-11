var userLang = localStorage.getItem("lang") || navigator.language || navigator.userLanguage; 
if(userLang != "tr-TR") userLang = "en-EN";

const lang = {
    "tr-TR": {
        page_title : "R.U.F.T.J: Bu İş İçin Uygun Musun?",
        wellcome_card: {
            header: "R.U.F.T.J Nedir?",
            content: 'R.U.F.T.J "Bu işe uygun musun?" cümlesinin ingilizce telafuzundan türetilen bir isim. Bu yazılımın amacı bir iş ilan metnini bir değerlendirme formuna dönüştürmektir. Bunun için karmaşık Yapay Zeka algoritmaları kullanılıyor. Makine öğrenimi ve Doğal Dil İşleme bir arada kullanılıyor. Hey! sadece şaka yapıyorum. Bunu sadece biri bana bir iş ilanı metni gönderip "bu iş ilanına ne kadar uygunsun?" diye sorduğunda oluşturmak istedim. Bu soruya nasıl cevap verebileceğimi bilmiyordum. Ben de gereksinimlerin kaçına uygun olduğumu not edip yüzde hesabı yaptım. Üzücü çünkü sadece %37.5 uyumluydum. Konu bu değil özür dilerim. Bu projeyi de bana hangi iş ilanına başvurmam gerektiğini analitik olarak söylemesi için gerçekleştirdim.',
            button: "Başlayalım",
            dontShowAgain: "bunu bir daha gösterme"
        },
        requirement_card: {
            header: "İş Gereksinimleri",
            textarea: {
                placeholder: "Satır satır iş gereksinimleri (Genellikle buraya yapıştırmanız yeterli olur.)"
            },
            load_sample: {
                button: "Örnek Metin",
                content: `Hiç bir gerçek dünya problemini çözmeyen sadece kâr oldaklı olarak yazılım geliştiren bir ortamda +2 yıl deneyim sahibi,
Kendi kendine motive olabilen, İçten yanmalı, 
Yeni şeyler öğrenmekten/keşfetmekten mutluluk duyan,
Aynı işi tekrar etmekten sıkılan bir ekip arkadaşı ile çapraz çalışma (periyodik görev değişikliği) yapabilecek,
iletişimi kuvvetli (geveze olmak, kendinden övgü ile söz etmekten söz etmiyorum) sorunları dile getirip tartışmaya girebilecek,
Düşüncesini kabul ettiremediğinde küsmek yerine onu ispat edebilecek,
Maddi kaygısı ve gelecek kaygısı olmayan (Henüz yeni bir oluşum olduğumuz için ÖNEMLİ!),
Tatil ve çalışma zamanlarına kendi karar verebilecek, sorumluluk duygusu gelişmiş ve adil,
Yorum satırı yazmayı alışkanlık edinen/edinebilecek olan.
Discord kullanan/kullanabilecek olan,
Hangi Framework diye sormayan, kod tabanına uyum sağlayabilecek,
internetteki anonim kullanıcıların da insan olduklarını bilen,
interneti anonim olarak kullandığında insan olduğunu unutmayan,
Yazılımın bir şeyler değiştirebileceğine inanan çalışma arkadaşları arıyoruz.`
            },
            button: "Test Oluştur"
        },
        test_card: {
            header: "Kendine Karşı Dürüst Ol!",
            button: "Uygunluğu Göster"
        },
        result_card: {
          result_percent: "Sonuç: "
        },
        results:{
            ">=10": {
                title: "Bu işe uygun görünmüyorsun!",
                image: "assets/temet_nosce_2.png",
                content: "iyi tarafından bak ne bilmediğini biliyorsun. Sıkı çalış ve kendini geliştirirken öz güvenini de geliştirmeyi ihmal etme. Ne bilmediğini bilmek, kendini bilmektir. "
            },
            ">=40": {
                title: "Bu işe başvuracak olursan sıkı çalışmalısın.",
                image: "assets/labor_omnia_vincit.jpg",
                content: `Aslında işe başlamak için gerekli hedefe sandığından daha yakınsın.Bazı konularda kendini yeterli hissedebilmen için daha çok pratik yapmalısın. Eşdeğer bir işe daha sonra başvurman senin için daha doğru bir karar olabilir. 

Note: Tevazunun seni mağdur etmesine izin verme.`
            },
            ">=70": {
                title: "Bu iş tam sana göre",
                image: "assets/non_progredi_est_regredi_2.jpg",
                content: "Bence bu işe başvurmalısın çünkü sana yeni ufuklar açacaktır. Eksik olduğun ve kendine güvenmediğin konular var biliyorum. Tam da bu nedenle burada çalışman gerekiyor zaten."
            },
            ">=100": {
                title: "Kartallar sinek avlamaz",
                image: "assets/aquila_non_capit_muscas.jpg",
                content: "Bu işe başvurursanız muhtemelen kabul edileceksiniz. Tabi dürüst davrandıysanız. Ancak bu iş kendinizi geliştirmeniz için gerekli ortamı sağlamıyor olabilir. Kendi kararınızı vermelisiniz. "
            }
        }
    },
    "en-EN": {
        page_title : "R.U.F.T.J: Are You Fit This Job?",
        wellcome_card: {
            header: "What is R.U.F.T.J?",
            content: `R.U.F.T.J. "Are you fit for this job?" A noun derived from the English pronunciation of the sentence. The purpose of this software is to convert a job posting text into an evaluation form. Complex Artificial Intelligence algorithms are used for this. Machine learning and Natural Language Processing go hand in hand. Hey! I m just kidding. It's just that someone sends me a copy of a job posting and says, "How fit are you for this job posting?" I wanted to create when he asked. I didn't know how to answer this question. I noted how many of the requirements I satisfy and calculated the percentage. It's sad because I was only 37.5% fit. Sorry, that's not the point. I carried out this project so that it would analytically tell me which job posting I should apply for.`,
            button: "Lets Start",
            dontShowAgain: "don't show this again"
        },
        requirement_card: {
            header: "Job Requirements",
            textarea: {
                placeholder: "Job requirement list line by line (Generally you just have to paste it here)"
            },
            load_sample: {
                button: "Load Sample",
                content: `Assists in developing, writing, testing, debugging and implementing code using the relevant programming languages.
Participates in product testing and maintenance activities as required by project management.
May assist in tool development with other engineers.
Applies professional expertise to review, analyze and test products under development as a contributing member of a production team to ensure delivery of ECORP’s high standard of quality and timeliness.
Understanding of computer science and software design principles.
Ability to read and debug other engineers’ code.
Knowledge of the relevant programming languages (C/C++ and/or Web Development (HTML, JavaScript, and CSS)).
Internship at a software development company preferred.
Undergraduate degree in Computer Science or related field; or equivalent education and experience. `
            },
            button: "Create Test"
        },
        test_card: {
            header: "Be honest with yourself!",
            button: "Show Fitness"
        },
        result_card: {
          result_percent: "Result: "
        },
        results: {
            ">=10": {
                title: "You don't seem fit for the job!",
                image: "assets/temet_nosce_2.png",
                content: "Look on the bright side, you know what you don't know. Work hard and don't forget to build your self-confidence while improving yourself. To know what you don't know is to know yourself."
            },
            ">=40": {
                title: "You have to work hard if you apply for this job.",
                image: "assets/labor_omnia_vincit.jpg",
                content: `In fact, you are closer to the goal you need to start the job than you think. You need to practice more in order to feel competent in some subjects. It may be a better decision for you to apply for an equivalent job later.

Note: Don't let humility get you down.`
            },
            ">=70": {
                title: "This job is right for you",
                image: "assets/non_progredi_est_regredi_2.jpg",
                content: "I think you should apply for this job because it will open new horizons for you. I know there are issues that you are lacking and that you do not trust yourself. This is exactly why you need to work here."
            },
            ">=100": {
                title: "Eagles don't hunt flies",
                image: "assets/aquila_non_capit_muscas.jpg",
                content: "You will likely be accepted if you apply for this job. Of course, if you were honest. However, this job may not provide the necessary environment for you to develop yourself. You have to make your own decision."
            }
        }
    }
}