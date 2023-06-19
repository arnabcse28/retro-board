# 🎨 White-Labelling

When self-hosting your own instance of Retrospected, you have the possibility of customising the colours and the logo so they are more in line with your company's branding.

As an example, we can easily re-brand Retrospected to fit with the British Red Cross colours:

![An example of White-Labelling](/img/self-hosting/white-labelling-example-1.png)

## What can I configure

You have the ability to change 4 details:

- The Primary colour (this is the colour of most components, purple by default)
- The Secodary colour (this is the colour of some secondary components, like buttons, pink by default)
- The Header colour (by default, it takes the primary colour, but you can choose something else)
- The Logo

## How can I configure it

All the following are to be set in the `docker-compose.yml` file, in the `frontend` section.

### Configure the Primary and Secondary colours

Both the Primary and the Secondary colours are actually a palette of 14 colours.

You can see examples of this here: [https://materialui.co/colors/](https://materialui.co/colors/).

You must choose 14 colours, that are each a variation of each other, from very light to very dark.

This is an example with a red-ish colour, as seen in the Red Cross example above:

You will notice that the list of 14 colours is a list of 14 HEX RGB colours, separated by commas.

`FRONTEND_PRIMARY_COLOR='#ffebee,#ffcdd2,#ef9a9a,#e57373,#ef5350,#f44336,#e53935,#d32f2f,#c62828,#b71c1c,#ff8a80,#ff5252,#ff1744,#d50000'`

Do the same for the secondary colour, with 14 other colours.

Example:

`FRONTEND_SECONDARY_COLOR='#e0f2f1,#b2dfdb,#80cbc4,#4db6ac,#26a69a,#009688,#00897b,#00796b,#00695c,#004d40,#a7ffeb,#64ffda,#1de9b6,#00bfa5'`

### Configure the Header colour

The header colour is simpler: it is just one colour, to be defined this way:

`FRONTEND_HEADER_COLOR='#FFFFFF'`

### Configure the Logo

The logo must be in a [Image URI format](https://en.wikipedia.org/wiki/Data_URI_scheme).

In order to get this Image URI, you can use the following service: [https://ezgif.com/image-to-datauri](https://ezgif.com/image-to-datauri).

You'll be able to transform any JPEG, PNG or SVG image into this text format, and then set it that way:

`FRONTEND_LOGO='data:image/svg+xml;base64,PD94bWwgdmVyc[...]+Cg=='`

:::info Syntax
Please ensure your value starts with **data:image** and ends with **==**.
The value can be quite long if the image is big.
:::
