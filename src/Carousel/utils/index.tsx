import { Token } from "fountain-js";
import { createIntlSegmenterPolyfill } from "intl-segmenter-polyfill/dist/bundled";

let hasRendered = false;
const renderPages = async (container: HTMLDivElement, tokens: Token[]) => {
  if (hasRendered) {
    return;
  }
  const Segmenter = await createIntlSegmenterPolyfill();

  const segmenter = new Segmenter("nl", { granularity: "word" });

  const startTime = performance.now();

  let pageIndex = 0;

  const maxHeight = container.clientHeight;

  let currentPage = renderNewPage(container, pageIndex);

  // console.log(tokens);
  const renderToken = (token: Token) => {
    if (!token.text) {
      return;
    }
    const words = segmenter.segment(token.text)[Symbol.iterator]();

    let currentParagraph = document.createElement("p");
    currentPage.appendChild(currentParagraph);

    for (const word of words) {
      if (word.index > 60 && word.index < 90) {
        console.log(word);
      }

      let textNode;
      if (word.segment === "\n") {
        textNode = document.createElement("br");
      } else {
        textNode = document.createTextNode(word.segment);
      }

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
  hasRendered = true;
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

const renderNewPage = (container: HTMLDivElement, index: number) => {
  const width = container.clientWidth;
  const page = document.createElement("div");
  page.className = "page";
  page.style.left = `${index * width}px`;
  container.appendChild(page);
  return page;
};

export { renderPages, clearPages };
