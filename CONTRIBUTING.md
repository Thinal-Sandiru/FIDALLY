# Contributing to FIDALLY

## Coding standards
- Python: follow PEP 8; use clear snake_case names; format with Black.
- Flutter/Dart: follow Effective Dart; run dart format and flutter analyze.
- HTML/CSS/JS: semantic HTML, alt text on every image, consistent indentation.
- Keep functions short; comments explain why, not what.- Never commit passwords, API keys or .env files.

## Branches
- main: stable version. Protected; only changed through an approved pull request.
- develop: where finished work is joined together.
- feature/<name>, fix/<name>, docs/<name>: one branch per task, made from develop.

## Pull requests and code review
1. Open a pull request into develop for every change.
2. Write the requirement ID in the title, for example "FR5: create reminder by voice". 
3. At least one other member reviews and approves before merging into main. 
4. The reviewer checks: coding standards, the requirement is met, no secrets, tests pass. 
5. Fix all review comments before merging.

## Commit messages
Short and clear, starting with a verb: Add, Update, Fix, Remove. 
Example: Add reminder API endpoint
