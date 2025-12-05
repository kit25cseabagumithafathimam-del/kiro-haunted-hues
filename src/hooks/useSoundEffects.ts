import { useCallback, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useSoundStore } from '@/stores/soundStore';

// Free sound URLs from various CDNs
const SOUND_URLS = {
  // Ambient
  ambient: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', // wind/atmosphere
  thunder: 'https://assets.mixkit.co/active_storage/sfx/1282/1282-preview.mp3',
  
  // Interactive
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // bone crack
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // subtle
  complete: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // chime
  error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  
  // Notifications
  notification: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // bell
  alert: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  
  // Special
  jumpscare: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3',
  whisper: 'https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3',
  footsteps: 'https://assets.mixkit.co/active_storage/sfx/2576/2576-preview.mp3',
  heartbeat: 'https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.mp3',
};

type SoundType = keyof typeof SOUND_URLS;

export const useSoundEffects = () => {
  const { masterVolume, effectsVolume, ambientVolume, isMuted, ambientPlaying, setAmbientPlaying } = useSoundStore();
  const soundsRef = useRef<Record<string, Howl>>({});
  const ambientRef = useRef<Howl | null>(null);

  // Initialize sounds
  useEffect(() => {
    // Preload effect sounds
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      if (key !== 'ambient') {
        soundsRef.current[key] = new Howl({
          src: [url],
          volume: 0.5,
          preload: true,
        });
      }
    });

    // Setup ambient sound
    ambientRef.current = new Howl({
      src: [SOUND_URLS.ambient],
      loop: true,
      volume: 0.2,
    });

    return () => {
      Object.values(soundsRef.current).forEach(sound => sound.unload());
      ambientRef.current?.unload();
    };
  }, []);

  // Update global volume
  useEffect(() => {
    Howler.volume(isMuted ? 0 : masterVolume);
  }, [masterVolume, isMuted]);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    
    const sound = soundsRef.current[type];
    if (sound) {
      sound.volume(effectsVolume * masterVolume);
      sound.play();
    }
  }, [effectsVolume, masterVolume, isMuted]);

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playHover = useCallback(() => playSound('hover'), [playSound]);
  const playComplete = useCallback(() => playSound('complete'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);
  const playNotification = useCallback(() => playSound('notification'), [playSound]);
  const playJumpscare = useCallback(() => playSound('jumpscare'), [playSound]);
  const playWhisper = useCallback(() => playSound('whisper'), [playSound]);
  const playFootsteps = useCallback(() => playSound('footsteps'), [playSound]);
  const playHeartbeat = useCallback(() => playSound('heartbeat'), [playSound]);
  const playThunder = useCallback(() => playSound('thunder'), [playSound]);

  const toggleAmbient = useCallback(() => {
    if (!ambientRef.current) return;
    
    if (ambientPlaying) {
      ambientRef.current.pause();
      setAmbientPlaying(false);
    } else {
      ambientRef.current.volume(ambientVolume * masterVolume);
      ambientRef.current.play();
      setAmbientPlaying(true);
    }
  }, [ambientPlaying, ambientVolume, masterVolume, setAmbientPlaying]);

  return {
    playClick,
    playHover,
    playComplete,
    playError,
    playNotification,
    playJumpscare,
    playWhisper,
    playFootsteps,
    playHeartbeat,
    playThunder,
    toggleAmbient,
    ambientPlaying,
  };
};
