import { Token } from "fountain-js";
import { createIntlSegmenterPolyfill } from "intl-segmenter-polyfill/dist/bundled";

const getPages = async (
  container: HTMLDivElement,
  tokens: Token[],
  maxHeight: number,
) => {
  const Segmenter = await createIntlSegmenterPolyfill();

  const segmenter = new Segmenter("nl", { granularity: "word" });

  const startTime = performance.now();
  document.body.appendChild(container);

  let pageIndex = 0;

  const page = renderNewPage(container, pageIndex);

  let innerPage = page;
  const renderToken = (token: Token) => {
    if (!token.text) {
      return;
    }
    const words = segmenter.segment(token.text)[Symbol.iterator]();

    let paragraph = document.createElement("p");
    innerPage.appendChild(paragraph);

    for (const word of words) {
      const textNode = document.createTextNode(word.segment);

      paragraph.appendChild(textNode);

      if (innerPage.clientHeight > maxHeight) {
        pageIndex += 1;

        const { newPage, newParagraph } = renderLastNode(
          container,
          paragraph,
          textNode,
          pageIndex,
        );

        innerPage = newPage;
        paragraph = newParagraph;
      }
    }
  };

  tokens.forEach(renderToken);

  const duration = performance.now() - startTime;
  console.log("Text reflowing complete in: ", duration);
  return pageIndex;
};

const clearPages = (container?: HTMLDivElement | null) => {
  if (!container) {
    return;
  }
  container.innerHTML = "";
};

const renderLastNode = (
  container: HTMLDivElement,
  previousParagraph: HTMLParagraphElement,
  node: Text,
  pageIndex: number,
) => {
  previousParagraph.removeChild(node);
  const newPage = renderNewPage(container, pageIndex);

  const newParagraph = document.createElement("p");
  newPage.appendChild(newParagraph);
  newParagraph.appendChild(node);

  return { newPage, newParagraph };
};

const renderNewPage = (container: HTMLDivElement, index: number) => {
  const page = document.createElement("div");
  page.className = "page";
  page.style.left = `${index * 400}px`;
  container.appendChild(page);
  return page;
};

export { getPages, clearPages };
