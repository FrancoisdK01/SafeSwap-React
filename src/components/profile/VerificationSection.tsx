import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { useLanguage } from '../../contexts/LanguageContext';

export default function VerificationSection() {
  const { t } = useLanguage();
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  const handleIdUpload = (file: File) => {
    console.log('ID document uploaded:', file.name);
    setIdUploaded(true);
  };

  const handleSelfieUpload = (file: File) => {
    console.log('Selfie uploaded:', file.name);
    setSelfieUploaded(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-medium mb-2">{t('profile.steps')}</h2>
      <div className="space-y-4">
        <ImageUpload
          label={t('profile.step1')}
          onUpload={handleIdUpload}
          isUploaded={idUploaded}
        />
        <ImageUpload
          label={t('profile.step2')}
          onUpload={handleSelfieUpload}
          isUploaded={selfieUploaded}
        />
      </div>
    </div>
  );
}