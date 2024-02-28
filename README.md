![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

# Test Task

## Description

This is a test task for the position of Frontend Developer.
The task is to create a simple web application that will display a list of places in Zürich and their details. The application should be built using Next.js and TypeScript.


### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- [Node.js with NVM](https://github.com/nvm-sh/nvm]) (Check in the .nvmrc file for the correct version v20.10.0)
- [NPM](https://www.npmjs.com/get-npm) (Should be coming with Node ;))


### Install dependencies

Run `npm install` to install all dependencies.

### Build the app

Run `npm run build` to build the app.


### Run the app

Run `npm run start` to start the app.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Frontend Libraries

I used the following libraries to make myself the life easier:


- [React](https://beta.reactjs.org/learn)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/material-ui/)
- [Date-fns](https://date-fns.org/)
- [Tailwind CSS](https://tailwindcss.com/)


## Describe your architectural decisions(why did you choose to make it with ...)

NextJS wurde gewählt da dies dass Frontent Framework ist, welches ich am besten kenne und am meisten Erfahrung habe.
Typescript + Mui wurde gewählt da mit Material UI soweit alle Komponenten vorhanden sind und ich somit nicht unnötig Zeit verliere mit dem Styling.
Date-fns wurde gewählt da es eine sehr gute Library ist um mit Datum und Zeit zu arbeiten und die "Opening Hours" zu berechnen, diese sind leider etwas schlecht formatiert was einige unstimmigkeiten ergeben kann.


## How difficult was the challenge for you?

Sehr einach, also man hätte natürlich viel mehr zeit Investieren können, normalerweisse würde ich eine Library wie React Redux wählen um die States zu kontrollieren und auch anschliessend die Calls zu invalidieren, aber da es sich hier um eine sehr kleine test Applikation handelt, habe ich darauf verzichtet.

## Did you encounter any problems? How did you solve them?

Soweit keine Probleme, dass darstellen und die anforderungen vom Task wurden erfüllt. Es sollte ja auch nicht dass ziel sein irgendwelche Anforderungen zu erfinden und somit unnötig Zeit zu investieren.

## Do you see any improvements in your solution?

Ja sehr viele:

- Die "Opening Hours" sind nicht alle korrekt, da diese nicht in einem korrekten Format sind, somit kann es zu Fehlern kommen.
- Die JSX Komponenten könnten noch in kleinere Komponenten aufgeteilt werden.
- Die "Opening Hours" könnten noch besser dargestellt werden.
- Die Calls könnten mit z.B React Redux besser kontrolliert werden und auch gecached und invalidiert werden.
- Die Applikation könnte noch besser getestet werden.
- Die Applikation könnte noch besser gestylt werden.
- Die Applikation könnte noch besser aufgebaut werden, z.B mit einer besseren Ordnerstruktur.
- Die Applikation könnte noch besser dokumentiert werden.
- Die API erlaubt leider keine direkten Calls zu den "einzelnen Objekten" (soweit ich gesehen habe), somit habe ich keine "eigenen" dynamischen
Pages eingebaut für die Details sondern ein Modal, da ich keine Zeit verlieren wollte mit dem "umgehen" der API. Wenn dies einfach möglich gewesen wäre z.B mit dem Identifier au dem Objekt
hätte ich dies natürlich gemacht.
- Pagination für die Einzelnen Kategorien, da es sehr viele Einträge gibt, da die API aber keine Pagination anbietet habe ich dies auch weg gelassen, Pagination sollte normalerweise vom Backend aus kommen.

## Test