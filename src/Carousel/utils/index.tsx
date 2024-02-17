import { Token } from "fountain-js";
import { createIntlSegmenterPolyfill } from "intl-segmenter-polyfill/dist/bundled";

const renderPages = async (container: HTMLDivElement, tokens: Token[]) => {
  const Segmenter = await createIntlSegmenterPolyfill();

  const segmenter = new Segmenter("nl", { granularity: "word" });

  const startTime = performance.now();

  let pageIndex = 0;

  const maxHeight = container.clientHeight;

  let currentPage = renderNewPage(container, pageIndex);

  const renderToken = (token: Token) => {
    if (!token.text) {
      return;
    }
    const words = segmenter.segment(token.text)[Symbol.iterator]();

    let currentParagraph = document.createElement("p");
    currentPage.appendChild(currentParagraph);

    for (const word of words) {
      const isLineBreak = word.segment === "\n";

      const textNode = isLineBreak
        ? document.createElement("br")
        : document.createTextNode(word.segment);

      currentParagraph.appendChild(textNode);

      if (currentPage.clientHeight > maxHeight) {
        pageIndex += 1;

        const { newPage, newParagraph } = renderLastNode(
          container,
          currentParagraph,
          textNode,
          pageIndex,
        );

        currentPage = newPage;
        currentParagraph = newParagraph;
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

/*
 * - Removes the node from the previous paragraph
 * - Creates a new page and paragraph
 * - Adds the node to the new paragraph
 * - Returns the new page and paragraph
 */
const renderLastNode = (
  container: HTMLDivElement,
  previousParagraph: HTMLParagraphElement,
  node: Text | HTMLBRElement,
  pageIndex: number,
) => {
  previousParagraph.removeChild(node);
  const newPage = renderNewPage(container, pageIndex);

  const newParagraph = document.createElement("p");
  newPage.appendChild(newParagraph);
  newParagraph.appendChild(node);

  return { newPage, newParagraph };
};

// Renders a new page and adds it to the container
const renderNewPage = (container: HTMLDivElement, index: number) => {
  const width = container.clientWidth;
  const page = document.createElement("div");
  page.className = "page";
  page.style.left = `${index * width}px`;
  container.appendChild(page);
  return page;
};

export { renderPages, clearPages };
