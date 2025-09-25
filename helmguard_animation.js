document.addEventListener('DOMContentLoaded', () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
          console.error('GSAP or ScrollTrigger not loaded');
          return;
        }
        
        gsap.registerPlugin(ScrollTrigger);
        console.log('🚀 Custom horizontal scroll script loaded');
        
        // Target the horizontal scroll section
        const horizontalSection = document.querySelector('.horizontal-scroll-section.is-desktop');
        
        if (!horizontalSection) {
          console.error('❌ Horizontal scroll section not found');
          return;
        }
        
        const scrollableDiv = horizontalSection.querySelector('.the-width-400vh-scrollable-div');
        const contentWrapper = horizontalSection.querySelector('.the-content-wrapper');
        const content = horizontalSection.querySelector('.the-content');
        const cards = horizontalSection.querySelectorAll('.modules-card');
        
        if (!scrollableDiv || !content || !cards.length) {
          console.error('❌ Required elements not found:', {
            scrollableDiv: !!scrollableDiv,
            content: !!content,
            cardsCount: cards.length
          });
          return;
        }
        
        console.log('✅ Found all required elements:', {
          section: horizontalSection,
          scrollableDiv: scrollableDiv,
          cardsCount: cards.length
        });
        
        // Calculate dimensions
        const getSectionDimensions = () => {
          const sectionRect = horizontalSection.getBoundingClientRect();
          const contentRect = content.getBoundingClientRect();
          
          // Calculate total width of all cards plus gaps
          let totalCardsWidth = 0;
          cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            totalCardsWidth += cardRect.width;
            if (index < cards.length - 1) {
              totalCardsWidth += 40; // gap between cards
            }
          });
          
          const viewportWidth = sectionRect.width;
          const lastCardWidth = cards[cards.length - 1].getBoundingClientRect().width;
          
          // Calculate max scroll distance (keep 30% of last card visible)
          const maxScroll = totalCardsWidth - viewportWidth - (lastCardWidth * 0.3);
          
          console.log('📐 Dimensions calculated:', {
            viewportWidth,
            totalCardsWidth,
            lastCardWidth,
            maxScroll
          });
          
          return { viewportWidth, totalCardsWidth, maxScroll };
        };
        
        const { maxScroll } = getSectionDimensions();
        
        // Calculate precise end distance to keep last card 30% visible
        const lastCardVisibility = 0.3; // 30% of last card visible
        const adjustedMaxScroll = maxScroll * (1 - lastCardVisibility);
        
        // Create the timeline for right-to-left scrolling
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${adjustedMaxScroll * 1.5}`, // More precise scroll distance
            scrub: 1.5, // Smoother scrubbing for better control
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              // Right-to-left: start from 0 and go negative
              const translateX = -progress * adjustedMaxScroll;
              
              // Apply transform with precise clamping to keep last card visible
              const clampedX = Math.max(translateX, -adjustedMaxScroll);
              
              gsap.set(scrollableDiv, {
                x: clampedX,
                force3D: true,
                ease: "power2.out" // Smoother easing at the end
              });
              
              // Log progress for debugging
              if (Math.round(progress * 100) % 10 === 0) { // Log every 10%
                const visibilityPercent = Math.round((1 - Math.abs(clampedX) / maxScroll) * 100);
                console.log(`📊 Scroll Progress: ${Math.round(progress * 100)}% | TranslateX: ${Math.round(clampedX)}px | Last Card Visible: ${visibilityPercent}%`);
              }
            },
            onStart: () => {
              console.log('🎬 Horizontal scroll animation started');
            },
            onComplete: () => {
              console.log('🏁 Horizontal scroll animation completed - Last card should be 30% visible');
              
              // Ensure final position is set correctly
              gsap.set(scrollableDiv, {
                x: -adjustedMaxScroll,
                force3D: true
              });
              
              // Add a small delay before unpinning to prevent abrupt jump
              gsap.delayedCall(0.3, () => {
                console.log('✅ Final position locked, ready for next section');
              });
            }
          }
        });
        
        // Add timeline content (dummy animation for proper ScrollTrigger behavior)
        tl.to({}, { duration: 1 });
        
        // Add visual debugging for testing
        const addDebugStyles = () => {
          const debugStyle = document.createElement('style');
          debugStyle.id = 'horizontal-scroll-debug';
          debugStyle.innerHTML = `
            /* Debug styles for horizontal scroll testing */
            .modules-card {
              border: 2px solid rgba(0, 255, 0, 0.3) !important;
              transition: all 0.3s ease !important;
              position: relative !important;
            }
            
            .modules-card:hover {
              border-color: rgba(0, 255, 0, 0.8) !important;
              transform: scale(1.02) !important;
            }
            
            .modules-card:last-child {
              border-color: rgba(255, 0, 0, 0.5) !important;
            }
            
            .modules-card:last-child:hover {
              border-color: rgba(255, 0, 0, 1) !important;
            }
            
            .horizontal-scroll-section.is-desktop::before {
              content: '🎯 Right-to-Left Scroll Active';
              position: fixed;
              top: 10px;
              left: 10px;
              background: linear-gradient(45deg, #4CAF50, #45a049);
              color: white;
              padding: 8px 12px;
              font-size: 14px;
              font-weight: bold;
              z-index: 10000;
              border-radius: 6px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              font-family: Arial, sans-serif;
            }
            
            .the-width-400vh-scrollable-div.is-desktop {
              transition: none !important;
            }
          `;
          document.head.appendChild(debugStyle);
          console.log('🎨 Debug styles applied');
        };
        
        addDebugStyles();
        
        // Handle resize events
        const handleResize = () => {
          console.log('📱 Window resized, refreshing ScrollTrigger');
          ScrollTrigger.refresh();
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup function for debugging
        window.removeHorizontalScrollDebug = () => {
          const debugStyle = document.getElementById('horizontal-scroll-debug');
          if (debugStyle) {
            debugStyle.remove();
            console.log('🧹 Debug styles removed');
          }
        };
        
        console.log('✨ Right-to-left horizontal scroll setup complete!');
        console.log('💡 Use window.removeHorizontalScrollDebug() to remove debug styles');
      });