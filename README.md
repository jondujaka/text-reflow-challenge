# Text Reflow Challenge

This repository includes the text-reflow code challenge. If you're reading this, you probably know what this is.

## Access

You can access a live version of this repo at https://textreflow-challenge.vercel.app

## Running locally

Simply install the depencencies and run the development server

```
npm i
npm run dev
```

## Thoughts

This application is built on React just for the sake of the ease for setting up and deploying. The main logic of the application is pure Javascript.

This was a very interesting challenge, as I was always aware of the challenges of text-reflow when converting ebooks from pdf to epub, etc. So I was excited to give a simplified version of that a go.

In the current state, this code is able to:

- Parse a .fountain file to json
- Flows the text automatically, to perfectly fit the defined pages size
- Generates "page" divs automatically, based on the set-height of the parent container
- Preserves formatting, line-breaks
- Provides Previous/Next buttons to navigate between pages

## Challenges

The two main challenges which took me the longest, were:
**Split the text into words in a meaningful way**
I had to do some research on this, to find the best way. Splitting the text with a regular `String.split()` function would be problematic since it could affect the punctuation, and words are split very differently based on the language. I wanted to find a robust solution that would work with many different texts.

So I found out about [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter). This works really well, as you can define the locale for it. The only issue was that it's not out in all browsers yet, so I had to use a polyfill to make it work across more browsers.

**Render the text to fit exactly on the page**
I haven't really had experience with this before, so I had to think a bit about it. I figured that the most straightforward approach would be to render the text word by word, check the height of the rendered text, and adjust based on that.

So the `renderPages()` method does just that. Splits the text into words, then on each word iteration checks for the rendered height of the page div. If the height exceeds the limit, removes the last word, and instead renderes it in the next page, and continues with the next words.

This also took some time figuring out some intricacies, such as handling this carry-over word, rendering paragraphs properly so that formatting would be preserved, etc.

## Next

### Performance

Throughout the whole challenge, I was worried about the performance of the application. Right now, the script tries to parse and render the whole text at once.

I think a next step would be so that only the page that is needed currently, is parsed and rendered.

### Formatting

I haven't worked with .fountain files before, so I had no reference, but I think next step would be to make sure that the formatting is preserved and rendered correctly. There must be some way to preserve title, and other labelings through the fountain parsing libraries.
