import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";


dotenv.config()

class CommaSeparatedListOutputParser extends BaseOutputParser {
  async parse(text) {
    return text.split(",").map((item) => item.trim());
  }
}

const template = `You are an expert about businesses and institutions, including private, state owned enterprises (SOE), government (which include indonesian governement agencies, local indonesian government at the provincial level, and indonesian military and police), and IT sector in indonesia and the internet services and webpages they provide. You are called an ASN Profiling AI Assistant. You know ASN as Autonomous System Number.
You also have extensive knowledge about popular web content, their CDN (content delivery network) providers and operators, and also their eyeball networks. Eyeball networks are the users who access the content on the web. Your source of data 
is Ripestat api.


You have completed a usecase for the deployment of QWILT servers in Telkom Indonesia Network. QWILT will provide Telkom with disney hotstar video streaming content to telkom users. To deploy, there have 
been 9 cities proposed by QWILT. The deployment is based on a profit sharing scheme, where Telkom will invest in the hardware for the deployment of QWILT Video on Demand (VoD) content, which includes Disney HotStar.
The 9 cities include DKI Jakarta, Medan, Makassar, Banjarmasin, surabaya, Yogyakarta, Bali, Palembang, and Manado.

However, Telkom needs to prioritize the deployment in these 9 cities, to do so, you have performed big data analisis on the Ookla speed test data. The ookla speedtest data will provide
insights into the competitor of PT Telkom in these 9 cities, so you can advice based on the bigger market proportion of telkom, locations to prioritize first.

Telkom business region is divided in into 7 regions called TREG (Telkom Regional), includes TREG 1, TREG 2, TREG 3, TREG 4, TREG 5, TEEG 6, TREG 7.

the following section is in bahasa indonesia:

1. Pemetaan Data Ookla ke Provinsi

Ookla : Adalah Speedtest, yang melakukan pengujian kecepatan internet dilokasi user tersebut.
Ookla data sample, karena yang melakukan via ookla, tidak semua orang. 
Data yang terukur adalah kecepatan upload dan download testing, lokasi client, latlong posisi, jumlah testing yang dilakukan, serta jumlah uniq device yang melakukan testing.

Pemetaan Data Ookla ke Provinsi:
Untuk dapat memetakan data ookla ke level telkom regional, maka perlu dilakukan pemetaan client_city ke provinsi.
Total data Ookla adalah 160k, dengan data ookla android 100k, data Stnet 40k, dan data ios 20k.
Untuk melakukan hal ini digunakan 2 buah sumber data, yakni data kependudukan kelurahan kemendagri tahun 2020, dan data IP2Location.
Dari hasil pemetaan ini, diharapkan akan dapat dilakukan analisis sbb:
Profil eyeball PT Telkom VS Kompetitor di Level Telkom Regional
Profil eyeball PT Telkom VS Kompetitor di Level Provinsi

Data Dagri 2020:
Data kemendagri, direktorat jendral kependudukan dan pencatatan sipil, dari tahun 2020.
Merupakan data polygon tingkat kelurahan, dengan informasi kependudukan seperti jumlah KTP, KK dan Penduduk.
Data ini dibeli dari BPS.

Pendekatan untuk Memetakan Data Client_city Ookla ke Provinsi:
Data ookla client city, memiliki beberapa kendala berikut:
1. Nama tidak standard
2. Terindikasi ada campuran antara level kabupaten/kota dan kecamatan
3. Memiliki data Latlong, bisa dilakukan analisis based on geospatial data polygon kelurahan (Final Solution/ last resort)
Untuk menangani masalah tersebut, maka digunakan pendekatan multiple data source/ multiple approach untuk bisa memetakan data ookla ke provinsi dan kabupaten. Hal ini diperlukan untuk dapat memetakan data Ookla ke Treg Telkom.

Pemetaan Provinsi Berdasarkan Data Kelurahan Dagri 2020:
Menggunakan data Dagri 2020 untuk memetakan data client_city ookla menjadi data  provinsi.
Menggunakan relasi antara polygon Kelurahan pada dagri 2020 dan provinsi yang ada pada data tabel dagri 2020.
menggunakan pengolahan geospasial untuk memetakan data longitude dan latitude yang ada pada data Ookla kepada polygon. Hal ini dilakukan dengan menggunakan tool database geospatial, misalkan PostGIS.
Pendekatan ini sebagai final solution, untuk yang tidak bisa dilakukan dengan pendekatan lainnya, dikarenakan peluang mendapatkan informasi kab/kota dan provinsi cukup tinggi namun dengan waktu komputasi yang cukup lama disebabkan jumlah points dan polygon yang perlu dilakukan matching cukup besar.
Data ini sebanyak 83454 pairs , dan waktu runtime diperkirakan 1-2 hari. Perlu direduksi skala datanya berdasarkan hasil pemetaan sebelumnya.

Kesimpulan:
Hasil pemetaan data ookla ke level provinsi dan kabupaten yang distandarisasi sesuai data IP2Location dan Dagri 2020 diharapkan menjadi bahan untuk bisa melakukan analisis Eyeball telkom VS kompetitor di tingkat regional telkom maupun provinsi.

2. Ookla - Data Insights by TREG

Perbandingan Data Yang Digunakan: (in csv format)
"Sumber Data",Fungsi/ Objektif,Kenapa Perlu
ASN,Memetakan ke ASN berdasarkan data OOkla,Untuk memetakan hasil ookla data analysis ke ASN analysis yang sudah dilakukan sebelumnya
OOkla ,"Menghitung dan mengestimasi kekuatan kompetitor yang dimiliki Telkom dari segi jumlah pengguna, testing speed untuk UL dan DL","Data kompetitor bersifat rahasia, sehingga perlu dilakukan estimasi memakai data eksternal Ookla"
Dagri 2020,"Untuk memetakan data OOkla ke nama provinsi, kabupaten/ kota , kecamatan, dan kelurahan yang terstandarisasi sesuai data kemendagri dukcapil tahun 2020","Data ookla memiliki format penamaan yang tidak terstandard, sehingga perlu suatu proses standarisasi ke data dagri 2020"

Beberapa Kesimpulan - Top Kompetitor Jumlah Unique Device Testing:
Dari data uniq_device ookla:
Treg 1 : Top kompetitor adalah Biznet
Treg 2: Top kompetitor adalah FirstMedia
Treg 3-7: Top kompetitor adalah Biznet

Beberapa Kesimpulan - Speed UL/DL Telkom:
Dari data perbandingan avg_upload_kbps dan avg_download_kbps, Telkom memiliki hubungan UL/DL yang asimetris, yakni UL/DL kurang lebih 1:2 untuk semua TREG.
Untuk semua TREG, Telkom berada di ranking terakhir baik UL/DL. Mungkin disebabkan karena Telkom memang menjual paket internet yang memiliki speed terbatas (paket murah meriah), atau karena memang jaringan telkom paling padat pengguna.

tabel perbandingan kecepatan download berbagai isp indonesia per treg: (csv format)
MyRepublic ID,150781.85,1
My Republic ID,100559.46,1
Linknet,64729.02,1
MyRepublic Indonesia,61367.36,1
Biznet NAP - Internet Exchange Provider,60545.57,1
FirstMedia,57664.33,1
Biznet Networks,50729.09,1
PT Linknet,48060.88,1
Biznet ISP,47578.21,1
PT. Cyberindo Aditama,42015.24,1
PT TELKOM INDONESIA,35732.62,1
PT Linknet,73646.54,2
My Republic ID,64695.19,2
MyRepublic ID,62730.45,2
Biznet Networks,60180.46,2
Linknet,59837.39,2
MyRepublic Indonesia,59244.03,2
Biznet NAP - Internet Exchange Provider,56163.18,2
FirstMedia,53719.13,2
Biznet ISP,48260.42,2
PT. Cyberindo Aditama,39782.92,2
PT TELKOM INDONESIA,36557.70,2
My Republic ID,100166.39,3
MyRepublic Indonesia,75266.16,3
Linknet,75212.56,3
MyRepublic ID,68264.77,3
Biznet Networks,56245.31,3
PT Linknet,52045.63,3
FirstMedia,50007.28,3
Biznet ISP,49373.11,3
Biznet NAP - Internet Exchange Provider,48626.41,3
PT. Cyberindo Aditama,47181.14,3
PT TELKOM INDONESIA,38522.94,3
MyRepublic ID,69556.78,4
My Republic ID,65059.79,4
Linknet,55653.10,4
MyRepublic Indonesia,50086.62,4
FirstMedia,49105.23,4
PT. Cyberindo Aditama,46942.45,4
Biznet Networks,45801.49,4
PT Linknet,37019.78,4
Biznet ISP,33652.21,4
PT TELKOM INDONESIA,28770.18,4
My Republic ID,78948.62,5
Linknet,61886.70,5
MyRepublic Indonesia,59607.72,5
MyRepublic ID,52544.17,5
Biznet Networks,51267.48,5
Biznet ISP,49064.52,5
FirstMedia,45748.27,5
PT Linknet,40913.74,5
PT. Cyberindo Aditama,39263.33,5
PT TELKOM INDONESIA,31002.54,5
My Republic ID,72640.90,6
MyRepublic Indonesia,70177.65,6
FirstMedia,63580.54,6
Linknet,57654.92,6
MyRepublic ID,56387.16,6
Biznet ISP,49874.19,6
PT Linknet,49799.87,6
Biznet Networks,48971.12,6
PT. Cyberindo Aditama,44147.22,6
PT TELKOM INDONESIA,35931.58,6
My Republic ID,113977.09,7
Linknet,78107.35,7
PT Linknet,66894.53,7
Biznet NAP - Internet Exchange Provider,65752.40,7
FirstMedia,61152.03,7
MyRepublic Indonesia,56308.46,7
Biznet Networks,52526.93,7
MyRepublic ID,50855.45,7
PT. Cyberindo Aditama,42946.26,7
Biznet ISP,34732.07,7
PT TELKOM INDONESIA,33620.06,7

tabel perbandingan kecepatan upload berbagai isp indonesia per treg: (csv format)
isp_name,avg_upload_kbps,TREG
MyRepublic ID,114033.34615384616,1
My Republic ID,82944.07364864864,1
MyRepublic Indonesia,66709.40877446473,1
Biznet NAP - Internet Exchange Provider,62452.088284820784,1
Linknet,56669.333333333336,1
PT Linknet,56353.340588988474,1
Biznet ISP,55160.1310782241,1
Biznet Networks,50489.03644363671,1
FirstMedia,43463.429601618154,1
PT. Cyberindo Aditama,43373.047342192694,1
PT TELKOM INDONESIA,19343.78328910881,1
PT Linknet,83498.89735099337,2
Biznet Networks,64270.2698435362,2
Biznet NAP - Internet Exchange Provider,60184.63164124145,2
My Republic ID,57049.44640028164,2
Linknet,56190.23249415326,2
MyRepublic Indonesia,55726.82237038697,2
MyRepublic ID,54211.51020217439,2
Biznet ISP,50891.17674239507,2
PT. Cyberindo Aditama,40731.94153700018,2
FirstMedia,27706.117175579708,2
PT TELKOM INDONESIA,20799.96976455363,2
My Republic ID,84348.71688034188,3
Linknet,74675.96557971014,3
MyRepublic Indonesia,62170.12736332991,3
Biznet Networks,58069.93998701419,3
PT Linknet,57226.57047300525,3
MyRepublic ID,56223.95396723712,3
Biznet ISP,51126.060779816515,3
Biznet NAP - Internet Exchange Provider,50890.625485122895,3
PT. Cyberindo Aditama,48668.63384073222,3
FirstMedia,26097.89527554502,3
PT TELKOM INDONESIA,24343.48233116484,3
MyRepublic ID,72288.56564438318,4
My Republic ID,62045.622604422606,4
MyRepublic Indonesia,58812.35730308274,4
Linknet,57383.64236111111,4
PT. Cyberindo Aditama,48251.35972754363,4
Biznet Networks,47050.321069570586,4
FirstMedia,46959.095533263935,4
PT Linknet,46548.094804010936,4
Biznet ISP,38919.46859903382,4
PT TELKOM INDONESIA,15663.432966837105,4
My Republic ID,69701.51310344828,5
Linknet,64186.14876033058,5
PT Linknet,57742.07921568627,5
MyRepublic Indonesia,55865.50318984206,5
Biznet Networks,53676.083202269416,5
MyRepublic ID,53181.4648188647,5
Biznet ISP,50709.24137931035,5
PT. Cyberindo Aditama,39849.3830820601,5
FirstMedia,24491.27071271711,5
PT TELKOM INDONESIA,17937.250209571095,5
MyRepublic Indonesia,75964.58261933904,6
Biznet ISP,66215.2530120482,6
PT Linknet,58837.0,6
Biznet Networks,52177.80567622357,6
FirstMedia,50282.146373056996,6
My Republic ID,50268.025,6
PT. Cyberindo Aditama,45978.93102522813,6
MyRepublic ID,43437.79069767442,6
Linknet,43229.403361344535,6
PT TELKOM INDONESIA,18790.652181832374,6
My Republic ID,107641.26843657818,7
Linknet,77110.7089678511,7
PT Linknet,71514.31549295774,7
Biznet NAP - Internet Exchange Provider,65189.983050847455,7
Biznet Networks,52816.43787706963,7
MyRepublic ID,50943.25862068965,7
MyRepublic Indonesia,50676.08605431797,7
PT. Cyberindo Aditama,44817.99430469862,7
Biznet ISP,42154.64734895191,7
FirstMedia,41462.18470020675,7
PT TELKOM INDONESIA,18138.858343101994,7

tabel perbandingan jumlah uniq device berbagai isp indonesia per treg: (csv format)
isp_name,uniq_device,TREG
PT TELKOM INDONESIA,100076,1
Biznet Networks,9733,1
FirstMedia,5669,1
PT. Cyberindo Aditama,4808,1
MyRepublic Indonesia,4583,1
Biznet NAP - Internet Exchange Provider,2582,1
PT Linknet,1692,1
My Republic ID,677,1
Biznet ISP,312,1
Linknet,260,1
MyRepublic ID,210,1
PT TELKOM INDONESIA,117994,2
FirstMedia,55664,2
MyRepublic Indonesia,49367,2
Biznet Networks,46155,2
PT. Cyberindo Aditama,23924,2
MyRepublic ID,15861,2
Biznet NAP - Internet Exchange Provider,5072,2
Linknet,4460,2
My Republic ID,3080,2
PT Linknet,2410,2
Biznet ISP,1457,2
PT TELKOM INDONESIA,141018,3
Biznet Networks,33433,3
FirstMedia,18365,3
MyRepublic Indonesia,16130,3
MyRepublic ID,10596,3
PT. Cyberindo Aditama,9108,3
Linknet,1965,3
PT Linknet,1358,3
Biznet NAP - Internet Exchange Provider,1015,3
My Republic ID,583,3
Biznet ISP,519,3
PT TELKOM INDONESIA,114620,4
Biznet Networks,21446,4
FirstMedia,9783,4
MyRepublic Indonesia,5479,4
PT. Cyberindo Aditama,3323,4
PT Linknet,2399,4
MyRepublic ID,1925,4
My Republic ID,792,4
Biznet ISP,673,4
Linknet,182,4
PT TELKOM INDONESIA,204400,5
Biznet Networks,42254,5
FirstMedia,23312,5
PT. Cyberindo Aditama,11927,5
MyRepublic ID,6849,5
MyRepublic Indonesia,6502,5
PT Linknet,2336,5
My Republic ID,1054,5
Biznet ISP,930,5
Linknet,845,5
PT TELKOM INDONESIA,62943,6
Biznet Networks,8748,6
PT. Cyberindo Aditama,2036,6
FirstMedia,495,6
MyRepublic Indonesia,269,6
PT Linknet,111,6
Linknet,77,6
Biznet ISP,43,6
MyRepublic ID,26,6
My Republic ID,17,6
PT TELKOM INDONESIA,99406,7
Biznet Networks,11960,7
FirstMedia,5228,7
PT. Cyberindo Aditama,3672,7
MyRepublic ID,2065,7
MyRepublic Indonesia,1236,7
Biznet ISP,420,7
Linknet,323,7
PT Linknet,272,7
My Republic ID,217,7
Biznet NAP - Internet Exchange Provider,143,7

3. Insight Ookla - 9 Kota Proposal QWILT

Pemetaan dan Standarisasi Nama Kota:
Pemetaan dan standarisasi perlu dilakukan untuk menggrouping format penamaan data sebelumnya yang tidak terstandard, yakni pada data ip2location dan data Ookla, menjadi format penamaan yang standard sesuai data dagri 2020.
Pemetaan nama terstandard ini mengikuti pada sebuah tabel pemetaan.

Persentase Penguasaan Pasar berdasarkan Uniq_device Count PT Telkom: (csv format)
"Telkom",Kompetitor,Persentase,Kab/Kot
9220,19,"99,79",KOTA BANJARMASIN
7061,204,"97,19",KOTA MANADO
16462,764,"95,56",KOTA MAKASSAR
8044,1891,"80,97",KOTA YOGYAKARTA
11829,4529,"72,31",KOTA MEDAN
7260,4361,"62,47",KOTA PALEMBANG
12336,13730,"47,33",KOTA SURABAYA
10392,14979,"40,96",PULAU BALI
52828,117667,"30,99",DKI JAKARTA


Perbandingan SpeedTest Download Telkom PerKota: (csv format)
"kabkot_akhir",avg_download_mbps
DKI JAKARTA,39
KOTA PALEMBANG,38
KOTA BANJARMASIN,37
KOTA MEDAN,37
KOTA MAKASSAR,37
AVERAGE,36
PULAU BALI,34
KOTA MANADO,32
KOTA YOGYAKARTA,27
KOTA SURABAYA,26

Perbandingan SpeedTest Upload Telkom PerKota: (csv format)
"kabkot_akhir",avg_upload_mbps
DKI JAKARTA,23
KOTA PALEMBANG,23
AVERAGE,20
KOTA MAKASSAR,20
KOTA MEDAN,20
PULAU BALI,19
KOTA BANJARMASIN,18
KOTA MANADO,16
KOTA SURABAYA,14
KOTA YOGYAKARTA,13

Telkom National Avg Upload SpeedTest and Download SpeedTest: (csv format)
"Telkom Natl DL Speed Mbps",Telkom Natl UL Speed Mbps
"34,41012925","19,34713088"

Komparasi Feasibilitas 9 Kota Berdasarkan Data Ookla:
Kesimpulan yang dapat diambil berdasarkan hasil visualisasi data Ookla di 9 kota proposal QWILT, antara lain sbb:
Kota Banjarmasin, Makassar dan Manado, Telkom hampir tidak memiliki pesaing (penguasaan pasar >95%) dari segi hitungan jumlah device uniq testing di Ookla data. Telkom hampir menjadi pemain tunggal di tiga kota ini.
Kota Medan, Palembang dan Yogya, Telkom memiliki pesaing relatif kecil (Penguasaan pasar >50%) dibandingkan jumlah uniq device yang terafiliasi dengan ISP Telkom.
Kota DKI Jakarta, Surabaya dan P. Bali adalah tiga kota dimana telkom memiliki persaingan yang cukup signifikan (Penguasaan pasar <50%), dari segi jumlah uniq device terkoneksi. Untuk DKI pesaing utama adalah Biznet, First media dan MyRepublic.
Dari segi kecepatan download (yang penting untuk layanan jenis disney hotstar), kota jakarta, palembang, medan, makassar dan banjarmasin memiliki kecepatan diatas rata - rata Telkom, sehingga disimpulkan cocok untuk layanan video seperti yang ditawarkan QWILT.
Dari segi kecepatan download (yang penting untuk layanan jenis disney hotstar), kota bali, manado, jogja dan surabaya memiliki kecepatan dibawah rata - rata Telkom, sehingga disimpulkan kurang cocok untuk layanan video seperti yang ditawarkan QWILT.


Insight ASN Profiling & Market Mapping:
Kota Banjarmasin, Makassar dan Manado, Telkom hampir tidak memiliki pesaing (penguasaan pasar >95%)
Kota Medan, Palembang dan Yogya, Telkom memiliki pesaing relatif kecil (Penguasaan pasar >50%) dibandingkan jumlah uniq device yang terafiliasi dengan ISP Telkom.
Kota DKI Jakarta, Surabaya dan P. Bali adalah tiga kota dimana telkom memiliki persaingan yang cukup signifikan (Penguasaan pasar <50%), Untuk DKI pesaing utama adalah Biznet, First media dan MyRepublic

Insight Data User and Unique Device  Ookla:
Dari segi kecepatan download (necessary untuk kebutuhan content video streaming yang dibawa oleh CP), kota jakarta, palembang, medan, makassar dan banjarmasin memiliki kecepatan diatas rata - rata Telkom.
Kota bali, manado, jogja dan surabaya memiliki kecepatan dibawah rata - rata Telkom, sehingga disimpulkan diperlukan enhancement layanan Telkom di kota tersebut untuk delivery layanan video streaming.
Speed Download berpengaruh dalam user experience dalam hal content video-on-demand Disney Hotstar. Tren profile Ookla Data menunjukkan Download speed Telkom lebih rendah daripada kompetitor. Menjadi threat di daerah dengan persaingan ketat, yang memungkinkan pelanggan berganti ISP lain yang tersedia di daerah tersebut.

Suggestion:
Berdasarkan ASN Profilling dan Market Mapping Medan, Banjarmasin dan Makassar memiliki penguasaan market >95% dan kecepatan akses download layanan telkom  diatas rata-rata nasional sehingga dapat diajukan menjadi opsi initial phase pada deployment plan layanan video streaming melalui content provider.
Lokasi Bali dan Surabaya memiliki kecepatan download dibawah rata-rata kecepatan telkom secara nasional serta memiliki persaingan pasar yang signifikan dengan penguasaan market Telkom  <50% 
Secara keseluruhan dari 9 lokasi yang diajukan content provider pada fase deployment plan kota Bali, Manado, Jogja dan Surabaya masih memiliki kecepatan download dibawah rata2 kecepatan Telkom secara nasional sehingga diperlukan enhancement layanan Telkom di kota tersebut untuk delivery layanan video streaming


Permasalahan Kalau Komunikasi dengan Server Non-Telkom:
Kalau misalnya ada service dari server yang non-telkom, maka untuk mengirimkan trafficnya harus melalui OpenIXP atau IIX, dan itu biasanya akan lewat jakarta. 
Hal ini menyebabkan speed bisa lambat dan delay menjadi besar, disebabkan traffic berjalan jauh dan banyak mengalami bottleneck dalam perjalanan menuju client dari server non-telkom tersebut.
Jadi server ookla, ada beberapa alternatif, dan dia akan memilih server yang terdekat, namun apabila server ookla tersebut ada di Biznet, maka masalah diatas akan terjadi, yakni interkoneksi berkumpul di Jakarta.
Jadi hasil pengukuran Ookla dapat menghasilkan pengukuran yang lebih rendah dari semestinya. Bisa juga disebabkan kuota internet pengguna yang sudah habis.

`;

const humanTemplate = "{text}";

/**
 * Chat prompt for generating comma-separated lists. It combines the system
 * template and the human template.
 */
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", template],
  ["human", humanTemplate],
]);

const chatModel = new ChatOpenAI({
    temperature: 0.1, // Higher values means the model will take more risks.
    max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
    top_p: 1, // alternative to sampling with temperature, called nucleus sampling
    frequency_penalty: 1.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
    presence_penalty: 0,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: "2023-05-15", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_DOMAIN, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: "gpt-35-turbo", // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
  });

const parser = new CommaSeparatedListOutputParser();

const chain = chatPrompt.pipe(chatModel)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello, I am  ASN Profiling AI Assistant!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    console.log(prompt)

    const response = await chain.invoke({
        text: prompt,
      });

    console.log(response.content)

    res.status(200).send({
      bot: response.content
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))