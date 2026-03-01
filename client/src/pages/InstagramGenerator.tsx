import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import {
  TOPICS,
  FORMATS,
  HOOK_LABELS,
  ERGO,
  generateSlidesFromTopic,
  type TopicTemplate,
  type FormatKey,
  type HookType,
  type SlideData,
} from '@/lib/instagram-config';
import { SlideRenderer, StoryFrameRenderer } from '@/components/instagram/SlideRenderer';

type TabKey = 'slides' | 'stories' | 'caption' | 'script' | 'info';

export default function InstagramGenerator() {
  const [selectedTopic, setSelectedTopic] = useState<TopicTemplate | null>(null);
  const [format, setFormat] = useState<FormatKey>('feed');
  const [hookType, setHookType] = useState<HookType>('schock');
  const [activeTab, setActiveTab] = useState<TabKey>('slides');
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const handleSelectTopic = useCallback((topic: TopicTemplate) => {
    setSelectedTopic(topic);
    setSlides(generateSlidesFromTopic(topic, hookType));
    setActiveSlideIndex(0);
    setActiveTab('slides');
  }, [hookType]);

  const handleHookChange = useCallback((newHook: HookType) => {
    setHookType(newHook);
    if (selectedTopic) {
      setSlides(generateSlidesFromTopic(selectedTopic, newHook));
      setActiveSlideIndex(0);
    }
  }, [selectedTopic]);

  const handleDownloadSlide = useCallback(async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(ref.current, {
        quality: 1,
        pixelRatio: 1,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  }, []);

  const handleDownloadAllSlides = useCallback(async () => {
    if (!selectedTopic) return;
    setDownloading(true);

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    try {
      for (let i = 0; i < slides.length; i++) {
        const wrapper = document.createElement('div');
        container.appendChild(wrapper);

        // Use ReactDOM to render each slide
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(wrapper);

        await new Promise<void>((resolve) => {
          root.render(
            <SlideRenderer
              ref={(el) => {
                if (el) {
                  // Wait for render
                  requestAnimationFrame(async () => {
                    try {
                      const dataUrl = await toPng(el, { quality: 1, pixelRatio: 1, cacheBust: true });
                      const link = document.createElement('a');
                      link.download = `${selectedTopic.id}_slide_${i + 1}.png`;
                      link.href = dataUrl;
                      link.click();
                    } catch (err) {
                      console.error(`Failed to download slide ${i + 1}:`, err);
                    }
                    root.unmount();
                    resolve();
                  });
                }
              }}
              slide={slides[i]}
              format={format}
              slideIndex={i}
              totalSlides={slides.length}
            />
          );
        });

        // Small delay between downloads
        await new Promise(r => setTimeout(r, 300));
      }
    } finally {
      document.body.removeChild(container);
      setDownloading(false);
    }
  }, [selectedTopic, slides, format]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  // Scale factor for preview
  const previewScale = format === 'feed' ? 0.25 : 0.2;
  const previewWidth = FORMATS[format].width * previewScale;
  const previewHeight = FORMATS[format].height * previewScale;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${ERGO.primary}, ${ERGO.gradientTo})`,
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontFamily: ERGO.fontHeadline,
            fontSize: 24,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: ERGO.logoSpacing,
          }}>
            ERGO
          </span>
          <span style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
          }}>
            Instagram Generator
          </span>
        </div>
        <div style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
        }}>
          {ERGO.agency} &middot; {ERGO.region}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 80px' }}>
        {/* Topic Selection */}
        {!selectedTopic ? (
          <div>
            <h2 style={{
              fontFamily: ERGO.fontHeadline,
              fontSize: 28,
              fontWeight: 800,
              color: ERGO.textDark,
              marginBottom: 8,
            }}>
              Thema auswählen
            </h2>
            <p style={{ fontSize: 16, color: ERGO.textMedium, marginBottom: 24 }}>
              Wähle ein Thema und erhalte sofort ein komplettes Content-Paket für Instagram.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}>
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  style={{
                    padding: '24px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #e8e8e8',
                    borderRadius: 16,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = ERGO.primary;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(238,1,56,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8e8e8';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{topic.icon}</div>
                  <div style={{
                    fontFamily: ERGO.fontHeadline,
                    fontSize: 18,
                    fontWeight: 700,
                    color: ERGO.textDark,
                    marginBottom: 8,
                  }}>
                    {topic.name}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: ERGO.textMedium,
                    lineHeight: 1.5,
                  }}>
                    {topic.hooks.schock.replace('\n', ' ')}
                  </div>
                  {topic.seasonal && (
                    <div style={{
                      marginTop: 12,
                      padding: '4px 12px',
                      backgroundColor: ERGO.accentBg,
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      color: ERGO.primary,
                      display: 'inline-block',
                    }}>
                      {topic.seasonal}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Back button + Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <button
                onClick={() => { setSelectedTopic(null); setSlides([]); }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #e0e0e0',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  color: ERGO.textDark,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                ← Zurück
              </button>

              <div style={{
                fontFamily: ERGO.fontHeadline,
                fontSize: 22,
                fontWeight: 800,
                color: ERGO.textDark,
                flex: 1,
              }}>
                {selectedTopic.icon} {selectedTopic.name}
              </div>

              {/* Format selector */}
              <div style={{ display: 'flex', gap: 8 }}>
                {(Object.keys(FORMATS) as FormatKey[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: format === f ? ERGO.primary : '#FFFFFF',
                      color: format === f ? '#FFFFFF' : ERGO.textDark,
                      border: `2px solid ${format === f ? ERGO.primary : '#e0e0e0'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {FORMATS[f].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hook selector */}
            <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: ERGO.textMedium, alignSelf: 'center', marginRight: 8 }}>
                Hook-Typ:
              </span>
              {(Object.keys(HOOK_LABELS) as HookType[]).map((h) => (
                <button
                  key={h}
                  onClick={() => handleHookChange(h)}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: hookType === h ? ERGO.accentBg : '#FFFFFF',
                    color: hookType === h ? ERGO.primary : ERGO.textMedium,
                    border: `1.5px solid ${hookType === h ? ERGO.primary : '#e0e0e0'}`,
                    borderRadius: 20,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {HOOK_LABELS[h]}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: 0,
              borderBottom: '2px solid #e8e8e8',
              marginBottom: 24,
            }}>
              {([
                { key: 'slides' as TabKey, label: 'Carousel Slides' },
                { key: 'stories' as TabKey, label: 'Story-Serie' },
                { key: 'caption' as TabKey, label: 'Caption' },
                { key: 'script' as TabKey, label: 'HeyGen Script' },
                { key: 'info' as TabKey, label: 'Posting-Info' },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === key ? `3px solid ${ERGO.primary}` : '3px solid transparent',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: activeTab === key ? 700 : 500,
                    color: activeTab === key ? ERGO.primary : ERGO.textMedium,
                    marginBottom: -2,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'slides' && (
              <div>
                {/* Slide thumbnails */}
                <div style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                  paddingBottom: 16,
                  marginBottom: 24,
                }}>
                  {slides.map((slide, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlideIndex(i)}
                      style={{
                        width: previewWidth,
                        height: previewHeight,
                        overflow: 'hidden',
                        borderRadius: 8,
                        border: `3px solid ${activeSlideIndex === i ? ERGO.primary : '#e0e0e0'}`,
                        cursor: 'pointer',
                        flexShrink: 0,
                        position: 'relative',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <div style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'top left',
                        pointerEvents: 'none',
                      }}>
                        <SlideRenderer
                          slide={slide}
                          format={format}
                          slideIndex={i}
                          totalSlides={slides.length}
                        />
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '4px 6px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: '#FFF',
                        fontSize: 10,
                        fontWeight: 600,
                        textAlign: 'center',
                      }}>
                        {slide.label.split(' — ')[1] || slide.label}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active slide preview + download */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{
                      width: previewWidth * 2,
                      height: previewHeight * 2,
                      overflow: 'hidden',
                      borderRadius: 12,
                      border: '2px solid #e0e0e0',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    }}>
                      <div style={{
                        transform: `scale(${previewScale * 2})`,
                        transformOrigin: 'top left',
                      }}>
                        <SlideRenderer
                          slide={slides[activeSlideIndex]}
                          format={format}
                          slideIndex={activeSlideIndex}
                          totalSlides={slides.length}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        disabled={activeSlideIndex === 0}
                        onClick={() => setActiveSlideIndex(i => i - 1)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#FFFFFF',
                          border: '2px solid #e0e0e0',
                          borderRadius: 8,
                          cursor: activeSlideIndex === 0 ? 'not-allowed' : 'pointer',
                          opacity: activeSlideIndex === 0 ? 0.4 : 1,
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        ← Zurück
                      </button>
                      <button
                        disabled={activeSlideIndex === slides.length - 1}
                        onClick={() => setActiveSlideIndex(i => i + 1)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#FFFFFF',
                          border: '2px solid #e0e0e0',
                          borderRadius: 8,
                          cursor: activeSlideIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: activeSlideIndex === slides.length - 1 ? 0.4 : 1,
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        Weiter →
                      </button>
                      <span style={{ fontSize: 14, color: ERGO.textMedium, alignSelf: 'center', marginLeft: 8 }}>
                        {activeSlideIndex + 1} / {slides.length}
                      </span>
                    </div>
                  </div>

                  {/* Slide info + download */}
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{
                      padding: 24,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 12,
                      border: '1px solid #e8e8e8',
                    }}>
                      <h3 style={{
                        fontFamily: ERGO.fontHeadline,
                        fontSize: 18,
                        fontWeight: 700,
                        color: ERGO.textDark,
                        marginBottom: 8,
                      }}>
                        {slides[activeSlideIndex].label}
                      </h3>
                      <p style={{ fontSize: 14, color: ERGO.textMedium, marginBottom: 16 }}>
                        {FORMATS[format].width} × {FORMATS[format].height}px ({FORMATS[format].ratio})
                      </p>

                      <button
                        onClick={() => handleDownloadSlide(slideRef, `${selectedTopic.id}_slide_${activeSlideIndex + 1}.png`)}
                        disabled={downloading}
                        style={{
                          width: '100%',
                          padding: '12px 24px',
                          backgroundColor: ERGO.primary,
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 10,
                          cursor: downloading ? 'not-allowed' : 'pointer',
                          fontSize: 14,
                          fontWeight: 700,
                          marginBottom: 8,
                          opacity: downloading ? 0.7 : 1,
                        }}
                      >
                        {downloading ? 'Wird erstellt...' : 'Diese Slide als PNG'}
                      </button>

                      <button
                        onClick={handleDownloadAllSlides}
                        disabled={downloading}
                        style={{
                          width: '100%',
                          padding: '12px 24px',
                          backgroundColor: '#FFFFFF',
                          color: ERGO.primary,
                          border: `2px solid ${ERGO.primary}`,
                          borderRadius: 10,
                          cursor: downloading ? 'not-allowed' : 'pointer',
                          fontSize: 14,
                          fontWeight: 700,
                          opacity: downloading ? 0.7 : 1,
                        }}
                      >
                        {downloading ? 'Wird erstellt...' : 'Alle Slides als PNG'}
                      </button>
                    </div>

                    {/* Quick edit hint */}
                    <div style={{
                      marginTop: 16,
                      padding: 16,
                      backgroundColor: ERGO.accentBg,
                      borderRadius: 12,
                      fontSize: 13,
                      color: ERGO.textMedium,
                      lineHeight: 1.6,
                    }}>
                      <strong>Hook-Typ wechseln</strong> um verschiedene Hook-Varianten zu sehen. Jedes Thema hat 5 verschiedene Hook-Stile.
                    </div>
                  </div>
                </div>

                {/* Hidden full-res render for download */}
                <div style={{ position: 'fixed', left: -9999, top: 0 }}>
                  <SlideRenderer
                    ref={slideRef}
                    slide={slides[activeSlideIndex]}
                    format={format}
                    slideIndex={activeSlideIndex}
                    totalSlides={slides.length}
                  />
                </div>
              </div>
            )}

            {activeTab === 'stories' && selectedTopic.storyFrames && (
              <div>
                <div style={{
                  display: 'flex',
                  gap: 16,
                  overflowX: 'auto',
                  paddingBottom: 16,
                }}>
                  {selectedTopic.storyFrames.map((frame, i) => (
                    <div key={i} style={{ flexShrink: 0 }}>
                      <div style={{
                        width: 216,
                        height: 384,
                        overflow: 'hidden',
                        borderRadius: 12,
                        border: '2px solid #e0e0e0',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        position: 'relative',
                      }}>
                        <div style={{
                          transform: 'scale(0.2)',
                          transformOrigin: 'top left',
                          pointerEvents: 'none',
                        }}>
                          <StoryFrameRenderer
                            frame={frame}
                            frameIndex={i}
                            totalFrames={selectedTopic.storyFrames.length}
                          />
                        </div>
                      </div>
                      <div style={{
                        marginTop: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        color: ERGO.textDark,
                        textAlign: 'center',
                      }}>
                        Frame {i + 1}: {frame.label}
                      </div>
                      <button
                        onClick={() => handleDownloadSlide(storyRef, `${selectedTopic.id}_story_${i + 1}.png`)}
                        disabled={downloading}
                        style={{
                          marginTop: 6,
                          width: '100%',
                          padding: '6px 12px',
                          backgroundColor: ERGO.primary,
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        PNG
                      </button>
                      {/* Hidden full-res story render */}
                      <div style={{ position: 'fixed', left: -9999, top: 0 }}>
                        <StoryFrameRenderer
                          ref={storyRef}
                          frame={frame}
                          frameIndex={i}
                          totalFrames={selectedTopic.storyFrames.length}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Story design notes */}
                <div style={{
                  marginTop: 24,
                  padding: 20,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                }}>
                  <h3 style={{
                    fontFamily: ERGO.fontHeadline,
                    fontSize: 16,
                    fontWeight: 700,
                    color: ERGO.textDark,
                    marginBottom: 12,
                  }}>
                    Story-Serie Hinweise
                  </h3>
                  <ul style={{ fontSize: 14, color: ERGO.textMedium, lineHeight: 1.8, paddingLeft: 20 }}>
                    <li>Frame 4 enthält eine Umfrage — verwende den Instagram Poll-Sticker</li>
                    <li>Frame 6 — verwende DM-Sticker oder Link-Sticker für den CTA</li>
                    <li>Frame 7 — Share-Trigger animiert zum Teilen der Story</li>
                    <li>Format: 1080 × 1920px (9:16)</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'caption' && (
              <div style={{ maxWidth: 700 }}>
                <div style={{
                  padding: 24,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{
                      fontFamily: ERGO.fontHeadline,
                      fontSize: 18,
                      fontWeight: 700,
                      color: ERGO.textDark,
                    }}>
                      Instagram Caption
                    </h3>
                    <button
                      onClick={() => copyToClipboard(selectedTopic.caption)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: ERGO.accentBg,
                        color: ERGO.primary,
                        border: `1.5px solid ${ERGO.primary}`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Kopieren
                    </button>
                  </div>
                  <div style={{
                    whiteSpace: 'pre-line',
                    fontSize: 15,
                    color: ERGO.textDark,
                    lineHeight: 1.7,
                    padding: 20,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    border: '1px solid #e8e8e8',
                    fontFamily: 'system-ui, sans-serif',
                  }}>
                    {selectedTopic.caption}
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: ERGO.textDark, marginBottom: 8 }}>
                      Hashtags ({selectedTopic.hashtags.length}/5)
                    </h4>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {selectedTopic.hashtags.map((tag, i) => (
                        <span key={i} style={{
                          padding: '4px 12px',
                          backgroundColor: ERGO.accentBg,
                          borderRadius: 16,
                          fontSize: 13,
                          fontWeight: 600,
                          color: ERGO.primary,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Caption rules reminder */}
                <div style={{
                  marginTop: 16,
                  padding: 16,
                  backgroundColor: ERGO.accentBg,
                  borderRadius: 12,
                  fontSize: 13,
                  color: ERGO.textMedium,
                  lineHeight: 1.6,
                }}>
                  <strong style={{ color: ERGO.textDark }}>Caption-Regeln 2026:</strong><br />
                  Max. 5 Hashtags &middot; Erste Zeile = Hook &middot; Absätze nutzen &middot; Max. 3 Emojis &middot; Frage am Ende
                </div>
              </div>
            )}

            {activeTab === 'script' && (
              <div style={{ maxWidth: 700 }}>
                <div style={{
                  padding: 24,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{
                      fontFamily: ERGO.fontHeadline,
                      fontSize: 18,
                      fontWeight: 700,
                      color: ERGO.textDark,
                    }}>
                      HeyGen-Script (Podcast-Ton)
                    </h3>
                    <button
                      onClick={() => copyToClipboard(selectedTopic.heygenScript)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: ERGO.accentBg,
                        color: ERGO.primary,
                        border: `1.5px solid ${ERGO.primary}`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Kopieren
                    </button>
                  </div>
                  <div style={{
                    whiteSpace: 'pre-line',
                    fontSize: 15,
                    color: ERGO.textDark,
                    lineHeight: 1.8,
                    padding: 20,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    border: '1px solid #e8e8e8',
                  }}>
                    {selectedTopic.heygenScript}
                  </div>
                </div>

                {/* Reel structure */}
                <div style={{
                  marginTop: 16,
                  padding: 20,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: ERGO.textDark, marginBottom: 12 }}>
                    Reel-Struktur (60–75 Sekunden)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { time: '0–3s', label: 'HOOK — Schockaussage', tip: 'Text-Overlay groß' },
                      { time: '3–15s', label: 'Setup — Wer, Was, Wo', tip: 'Natürlich reden' },
                      { time: '15–45s', label: 'Story — Das ist passiert', tip: 'Emotionales Erzählen' },
                      { time: '45–60s', label: 'Twist — Moment der Wahrheit', tip: 'Pause, langsamer' },
                      { time: '60–75s', label: 'Appell — Was du tun solltest', tip: 'Direkte Ansprache, CTA' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        gap: 12,
                        padding: '8px 12px',
                        backgroundColor: i % 2 === 0 ? '#f8f9fa' : 'transparent',
                        borderRadius: 6,
                      }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: ERGO.primary,
                          minWidth: 60,
                        }}>
                          {item.time}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: ERGO.textDark, flex: 1 }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: 12, color: ERGO.textMedium }}>
                          {item.tip}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* CTA Info */}
                <div style={{
                  padding: 24,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                }}>
                  <h3 style={{
                    fontFamily: ERGO.fontHeadline,
                    fontSize: 18,
                    fontWeight: 700,
                    color: ERGO.textDark,
                    marginBottom: 16,
                  }}>
                    CTA & Autoresponder
                  </h3>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{
                      flex: 1,
                      minWidth: 200,
                      padding: 16,
                      backgroundColor: ERGO.accentBg,
                      borderRadius: 10,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: ERGO.textMedium, marginBottom: 4 }}>
                        DM-Keyword
                      </div>
                      <div style={{
                        fontFamily: ERGO.fontHeadline,
                        fontSize: 28,
                        fontWeight: 800,
                        color: ERGO.primary,
                      }}>
                        {selectedTopic.ctaKeyword}
                      </div>
                    </div>
                    <div style={{
                      flex: 2,
                      minWidth: 200,
                      padding: 16,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 10,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: ERGO.textMedium, marginBottom: 4 }}>
                        Autoresponder-Text
                      </div>
                      <div style={{ fontSize: 15, color: ERGO.textDark, lineHeight: 1.5 }}>
                        {selectedTopic.ctaAutoresponder}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Posting recommendation */}
                <div style={{
                  padding: 24,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                }}>
                  <h3 style={{
                    fontFamily: ERGO.fontHeadline,
                    fontSize: 18,
                    fontWeight: 700,
                    color: ERGO.textDark,
                    marginBottom: 16,
                  }}>
                    Posting-Empfehlung
                  </h3>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{
                      flex: 1,
                      padding: 16,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 10,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: ERGO.textMedium, marginBottom: 4 }}>Tag</div>
                      <div style={{
                        fontFamily: ERGO.fontHeadline,
                        fontSize: 20,
                        fontWeight: 700,
                        color: ERGO.textDark,
                      }}>
                        {selectedTopic.postingDay}
                      </div>
                    </div>
                    <div style={{
                      flex: 1,
                      padding: 16,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 10,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: ERGO.textMedium, marginBottom: 4 }}>Uhrzeit</div>
                      <div style={{
                        fontFamily: ERGO.fontHeadline,
                        fontSize: 20,
                        fontWeight: 700,
                        color: ERGO.textDark,
                      }}>
                        {selectedTopic.postingTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance checklist */}
                <div style={{
                  padding: 24,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #e8e8e8',
                }}>
                  <h3 style={{
                    fontFamily: ERGO.fontHeadline,
                    fontSize: 18,
                    fontWeight: 700,
                    color: ERGO.textDark,
                    marginBottom: 16,
                  }}>
                    Performance-Checkliste
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Speicherbar', desc: 'Enthält Wissen, das man später braucht' },
                      { label: 'Teilbar', desc: '„Schick das deinen Eltern"' },
                      { label: 'Kommentierbar', desc: 'Enthält Frage oder kontroverse These' },
                      { label: 'Emotional', desc: 'Erzeugt Angst, Erleichterung oder Aha-Moment' },
                      { label: 'Nützlich', desc: 'Konkreter Tipp oder Handlungsanweisung' },
                    ].map((item, i) => (
                      <label key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}>
                        <input type="checkbox" style={{ width: 18, height: 18, accentColor: ERGO.primary }} />
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: ERGO.textDark }}>
                            {item.label}
                          </span>
                          <span style={{ fontSize: 13, color: ERGO.textMedium, marginLeft: 8 }}>
                            — {item.desc}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 12,
                    fontSize: 13,
                    color: ERGO.textMedium,
                    fontStyle: 'italic',
                  }}>
                    Jeder Post muss mindestens 3 von 5 erfüllen.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
