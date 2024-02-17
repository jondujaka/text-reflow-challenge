import styles from "./Carousel.module.scss";
import { Fountain } from "fountain-js";

import chapter from "./data/chapter.fountain?raw";
import { renderPages, clearPages } from "./utils";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const fountain = new Fountain();

const Carousel = () => {
  const carouselWrapperRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [nrPages, setNrPages] = useState(0);

  const handleGetPages = useCallback(async () => {
    const parsedChapter = fountain.parse(chapter, true);

    if (!carouselWrapperRef.current) {
      return;
    }

    const nrPages = await renderPages(
      carouselWrapperRef.current,
      parsedChapter.tokens,
    );

    setNrPages(nrPages);

    setIsLoading(false);
  }, []);

  useLayoutEffect(() => {
    handleGetPages();

    const container = carouselWrapperRef?.current;

    return () => clearPages(container);
  }, [handleGetPages]);

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!carouselWrapperRef.current) {
      return;
    }

    carouselWrapperRef.current?.scrollTo({
      left: slide * carouselWrapperRef.current.clientWidth,
      behavior: "smooth",
    });
  }, [slide]);

  const containerClasses = `${styles.container} ${isLoading ? styles.isLoading : "not-loading"}`;

  const handleNext = () => {
    if (slide === nrPages) {
      return;
    }

    setSlide((slide) => slide + 1);
  };

  const handlePrev = () => {
    if (slide === 0) {
      return;
    }

    setSlide((slide) => slide - 1);
  };

  return (
    <>
      <div className={containerClasses} ref={carouselWrapperRef} />

      {nrPages > 0 && (
        <div className={styles.buttons}>
          <button onClick={handlePrev}>Prevs</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </>
  );
};

export default Carousel;
