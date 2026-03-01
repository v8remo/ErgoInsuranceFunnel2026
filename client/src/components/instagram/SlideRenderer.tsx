import { forwardRef } from 'react';
import { ERGO, type SlideData, type StoryFrame, type FormatKey, FORMATS } from '@/lib/instagram-config';

interface SlideRendererProps {
  slide: SlideData;
  format: FormatKey;
  slideIndex: number;
  totalSlides: number;
}

const baseStyles = (format: FormatKey): React.CSSProperties => ({
  width: FORMATS[format].width,
  height: FORMATS[format].height,
  backgroundColor: ERGO.background,
  fontFamily: ERGO.fontBody,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
});

function TopAccent() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 6,
      background: `linear-gradient(90deg, ${ERGO.primary}, ${ERGO.gradientTo})`,
    }} />
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 40,
      left: 80,
      right: 80,
      display: 'flex',
      gap: 8,
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: i === current ? ERGO.primary : '#e0e0e0',
            transition: 'background-color 0.3s',
          }}
        />
      ))}
    </div>
  );
}

function LogoSmall() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 80,
      right: 60,
      fontFamily: ERGO.fontHeadline,
      fontSize: 28,
      fontWeight: ERGO.logoWeight,
      color: ERGO.primary,
      letterSpacing: ERGO.logoSpacing,
    }}>
      {ERGO.logoText}
    </div>
  );
}

function HookSlide({ slide, format }: { slide: SlideData; format: FormatKey }) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      justifyContent: 'center',
      alignItems: 'center',
      padding: isStory ? '200px 80px' : '120px 80px',
    }}>
      <TopAccent />
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 72 : 80,
        fontWeight: 900,
        color: ERGO.primary,
        textAlign: 'center',
        lineHeight: 1.15,
        whiteSpace: 'pre-line',
        maxWidth: '90%',
      }}>
        {slide.headline}
      </div>
      <ProgressBar current={0} total={10} />
    </div>
  );
}

function ContextSlide({ slide, format, slideIndex, totalSlides }: SlideRendererProps) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      padding: isStory ? '200px 80px 120px' : '120px 80px',
      justifyContent: 'center',
    }}>
      <TopAccent />
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 48 : 52,
        fontWeight: 800,
        color: ERGO.primary,
        marginBottom: 40,
        lineHeight: 1.2,
      }}>
        {slide.headline}
      </div>
      <div style={{
        position: 'relative',
        paddingLeft: 32,
        borderLeft: `5px solid ${ERGO.primary}`,
      }}>
        <div style={{
          fontSize: isStory ? 38 : 42,
          fontWeight: 500,
          color: ERGO.textDark,
          lineHeight: 1.5,
          whiteSpace: 'pre-line',
        }}>
          {slide.subtext}
        </div>
      </div>
      <LogoSmall />
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

function ProblemSlide({ slide, format, slideIndex, totalSlides }: SlideRendererProps) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      padding: isStory ? '200px 80px 120px' : '120px 80px',
      justifyContent: 'center',
    }}>
      <TopAccent />
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: ERGO.accentBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        fontSize: 40,
      }}>
        ⚠️
      </div>
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 44 : 48,
        fontWeight: 800,
        color: ERGO.textDark,
        marginBottom: 32,
        lineHeight: 1.2,
      }}>
        {slide.headline}
      </div>
      <div style={{
        fontSize: isStory ? 36 : 40,
        fontWeight: 500,
        color: ERGO.textMedium,
        lineHeight: 1.5,
        whiteSpace: 'pre-line',
      }}>
        {slide.subtext}
      </div>
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

function ConsequenceSlide({ slide, format, slideIndex, totalSlides }: SlideRendererProps) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      padding: isStory ? '200px 80px 120px' : '120px 80px',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <TopAccent />
      <div style={{
        fontSize: isStory ? 36 : 40,
        fontWeight: 600,
        color: ERGO.textMedium,
        marginBottom: 24,
      }}>
        {slide.headline}
      </div>
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 110 : 120,
        fontWeight: 900,
        color: ERGO.primary,
        lineHeight: 1,
        marginBottom: 20,
      }}>
        {slide.number}
      </div>
      <div style={{
        fontSize: isStory ? 34 : 38,
        fontWeight: 600,
        color: ERGO.textDark,
        lineHeight: 1.4,
      }}>
        {slide.numberLabel}
      </div>
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

