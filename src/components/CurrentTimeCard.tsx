
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDateTime } from '@/utils/dateUtils';

const CurrentTimeCard = () => {
  const { t } = useLanguage();
  const currentTime = formatDateTime(new Date().toISOString());

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-2 text-blue-800">
          <Clock className="h-5 w-5" />
          <span className="font-medium">{t.currentTime}: {currentTime}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentTimeCard;
