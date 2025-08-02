import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import Canvas from "./Canvas";
import data from "./data";
import LocomotiveScroll from "locomotive-scroll";
import gsap from "gsap";

function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [fadeOutCanvas, setFadeOutCanvas] = useState(false);
  const growingSpan = useRef(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [cursorScale, setCursorScale] = useState(1);
  const [cursorImage, setCursorImage] = useState(null);
  const circleImageRef = useRef(null);
  const rotationRef = useRef(0);
  const speedRef = useRef(0.05);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [buttonFadedOut, setButtonFadedOut] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const canvasContainerClass = `absolute inset-0 transition-opacity duration-1000 pointer-events-none
ml-[-20%] lg:ml-0
${showCanvas && !fadeOutCanvas ? "opacity-100" : "opacity-0"}`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageLoaded(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    new LocomotiveScroll();
  }, []);

  useEffect(() => {
    const headingElement = headingRef.current;
    if (!headingElement) return;

    const handleClick = (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      triggerCanvasAnimation(clickX, clickY);

      const span = growingSpan.current;
      gsap.set(span, {
        top: clickY,
        left: clickX,
        transformOrigin: "center center",
      });

      if (!showCanvas) {
        setCursorColor("bg-white");

        gsap.set(span, { scale: 0 });

        gsap.to(span, {
          scale: 1000,
          duration: 2,
          ease: "power2.inOut",
        });

        gsap.to("body", {
          backgroundColor: "#fd2c2a",
          color: "#000",
          duration: 1.2,
          ease: "power2.inOut",
        });

        setFadeOutCanvas(false);
        setShowCanvas(true);
      } else {
        setCursorColor("bg-[#fd2c2a]");

        gsap.set(span, { scale: 1000 });

        gsap.to(span, {
          scale: 0,
          duration: 1.1,
          delay: -0.2,
          ease: "power2.inOut",
        });

        gsap.to("body", {
          backgroundColor: "#000",
          color: "#fff",
          duration: 1.2,
          ease: "power2.inOut",
        });

        setFadeOutCanvas(true);
        setTimeout(() => {
          setShowCanvas(false);
        }, 1000);
      }
    };

    headingElement.addEventListener("click", handleClick);

    return () => headingElement.removeEventListener("click", handleClick);
  }, [showCanvas]);

  const cursorRef = useRef(null);
  const headingRef = useRef(null);

  const [cursorColor, setCursorColor] = useState("bg-red-500");

  useEffect(() => {
    const cursor = cursorRef.current;
    let mouseX = 0,
      mouseY = 0;
    let currentX = 0,
      currentY = 0;

    const animate = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      if (cursor) {
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      requestAnimationFrame(animate);
    };
    animate();

    const moveHandler = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", moveHandler);
    return () => window.removeEventListener("mousemove", moveHandler);
  }, []);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const handleMouseEnter = () => {
      setCursorScale(5);
      setIsTooltipVisible(true);
      setCursorImage("/tooltip.png");
    };

    const handleMouseLeave = () => {
      setCursorScale(1);
      setIsTooltipVisible(false);
      setCursorImage(null);
    };

    heading.addEventListener("mouseenter", handleMouseEnter);
    heading.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heading.removeEventListener("mouseenter", handleMouseEnter);
      heading.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const el = circleImageRef.current;
    if (!el) return;

    const rotate = () => {
      rotationRef.current += speedRef.current;
      gsap.set(el, { rotate: rotationRef.current });
      requestAnimationFrame(rotate);
    };
    rotate();

    let scrollTimeout;

    const handleScroll = () => {
      gsap.killTweensOf(speedRef);
      speedRef.current = 0.4;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        gsap.to(speedRef, {
          current: 0.08,
          duration: 1.2,
          ease: "power2.out",
        });
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCloseMenu = () => {
    setIsClosing(true);

    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 500);
  };

  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    button.style.setProperty("--x", `${x}px`);
    button.style.setProperty("--y", `${y}px`);
  };

  const triggerCanvasAnimation = (clickX, clickY) => {
    const span = growingSpan.current;

    gsap.set(span, {
      top: clickY,
      left: clickX,
      transformOrigin: "center center",
    });

    if (!showCanvas) {
      setCursorColor("bg-white");

      gsap.set(span, { scale: 0 });

      gsap.to(span, {
        scale: 1000,
        duration: 2,
        ease: "power2.inOut",
      });

      gsap.to("body", {
        backgroundColor: "#fd2c2a",
        color: "#000",
        duration: 1.2,
        ease: "power2.inOut",
      });

      setFadeOutCanvas(false);
      setShowCanvas(true);
    } else {
      setCursorColor("bg-[#fd2c2a]");

      gsap.set(span, { scale: 1000 });

      gsap.to(span, {
        scale: 0,
        duration: 1.1,
        delay: -0.2,
        ease: "power2.inOut",
      });

      gsap.to("body", {
        backgroundColor: "#000",
        color: "#fff",
        duration: 1.2,
        ease: "power2.inOut",
      });

      setFadeOutCanvas(true);
      setTimeout(() => {
        setShowCanvas(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (!showCanvas) {
      setButtonFadedOut(false);
    }
  }, [showCanvas]);

  return (
    <>
      <span
        ref={growingSpan}
        className="growing rounded-full block fixed top-[-20px] left-[-20px] w-5 h-5"
      ></span>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none`}
        style={{
          transform: "translate(-50%, -50%)",
          width: "20px",
          height: "20px",
        }}
      >
        <div
          className={`rounded-full transition-transform duration-300 ease-out ${cursorColor}`}
          style={{
            transform: `scale(${cursorScale})`,
            width: "100%",
            height: "100%",
            willChange: "transform, background-color",
          }}
        >
          {isTooltipVisible && cursorImage && (
            <img
              src={cursorImage}
              alt="tooltip"
              className="w-full h-full object-contain pointer-events-none"
            />
          )}
        </div>
      </div>

      <div className="w-full relative min-h-screen font-['Helvetica_Now_Display'] pb-24">
        <div className={`${canvasContainerClass}`}>
          {data[1].map((canvasdets, index) => (
            <Canvas key={index} details={canvasdets} />
          ))}
        </div>

        <div className="w-full relative z-[3] h-screen">
          <nav
            className={`fixed top-0 left-0 w-full p-3 md:p-3 flex justify-between items-center z-[100] transition-transform duration-500 backdrop-blur-md bg-zinc-600/10 border-b border-zinc-700/10 ${navVisible ? "translate-y-0" : "-translate-y-full"
              } ${pageLoaded ? "animate-fade-in-delay-2" : "opacity-0"}`}
          >
            <div className="brand text-2xl font-md">Thirtysixstudios</div>

            <div className="links hidden md:flex gap-10">
              {[
                "Original Site",
                "What we do",
                "Who we are",
                "How we give back",
                "Talk to us",
              ].map((link, index) => (
                <a
                  key={index}
                  href={
                    link === "Original Site"
                      ? "https://thirtysixstudio.com/"
                      : `#${link.toLowerCase().replace(/\s+/g, "-")}`
                  }
                  className="text-md hover:text-gray-300"
                  target={link === "Original Site" ? "_blank" : "_self"} // opens in new tab
                  rel={link === "Original Site" ? "noopener noreferrer" : ""}
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-md cursor-pointer hover:text-gray-400"
              >
                Menu
              </button>
            </div>
          </nav>

          {menuOpen && (
            <div
              className={`fixed top-0 left-0 w-screen h-screen bg-black text-white z-101 flex flex-col items-start px-4 pt-10
                           overflow-x-hidden overflow-y-auto
                           ${isClosing
                  ? "animate-slide-down"
                  : "animate-slide-up"
                }
                        `}
            >
              <button
                onClick={handleCloseMenu}
                className="absolute top-4 right-4 text-4xl font-bold hover:text-gray-400 z-50 cursor-pointer"
              >
                ×
              </button>

              <div className="mt-20 flex flex-col gap-6 w-full">
                {[
                  "Original Site",
                  "What we do",
                  "Who we are",
                  "How we give back",
                  "Talk to us",
                ].map((link, index) => (
                  <a
                    key={index}
                    href={
                      link === "Original Site"
                        ? "https://thirtysixstudio.com/"
                        : `#${link.toLowerCase().replace(/\s+/g, "-")}`
                    }
                    className={`text-5xl font-medium whitespace-nowrap overflow-visible truncate hover:text-gray-400 cursor-pointer
        ${isClosing
                        ? "animate-fade-slide-out"
                        : "opacity-0 animate-fade-slide-in"
                      }
      `}
                    target={link === "Original Site" ? "_blank" : "_self"}
                    rel={link === "Original Site" ? "noopener noreferrer" : ""}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="textcontainer w-full pt-[80px] px-[5%] lg:pl-[18%] lg:pr-20 flex flex-col lg:flex-row justify-between items-start lg:gap-[120px]">
            <div
              className={`text w-full lg:w-[50%] text-center lg:text-left lg:pt-[4%] ${pageLoaded ? "animate-fade-in-delay-1" : "opacity-0"
                }`}
            >
              <h3 className="text-2xl md:text-4xl leading-[1.3]">
                At Thirtysixstudio, we build immersive digital experiences for
                brands with a purpose.
              </h3>
              <p className="text-base md:text-lg w-full md:w-[80%] mt-6 md:mt-10 font-normal mx-auto md:mx-0">
                We are a team of designers, developers, and strategists who are
                passionate about creating digital experiences that are both
                beautiful and functional.
              </p>
              <p className="text-md mt-6 md:mt-10">scroll</p>
            </div>

            <div
              className={`w-full lg:w-[50%] flex justify-center lg:justify-end mt-10 lg:mt-0 ${pageLoaded ? "animate-fade-in-delay-2" : "opacity-0"
                }`}
            >
              {" "}
              <img
                ref={circleImageRef}
                src="/circletext.svg"
                alt="Rotating Text"
                className="w-[350px] lg:w-[320px] h-[350px] lg:h-[320px]"
              />
            </div>
          </div>

          <div className="w-full mt-5">
            <h1
              ref={headingRef}
              className={`
    text-[5rem] sm:text-[7rem] md:text-[8rem] lg:text-[9.6rem] xl:text-[12rem] 2xl:text-[14.8rem]
    font-normal tracking-tight leading-none pl-4 md:pl-5 break-words mb-24
    ${pageLoaded ? "animate-fade-in" : "opacity-0"}
  `}
            >
              Thirtysixstudios
            </h1>
          </div>
        </div>
      </div>

      <div
        className={`w-full relative min-h-screen mt-35 px-6 md:px-10 font-['Helvetica_Now_Display'] ${pageLoaded ? "animate-fade-in-delay-2" : "opacity-0"
          } `}
      >
        <div className={`${canvasContainerClass}`}>
          {data[0].map((canvasdets, index) => (
            <Canvas key={index} details={canvasdets} />
          ))}
        </div>

        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 font-['Helvetica_Now_Display'] pt-10 sm:pt-5">
          <div className="max-w-4xl mx-auto text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl tracking-tighter leading-tight font-extrabold">
              About the brand
            </h1>

            <p className="text-base sm:text-2xl md:text-3xl lg:text-3xl leading-relaxed md:leading-[1.5] mt-6 md:mt-10 font-normal">
              At Thirtysixstudio, we recognize that our industry can perpetuate
              harm. We believe we have to try and reverse some of these
              imbalances. That’s why we’re launching SS36, our local social
              sustainability hub. Through SS36, we reinvest some of our revenue
              and expertise into the communities that shape the culture and
              trends our field so heavily relies on.
            </p>

            <p className="text-base sm:text-2xl md:text-3xl lg:text-3xl leading-relaxed md:leading-[1.5] mt-6 md:mt-10 font-normal">
              Our main focus is on bridging gaps for those affected by systemic
              obstacles related to race, sexuality, wealth and gender identity.
              We are a team of designers, developers, and strategists who are
              passionate about creating digital experiences that are both
              beautiful and functional.
            </p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center mt-12 md:mt-20">
          <img
            className="w-[90%] md:w-[85%] lg:w-[80%] h-auto max-h-full rounded-3xl object-cover"
            src="image.jpg"
            alt="Brand Visual"
          />
        </div>
      </div>
      <div
        className={`w-full relative h-screen px-4 sm:px-8 md:px-10 flex items-center justify-center font-['Helvetica_Now_Display']${pageLoaded ? "animate-fade-in-delay-1" : "opacity-0"
          } `}
      >
        <div
          className={`${canvasContainerClass} absolute top-0 left-0 w-full h-full z-8`}
        >
          {data[2].map((canvasdets, index) => (
            <Canvas key={index} details={canvasdets} />
          ))}
        </div>

        {showCanvas ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 relative z-1">
            <img
              src="/image2.jpg"
              alt="Spicy Mode Image 1"
              className="w-full sm:w-1/2 rounded-2xl shadow-xl animate-fade-scale-in"
            />
            <img
              src="/image3.jpg"
              alt="Spicy Mode Image 2"
              className="w-full sm:w-1/2 rounded-2xl shadow-xl animate-fade-scale-in"
            />
          </div>
        ) : (
          !buttonFadedOut && (
            <div className="relative max-w-4xl text-center flex flex-col items-center space-y-8 animate-fade-smooth-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-tight">
                Pssst. Looking for
                <br className="hidden sm:block" /> something spicy?
              </h1>

              <p className="text-base sm:text-lg md:text-xl max-w-xl">
                Find the floating adjuma pepper or click the big red button
                below to unlock our fiery alter ego. Be warned, it’s hot in
                there!
              </p>

              <button
                ref={buttonRef}
                onMouseMove={handleMouseMove}
                onClick={(e) => {
                  setButtonFadedOut(true);
                  triggerCanvasAnimation(e.clientX, e.clientY);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative overflow-hidden hover-button font-semibold text-base sm:text-lg px-6 sm:px-10 py-3 rounded-full text-black cursor-pointer"
              >
                <span>BRING THE HEAT!</span>
              </button>
            </div>
          )
        )}
      </div>

      <div className="w-full relative h-full font-['Helvetica_Now_Display']">
        <div className={`${canvasContainerClass}`}>
          {data[3].map((canvasdets, index) => (
            <Canvas key={index} details={canvasdets} />
          ))}
        </div>
        <div
          className={`mt-10 space-y-20 ${pageLoaded ? "animate-fade-in-delay-2" : "opacity-0"
            } `}
        >
          {[
            {
              title: "Agile",
              description:
                "We live and breathe efficiency and are not limited by geography. Local to Amsterdam with hubs in London, Paris, Johannesburg, New York, and beyond, we curate the right team for each project and get moving swiftly.",
            },
            {
              title: "Innovative",
              description:
                "We use carefully crafted digital processes and new technology to ensure our initiatives run smoothly, allowing our lean and international team to focus on what matters and maximize momentum and opportunity.",
            },
            {
              title: "Cultured",
              description:
                "We are progressive and community-focused and don’t believe in maintaining the status quo or sticking to outdated ways. Our people reflect today’s realities and stay connected to culture.",
            },
            {
              title: "Developer",
              description: (
                <>
                  Thirtysixstudio-clone blends modern design with smooth GSAP
                  animations to deliver sleek, performant user experiences.
                  Built using React, Tailwind CSS, and crafted by{" "}
                  <span className="font-bold underline">KHAN ARKAM</span>, it’s
                  a minimal clone of the Thirtysixstudio landing page.
                </>
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="w-full border-zinc-700 border-b 
                   first:border-t"
            >
              <div className="px-4 sm:px-6 md:px-10 py-10 flex flex-col md:flex-row gap-6 md:gap-10">
                <h1 className="text-4xl sm:text-5xl lg:text-8xl tracking-tighter w-full md:w-1/2">
                  {item.title}
                </h1>
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed w-full md:w-1/2 font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
