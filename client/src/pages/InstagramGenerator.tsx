import { useState, useRef, useCallback, useEffect } from 'react';
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

interface AIContent {
  hooks?: Partial<Record<HookType, string>>;
  storySetup?: string;
  problem?: string;
  consequence?: string;
  consequenceNumber?: string;
  consequenceLabel?: string;
  emotionalQuote?: string;
  explanationBullets?: string[];
  solutionSteps?: string[];
  ctaKeyword?: string;
  caption?: string;
  hashtags?: string[];
}

export default function InstagramGenerator() {
  const [selectedTopic, setSelectedTopic] = useState<TopicTemplate | null>(null);
  const [format, setFormat] = useState<FormatKey>('feed');
  const [hookType, setHookType] = useState<HookType>('schock');
  const [activeTab, setActiveTab] = useState<TabKey>('slides');
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [showTopicSwitcher, setShowTopicSwitcher] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const slideRef = useRef<HTMLDivElement>(null);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = windowWidth < 640;

  const effectiveTopic: TopicTemplate | null = aiContent && selectedTopic
    ? {
        ...selectedTopic,
        hooks: { ...selectedTopic.hooks, ...aiContent.hooks } as Record<HookType, string>,
        storySetup: aiContent.storySetup ?? selectedTopic.storySetup,
        problem: aiContent.problem ?? selectedTopic.problem,
        consequence: aiContent.consequence ?? selectedTopic.consequence,
        consequenceNumber: aiContent.consequenceNumber ?? selectedTopic.consequenceNumber,
        consequenceLabel: aiContent.consequenceLabel ?? selectedTopic.consequenceLabel,
        emotionalQuote: aiContent.emotionalQuote ?? selectedTopic.emotionalQuote,
        explanationBullets: aiContent.explanationBullets ?? selectedTopic.explanationBullets,
        solutionSteps: aiContent.solutionSteps ?? selectedTopic.solutionSteps,
        ctaKeyword: aiContent.ctaKeyword ?? selectedTopic.ctaKeyword,
        caption: aiContent.caption ?? selectedTopic.caption,
        hashtags: aiContent.hashtags ?? selectedTopic.hashtags,
      }
    : selectedTopic;

  const handleSelectTopic = useCallback((topic: TopicTemplate) => {
    setSelectedTopic(topic);
    setAiContent(null);
    setGenerateError(null);
    setSlides(generateSlidesFromTopic(topic, hookType));
    setActiveSlideIndex(0);
    setActiveTab('slides');
    setShowTopicSwitcher(false);
  }, [hookType]);

  const handleHookChange = (newHook: HookType) => {
    setHookType(newHook);
    const topic = effectiveTopic;
    if (topic) {
      setSlides(generateSlidesFromTopic(topic, newHook));
      setActiveSlideIndex(0);
    }
  };

  const generateWithAI = async () => {
    if (!selectedTopic || generating) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const response = await fetch('/api/instagram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicName: selectedTopic.name,
          topicIcon: selectedTopic.icon,
          topicId: selectedTopic.id,
        }),
      });
      if (!response.ok) throw new Error('Server-Fehler');
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Generierung fehlgeschlagen');
      const newContent: AIContent = data.content;
      setAiContent(newContent);
      const merged: TopicTemplate = {
        ...selectedTopic,
        hooks: { ...selectedTopic.hooks, ...newContent.hooks } as Record<HookType, string>,
        storySetup: newContent.storySetup ?? selectedTopic.storySetup,
        problem: newContent.problem ?? selectedTopic.problem,
        consequence: newContent.consequence ?? selectedTopic.consequence,
        consequenceNumber: newContent.consequenceNumber ?? selectedTopic.consequenceNumber,
        consequenceLabel: newContent.consequenceLabel ?? selectedTopic.consequenceLabel,
        emotionalQuote: newContent.emotionalQuote ?? selectedTopic.emotionalQuote,
        explanationBullets: newContent.explanationBullets ?? selectedTopic.explanationBullets,
        solutionSteps: newContent.solutionSteps ?? selectedTopic.solutionSteps,
        ctaKeyword: newContent.ctaKeyword ?? selectedTopic.ctaKeyword,
        caption: newContent.caption ?? selectedTopic.caption,
        hashtags: newContent.hashtags ?? selectedTopic.hashtags,
      };
      setSlides(generateSlidesFromTopic(merged, hookType));
      setActiveSlideIndex(0);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setGenerating(false);
    }
  };

  // Module-level font CSS cache so we only fetch once per session
  const fontCSS = useRef<string | null>(null);
  const loadFontCSS = useCallback(async (): Promise<string> => {
    if (fontCSS.current) return fontCSS.current;
    try {
      const resp = await fetch('/api/instagram/font-embed');
      if (resp.ok) fontCSS.current = await resp.text();
    } catch (_) { /* font embed optional */ }
    return fontCSS.current ?? '';
  }, []);

  const downloadPng = useCallback(async (el: HTMLElement, filename: string, embeddedFontCSS: string) => {
    let styleEl: HTMLStyleElement | null = null;
    // All cross-origin <link> stylesheets that we temporarily remove to avoid
    // html-to-image's SecurityError when it tries to read their cssRules
    const removedLinks: { el: HTMLLinkElement; next: ChildNode | null }[] = [];
    try {
      // 1. Inject base64 font CSS so fonts remain available after we remove the remote links
      if (embeddedFontCSS) {
        styleEl = document.createElement('style');
        styleEl.setAttribute('data-font-embed', '1');
        styleEl.textContent = embeddedFontCSS;
        document.head.appendChild(styleEl);
      }

      // 2. Remove ALL external font/CSS links that would trigger CORS errors
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach(link => {
        try {
          // accessing href can be same-origin, so test cssRules instead
          const sheet = Array.from(document.styleSheets).find(s => s.href === link.href);
          if (sheet) { sheet.cssRules; } // throws if cross-origin
        } catch {
          removedLinks.push({ el: link, next: link.nextSibling });
          document.head.removeChild(link);
        }
      });

      await document.fonts.ready;
      const dataUrl = await toPng(el, { quality: 1, pixelRatio: 1, cacheBust: true });

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      // Restore removed stylesheets in original order
      removedLinks.forEach(({ el, next }) => {
        if (next && document.head.contains(next as ChildNode)) {
          document.head.insertBefore(el, next);
        } else {
          document.head.appendChild(el);
        }
      });
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    }
  }, []);

  const handleDownloadSlide = useCallback(async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const css = await loadFontCSS();
      await downloadPng(ref.current, filename, css);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [loadFontCSS, downloadPng]);

  const handleDownloadAllSlides = useCallback(async () => {
    if (!selectedTopic) return;
    setDownloading(true);
    const css = await loadFontCSS();
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);
    try {
      for (let i = 0; i < slides.length; i++) {
        const wrapper = document.createElement('div');
        container.appendChild(wrapper);
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(wrapper);
        await new Promise<void>((resolve) => {
          root.render(
            <SlideRenderer
              ref={(el) => {
                if (el) {
                  requestAnimationFrame(async () => {
                    try {
                      await downloadPng(el, `${selectedTopic.id}_slide_${i + 1}.png`, css);
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
        await new Promise(r => setTimeout(r, 300));
      }
    } finally {
      document.body.removeChild(container);
      setDownloading(false);
    }
  }, [selectedTopic, slides, format, loadFontCSS, downloadPng]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const previewScale = isMobile
    ? (format === 'feed' ? 0.16 : 0.12)
    : (format === 'feed' ? 0.25 : 0.2);
  const previewWidth = FORMATS[format].width * previewScale;
  const previewHeight = FORMATS[format].height * previewScale;

  const captionText = effectiveTopic?.caption ?? selectedTopic?.caption ?? '';
  const hashtags = effectiveTopic?.hashtags ?? selectedTopic?.hashtags ?? [];

  return (
    <div style={{ minHeight: '50vh', backgroundColor: '#f8f9fa', fontFamily: "'Inter', sans-serif", borderRadius: 8, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${ERGO.primary}, ${ERGO.gradientTo})`,
        padding: isMobile ? '16px' : '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, flexWrap: 'wrap' }}>
          <a
            href="/admin"
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 8,
              border: '1.5px solid rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            ← Admin
          </a>
          <span style={{ fontFamily: ERGO.fontHeadline, fontSize: isMobile ? 18 : 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: ERGO.logoSpacing }}>
            ERGO
          </span>
          <span style={{ fontSize: isMobile ? 14 : 18, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            Instagram Generator
          </span>
        </div>
        {!isMobile && (
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            {ERGO.agency} &middot; {ERGO.region}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '16px 12px 60px' : '24px 24px 80px' }}>
        {/* Topic Selection */}
        {!selectedTopic ? (
          <div>
            <h2 style={{ fontFamily: ERGO.fontHeadline, fontSize: isMobile ? 22 : 28, fontWeight: 800, color: ERGO.textDark, marginBottom: 8 }}>
              Thema auswählen
            </h2>
            <p style={{ fontSize: 15, color: ERGO.textMedium, marginBottom: 20 }}>
              Wähle ein Thema und erhalte sofort ein komplettes Content-Paket für Instagram.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 12,
            }}>
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  style={{
                    padding: isMobile ? '16px' : '24px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #e8e8e8',
                    borderRadius: 14,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    gap: isMobile ? 14 : 0,
                    flexDirection: isMobile ? 'row' : 'column',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ERGO.primary; e.currentTarget.style.boxShadow = '0 4px 16px rgba(238,1,56,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: isMobile ? 28 : 32, marginBottom: isMobile ? 0 : 10, flexShrink: 0 }}>{topic.icon}</div>
                  <div>
                    <div style={{ fontFamily: ERGO.fontHeadline, fontSize: 16, fontWeight: 700, color: ERGO.textDark, marginBottom: 4 }}>
                      {topic.name}
                    </div>
                    {!isMobile && (
                      <div style={{ fontSize: 13, color: ERGO.textMedium, lineHeight: 1.5 }}>
                        {topic.hooks.schock.replace('\n', ' ')}
                      </div>
                    )}
                    {topic.seasonal && (
                      <div style={{ marginTop: isMobile ? 0 : 10, padding: '3px 10px', backgroundColor: ERGO.accentBg, borderRadius: 20, fontSize: 11, fontWeight: 600, color: ERGO.primary, display: 'inline-block' }}>
                        {topic.seasonal}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Controls bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: showTopicSwitcher ? 10 : 20, flexWrap: 'wrap' }}>
              <button
                onClick={() => { setSelectedTopic(null); setSlides([]); setAiContent(null); setShowTopicSwitcher(false); }}
                style={{ padding: '9px 16px', backgroundColor: '#FFFFFF', border: '2px solid #e0e0e0', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: ERGO.textDark, whiteSpace: 'nowrap' }}
              >
                ← Themen
              </button>

              <div style={{ fontFamily: ERGO.fontHeadline, fontSize: isMobile ? 16 : 20, fontWeight: 800, color: ERGO.textDark, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedTopic.icon} {selectedTopic.name}
              </div>

              {aiContent && (
                <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  ✨ KI-Version
                </div>
              )}

              <button
                onClick={() => setShowTopicSwitcher(prev => !prev)}
                style={{ padding: '9px 14px', backgroundColor: showTopicSwitcher ? ERGO.primary : '#FFFFFF', color: showTopicSwitcher ? '#FFFFFF' : ERGO.textDark, border: `2px solid ${showTopicSwitcher ? ERGO.primary : '#e0e0e0'}`, borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                🔄 {isMobile ? 'Wechseln' : 'Thema wechseln'}
              </button>

              <div style={{ display: 'flex', gap: 6 }}>
                {(Object.keys(FORMATS) as FormatKey[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    style={{ padding: '8px 12px', backgroundColor: format === f ? ERGO.primary : '#FFFFFF', color: format === f ? '#FFFFFF' : ERGO.textDark, border: `2px solid ${format === f ? ERGO.primary : '#e0e0e0'}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
                  >
                    {FORMATS[f].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inline topic switcher panel */}
            {showTopicSwitcher && (
              <div style={{ backgroundColor: '#f8f8f8', border: '2px solid #e8e8e8', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: ERGO.textMedium, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Anderes Thema:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      style={{ padding: '7px 14px', backgroundColor: selectedTopic?.id === topic.id ? ERGO.primary : '#FFFFFF', color: selectedTopic?.id === topic.id ? '#FFFFFF' : ERGO.textDark, border: `2px solid ${selectedTopic?.id === topic.id ? ERGO.primary : '#e0e0e0'}`, borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hook selector + AI generate button */}
            <div style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: ERGO.textMedium, whiteSpace: 'nowrap' }}>Hook:</span>
              {(Object.keys(HOOK_LABELS) as HookType[]).map((h) => (
                <button
                  key={h}
                  onClick={() => handleHookChange(h)}
                  style={{ padding: '6px 12px', backgroundColor: hookType === h ? ERGO.accentBg : '#FFFFFF', color: hookType === h ? ERGO.primary : ERGO.textMedium, border: `1.5px solid ${hookType === h ? ERGO.primary : '#e0e0e0'}`, borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  {HOOK_LABELS[h]}
                </button>
              ))}

              <div style={{ flex: 1 }} />

              {/* AI Generate button */}
              <button
                onClick={generateWithAI}
                disabled={generating}
                style={{
                  padding: '9px 18px',
                  background: generating ? '#e0e0e0' : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 10,
                  cursor: generating ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  whiteSpace: 'nowrap',
                  boxShadow: generating ? 'none' : '0 2px 8px rgba(124,58,237,0.3)',
                }}
              >
                {generating ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                    {isMobile ? 'KI...' : 'KI generiert...'}
                  </>
                ) : (
                  <>
                    ✨ {isMobile ? 'Neu generieren' : `Neues ${selectedTopic.name} generieren`}
                  </>
                )}
              </button>
            </div>

            {/* Error message */}
            {generateError && (
              <div style={{ padding: '10px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
                ⚠️ {generateError}
              </div>
            )}

            {/* AI content info banner */}
            {aiContent && (
              <div style={{ padding: '10px 16px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, fontSize: 13, color: '#15803d', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <span>✨ <strong>KI hat eine neue Story für {selectedTopic.name} generiert.</strong> Alle Slides wurden aktualisiert.</span>
                <button
                  onClick={() => { setAiContent(null); setSlides(generateSlidesFromTopic(selectedTopic, hookType)); }}
                  style={{ fontSize: 12, color: '#16a34a', background: 'none', border: '1px solid #86efac', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  ↩ Original
                </button>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e8e8e8', marginBottom: 20, overflowX: 'auto' }}>
              {([
                { key: 'slides' as TabKey, label: isMobile ? 'Slides' : 'Carousel Slides' },
                { key: 'stories' as TabKey, label: isMobile ? 'Stories' : 'Story-Serie' },
                { key: 'caption' as TabKey, label: 'Caption' },
                { key: 'script' as TabKey, label: isMobile ? 'Script' : 'HeyGen Script' },
                { key: 'info' as TabKey, label: 'Info' },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{ padding: isMobile ? '10px 14px' : '12px 22px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === key ? `3px solid ${ERGO.primary}` : '3px solid transparent', cursor: 'pointer', fontSize: isMobile ? 13 : 14, fontWeight: activeTab === key ? 700 : 500, color: activeTab === key ? ERGO.primary : ERGO.textMedium, marginBottom: -2, whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* SLIDES TAB */}
            {activeTab === 'slides' && (
              <div>
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 14, marginBottom: 20 }}>
                  {slides.map((slide, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlideIndex(i)}
                      style={{ width: previewWidth, height: previewHeight, overflow: 'hidden', borderRadius: 8, border: `3px solid ${activeSlideIndex === i ? ERGO.primary : '#e0e0e0'}`, cursor: 'pointer', flexShrink: 0, position: 'relative', backgroundColor: '#FFFFFF' }}
                    >
                      <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                        <SlideRenderer slide={slide} format={format} slideIndex={i} totalSlides={slides.length} />
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3px 4px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: 9, fontWeight: 600, textAlign: 'center' }}>
                        {slide.label.split(' — ')[1] || slide.label}
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: isMobile ? 12 : 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ width: previewWidth * 2, height: previewHeight * 2, overflow: 'hidden', borderRadius: 12, border: '2px solid #e0e0e0', backgroundColor: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                      <div style={{ transform: `scale(${previewScale * 2})`, transformOrigin: 'top left' }}>
                        <SlideRenderer slide={slides[activeSlideIndex]} format={format} slideIndex={activeSlideIndex} totalSlides={slides.length} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button disabled={activeSlideIndex === 0} onClick={() => setActiveSlideIndex(i => i - 1)} style={{ padding: '8px 14px', backgroundColor: '#FFFFFF', border: '2px solid #e0e0e0', borderRadius: 8, cursor: activeSlideIndex === 0 ? 'not-allowed' : 'pointer', opacity: activeSlideIndex === 0 ? 0.4 : 1, fontSize: 13, fontWeight: 600 }}>← Zurück</button>
                      <button disabled={activeSlideIndex === slides.length - 1} onClick={() => setActiveSlideIndex(i => i + 1)} style={{ padding: '8px 14px', backgroundColor: '#FFFFFF', border: '2px solid #e0e0e0', borderRadius: 8, cursor: activeSlideIndex === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: activeSlideIndex === slides.length - 1 ? 0.4 : 1, fontSize: 13, fontWeight: 600 }}>Weiter →</button>
                      <span style={{ fontSize: 13, color: ERGO.textMedium, alignSelf: 'center' }}>{activeSlideIndex + 1}/{slides.length}</span>
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: isMobile ? '100%' : 240 }}>
                    <div style={{ padding: isMobile ? 16 : 20, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                      <h3 style={{ fontFamily: ERGO.fontHeadline, fontSize: 16, fontWeight: 700, color: ERGO.textDark, marginBottom: 6 }}>
                        {slides[activeSlideIndex]?.label}
                      </h3>
                      <p style={{ fontSize: 13, color: ERGO.textMedium, marginBottom: 14 }}>
                        {FORMATS[format].width} × {FORMATS[format].height}px
                      </p>
                      <button
                        onClick={() => handleDownloadSlide(slideRef, `${selectedTopic.id}_slide_${activeSlideIndex + 1}.png`)}
                        disabled={downloading}
                        style={{ width: '100%', padding: '11px 20px', backgroundColor: ERGO.primary, color: '#FFFFFF', border: 'none', borderRadius: 10, cursor: downloading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, marginBottom: 8, opacity: downloading ? 0.7 : 1 }}
                      >
                        {downloading ? 'Wird erstellt...' : '⬇ Diese Slide als PNG'}
                      </button>
                      <button
                        onClick={handleDownloadAllSlides}
                        disabled={downloading}
                        style={{ width: '100%', padding: '11px 20px', backgroundColor: '#FFFFFF', color: ERGO.primary, border: `2px solid ${ERGO.primary}`, borderRadius: 10, cursor: downloading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, opacity: downloading ? 0.7 : 1 }}
                      >
                        {downloading ? 'Wird erstellt...' : '⬇ Alle Slides (PNG)'}
                      </button>
                    </div>

                    <div style={{ marginTop: 14, padding: 14, backgroundColor: ERGO.accentBg, borderRadius: 10, fontSize: 13, color: ERGO.textMedium, lineHeight: 1.6 }}>
                      <strong>Tipp:</strong> Hook-Typ wechseln für verschiedene Stile &middot; <strong>✨ Neu generieren</strong> für eine KI-frische Story zum gleichen Thema
                    </div>
                  </div>
                </div>

                <div style={{ position: 'fixed', left: -9999, top: 0 }}>
                  <SlideRenderer ref={slideRef} slide={slides[activeSlideIndex]} format={format} slideIndex={activeSlideIndex} totalSlides={slides.length} />
                </div>
              </div>
            )}

            {/* STORIES TAB */}
            {activeTab === 'stories' && selectedTopic.storyFrames && (
              <div>
                <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 14 }}>
                  {selectedTopic.storyFrames.map((frame, i) => (
                    <div key={i} style={{ flexShrink: 0 }}>
                      <div style={{ width: isMobile ? 160 : 216, height: isMobile ? 284 : 384, overflow: 'hidden', borderRadius: 12, border: '2px solid #e0e0e0', backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'relative' }}>
                        <div style={{ transform: isMobile ? 'scale(0.148)' : 'scale(0.2)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                          <StoryFrameRenderer frame={frame} frameIndex={i} totalFrames={selectedTopic.storyFrames!.length} />
                        </div>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: ERGO.textDark, textAlign: 'center' }}>Frame {i + 1}: {frame.label}</div>
                      <button
                        onClick={() => {
                          const ref = { current: storyRefs.current[i] };
                          handleDownloadSlide(ref, `${selectedTopic.id}_story_${i + 1}.png`);
                        }}
                        disabled={downloading}
                        style={{ marginTop: 6, width: '100%', padding: '5px 10px', backgroundColor: ERGO.primary, color: '#FFFFFF', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                      >
                        PNG
                      </button>
                      <div style={{ position: 'fixed', left: -9999, top: 0 }}>
                        <StoryFrameRenderer ref={el => { storyRefs.current[i] = el; }} frame={frame} frameIndex={i} totalFrames={selectedTopic.storyFrames!.length} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: 18, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                  <h3 style={{ fontFamily: ERGO.fontHeadline, fontSize: 15, fontWeight: 700, color: ERGO.textDark, marginBottom: 10 }}>Story-Serie Hinweise</h3>
                  <ul style={{ fontSize: 13, color: ERGO.textMedium, lineHeight: 1.8, paddingLeft: 18 }}>
                    <li>Frame 4 enthält eine Umfrage — verwende den Instagram Poll-Sticker</li>
                    <li>Frame 6 — verwende DM-Sticker oder Link-Sticker für den CTA</li>
                    <li>Frame 7 — Share-Trigger animiert zum Teilen der Story</li>
                    <li>Format: 1080 × 1920px (9:16)</li>
                  </ul>
                </div>
              </div>
            )}

            {/* CAPTION TAB */}
            {activeTab === 'caption' && (
              <div style={{ maxWidth: 700 }}>
                <div style={{ padding: isMobile ? 16 : 24, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
                    <h3 style={{ fontFamily: ERGO.fontHeadline, fontSize: 17, fontWeight: 700, color: ERGO.textDark }}>
                      Instagram Caption {aiContent && <span style={{ fontSize: 12, color: '#16a34a' }}>✨ KI</span>}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(captionText)}
                      style={{ padding: '7px 14px', backgroundColor: ERGO.accentBg, color: ERGO.primary, border: `1.5px solid ${ERGO.primary}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      Kopieren
                    </button>
                  </div>
                  <div style={{ whiteSpace: 'pre-line', fontSize: 14, color: ERGO.textDark, lineHeight: 1.7, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #e8e8e8' }}>
                    {captionText}
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: ERGO.textDark, marginBottom: 8 }}>Hashtags ({hashtags.length}/5)</h4>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {hashtags.map((tag, i) => (
                        <span key={i} style={{ padding: '4px 12px', backgroundColor: ERGO.accentBg, borderRadius: 16, fontSize: 13, fontWeight: 600, color: ERGO.primary }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 14, padding: 14, backgroundColor: ERGO.accentBg, borderRadius: 10, fontSize: 12, color: ERGO.textMedium, lineHeight: 1.6 }}>
                  <strong style={{ color: ERGO.textDark }}>Caption-Regeln 2026:</strong> Max. 5 Hashtags &middot; Erste Zeile = Hook &middot; Absätze nutzen &middot; Max. 3 Emojis &middot; Frage am Ende
                </div>
              </div>
            )}

            {/* SCRIPT TAB */}
            {activeTab === 'script' && (
              <div style={{ maxWidth: 700 }}>
                <div style={{ padding: isMobile ? 16 : 24, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
                    <h3 style={{ fontFamily: ERGO.fontHeadline, fontSize: 17, fontWeight: 700, color: ERGO.textDark }}>HeyGen-Script</h3>
                    <button onClick={() => copyToClipboard(selectedTopic.heygenScript)} style={{ padding: '7px 14px', backgroundColor: ERGO.accentBg, color: ERGO.primary, border: `1.5px solid ${ERGO.primary}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Kopieren</button>
                  </div>
                  <div style={{ whiteSpace: 'pre-line', fontSize: 14, color: ERGO.textDark, lineHeight: 1.8, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #e8e8e8' }}>
                    {selectedTopic.heygenScript}
                  </div>
                </div>
                <div style={{ marginTop: 14, padding: 18, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: ERGO.textDark, marginBottom: 10 }}>Reel-Struktur (60–75 Sekunden)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { time: '0–3s', label: 'HOOK — Schockaussage', tip: 'Text-Overlay groß' },
                      { time: '3–15s', label: 'Setup — Wer, Was, Wo', tip: 'Natürlich reden' },
                      { time: '15–45s', label: 'Story — Das ist passiert', tip: 'Emotionales Erzählen' },
                      { time: '45–60s', label: 'Twist — Moment der Wahrheit', tip: 'Pause, langsamer' },
                      { time: '60–75s', label: 'Appell — Was du tun solltest', tip: 'Direkte Ansprache, CTA' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 10px', backgroundColor: i % 2 === 0 ? '#f8f9fa' : 'transparent', borderRadius: 6, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: ERGO.primary, minWidth: 50 }}>{item.time}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: ERGO.textDark, flex: 1 }}>{item.label}</span>
                        <span style={{ fontSize: 11, color: ERGO.textMedium }}>{item.tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ padding: isMobile ? 16 : 24, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                  <h3 style={{ fontFamily: ERGO.fontHeadline, fontSize: 17, fontWeight: 700, color: ERGO.textDark, marginBottom: 14 }}>CTA & Autoresponder</h3>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 140, padding: 14, backgroundColor: ERGO.accentBg, borderRadius: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: ERGO.textMedium, marginBottom: 4 }}>DM-Keyword</div>
                      <div style={{ fontFamily: ERGO.fontHeadline, fontSize: 26, fontWeight: 800, color: ERGO.primary }}>{effectiveTopic?.ctaKeyword}</div>
                    </div>
                    <div style={{ flex: 2, minWidth: 180, padding: 14, backgroundColor: '#f8f9fa', borderRadius: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: ERGO.textMedium, marginBottom: 4 }}>Autoresponder-Text</div>
                      <div style={{ fontSize: 14, color: ERGO.textDark, lineHeight: 1.5 }}>{selectedTopic.ctaAutoresponder}</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: isMobile ? 16 : 24, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                  <h3 style={{ fontFamily: ERGO.fontHeadline, fontSize: 17, fontWeight: 700, color: ERGO.textDark, marginBottom: 14 }}>Posting-Empfehlung</h3>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Tag', value: selectedTopic.postingDay },
                      { label: 'Uhrzeit', value: selectedTopic.postingTime },
                    ].map((item, i) => (
                      <div key={i} style={{ flex: 1, minWidth: 120, padding: 14, backgroundColor: '#f8f9fa', borderRadius: 10, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: ERGO.textMedium, marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontFamily: ERGO.fontHeadline, fontSize: 18, fontWeight: 700, color: ERGO.textDark }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: isMobile ? 16 : 24, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #e8e8e8' }}>
                  <h3 style={{ fontFamily: ERGO.fontHeadline, fontSize: 17, fontWeight: 700, color: ERGO.textDark, marginBottom: 14 }}>Performance-Checkliste</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Speicherbar', desc: 'Enthält Wissen, das man später braucht' },
                      { label: 'Teilbar', desc: '„Schick das deinen Eltern"' },
                      { label: 'Kommentierbar', desc: 'Enthält Frage oder kontroverse These' },
                      { label: 'Emotional', desc: 'Erzeugt Angst, Erleichterung oder Aha-Moment' },
                      { label: 'Nützlich', desc: 'Konkreter Tipp oder Handlungsanweisung' },
                    ].map((item, i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px', backgroundColor: '#f8f9fa', borderRadius: 8, cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: 16, height: 16, accentColor: ERGO.primary, marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: ERGO.textDark }}>{item.label}</span>
                          <span style={{ fontSize: 12, color: ERGO.textMedium, marginLeft: 6 }}>— {item.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: ERGO.textMedium, fontStyle: 'italic' }}>Jeder Post muss mindestens 3 von 5 erfüllen.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
