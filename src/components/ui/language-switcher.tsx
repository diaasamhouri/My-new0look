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

  // Initialize direction on mount
  React.useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 min-h-[44px] px-3 py-2 sm:px-4">
          <Globe className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline text-sm">
            {t('common.language')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border z-50 min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={`min-h-[44px] px-4 py-2 cursor-pointer ${i18n.language === 'en' ? 'bg-accent' : ''}`}
        >
          {t('common.english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('ar')}
          className={`min-h-[44px] px-4 py-2 cursor-pointer ${i18n.language === 'ar' ? 'bg-accent' : ''}`}
        >
          {t('common.arabic')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};