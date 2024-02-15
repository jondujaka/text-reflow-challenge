import { Token } from "fountain-js";

const segmenter = new Intl.Segmenter("nl", { granularity: "word" });

const getPages = (
  container: HTMLDivElement,
  tokens: Token[],
  maxHeight: number,
) => {
  console.log("GET PAGES");
  console.time("render text");

  document.body.appendChild(container);

  let pageIndex = 0;

  const page = renderNewPage(container, pageIndex);

  let innerPage = page;
  const renderToken = (token: Token) => {
    const words = segmenter.segment(token.text)[Symbol.iterator]();

    for (const word of words) {
      const textNode = document.createTextNode(word.segment);
      innerPage.appendChild(textNode);
      //   console.log(page.clientHeight);

      if (innerPage.clientHeight > maxHeight) {
        // console.log("new page", innerPage.clientHeight);
        pageIndex += 1;
        innerPage.removeChild(textNode);
        innerPage = renderNewPage(container, pageIndex);
        innerPage.appendChild(textNode);
      }
    }
  };

  tokens.forEach(renderToken);
  console.timeEnd("render text");
};

const renderNewPage = (container: HTMLDivElement, index: number) => {
  const page = document.createElement("p");
  page.className = "page";
  page.style.left = `${index * 400}px`;
  container.appendChild(page);
  return page;
};

export { getPages };
