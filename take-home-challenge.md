# Take Home Challenge

Dear applicant

The following content is your take-home-challenge. It is the second step of the AX recruitment process.
You will be evaluated based on the solution you submit. 

This challenge should not be solved like a code puzzle, where the easiest solution is the best. 
Rather, you should show what you can do so that we have something to evaluate.

**Important Note:**
It does not matter if you are not completely finished. It is hard to finish everything in the given time limit.
It is generally better to submit the project in a clean state, with working parts and good reflection
than to finish it with bad code and a bad reflection.

Please read the introduction carefully before starting the challenge.

Good luck!

## Introduction
1. Set up the project using either javascript/typescript or python.
2. choose any framework or build from scratch
3. use the API provided
4. Style your browser output accordingly
5. write a readme that explains how to set up and run your project
6. when finished, submit a pull request with your solution to the specified Github repository
7. announce by email that you are done - **deadline ends here!** 
8. write a retrospective.md (german or english, as you prefer)

**Time limit: 4h - starts with getting this Information; ends with the information email(item point 7)**

After you have completed the challenge, write a retrospective.md about your work with the following content
   1. Describe your architectural decisions(why did you choose to make it with ...)
   2. How difficult was the challenge for you?
   3. Did you encounter any problems? How did you solve them?
   4. Do you see any improvements in your solution?

**The retrospective does not have to be done withing the 4 hours time limit and can be submitted later by email**


## Challenge

**Context**

Zürich offers a wide range of leisure activities, but sometimes it's difficult to find out, what's open at any given time.
We need a tool to quickly find out, which places in Zürich are open at a certain time.

User story 1 has priority.
Do not start the next user stories, until you have fully completed story 1(keep in mind important note from the introduction).

**Anything that is not defined is open to the coder**

**User Stories**

```
User Story 1 - Display locations

As a visitor 
I want to see which locations exists in Zürich
so that I don't have to search them for myself

Acceptance Test:
- Categories to display: bars and lounges/eating out/culture/museums and nightlife
- all locations are displayed as a list
```

```
User Story 2 - Show open locations

As a visitor
I want to see which locations are open at a given time
so that I know where i can go

Acceptance Test:
- datetime can be set with a datetime picker
- all open locations at the set time are shown
- closed locations are shown at the end of the list visually separated
```

```
User Story 3 - Detailpages

As a visitor
I want to see detail information about an location
so that I know what this location is about.

Acceptance Test:
- detailpage is shown when a location is clicked in the list
- data displayed
  - name
  - description
  - image
  - address
  - opening hours
```

## API

The data is available at the public API:

https://zt.zuerich.com/en/open-data/v2



