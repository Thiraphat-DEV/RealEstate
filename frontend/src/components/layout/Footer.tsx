import { memo } from 'react'

export const Footer = memo(() => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">เกี่ยวกับเรา</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">เกี่ยวกับอสังหาริมทรัพย์</a></li>
              <li><a href="mailto:thiraboaty@gmail.com" className="hover:text-gold-400 transition-colors">ติดต่อเรา</a></li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="text-white font-semibold mb-4">สำหรับผู้ซื้อ</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">ดูอสังหาริมทรัพย์</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">คู่มืออสังหาริมทรัพย์</a></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="text-white font-semibold mb-4">สำหรับผู้ขาย</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">ขายอสังหาริมทรัพย์</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">คู่มือราคา</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">ทรัพยากร</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition-colors">ข่าวอสังหาริมทรัพย์</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">ศูนย์ช่วยเหลือ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2026 Thiraphat Chorakhe
          </p>
          <div className="flex ml-10 gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-gold-400 transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="text-sm hover:text-gold-400 transition-colors">เงื่อนไขการให้บริการ</a>
            <a href="#" className="text-sm hover:text-gold-400 transition-colors">นโยบายคุกกี้</a>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
