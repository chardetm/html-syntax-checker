- Implement a "best fit" to handle the stack better: instead of always closing the last tag on the stack, try to find the best match based on the error. Might require an additional pass to add missing tags (marked to be distinguished from user tags) to have the best feedback possible. Handle:
  + incomplete opening tags (missing '>'): still push to the stack?
  + incomplete closing tags (missing '>'): still remove from the stack if tags match?
  + tags closed in reverse order (e.g. `<b><a></b></a>`): custom error message?
  + forgotten opening tags: strategy to best handle the stack for the rest of the file
  + forgotten closing tags: sstrategy to best handle the stack for the rest of the file
  + mismatching closing tag when none of the above apply: already handled well