function EmotionSlide({ slide, format, slideIndex, totalSlides }: SlideRendererProps) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      padding: isStory ? '200px 80px 120px' : '120px 80px',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <TopAccent />
      <div style={{
        position: 'relative',
        padding: '40px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: ERGO.fontHeadline,
          fontSize: 160,
          color: ERGO.accentBg,
          lineHeight: 1,
          userSelect: 'none',
        }}>
          &ldquo;
        </div>
        <div style={{
          fontFamily: ERGO.fontHeadline,
          fontSize: isStory ? 44 : 48,
          fontWeight: 700,
          fontStyle: 'italic',
          color: ERGO.textDark,
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
          position: 'relative',
          zIndex: 1,
        }}>
          {slide.quote}
        </div>
      </div>
      <div style={{
        width: 60,
        height: 4,
        backgroundColor: ERGO.primary,
        borderRadius: 2,
        marginTop: 40,
      }} />
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

function ExplanationSlide({ slide, format, slideIndex, totalSlides }: SlideRendererProps) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      padding: isStory ? '200px 80px 120px' : '120px 80px',
      justifyContent: 'center',
    }}>
      <TopAccent />
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 44 : 48,
        fontWeight: 800,
        color: ERGO.textDark,
        marginBottom: 48,
        lineHeight: 1.2,
      }}>
        {slide.headline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {slide.bullets?.map((bullet, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: ERGO.primary,
              marginTop: 14,
              flexShrink: 0,
            }} />
            <div style={{
              fontSize: isStory ? 34 : 38,
              fontWeight: 500,
              color: ERGO.textDark,
              lineHeight: 1.5,
            }}>
              {bullet}
            </div>
          </div>
        ))}
      </div>
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

function SolutionSlide({ slide, format, slideIndex, totalSlides }: SlideRendererProps) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      padding: isStory ? '200px 80px 120px' : '120px 80px',
      justifyContent: 'center',
    }}>
      <TopAccent />
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 44 : 48,
        fontWeight: 800,
        color: ERGO.primary,
        marginBottom: 48,
        lineHeight: 1.2,
      }}>
        {slide.headline}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {slide.bullets?.map((bullet, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: ERGO.accentBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontFamily: ERGO.fontHeadline,
              fontSize: 24,
              fontWeight: 800,
              color: ERGO.primary,
            }}>
              {i + 1}
            </div>
            <div style={{
              fontSize: isStory ? 34 : 38,
              fontWeight: 500,
              color: ERGO.textDark,
              lineHeight: 1.5,
              paddingTop: 6,
            }}>
              {bullet}
            </div>
          </div>
        ))}
      </div>
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

function BrandingSlide({ format, slideIndex, totalSlides }: { format: FormatKey; slideIndex: number; totalSlides: number }) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <TopAccent />
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 80 : 96,
        fontWeight: ERGO.logoWeight,
        color: ERGO.primary,
        letterSpacing: ERGO.logoSpacing,
        marginBottom: 32,
      }}>
        {ERGO.logoText}
      </div>
      <div style={{
        width: 80,
        height: 4,
        backgroundColor: ERGO.primary,
        borderRadius: 2,
        marginBottom: 32,
      }} />
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 36 : 40,
        fontWeight: 700,
        color: ERGO.textDark,
        marginBottom: 16,
      }}>
        {ERGO.agency}
      </div>
      <div style={{
        fontSize: isStory ? 28 : 32,
        fontWeight: 500,
        color: ERGO.textMedium,
        marginBottom: 48,
      }}>
        {ERGO.region}
      </div>
      <div style={{
        padding: '16px 40px',
        backgroundColor: ERGO.accentBg,
        borderRadius: 12,
        fontSize: isStory ? 26 : 28,
        fontWeight: 600,
        color: ERGO.textMedium,
      }}>
        Persönlich. Nahbar. Für dich da.
      </div>
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

function CTASlide({ slide, format, slideIndex, totalSlides }: SlideRendererProps) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: isStory ? '200px 80px 120px' : '120px 80px',
    }}>
      <TopAccent />
      <div style={{
        fontSize: isStory ? 36 : 40,
        fontWeight: 600,
        color: ERGO.textMedium,
        marginBottom: 48,
      }}>
        Eine Nachricht. Zehn Minuten.
      </div>
      <div style={{
        padding: '28px 64px',
        backgroundColor: ERGO.primary,
        borderRadius: 16,
        marginBottom: 40,
      }}>
        <div style={{
          fontFamily: ERGO.fontHeadline,
          fontSize: isStory ? 44 : 48,
          fontWeight: 800,
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
        }}>
          {slide.ctaText}
        </div>
      </div>
      <div style={{
        fontSize: isStory ? 32 : 36,
        fontWeight: 500,
        color: ERGO.textMedium,
        lineHeight: 1.5,
      }}>
        {slide.subtext}
      </div>
      <div style={{
        position: 'absolute',
        bottom: 100,
        fontFamily: ERGO.fontHeadline,
        fontSize: 28,
        fontWeight: ERGO.logoWeight,
        color: ERGO.primary,
        letterSpacing: ERGO.logoSpacing,
      }}>
        {ERGO.logoText}
      </div>
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

