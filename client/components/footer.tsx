import { Leaf } from "lucide-react"

interface FooterProps {
  language: string
}

export function Footer({ language }: FooterProps) {
  const content = {
    en: {
      footer: {
        about: "About Us",
        contact: "Contact",
        privacy: "Privacy Policy",
        copyright: "Built with ❤ for farmers.",
      },
    },
    ml: {
      footer: {
        about: "ഞങ്ങളെ കുറിച്ച്",
        contact: "ബന്ധപ്പെടുക",
        privacy: "സ്വകാര്യതാ നയം",
        copyright: "കേരളത്തിലെ കർഷകർക്കായി ❤ ഉപയോഗിച്ച് നിർമ്മിച്ചത്.",
      },
    },
    hi: {
      footer: {
        about: "हमारे बारे में",
        contact: "संपर्क करें",
        privacy: "गोपनीयता नीति",
        copyright: "केरल के किसानों के लिए ❤ के साथ बनाया गया।",
      },
    },
  }

  const t = content[language as keyof typeof content] || content.en

  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Leaf className="h-6 w-6" />
            <span className="text-lg font-bold">Krishi Sakhi 🌾</span>
          </div>
          <div className="flex space-x-6">
            <a href="/about" className="hover:text-primary-foreground/80 transition-colors">
              {t.footer.about}
            </a>
            <a href="#" className="hover:text-primary-foreground/80 transition-colors">
              {t.footer.contact}
            </a>
            <a href="#" className="hover:text-primary-foreground/80 transition-colors">
              {t.footer.privacy}
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-primary-foreground/80">© 2026 Krishi Sakhi. {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}