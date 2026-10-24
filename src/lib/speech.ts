/**
 * Web Speech API wrapper for Kannada Speech Synthesis and Speech Recognition.
 */

export class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private recognition: any = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    if (!this.synth || typeof window === 'undefined') {
      console.warn('Speech synthesis is not supported on this browser/environment.');
      options?.onEnd?.();
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending utterance

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate ?? 0.9;
      utterance.pitch = options?.pitch ?? 1.0;

      // Find Kannada or Indian voice
      const voices = this.getAvailableVoices();
      const kannadaVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === 'kn-in' ||
          v.lang.toLowerCase().startsWith('kn') ||
          v.name.toLowerCase().includes('kannada')
      );

      const indianVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('en-in') ||
          v.lang.toLowerCase().includes('hi-in')
      );

      if (kannadaVoice) {
        utterance.voice = kannadaVoice;
        utterance.lang = 'kn-IN';
      } else if (indianVoice) {
        utterance.voice = indianVoice;
        utterance.lang = indianVoice.lang;
      } else {
        utterance.lang = 'kn-IN';
      }

      utterance.onend = () => {
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e);
        options?.onError?.(e);
        options?.onEnd?.();
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.error('Error invoking speak:', e);
      options?.onError?.(e);
      options?.onEnd?.();
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public startListening(
    callbacks: {
      onResult: (transcript: string, isFinal: boolean) => void;
      onError?: (error: any) => void;
      onEnd?: () => void;
    },
    lang: string = 'kn-IN'
  ): { stop: () => void } {
    if (!this.isSpeechRecognitionSupported()) {
      callbacks.onError?.(new Error('Speech recognition not supported in this browser.'));
      callbacks.onEnd?.();
      return { stop: () => {} };
    }

    const SpeechRec =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    try {
      this.recognition = new SpeechRec();
      this.recognition.lang = lang;
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        callbacks.onResult(text, !!finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        callbacks.onError?.(event);
      };

      this.recognition.onend = () => {
        callbacks.onEnd?.();
      };

      this.recognition.start();

      return {
        stop: () => {
          try {
            this.recognition?.stop();
          } catch (e) {
            // ignore
          }
        },
      };
    } catch (err) {
      callbacks.onError?.(err);
      callbacks.onEnd?.();
      return { stop: () => {} };
    }
  }
}

export const speechService = SpeechService.getInstance();
