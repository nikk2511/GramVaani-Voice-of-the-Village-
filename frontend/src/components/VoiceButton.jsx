'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { speak, stopSpeaking, isSpeaking } from '@/lib/voice';

export default function VoiceButton({ text, className = '' }) {
  const { i18n } = useTranslation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleClick = () => {
    if (isActive || isSpeaking()) {
      stopSpeaking();
      setIsActive(false);
    } else {
      speak(text, i18n.language);
      setIsActive(true);
      
      // Reset after speech ends
      setTimeout(() => {
        setIsActive(false);
      }, text.length * 50); // Rough estimate
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`voice-button ${className}`}
      aria-label={isActive ? 'Stop voice' : 'Play voice'}
      title={isActive ? 'Stop voice' : 'Play voice'}
    >
      {isActive ? (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383.07zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}