function SaveSlide({ slide, format, slideIndex, totalSlides }: SlideRendererProps) {
  const isStory = format === 'story';
  return (
    <div style={{
      ...baseStyles(format),
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: ERGO.accentBg,
    }}>
      <div style={{
        fontSize: 64,
        marginBottom: 32,
      }}>
        ↓
      </div>
      <div style={{
        fontFamily: ERGO.fontHeadline,
        fontSize: isStory ? 48 : 56,
        fontWeight: 800,
        color: ERGO.textDark,
        marginBottom: 20,
        lineHeight: 1.2,
      }}>
        {slide.headline}
      </div>
      <div style={{
        fontSize: isStory ? 32 : 36,
        fontWeight: 500,
        color: ERGO.textMedium,
      }}>
        {slide.subtext}
      </div>
      <ProgressBar current={slideIndex} total={totalSlides} />
    </div>
  );
}

export const SlideRenderer = forwardRef<HTMLDivElement, SlideRendererProps>(
  ({ slide, format, slideIndex, totalSlides }, ref) => {
    const renderSlide = () => {
      switch (slide.type) {
        case 'hook':
          return <HookSlide slide={slide} format={format} />;
        case 'context':
          return <ContextSlide slide={slide} format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        case 'problem':
          return <ProblemSlide slide={slide} format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        case 'consequence':
          return <ConsequenceSlide slide={slide} format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        case 'emotion':
          return <EmotionSlide slide={slide} format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        case 'explanation':
          return <ExplanationSlide slide={slide} format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        case 'solution':
          return <SolutionSlide slide={slide} format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        case 'branding':
          return <BrandingSlide format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        case 'cta':
          return <CTASlide slide={slide} format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        case 'save':
          return <SaveSlide slide={slide} format={format} slideIndex={slideIndex} totalSlides={totalSlides} />;
        default:
          return null;
      }
    };

    return (
      <div ref={ref} style={{ width: FORMATS[format].width, height: FORMATS[format].height }}>
        {renderSlide()}
      </div>
    );
  }
);

SlideRenderer.displayName = 'SlideRenderer';

// Story Frame Renderer
interface StoryFrameRendererProps {
  frame: StoryFrame;
  frameIndex: number;
  totalFrames: number;
}

