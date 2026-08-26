import { useState, useRef, useEffect } from 'react';

const AMBIANCE_SPACES = [
  {
    id: 1,
    title: 'Rooftop Starlight Terrace',
    tag: '🌌 Outdoor Sky Dining',
    description: 'Breathtaking 360° panoramic city skyline views under romantic fairy lights and gentle evening breezes.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=85',
    features: ['Open-air dining', 'Live acoustic music', 'Stargazing setup', 'Heat lamps in winter'],
  },
  {
    id: 2,
    title: 'Royal Velvet Indoor Lounge',
    tag: '🛋️ Luxury Fine Dining',
    description: 'Rich amber mood lighting, handcrafted leather booths, and curated soft jazz for intimate conversations.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&auto=format&fit=crop&q=85',
    features: ['Plush curved booths', 'Acoustic soundproofing', 'Temperature controlled', 'Curated wine wall'],
  },
  {
    id: 3,
    title: 'Open Tandoor & Live Kitchen',
    tag: '👨‍🍳 Culinary Theatrics',
    description: 'Watch master chefs roast kebabs in clay tandoors and flambé artisanal wok delicacies live.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=85',
    features: ['Chef interactive table', 'Live copper tandoors', 'Fresh bakery station', 'Tasting menu counter'],
  },
  {
    id: 4,
    title: 'Imperial Private VIP Suite',
    tag: '👑 Private Celebrations',
    description: 'Exquisite private dining salon with crystal chandelier, dedicated butler service, and custom menus.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&auto=format&fit=crop&q=85',
    features: ['Private butler', 'Custom playlist control', 'Up to 24 guests', 'Dedicated bar station'],
  },
];

function AmbianceGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? AMBIANCE_SPACES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === AMBIANCE_SPACES.length - 1 ? 0 : prev + 1));
  };

  const activeSpace = AMBIANCE_SPACES[currentIndex];

  // Ambient sound synthesizer using Web Audio API
  const startAmbientSynth = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Warm jazz chord progression frequencies (Cmaj7 -> Am7 -> Dm7 -> G7)
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];

      let chordIdx = 0;

      const playChord = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Soft ambient volume envelope
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + 4.0);
        });
      };

      playChord();
      intervalRef.current = setInterval(playChord, 3600);
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  };

  const stopAmbientSynth = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      stopAmbientSynth();
      setIsPlayingMusic(false);
    } else {
      startAmbientSynth();
      setIsPlayingMusic(true);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSynth();
    };
  }, []);

  return (
    <section id="ambiance" className="section ambiance-section-wrap">
      <div className="section-header-wrap">
        <h2 className="section-title">
          <span className="symbol">&mdash;</span> Ambiance &amp; Virtual Tour <span className="symbol">&mdash;</span>
        </h2>
        <p className="section-subtitle">
          Immerse yourself in our distinct dining zones, designed for unforgettable gatherings, romance, and celebrations.
        </p>

        {/* Ambient Sound Toggle */}
        <div className="music-toggle-container">
          <button
            type="button"
            className={`ambient-audio-btn ${isPlayingMusic ? 'playing' : ''}`}
            onClick={toggleMusic}
          >
            <span>{isPlayingMusic ? '🔊 Lounge Jazz Ambient: Playing' : '🎵 Play Ambient Restaurant Jazz'}</span>
            {isPlayingMusic && <span className="sound-wave-anim">🎶</span>}
          </button>
        </div>
      </div>

      {/* Main Feature Carousel */}
      <div className="ambiance-showcase-container">
        <div className="ambiance-carousel-frame">
          <img
            src={activeSpace.image}
            alt={activeSpace.title}
            className="ambiance-large-img"
          />
          <div className="ambiance-overlay-gradient"></div>

          <div className="ambiance-360-badge">
            <span>🔄 360° Virtual Showcase</span>
          </div>

          <button className="carousel-nav-btn prev" onClick={handlePrev} aria-label="Previous image">
            &#10094;
          </button>
          <button className="carousel-nav-btn next" onClick={handleNext} aria-label="Next image">
            &#10095;
          </button>

          {/* Space Details Card */}
          <div className="ambiance-caption-box">
            <span className="ambiance-tag-pill">{activeSpace.tag}</span>
            <h3>{activeSpace.title}</h3>
            <p>{activeSpace.description}</p>
            <div className="ambiance-features-row">
              {activeSpace.features.map((feat, idx) => (
                <span key={idx} className="feat-chip">
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Grid */}
        <div className="ambiance-thumbs-grid">
          {AMBIANCE_SPACES.map((space, idx) => (
            <div
              key={space.id}
              className={`ambiance-thumb-card ${currentIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={space.image} alt={space.title} />
              <div className="thumb-info">
                <strong>{space.title}</strong>
                <span>{space.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AmbianceGallery;
