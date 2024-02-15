import styles from "./Carousel.module.scss";
import { Fountain } from "fountain-js";

import chapter from "./data/chapter.fountain?raw";
import { getPages } from "./utils";
import { useCallback, useEffect, useRef, useState } from "react";

const fountain = new Fountain();

const Carousel = () => {
  const parsedChapter = fountain.parse(chapter, true);

  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const isDone = useRef<boolean>(false);

  const handleGetPages = useCallback(() => {
    if (!carouselWrapperRef.current || !parsedChapter?.tokens) {
      return;
    }

    const height = carouselWrapperRef.current.clientHeight;
    getPages(carouselWrapperRef.current, parsedChapter.tokens, height);
    isDone.current = true;
  }, [parsedChapter.tokens]);

  useEffect(() => {
    if (isDone.current) {
      return;
    }
    handleGetPages();
  }, []);

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

  return (
    <>
      <div className={styles.container} ref={carouselWrapperRef}></div>

      <button
        className={styles.prevButton}
        onClick={() => setSlide((prev) => prev - 1)}
      >
        Prev
      </button>
      <button
        className={styles.nextButton}
        onClick={() => setSlide((prev) => prev + 1)}
      >
        Next
      </button>
    </>
  );
};

export default Carousel;
