/**
 * SPDX-License-Identifier: Apache-2.0
 */

export const SUPPORTED_LANGS = [
  'en', 'in', 'id', 'vi', 'ja', 'zh', 'th', 'de', 'ar', 'ms', 'pl', 'cs'
] as const;

export type LangCode = typeof SUPPORTED_LANGS[number];

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string;
  faq: { q: string; a: string }[];
  features: { title: string; description: string }[];
  howItWorks: { step1: string; step2: string; step3: string };
  whyChoose: {
    title: string;
    f1: { t: string; d: string };
    f2: { t: string; d: string };
    f3: { t: string; d: string };
    f4: { t: string; d: string };
  };
  seoContent: {
    h2: string;
    p1: string;
    h3_1: string;
    p2: string;
    h3_2: string;
    p3: string;
    h3_3: string;
    p4: string;
  };
}

export const SEO_DATA: Record<LangCode, SeoMetadata> = {
  en: {
    title: "SSSTikPro – TikTok Video Downloader Without Watermark",
    description: "Download TikTok videos without watermark in HD quality using SSSTikPro. Fast, secure, unlimited, and free TikTok downloader for all devices.",
    keywords: "TikTok downloader, TikTok video downloader, TikTok without watermark, HD TikTok downloader, TikTok MP4 downloader, SSSTikPro",
    faq: [
      { q: "How to download TikTok videos?", a: "Simply copy the TikTok video link, paste it into our input field at the top of the page, and click 'Download'." },
      { q: "Is SSSTikPro free?", a: "Yes, our service is 100% free to use. We don't charge any fees for downloading TikTok videos." },
      { q: "Is it safe?", a: "Absolutely. We don't require any login information and we don't store your personal data." },
      { q: "Does it work on mobile?", a: "Yes, our website is fully responsive and works perfectly on all mobile devices and tablets." },
      { q: "Can I download without watermark?", a: "Yes, SSSTikPro specializes in high-quality TikTok downloads without any watermarks." }
    ],
    features: [
      { title: "No Watermark Downloads", description: "Get clean videos without any distracting TikTok watermarks or logos." },
      { title: "HD Video Quality", description: "Download in original high definition resolution for the best viewing experience." },
      { title: "Fast Processing", description: "Our high-speed engine processes your links in seconds, not minutes." },
      { title: "Unlimited Downloads", description: "No daily limits. Save as many videos as your heart desires." },
      { title: "Mobile Friendly", description: "Works perfectly on all devices. Use it on iOS, Android, or Desktop." },
      { title: "Safe & Secure", description: "No logins required. Your privacy and data are always protected." }
    ],
    howItWorks: {
      step1: "Find the video you love and click the share button to copy the link.",
      step2: "Open SSSTikPro and paste the link into the downloader above.",
      step3: "Press download and save your HD video without watermark instantly."
    },
    whyChoose: {
      title: "Why Choose SSSTikPro",
      f1: { t: "Faster than competitors", d: "Our optimized engine delivers results up to 3x faster than traditional tools." },
      f2: { t: "Clean UI", d: "No annoying popups or confusing ads. Just a pure, premium design." },
      f3: { t: "No login required", d: "We value your time. Download videos instantly without creating an account." },
      f4: { t: "Free forever", d: "Our premium service is available to everyone at zero cost, forever." }
    },
    seoContent: {
      h2: "TikTok Video Downloader",
      p1: "SSSTikPro is your ultimate solution for downloading TikTok videos with ease. Our platform is designed to provide a seamless experience, allowing you to save your favorite TikTok content directly to your device without any hassle.",
      h3_1: "Download TikTok Videos Without Watermark",
      p2: "One of the most sought-after features of our TikTok downloader is the ability to remove watermarks. Whether you're a content creator looking to repurpose your videos or just a fan who wants a clean version of a clip, SSSTikPro delivers pristine video quality every time.",
      h3_2: "HD TikTok Downloader",
      p3: "We understand that quality matters. That's why our downloader supports High Definition (HD) video saving. When you use SSSTikPro, you aren't just getting another copy of a video; you're getting the best possible version available on TikTok's servers.",
      h3_3: "Fast TikTok MP4 Downloads",
      p4: "Time is valuable. Our optimized server engine ensures that your MP4 files are ready in the blink of an eye. With state-of-the-art processing and a clean interface, SSSTikPro stands out as the fastest TikTok downloader in the futuristic web arena."
    }
  },
  in: {
    title: "TikTok Video Downloader India – SSSTikPro",
    description: "Best TikTok downloader for India users. Download HD TikTok videos without watermark instantly using SSSTikPro.",
    keywords: "TikTok downloader India, India TikTok downloader, HD TikTok downloader India, TikTok video saver India",
    faq: [
      { q: "How to download TikTok videos?", a: "Paste the link in our tool above and click 'Download'." },
      { q: "Is it free for India?", a: "Yes, SSSTikPro is 100% free for all Indian users." },
      { q: "Do I need a VPN?", a: "No, SSSTikPro works directly to help you retrieve your videos." },
      { q: "Can I save in HD?", a: "Yes, we support original High Definition downloads." },
      { q: "No Watermark?", a: "Yes, we remove all TikTok branding automatically." }
    ],
    features: [
      { title: "No Watermark", description: "Clear videos without any TikTok logos." },
      { title: "HD Resolution", description: "Original quality for the best visual experience." },
      { title: "Express Speed", description: "Lightning fast fetching for Indian networks." },
      { title: "Unlimited", description: "No restrictions on the number of downloads." },
      { title: "All Devices", description: "Compatible with all mobile phones and PCs." },
      { title: "Safe Access", description: "Secure downloads with no account required." }
    ],
    howItWorks: {
      step1: "Copy your favorite TikTok content link.",
      step2: "Paste the link into the SSSTikPro search bar.",
      step3: "Hit download and save the file to your gallery."
    },
    whyChoose: {
      title: "Why Indian Users Love SSSTikPro",
      f1: { t: "Superior Speed", d: "Optimized for high performance on all network types." },
      f2: { t: "No Ads", d: "Clean interface without intrusive advertisements." },
      f3: { t: "Instant Save", d: "No registration required to start downloading." },
      f4: { t: "Always Free", d: "Premium features at zero cost for everyone." }
    },
    seoContent: {
      h2: "Top TikTok Video Downloader in India",
      p1: "SSSTikPro provides Indian users with the most reliable way to save TikTok videos. Our tool is optimized for the region to ensure fast and reliable access.",
      h3_1: "Remove TikTok Watermark Easily",
      p2: "Content creators in India trust SSSTikPro for watermark removal. Get clean MP4 files ready for your next project or social post.",
      h3_2: "HD Quality Downloads",
      p3: "Don't settle for blurry videos. SSSTikPro retrieves the original source files so you get the highest quality possible.",
      h3_3: "Fast & Unlimited",
      p4: "Whether you need one video or a hundred, SSSTikPro handles them all with incredible speed and zero limits."
    }
  },
  id: {
    title: "TikTok Downloader Indonesia – SSSTikPro",
    description: "Unduh video TikTok tanpa watermark dengan kualitas HD menggunakan SSSTikPro secara gratis dan cepat.",
    keywords: "TikTok downloader Indonesia, unduh video TikTok, TikTok tanpa watermark, downloader TikTok HD",
    faq: [
      { q: "Bagaimana cara unduh video TikTok?", a: "Salin tautan video, tempel di kolom input di atas, lalu klik 'Download'." },
      { q: "Apakah SSSTikPro gratis?", a: "Ya, layanan kami 100% gratis selamanya." },
      { q: "Apakah aman digunakan?", a: "Tentu. Kami tidak menyimpan data pribadi Anda." },
      { q: "Bisa di HP Android/iOS?", a: "Bisa, SSSTikPro bekerja sempurna di perangkat seluler apa pun." },
      { q: "Bisa tanpa watermark?", a: "Ya, itulah fitur utama kami." }
    ],
    features: [
      { title: "Tanpa Watermark", description: "Dapatkan video bersih tanpa logo TikTok yang mengganggu." },
      { title: "Kualitas HD", description: "Unduhan dalam resolusi tinggi asli untuk kualitas terbaik." },
      { title: "Proses Cepat", description: "Mesin kami memproses video hanya dalam hitungan detik." },
      { title: "Unduhan Tak Terbatas", description: "Tidak ada batasan harian untuk menyimpan video." },
      { title: "Ramah Seluler", description: "Bekerja sempurna di semua perangkat smartphone." },
      { title: "Aman & Terjamin", description: "Tanpa login, privasi Anda selalu terlindungi." }
    ],
    howItWorks: {
      step1: "Salin tautan video TikTok yang ingin Anda simpan.",
      step2: "Buka SSSTikPro dan tempel tautan di atas.",
      step3: "Klik tombol download dan simpan video HD secara instan."
    },
    whyChoose: {
      title: "Mengapa Memilih SSSTikPro",
      f1: { t: "Lebih Cepat", d: "Mesin kami 3x lebih cepat dalam memproses tautan." },
      f2: { t: "UI Bersih", d: "Tanpa iklan yang membingungkan atau popup." },
      f3: { t: "Tanpa Login", d: "Gunakan langsung tanpa harus mendaftar akun." },
      f4: { t: "Gratis Selamanya", d: "Layanan premium yang tersedia tanpa biaya." }
    },
    seoContent: {
      h2: "Downloader Video TikTok Terbaik Indonesia",
      p1: "SSSTikPro adalah solusi utama Anda untuk mengunduh video TikTok dengan mudah. Platform kami dirancang untuk pengalaman yang mulus.",
      h3_1: "Unduh Video TikTok Tanpa Watermark",
      p2: "Fitur paling dicari adalah penghilang watermark. SSSTikPro memberikan kualitas video murni setiap saat.",
      h3_2: "Downloader TikTok HD",
      p3: "Kualitas sangat penting. Itulah mengapa kami mendukung penyimpanan video High Definition (HD).",
      h3_3: "Unduh MP4 TikTok Cepat",
      p4: "Waktu sangat berharga. Mesin server kami memastikan file MP4 Anda siap dalam sekejap mata."
    }
  },
  vi: {
    title: "TikTok Downloader Vietnam – SSSTikPro",
    description: "Tải video TikTok không logo chất lượng HD miễn phí với SSSTikPro nhanh chóng và an toàn.",
    keywords: "TikTok downloader Vietnam, tải video TikTok, TikTok không watermark, TikTok HD downloader",
    faq: [
      { q: "Làm thế nào để tải video TikTok?", a: "Chỉ cần sao chép liên kết video, dán vào ô nhập liệu và nhấp vào 'Download'." },
      { q: "SSSTikPro có miễn phí không?", a: "Vâng, dịch vụ của chúng tôi hoàn toàn miễn phí 100%." },
      { q: "Nó có an toàn không?", a: "Hoàn toàn an toàn. Chúng tôi không yêu cầu đăng nhập." },
      { q: "Có hoạt động trên điện thoại không?", a: "Có, nó hoạt động hoàn hảo trên mọi thiết bị di động." },
      { q: "Có tải được không logo không?", a: "Chắc chắn rồi, đó là tính năng chính của chúng tôi." }
    ],
    features: [
      { title: "Tải không logo", description: "Video sạch, không có hình mờ TikTok phiền phức." },
      { title: "Chất lượng HD", description: "Tải video với độ phân giải gốc cao nhất." },
      { title: "Xử lý cực nhanh", description: "Tốc độ xử lý link chỉ mất vài giây." },
      { title: "Tải không giới hạn", description: "Không giới hạn số lượng video tải về mỗi ngày." },
      { title: "Tương thích di động", description: "Hoạt động tốt trên iOS, Android và PC." },
      { title: "Bảo mật tuyệt đối", description: "Không cần đăng nhập, bảo vệ quyền riêng tư." }
    ],
    howItWorks: {
      step1: "Sao chép liên kết video TikTok bạn yêu thích.",
      step2: "Dán liên kết vào công cụ tải của SSSTikPro.",
      step3: "Nhấn tải xuống và lưu video HD không logo ngay lập tức."
    },
    whyChoose: {
      title: "Tại sao nên chọn SSSTikPro",
      f1: { t: "Tốc độ vượt trội", d: "Xử lý nhanh hơn gấp 3 lần so với công cụ thông thường." },
      f2: { t: "Giao diện sạch", d: "Không có quảng cáo khó chịu hay cửa sổ bật lên." },
      f3: { t: "Không cần tài khoản", d: "Tiết kiệm thời gian, tải ngay không cần đăng ký." },
      f4: { t: "Miễn phí mãi mãi", d: "Cung cấp dịch vụ cao cấp hoàn toàn không tính phí." }
    },
    seoContent: {
      h2: "Công cụ tải video TikTok tại Việt Nam",
      p1: "SSSTikPro là giải pháp tối ưu để tải video TikTok một cách dễ dàng và nhanh chóng.",
      h3_1: "Tải video TikTok không logo",
      p2: "Tính năng nổi bật là xóa watermark, giúp bạn có video sạch để sử dụng lại.",
      h3_2: "Trình tải TikTok HD",
      p3: "Chúng tôi hỗ trợ tải chất lượng HD, giữ nguyên độ nét của video gốc.",
      h3_3: "Tải MP4 TikTok nhanh gọn",
      p4: "Tiết kiệm thời gian với tốc độ tải xuống nhanh chóng và giao diện thân thiện."
    }
  },
  ja: {
    title: "TikTok Downloader Japan – SSSTikPro",
    description: "SSSTikProでTikTok動画を高画質で透かしなしダウンロード。高速、安全、無料。",
    keywords: "TikTok downloader Japan, TikTok動画ダウンロード, 高画質TikTok保存, TikTok透かしなし",
    faq: [
      { q: "TikTok動画のダウンロード方法は？", a: "動画のURLをコピーして、入力欄に貼り付け、『Download』をクリックするだけです。" },
      { q: "SSSTikProは無料ですか？", a: "はい、100%無料でご利用いただけます。" },
      { q: "安全性は？", a: "完全に安全です。ログイン不要で、個人情報は収集しません。" },
      { q: "スマホで使えますか？", a: "はい、iOSやAndroidのスマホ、タブレットで快適に使えます。" },
      { q: "透かしなしで保存できますか？", a: "はい、ロゴなしの高品質な保存が可能です。" }
    ],
    features: [
      { title: "ロゴなし保存", description: "邪魔なTikTokのロゴがないクリーンな動画を保存。" },
      { title: "HD高画質", description: "オリジナルの最高画質でダウンロード可能。" },
      { title: "高速エンジン", description: "数秒で動画を処理し、待ち時間を短縮。" },
      { title: "無制限ダウンロード", description: "一日の保存制限なし。好きなだけ保存。" },
      { title: "マルチデバイス対応", description: "PC、スマホ、タブレットのすべてに対応。" },
      { title: "安心・安全", description: "アカウント登録不要で、プライバシーを保護。" }
    ],
    howItWorks: {
      step1: "お気に入りのTikTok動画のリンクをコピーします。",
      step2: "SSSTikProを開き、リンクを貼り付けます。",
      step3: "ダウンロードボタンを押して、瞬時に保存します。"
    },
    whyChoose: {
      title: "SSSTikProが選ばれる理由",
      f1: { t: "圧倒的な速さ", d: "最適化されたエンジンで他社より3倍速く処理。" },
      f2: { t: "シンプルなUI", d: "広告が少なく、迷わず使えるプレミアムデザイン。" },
      f3: { t: "登録不要", d: "面倒なログインは一切なしで、すぐに使えます。" },
      f4: { t: "ずっと無料", d: "すべての機能を永久に無料で提供します。" }
    },
    seoContent: {
      h2: "日本最高のTikTokダウンローダー",
      p1: "SSSTikProは、TikTok動画を簡単に保存するための究極のソリューションです。",
      h3_1: "透かしなしでTikTokを保存",
      p2: "最大の特徴はロゴ除去機能です。編集用やオフライン再生用に最適です。",
      h3_2: "HD高画質対応",
      p3: "画質は重要です。弊社はオリジナルと同じHD画質での保存をサポート。" ,
      h3_3: "高速なMP4ダウンロード",
      p4: "時間は貴重です。SSSTikProは、一瞬でダウンロード準備を整えます。"
    }
  },
  zh: {
    title: "TikTok Downloader China – SSSTikPro",
    description: "使用SSSTikPro免费下载高清无水印TikTok视频，快速、安全、稳定。",
    keywords: "TikTok下载器, 无水印TikTok下载, 高清TikTok视频下载, TikTok downloader China",
    faq: [
      { q: "如何下载 TikTok 视频？", a: "只需复制链接，粘贴到输入框，然后点击“下载”。" },
      { q: "SSSTikPro 是免费的吗？", a: "是的，完全免费。我们不收取任何费用。" },
      { q: "它安全吗？", a: "非常安全。我们不需要任何登录信息。" },
      { q: "手机上可以使用吗？", a: "可以，支持所有移动端和桌面端设备。" },
      { q: "可以下载无水印的吗？", a: "是的，我们专门提供无水印高清下载。" }
    ],
    features: [
      { title: "无水印下载", description: "获取没有任何 TikTok 标志的清晰视频。" },
      { title: "HD 高清画质", description: "以原始分辨率下载，保证最高清晰度。" },
      { title: "极速处理", description: "秒级处理链接，无需长时间等待。" },
      { title: "无限次下载", description: "没有每日额度限制，想下就下。" },
      { title: "移动端友好", description: "在 iOS、Android 手机上运行完美。" },
      { title: "安全可靠", description: "无需登录，时刻保护您的数据隐私。" }
    ],
    howItWorks: {
      step1: "找到您喜欢的视频并点击“分享”复制链接。",
      step2: "打开 SSSTikPro 并将链接粘贴到上方下载器中。",
      step3: "点击下载，立即保存无水印高清视频。"
    },
    whyChoose: {
      title: "为什么选择 SSSTikPro",
      f1: { t: "比同行更快", d: "优化的引擎提供比传统工具快 3 倍的处理速度。" },
      f2: { t: "简洁界面", d: "无烦人的弹窗或广告，提供纯净的体验。" },
      f3: { t: "无需登录", d: "珍惜您的时间，无需账号即可开始。" },
      f4: { t: "永久免费", d: "面向所有人免费提供优质服务。" }
    },
    seoContent: {
      h2: "领先的 TikTok 视频下载器",
      p1: "SSSTikPro 是您轻松下载 TikTok 视频的终极解决方案。",
      h3_1: "无水印下载 TikTok 视频",
      p2: "我们下载器最受欢迎的功能就是去水印，为您提供最纯净的画质。",
      h3_2: "高清 TikTok 下载",
      p3: "画质至关重要。我们支持保存原始高清（HD）版本。",
      h3_3: "极速 MP4 下载",
      p4: "时间就是金钱。我们的服务器确保眨眼间就能准备好您的文件。"
    }
  },
  th: {
    title: "TikTok Downloader Thailand – SSSTikPro",
    description: "ดาวน์โหลดวิดีโอ TikTok แบบไม่มีลายน้ำคุณภาพ HD ฟรีด้วย SSSTikPro รวดเร็วและปลอดภัย",
    keywords: "TikTok downloader Thailand, ดาวน์โหลด TikTok, TikTok ไม่มีลายน้ำ, TikTok HD downloader",
    faq: [
      { q: "จะดาวน์โหลดวิดีโอ TikTok ได้อย่างไร?", a: "เพียงคัดลอกลิงก์วิดีโอ วางลงในช่อง และคลิก 'Download'" },
      { q: "SSSTikPro ฟรีหรือไม่?", a: "ใช่ บริการของเราฟรี 100% ตลอดไป" },
      { q: "ปลอดภัยไหม?", a: "ปลอดภัยแน่นอน เราไม่ต้องการข้อมูลส่วนตัวของคุณ" },
      { q: "ใช้กับมือถือได้ไหม?", a: "ได้ รองรับทั้ง iOS, Android และคอมพิวเตอร์" },
      { q: "โหลดแบบไม่มีลายน้ำได้ไหม?", a: "ได้ นี่คือเครื่องมือดาวน์โหลด TikTok แบบไม่มีลายน้ำโดยเฉพาะ" }
    ],
    features: [
      { title: "ไม่มีลายน้ำ", description: "ลบลายน้ำ TikTok ออกเพื่อให้ได้วิดีโอที่สะอาด" },
      { title: "คุณภาพระดับ HD", description: "ดาวน์โหลดด้วยความละเอียดต้นฉบับเพื่อให้ได้ภาพที่คมชัด" },
      { title: "ประมวลผลรวดเร็ว", description: "ประมวลผลลิงก์ของคุณในเวลาเพียงไม่กี่วินาที" },
      { title: "ดาวน์โหลดไม่จำกัด", description: "ไม่มีการจำกัดรอบการดาวน์โหลดต่อวัน" },
      { title: "รองรับมือถือ", description: "ทำงานได้อย่างสมบูรณ์แบบบนอุปกรณ์พกพาทุกรุ่น" },
      { title: "ปลอดภัยและเป็นส่วนตัว", description: "ไม่ต้องล็อกอิน ข้อมูลของคุณได้รับการปกป้อง" }
    ],
    howItWorks: {
      step1: "คัดลอกลิงก์วิดีโอ TikTok ที่คุณต้องการ",
      step2: "เปิด SSSTikPro และวางลิงก์ลงในช่องค้นหาด้านบน",
      step3: "กดดาวน์โหลดและบันทึกวิดีโอ HD ทันที"
    },
    whyChoose: {
      title: "ทำไมต้องเลือก SSSTikPro",
      f1: { t: "เร็วกว่าคู่แข่ง", d: "เครื่องยนต์ของเราเร็วกว่าเครื่องมือทั่วไปถึง 3 เท่า" },
      f2: { t: "UI สะอาดตา", d: "ไม่มีป๊อปอัปน่ารำคาญหรือโฆษณาที่ชวนสับสน" },
      f3: { t: "ไม่ต้องล็อกอิน", d: "ประหยัดเวลาของคุณด้วยการโหลดโดยไม่ต้องสมัครสมาชิก" },
      f4: { t: "ฟรีตลอดไป", d: "บริการระดับพรีเมียมที่มีให้ใช้โดยไม่มีค่าใช้จ่าย" }
    },
    seoContent: {
      h2: "เครื่องมือดาวน์โหลด TikTok ในประเทศไทย",
      p1: "SSSTikPro คือโซลูชันที่ดีที่สุดสำหรับการบันทึกวิดีโอ TikTok อย่างง่ายดาย",
      h3_1: "โหลดวิดีโอ TikTok ไม่มีลายน้ำ",
      p2: "ฟีเจอร์หลักคือการลบลายน้ำเพื่อให้คุณได้วิดีโอต้นฉบับที่สวยงาม",
      h3_2: "ดาวน์โหลด TikTok แบบ HD",
      p3: "เรารองรับการบันทึกในรูปแบบความละเอียดสูง (HD) เสมอ",
      h3_3: "โหลด MP4 TikTok รวดเร็ว",
      p4: "ประหยัดเวลาด้วยความเร็วในการดาวน์โหลดที่เหนือระดับ"
    }
  },
  de: {
    title: "TikTok Downloader Deutschland – SSSTikPro",
    description: "Laden Sie TikTok-Videos ohne Wasserzeichen kostenlos in HD mit SSSTikPro herunter.",
    keywords: "TikTok Downloader Deutschland, TikTok Video Downloader, TikTok ohne Wasserzeichen, HD TikTok Downloader",
    faq: [
      { q: "Wie lade ich TikTok-Videos herunter?", a: "Link kopieren, hier einfügen und auf 'Download' klicken." },
      { q: "Ist SSSTikPro kostenlos?", a: "Ja, unser Service ist zu 100% kostenlos." },
      { q: "Ist es sicher?", a: "Absolut. Alle Downloads sind sicher und ohne Trackking." },
      { q: "Funktioniert es auf dem Handy?", a: "Ja, optimiert für Android und iOS." },
      { q: "Ohne Wasserzeichen?", a: "Ja, wir entfernen das Logo automatisch." }
    ],
    features: [
      { title: "Kein Wasserzeichen", description: "Laden Sie Videos ohne störende Logos herunter." },
      { title: "HD-Qualität", description: "Wir bieten die bestmögliche Auflösung an." },
      { title: "Schnelle Verarbeitung", description: "Verarbeitet Links in Lichtgeschwindigkeit." },
      { title: "Unbegrenzt", description: "Keine Limits für Ihre Downloads." },
      { title: "Mobilfreundlich", description: "Perfekt auf allen Endgeräten nutzbar." },
      { title: "Sicher & Privat", description: "Kein Login nötig, totale Privatsphäre." }
    ],
    howItWorks: {
      step1: "Kopieren Sie den TikTok-Link des Videos.",
      step2: "Fügen Sie den Link bei SSSTikPro ein.",
      step3: "Klicken Sie auf Download und speichern Sie das Video."
    },
    whyChoose: {
      title: "Warum SSSTikPro wählen",
      f1: { t: "Schneller", d: "Bis zu 3x schneller als andere Downloader." },
      f2: { t: "Klares Design", d: "Keine nervige Werbung, nur Premium-Qualität." },
      f3: { t: "Kein Login", d: "Sofort starten ohne Registrierung." },
      f4: { t: "Immer gratis", d: "Unsere Premium-Tools sind für alle kostenlos." }
    },
    seoContent: {
      h2: "Der beste TikTok Downloader für Deutschland",
      p1: "SSSTikPro ist die ideale Lösung zum Speichern von Videos.",
      h3_1: "TikTok ohne Wasserzeichen",
      p2: "Unser Tool entfernt Logos präzise für eine saubere Datei.",
      h3_2: "HD TikTok Downloads",
      p3: "Wir unterstützen High Definition (HD) für alle Nutzer.",
      h3_3: "Schneller MP4-Download",
      p4: "Sparen Sie Zeit mit unserer hocheffizienten Engine."
    }
  },
  ar: {
    title: "TikTok Downloader Arabic – SSSTikPro",
    description: "قم بتنزيل فيديوهات TikTok بدون علامة مائية بجودة HD باستخدام SSSTikPro بسرعة وأمان.",
    keywords: "تحميل فيديو تيك توك, TikTok downloader Arabic, تنزيل تيك توك بدون علامة مائية, HD TikTok downloader",
    faq: [
      { q: "كيفية تحميل فيديوهات تيك توك؟", a: "انسخ الرابط، ضعه في المربع، واضغط 'تحميل'." },
      { q: "هل SSSTikPro مجاني؟", a: "نعم، خدمتنا مجانية 100%." },
      { q: "هل الموقع آمن؟", a: "نعم تماماً، لا نحتاج لمعلومات تسجيل دخول." },
      { q: "هل يعمل على الهاتف؟", a: "نعم، يعمل بشكل ممتاز على جميع الأجهزة." },
      { q: "هل يمكن التحميل بدون علامة مائية؟", a: "نعم، هذا تخصصنا." }
    ],
    features: [
      { title: "بدون علامة مائية", description: "احصل على فيديوهات نظيفة بدون شعار تيك توك." },
      { title: "جودة HD", description: "تحميل الفيديو بدقته الأصلية العالية." },
      { title: "معالجة سريعة", description: "محركنا يعالج الروابط في ثوانٍ معدودة." },
      { title: "تحميل غير محدود", description: "لا توجد حدود يومية لعدد التنزيلات." },
      { title: "متوافق مع الجوال", description: "يعمل بسلاسة على جميع أنظمة الهواتف." },
      { title: "آمن ومحمي", description: "خصوصيتك محمية دائماً ولا حاجة للتسجيل." }
    ],
    howItWorks: {
      step1: "انسخ رابط الفيديو الذي يعجبك من تطبيق تيك توك.",
      step2: "افتح SSSTikPro والصق الرابط في المربع أعلاه.",
      step3: "اضغط على زر التحميل واحفظ الفيديو فوراً."
    },
    whyChoose: {
      title: "لماذا تختار SSSTikPro",
      f1: { t: "أسرع من المنافسين", d: "أداء متفوق يعطيك النتائج بلمح البصر." },
      f2: { t: "واجهة نظيفة", d: "بدون إعلانات مزعجة وتصميم عصري." },
      f3: { t: "لا يتطلب تسجيل", d: "بدأ التحميل مباشرة دون الحاجة لإنشاء حساب." },
      f4: { t: "مجاني للأبد", d: "خدمة مميزة متاحة للجميع بدون أي تكاليف." }
    },
    seoContent: {
      h2: "محمل فيديوهات تيك توك العالمي",
      p1: "SSSTikPro هو الخيار الأمثل لتحميل فيديوهات تيك توك بكل سهولة.",
      h3_1: "تحميل تيك توك بدون علامة مائية",
      p2: "نزيل العلامة المائية لنعطيك فيديوهات بجودة أصلية.",
      h3_2: "جودة عالية HD",
      p3: "ندعم الجودة العالية لضمان أفضل تجربة مشاهدة.",
      h3_3: "تنزيل MP4 سريع",
      p4: "وفر وقتك مع محركنا السريع الذي يجهز ملفاتك فوراً."
    }
  },
  ms: {
    title: "TikTok Downloader Malaysia – SSSTikPro",
    description: "Muat turun video TikTok tanpa watermark dalam kualiti HD secara percuma menggunakan SSSTikPro.",
    keywords: "TikTok downloader Malaysia, muat turun TikTok, TikTok tanpa watermark, TikTok HD downloader",
    faq: [
      { q: "Macam mana nak muat turun?", a: "Copy link, paste kat sini, tekan 'Download'." },
      { q: "Adakah ianya percuma?", a: "Ya, 100% percuma di Malaysia." },
      { q: "Boleh buang watermark?", a: "Ya, kami akan buang watermark secara automatik." },
      { q: "Sesuai untuk Android/iOS?", a: "Ya, berfungsi di semua telefon pintar." },
      { q: "Perlu login?", a: "Tidak perlu login langsung." }
    ],
    features: [
      { title: "Tiada Watermark", description: "Video bersih tanpa logo TikTok." },
      { title: "Kualiti HD", description: "Dapatkan resolusi tertinggi yang disediakan." },
      { title: "Proses Pantas", description: "Sistem kami memproses link anda sekejap sahaja." },
      { title: "Muat Turun Tanpa Had", description: "Tiada had harian untuk anda." },
      { title: "Sesuai Untuk Mudah Alih", description: "Paparan responsif untuk semua peranti." },
      { title: "Selamat", description: "Privasi anda keutamaan kami." }
    ],
    howItWorks: {
      step1: "Salin link video TikTok yang anda mahu.",
      step2: "Buka SSSTikPro dan tampal link tersebut.",
      step3: "Klik download dan simpan video HD anda."
    },
    whyChoose: {
      title: "Kenapa Pilih SSSTikPro",
      f1: { t: "Laju Gila", d: "Sistem yang dioptimasi untuk kelajuan maksima." },
      f2: { t: "UI Moden", d: "Tanpa iklan menjengkelkan, pengalaman premium." },
      f3: { t: "Terus Guna", d: "Tak payah daftar, terus paste dan download." },
      f4: { t: "Sentiasa Percuma", d: "Alat premium untuk semua orang secara percuma." }
    },
    seoContent: {
      h2: "Downloader TikTok Terbaik Malaysia",
      p1: "SSSTikPro adalah pilihan utama rakyat Malaysia untuk menyimpan video.",
      h3_1: "Video Tanpa Watermark",
      p2: "Kami menyediakan kualiti video yang bersih tanpa sebarang gangguan.",
      h3_2: "Kualiti HD Setiap Masa",
      p3: "Dapatkan file MP4 dalam kualiti High Definition.",
      h3_3: "Muat Turun MP4 Cepat",
      p4: "Server kami memastikan proses muat turun berjalan lancar."
    }
  },
  pl: {
    title: "TikTok Downloader Poland – SSSTikPro",
    description: "Pobieraj filmy TikTok bez znaku wodnego w jakości HD za darmo dzięki SSSTikPro.",
    keywords: "TikTok downloader Poland, pobieranie TikTok, TikTok bez watermark, HD TikTok downloader",
    faq: [
      { q: "Jak pobrać film?", a: "Skopiuj link, wklej go tutaj i kliknij 'Download'." },
      { q: "Czy to jest darmowe?", a: "Tak, 100% za darmo dla wszystkich." },
      { q: "Czy to jest bezpieczne?", a: "Tak, nie wymagamy żadnych danych ani logowania." },
      { q: "Działa na telefonie?", a: "Tak, w pełni kompatybilne z Android i iOS." },
      { q: "Bez znaku wodnego?", a: "Tak, usuwamy znak wodny automatycznie." }
    ],
    features: [
      { title: "Bez znaku wodnego", description: "Czyste filmy bez zbędnych logotypów." },
      { title: "Jakość HD", description: "Pobieraj filmy w ich oryginalnej rozdzielczości." },
      { title: "Szybkość", description: "Nasze serwery działają błyskawicznie." },
      { title: "Bez limitów", description: "Pobieraj ile chcesz bez żadnych opłat." },
      { title: "Wygoda na mobile", description: "Serwis działa idealnie na smartfonach." },
      { title: "Pełna anonimowość", description: "Brak potrzeby zakładania konta." }
    ],
    howItWorks: {
      step1: "Znajdź film i skopiuj link do współdzielenia.",
      step2: "Wklej link do pola tekstowego w SSSTikPro.",
      step3: "Kliknij download i zapisz film HD."
    },
    whyChoose: {
      title: "Dlaczego SSSTikPro",
      f1: { t: "Najszybszy silnik", d: "Wyniki nawet kilkukrotnie szybciej." },
      f2: { t: "Przejrzysty UI", d: "Nowoczesny design bez wirusów i reklam." },
      f3: { t: "Bez konta", d: "Szanujemy Twój czas - pobieraj od razu." },
      f4: { t: "Zawsze free", d: "Platforma dostępna bezpłatnie na zawsze." }
    },
    seoContent: {
      h2: "Polska platforma do pobierania TikTok",
      p1: "SSSTikPro to najprostszy sposób na zapisywanie ulubionych treści.",
      h3_1: "Usuwanie znaku wodnego",
      p2: "Zdobądź filmy bez znaku wodnego, gotowe do dalszej edycji.",
      h3_2: "Najwyższa jakość HD",
      p3: "Obsługujemy oryginalną jakość High Definition z serwerów.",
      h3_3: "Ekspresowe MP4",
      p4: "Nasz system gwarantuje gotowe pliki w parę sekund."
    }
  },
  cs: {
    title: "TikTok Downloader Czech – SSSTikPro",
    description: "Stahujte TikTok videa bez vodoznaku zdarma ve vysoké kvalitě pomocí SSSTikPro.",
    keywords: "TikTok downloader Czech, stahování TikTok videí, TikTok bez watermarku, HD TikTok downloader",
    faq: [
      { q: "Jak stahovat?", a: "Zkopírujte odkaz, vložte ho zde a klikněte na 'Download'." },
      { q: "Je to zdarma?", a: "Ano, náš downloader je zcela zdarma." },
      { q: "Je to bezpečné?", a: "Ano, nepoužíváme cookies k sledování ani login." },
      { q: "Funguje to na mobilu?", a: "Ano, plně responzivní na iOS i Android." },
      { q: "Bez vodoznaku?", a: "Ano, odstraňujeme vodoznak zdarma." }
    ],
    features: [
      { title: "Bez vodoznaku", description: "Filmy v čisté podobě bez log." },
      { title: "HD kvalita", description: "Rozlišení jako v originálním videu." },
      { title: "Rychlý engine", description: "Zpracování odkazu za pár vteřin." },
      { title: "Bez limitů", description: "Ukládejte libovolné množství videí." },
      { title: "Podpora pro mobily", description: "Funguje skvěle v každém prohlížeči." },
      { title: "Bezpečnost", description: "Anonymní použití bez registrace." }
    ],
    howItWorks: {
      step1: "Zkopírujte URL adresu oblíbeného videa.",
      step2: "Vložte odkaz do SSSTikPro vyhledávače.",
      step3: "Klikněte na tlačítko download a stáhněte si video."
    },
    whyChoose: {
      title: "Proč zvolit SSSTikPro",
      f1: { t: "Blesková rychlost", d: "Až 3x rychlejší než jiné alternativy." },
      f2: { t: "Moderní vzhled", d: "Design bez otravných reklam a vyskakovacích oken." },
      f3: { t: "Bez čekání", d: "Žádné vytváření uživatelských profilů." },
      f4: { t: "Vždy bezplatně", d: "Naše prémiové služby jsou pro vás vždy zdarma." }
    },
    seoContent: {
      h2: "Český TikTok video downloader",
      p1: "SSSTikPro je perfektní nástroj pro ukládání TikTok videí v Česku.",
      h3_1: "Stahování bez loga",
      p2: "Umožňujeme vám získat čistá videa pro další použití.",
      h3_2: "Vysoké rozlišení HD",
      p3: "Podporujeme ukládání v HDR a HD kvalitě.",
      h3_3: "Rychlé MP4 ukládání",
      p4: "Nestačte mrknout a vaše video je připraveno ke stažení."
    }
  }
};
