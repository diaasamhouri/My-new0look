
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  // Initialize direction on mount and handle font loading
  React.useEffect(() => {
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';
    
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // Add Arabic font classes when needed
    if (isRTL) {
      document.body.classList.add('arabic-font');
    } else {
      document.body.classList.remove('arabic-font');
    }
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    const isRTL = lng === 'ar';
    
    i18n.changeLanguage(lng);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    
    // Handle font classes
    if (isRTL) {
      document.body.classList.add('arabic-font');
    } else {
      document.body.classList.remove('arabic-font');
    }
    
    // Store language preference
    localStorage.setItem('preferred-language', lng);
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'ar' ? 'العربية' : 'English';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 min-h-[44px] px-3 py-2 sm:px-4 transition-all hover:scale-105"
        >
          <Globe className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline text-sm font-medium">
            {getCurrentLanguageLabel()}
          </span>
          <span className="sm:hidden text-sm font-medium">
            {i18n.language === 'ar' ? 'ع' : 'EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-card border-border z-50 min-w-[140px] shadow-lg"
      >
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={`min-h-[44px] px-4 py-2 cursor-pointer transition-colors hover:bg-accent ${
            i18n.language === 'en' ? 'bg-accent font-medium' : ''
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span>
            English
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('ar')}
          className={`min-h-[44px] px-4 py-2 cursor-pointer transition-colors hover:bg-accent ${
            i18n.language === 'ar' ? 'bg-accent font-medium' : ''
          }`}
          dir="rtl"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🇸🇦</span>
            العربية
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