export const StoryFrameRenderer = forwardRef<HTMLDivElement, StoryFrameRendererProps>(
  ({ frame, frameIndex, totalFrames }, ref) => {
    const isRed = frame.bgColor === 'red';
    const bg = isRed
      ? `linear-gradient(${ERGO.gradientAngle}deg, ${ERGO.gradientFrom}, ${ERGO.gradientTo})`
      : ERGO.background;
    const textColor = isRed ? '#FFFFFF' : ERGO.textDark;
    const accentColor = isRed ? '#FFFFFF' : ERGO.primary;

    return (
      <div ref={ref} style={{ width: 1080, height: 1920 }}>
        <div style={{
          width: 1080,
          height: 1920,
          background: bg,
          fontFamily: ERGO.fontBody,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '200px 80px',
          boxSizing: 'border-box',
        }}>
          {/* Story progress dots */}
          <div style={{
            position: 'absolute',
            top: 40,
            left: 40,
            right: 40,
            display: 'flex',
            gap: 6,
          }}>
            {Array.from({ length: totalFrames }, (_, i) => (
              <div key={i} style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i <= frameIndex
                  ? (isRed ? 'rgba(255,255,255,0.9)' : ERGO.primary)
                  : (isRed ? 'rgba(255,255,255,0.3)' : '#e0e0e0'),
              }} />
            ))}
          </div>

          {frame.type === 'hook' && (
            <div style={{
              fontFamily: ERGO.fontHeadline,
              fontSize: 64,
              fontWeight: 900,
              color: textColor,
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
            }}>
              {frame.headline}
            </div>
          )}

          {frame.type === 'fact' && (
            <>
              <div style={{
                fontFamily: ERGO.fontHeadline,
                fontSize: 140,
                fontWeight: 900,
                color: textColor,
                lineHeight: 1,
                marginBottom: 24,
                whiteSpace: 'pre-line',
              }}>
                {frame.headline}
              </div>
              {frame.subtext && (
                <div style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: isRed ? 'rgba(255,255,255,0.85)' : ERGO.textMedium,
                }}>
                  {frame.subtext}
                </div>
              )}
            </>
          )}

          {frame.type === 'explain' && (
            <>
              {!isRed && <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: `linear-gradient(90deg, ${ERGO.primary}, ${ERGO.gradientTo})`,
              }} />}
              <div style={{
                fontFamily: ERGO.fontHeadline,
                fontSize: 48,
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.3,
                marginBottom: 32,
              }}>
                {frame.headline}
              </div>
              {frame.subtext && (
                <div style={{
                  fontSize: 36,
                  fontWeight: 500,
                  color: isRed ? 'rgba(255,255,255,0.85)' : ERGO.textMedium,
                  lineHeight: 1.5,
                }}>
                  {frame.subtext}
                </div>
              )}
            </>
          )}

          {frame.type === 'poll' && (
            <>
              {!isRed && <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: `linear-gradient(90deg, ${ERGO.primary}, ${ERGO.gradientTo})`,
              }} />}
              <div style={{
                fontFamily: ERGO.fontHeadline,
                fontSize: 48,
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.3,
                marginBottom: 60,
              }}>
                {frame.headline}
              </div>
              {frame.pollOptions && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 700 }}>
                  {frame.pollOptions.map((option, i) => (
                    <div key={i} style={{
                      padding: '24px 40px',
                      borderRadius: 16,
                      backgroundColor: isRed ? 'rgba(255,255,255,0.2)' : ERGO.accentBg,
                      border: `3px solid ${isRed ? 'rgba(255,255,255,0.4)' : ERGO.primary}`,
                      fontSize: 36,
                      fontWeight: 700,
                      color: textColor,
                      textAlign: 'center',
                    }}>
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {frame.type === 'tip' && (
            <>
              {!isRed && <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: `linear-gradient(90deg, ${ERGO.primary}, ${ERGO.gradientTo})`,
              }} />}
              <div style={{
                fontFamily: ERGO.fontHeadline,
                fontSize: 44,
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.3,
                marginBottom: 48,
                alignSelf: 'flex-start',
                textAlign: 'left',
              }}>
                {frame.headline}
              </div>
              {frame.bullets && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignSelf: 'flex-start', textAlign: 'left' }}>
                  {frame.bullets.map((bullet, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: isRed ? 'rgba(255,255,255,0.2)' : ERGO.accentBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: 24,
                      }}>
                        ✓
                      </div>
                      <div style={{
                        fontSize: 36,
                        fontWeight: 600,
                        color: textColor,
                      }}>
                        {bullet}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {frame.type === 'cta' && (
            <>
              {!isRed && <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: `linear-gradient(90deg, ${ERGO.primary}, ${ERGO.gradientTo})`,
              }} />}
              <div style={{
                padding: '28px 64px',
                backgroundColor: isRed ? '#FFFFFF' : ERGO.primary,
                borderRadius: 16,
                marginBottom: 32,
              }}>
                <div style={{
                  fontFamily: ERGO.fontHeadline,
                  fontSize: 48,
                  fontWeight: 800,
                  color: isRed ? ERGO.primary : '#FFFFFF',
                }}>
                  {frame.headline}
                </div>
              </div>
              {frame.subtext && (
                <div style={{
                  fontSize: 36,
                  fontWeight: 500,
                  color: isRed ? 'rgba(255,255,255,0.85)' : ERGO.textMedium,
                }}>
                  {frame.subtext}
                </div>
              )}
              <div style={{
                position: 'absolute',
                bottom: 120,
                fontFamily: ERGO.fontHeadline,
                fontSize: 32,
                fontWeight: ERGO.logoWeight,
                color: accentColor,
                letterSpacing: ERGO.logoSpacing,
              }}>
                {ERGO.logoText}
              </div>
            </>
          )}

          {frame.type === 'share' && (
            <div style={{
              fontFamily: ERGO.fontHeadline,
              fontSize: 52,
              fontWeight: 800,
              color: textColor,
              lineHeight: 1.3,
              whiteSpace: 'pre-line',
            }}>
              {frame.headline}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StoryFrameRenderer.displayName = 'StoryFrameRenderer';

export default SlideRenderer;
